<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { usePermisosStore } from '@/stores/permisos';

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
//@ts-ignore-next-line
import { getColombiaHolidaysByYear } from 'colombia-holidays';

// interfaces
import type { Permiso } from '@/types';
// store
const authStore = useAuthStore();
const storage = getStorage();
const permisosStore = usePermisosStore();
const route = useRoute();

// toRefs
const { user } = storeToRefs(authStore);
const { loading } = storeToRefs(permisosStore);

//refs
const permiso = ref<Permiso>({
  'FECHA Y HORA SALIDA': '',
  'TIEMPO PERMISO': '',
  'TIPO SOLICITUD': '',
  MOTIVO: '',
  ESTADO: 'Pendiente',
  ADJUNTOS: '',
});
const tiempoPermiso = ref<string[]>(['', '']);
const tipoLicencia = ref<string>('');

//watchEffect
watchEffect(async () => {
  if (route.params.id) {
    permiso.value = await permisosStore.getPermiso(route.params.id, "ID")
    tiempoPermiso.value = permiso.value['TIEMPO PERMISO'].split(' ');
    if (permiso.value['TIPO SOLICITUD'] === 'Licencia') {
      tipoLicencia.value = permiso.value['TIPO SOLICITUD'].split(' ')[1];
    }
    permiso.value['FECHA Y HORA SALIDA'] = new Date(permiso.value['FECHA Y HORA SALIDA']).toISOString().slice(0, 16);
  }
});

//holidays
const holidays = getColombiaHolidaysByYear(new Date().getFullYear());

//upload files
const uploadFiles = async () => {
  const ElementFiles = (document.getElementById('files') as HTMLInputElement);
  const files = ElementFiles.files;
  if (files) {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRefFile = storageRef(storage, `permisos/${file.name}`);
      promises.push(uploadBytes(storageRefFile, file));
    }
    const results = await Promise.all(promises);
    const urls = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      urls.push(await getDownloadURL(result.ref));
    }
    return urls
  }
};

//obtener fecha y hora de llegada, verificando que la suma del tiempo de permiso solo sean dias habiles
const getFechaHoraLlegada = (fechaSalida: string) => {
  const fecha = new Date(fechaSalida);
  fecha.setHours(fecha.getHours() - 5);
  let horasHabiles = parseInt(tiempoPermiso.value[0]);
  let fechaLlegada = fecha;
  let diasHabiles = parseInt(tiempoPermiso.value[0]);
  let dias = 0;

  if (tiempoPermiso.value[1] === 'Semanas') {
    //no maneja dias habiles
    fechaLlegada.setDate(fechaLlegada.getDate() + (parseInt(tiempoPermiso.value[0]) * 7));
  }
  if (tiempoPermiso.value[1] === 'Dias') {
    while (diasHabiles > 0) {
      fechaLlegada.setDate(fechaLlegada.getDate() + 1);
      if (fechaLlegada.getDay() !== 0 && !holidays.map((item: any) => new Date(item.holiday).toISOString().slice(0, 10)).includes(fechaLlegada.toISOString().slice(0, 10))) {
        diasHabiles--;
      }
      dias++;
    }
  }
  if (tiempoPermiso.value[1] === 'Horas' && horasHabiles > 0) {
    fechaLlegada.setHours(fechaLlegada.getHours() + horasHabiles);
  }

  return fechaLlegada.toISOString().slice(0, 16);
};

/**
 * Políticas de Permisos
 */

//la fecha de salida solo puede ser de lunes a viernes de 8:00 a 16:00 y los sabados de 8:00 a 12:00
const validateFechaHoraSalida = computed(() => {
  let fecha = new Date();
  fecha.setHours(fecha.getHours() - 5);
  if (permiso.value['FECHA Y HORA SALIDA'].length) {
    fecha = new Date(permiso.value['FECHA Y HORA SALIDA'])
  } else {
    fecha.setHours(fecha.getHours() - 5);
  }

  const festivos = holidays.map((item: any) => new Date(item.holiday).toISOString().slice(0, 10));
  if (fecha.getDay() === 0 || festivos.includes(fecha.toISOString().slice(0, 10))) {
    return false;
  }
  if (fecha.getHours() < 8 || fecha.getHours() > 16) {
    return false;
  }
  if (fecha.getDay() === 6 && fecha.getHours() > 12) {
    return false;
  }
  if (minFechaHoraSalida.value > permiso.value['FECHA Y HORA SALIDA']) {
    return false;
  }

  return true;
});

// Los permisos personales y otros deben ser solicitados como mínimo dos (2) días de anticipación, a excepción de los permisos médicos donde no habrá restricción.
const minFechaHoraSalida = computed(() => {
  /* fecha y hora de colombia */
  const fecha = new Date();
  fecha.setHours(fecha.getHours() - 5);

  if (permiso.value['TIPO SOLICITUD'] === 'Personal' || permiso.value['TIPO SOLICITUD'] === 'Otro') {
    fecha.setDate(fecha.getDate() + 2);
  }
  if (permiso.value['TIPO SOLICITUD'] === 'Licencia') {
    if (tipoLicencia.value === 'Matrimonio') {
      fecha.setDate(fecha.getDate() + 15);
    }
  }

  return fecha.toISOString().slice(0, 16);
});

//obtener cuando llegaria segun el tiempo estimado
const fechaHoraLlegada = computed(() => {
  if (permiso.value['FECHA Y HORA SALIDA'].length) {
    return getFechaHoraLlegada(permiso.value['FECHA Y HORA SALIDA']);
  }
  return '';
});


//Todos los permisos de tipo personal y otro que sean solicitados a partir de dos (2) días, serán considerados como vacaciones.
const isVacaciones = computed(() => {
  if (permiso.value['TIPO SOLICITUD'] === 'Personal' || permiso.value['TIPO SOLICITUD'] === 'Otro') {
    if (tiempoPermiso.value[1] === 'Dias') {
      if (parseInt(tiempoPermiso.value[0]) >= 2) {
        return true;
      }
    }
  }
  return false;
});

// Los permisos por matrimonio, se deberá hacer la solicitud con quince (15) días de anticipación, y la licencia será hasta 5 días hábiles.
const isMatrimonio = computed(() => {
  if (permiso.value['TIPO SOLICITUD'] === 'Licencia') {
    if (tipoLicencia.value === 'Matrimonio') {
      return true;
    }
  }
  return false;
});

// licencia paternidad tiene derecho a ocho (8) días hábiles los cuales debe debe adjuntar y entregar el registro de nacido vivo o registro civil en un término no mayor a 30 días después del nacimiento de su hijo.
const isPaternidad = computed(() => {
  if (permiso.value['TIPO SOLICITUD'] === 'Licencia') {
    if (tipoLicencia.value === 'Paternidad') {
      return true;
    }
  }
  return false;
});

// licencia Maternidad tiene derecho a 18 semanas de licencia remunerada, las cuales se deben tomar así: 2 semanas antes del parto y 16 semanas después del parto.
const isMaternidad = computed(() => {
  if (permiso.value['TIPO SOLICITUD'] === 'Licencia') {
    if (tipoLicencia.value === 'Maternidad') {
      return true;
    }
  }
  return false;
});

// La licencia por luto es de cinco (5) días hábiles, tal como lo señala el numeral 10 del artículo 57 del código sustantivo del trabajo adicionado por la ley 1280
const isLuto = computed(() => {
  if (permiso.value['TIPO SOLICITUD'] === 'Licencia') {
    if (tipoLicencia.value === 'Luto') {
      return true;
    }
  }
  return false;
});

//Agregar nuevo permiso a la base de datos
const newPermiso = async () => {
  // upload files
  const filesURL = await uploadFiles() as string[];
  // set values
  permiso.value.ID = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
  permiso.value.COLABORADOR = user.value?.id;
  const fecha = new Date();
  fecha.setHours(fecha.getHours() - 5);
  permiso.value['FECHA Y HORA'] = fecha.toISOString().slice(0, 16);
  permiso.value['FECHA Y HORA LLEGADA'] = isLuto.value ? '' : fechaHoraLlegada.value;
  permiso.value['TIEMPO PERMISO'] = tiempoPermiso.value.join(' ') as any;
  permiso.value['TIPO SOLICITUD'] = permiso.value['TIPO SOLICITUD'] === 'Licencia' ? 'Licencia ' + tipoLicencia.value : permiso.value['TIPO SOLICITUD'];
  permiso.value.REMUNERADA = 'N';

  // save
  await permisosStore.newPermiso(permiso.value);
  await permisosStore.addFilesURL(permiso.value.ID, filesURL);
  alert('Su Permiso a sido enviado');
};

//actualizar permiso a la base de datos
const updatePermiso = async () => {
  // upload files
  const filesURL = await uploadFiles() as string[];
  // set values
  const FechaSolicitud = new Date();
  FechaSolicitud.setHours(FechaSolicitud.getHours() - 5);
  permiso.value['FECHA Y HORA'] = FechaSolicitud.toISOString().slice(0, 16);
  permiso.value['TIEMPO PERMISO'] = tiempoPermiso.value.join(' ') as any;
  permiso.value['TIPO SOLICITUD'] = permiso.value['TIPO SOLICITUD'] === 'Licencia' ? 'Licencia ' + tipoLicencia.value : permiso.value['TIPO SOLICITUD'];

  // save
  await permisosStore.updatePermiso(permiso.value);
  if (permiso.value.ID && filesURL.length > 0)
    await permisosStore.addFilesURL(permiso.value.ID, filesURL);
  alert('Su Permiso a sido actualizado');
};
</script>
<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <!-- go back -->
        <routerLink to="/permissions" class="btn btn-sm btn-outline-secondary" title="volver">
          <i class="bi bi-arrow-left"></i>
        </routerLink>
      </div>
    </div>
    <h1 class="h2">Formulario de Permisos</h1>
  </div>
  <div class="container-fluid">
    <div class="alert alert-warning small" v-if="!validateFechaHoraSalida && permiso!['TIPO SOLICITUD'].length">
      <i class="bi bi-info-circle"></i>
      Recuerde que la fecha y hora de salida solo puede ser de lunes a viernes de 8:00 a 16:00 y los sabados de 8:00 a
      12:00
    </div>
    <div class="alert alert-danger small" v-if="isVacaciones">
      <span class="emoji">⚠️</span>
      Recuerde que los permisos personales y otros que sean solicitados a partir de dos (2) días, serán considerados
      como vacaciones, por lo cual se hará su respectiva liquidación, a excepción de los permisos médicos.
    </div>
    <div class="alert alert-warning small" v-if="isMatrimonio">
      <span class="emoji">⚠️</span>
      Recuerde que los permisos por matrimonio, se deberá hacer la solicitud con quince (15) días de anticipación, y la
      licencia será hasta 5 días hábiles.
    </div>
    <div class="alert alert-info small" v-if="isLuto">
      <i class="bi bi-info-circle"></i>
      Recuerde que la licencia por luto es de cinco (5) días hábiles, tal como lo señala el numeral 10 del artículo 57
      del código sustantivo del trabajo adicionado por la ley 1280. El colaborador presenta el formato de permiso o
      licencia aclarando el parentesco, fecha de fallecimiento y en el mismo formato se compromete a entregar el
      certificado de defunción en un tiempo no mayor a 30 días como lo establece la ley.
    </div>
    <div class="alert alert-info small" v-if="isPaternidad">
      <i class="bi bi-info-circle"></i>
      Recuerde que la licencia paternidad tiene derecho a ocho (8) días hábiles los cuales debe adjuntar el registro de
      nacido vivo o registro civil en un término no mayor a 30 días después del nacimiento de
      su hijo.
    </div>
    <div class="alert alert-info small" v-if="isMaternidad">
      <i class="bi bi-info-circle"></i>
      Recuerde que la licencia Maternidad tiene derecho a 18 semanas de licencia remunerada, las cuales se deben tomar
      así: 2 semanas antes del parto y 16 semanas después del parto.
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <form @submit.prevent="route.params.id ? updatePermiso() : newPermiso()">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="form-group col-12 col-md-6 mt-3">
                      <!-- label with emoji -->
                      <label for="tipoSolicitud" class="form-label">
                        Tipo de Permiso
                      </label>
                      <select class="form-select" id="tipoSolicitud" v-model="permiso!['TIPO SOLICITUD']" required>
                        <option selected disabled value="">
                          <span class="emoji">🔍</span>
                          Seleccione un tipo de permiso
                        </option>
                        <option value="Medica">
                          <span class="emoji">🩺</span>
                          Médica
                        </option>
                        <option value="Personal">
                          <span class="emoji">👥</span>
                          Personal
                        </option>
                        <option value="Calamidad">
                          <span class="emoji">🌪️</span>
                          Calamidad
                        </option>
                        <option value="Licencia">
                          <span class="emoji">📜</span>
                          Licencia
                        </option>
                        <option value="Otro">
                          <span class="emoji">🔍</span>
                          Otro
                        </option>
                      </select>
                    </div>
                    <!-- tipos de licencias -->
                    <div class="form-group col-12 col-md-6 mt-3" v-if="permiso!['TIPO SOLICITUD'] === 'Licencia'">
                      <label for="tipoLicencia" class="form-label">
                        Tipo de Licencia
                      </label>
                      <select class="form-select" id="tipoLicencia" v-model="tipoLicencia" required>
                        <option value="Matrimonio">
                          <span class="emoji">💍</span>
                          Matrimonio
                        </option>
                        <!-- Maternidad -->
                        <option value="Maternidad">
                          <span class="emoji">🤰</span>
                          Maternidad
                        </option>
                        <!-- Paternidad -->
                        <option value="Paternidad">
                          <span class="emoji">👨‍👩‍👦</span>
                          Paternidad
                        </option>
                        <!-- Lactancia -->
                        <option value="Lactancia">
                          <span class="emoji">🤱</span>
                          Lactancia
                        </option>
                        <!-- Luto -->
                        <option value="Luto">
                          <span class="emoji">😔</span>
                          Luto
                        </option>
                      </select>
                    </div>
                    <div class="form-group col-12 col-md-6 mt-3" v-if="permiso!['TIPO SOLICITUD'].length">
                      <!-- label with emoji -->
                      <label for="fechaHoraSalida" class="form-label">
                        Fecha y Hora de Salida
                      </label>
                      <input type="datetime-local" class="form-control" id="fechaHoraSalida"
                        v-model="permiso!['FECHA Y HORA SALIDA']" :class="{
                          'is-invalid': !validateFechaHoraSalida,
                          'is-valid': validateFechaHoraSalida
                        }" :min="minFechaHoraSalida" required>
                    </div>
                    <div class="form-group col-12 col-md-6 mt-3" v-if="permiso!['TIPO SOLICITUD'].length">
                      <!-- Tiempo de permiso horas/dias -->
                      <label for="tiempoPermiso" class="form-label">
                        Tiempo de Permiso
                      </label>
                      <div class="input-group">
                        <input type="number" class="form-control" id="tiempoPermiso" v-model="tiempoPermiso![0]"
                          placeholder="0" required
                          :max="isMatrimonio ? 5 : tiempoPermiso![1] === 'Horas' ? 6 : isPaternidad ? 8 : isLuto ? 5 : isMaternidad ? 18 : 2">
                        <select class="form-select" id="tiempoPermiso" v-model="tiempoPermiso![1]" required>
                          <option value="Horas" v-if="permiso!['TIPO SOLICITUD'] !== 'Licencia'">
                            <span class="emoji">⏰</span>
                            Horas
                          </option>
                          <option value="Dias" :selected="permiso!['TIPO SOLICITUD'] === 'Licencia'" v-if="!isMaternidad">
                            <span class="emoji">📅</span>
                            Días
                          </option>
                          <option value="Semanas" v-if="isMaternidad">
                            <span class="emoji">📅</span>
                            Semanas
                          </option>
                        </select>
                      </div>
                      <hr>
                      <span v-if="fechaHoraLlegada.length" class="text-muted small">
                        <span class="emoji">📅</span>
                        Fecha Llegada: {{ fechaHoraLlegada.slice(0, 10) }}
                        <br>
                        <span class="emoji">⏰</span>
                        Hora Llegada: {{ fechaHoraLlegada.slice(11, 16) }}
                      </span>

                    </div>
                  </div>
                </div>
                <div class="form-group col-12 col-md-6 mt-3" v-if="permiso!['TIPO SOLICITUD'].length">
                  <!-- label with emoji -->
                  <label for="motivo" class="form-label">
                    Motivo de la Solicitud
                    <!-- info small -->
                    <span class="text-info" style="font-size: x-small;">
                      <i class="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Especifique el motivo de la solicitud."></i>
                    </span>
                  </label>
                  <textarea class="form-control" id="motivo" rows="4" v-model="permiso!.MOTIVO" required></textarea>
                </div>
                <div class="form-group col-12 col-md-6 offset-md-6 mt-3" v-if="permiso!['TIPO SOLICITUD'].length">
                  <!-- label with emoji -->
                  <label for="motivo" class="form-label">
                    Soportes de la Solicitud
                  </label>
                  <input id="files" type="file" multiple class="form-control" ref="files"
                    :required="permiso!['TIPO SOLICITUD'] !== 'Personal'">
                </div>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button type="reset" class="btn btn-secondary">Cancelar</button>
              <button type="submit" :class="route.params.id ? 'btn btn-warning' : 'btn btn-primary'"
                :disabled="!validateFechaHoraSalida && loading">{{
                  route.params.id ? 'Actualizar' : 'Enviar'
                }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>