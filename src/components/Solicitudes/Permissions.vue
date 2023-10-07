<script setup lang="ts">
import { watchEffect, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { usePermisosStore } from '@/stores/permisos';

// store
const authStore = useAuthStore();
const permisosStore = usePermisosStore();

// refs
const { user } = storeToRefs(authStore);
const { permisos, loading: loadingData } = storeToRefs(permisosStore);
const loading = computed(() => loadingData.value);

//ocultar keys de permisos
const hiddenKeys = [
  '_RowNumber',
  'ID',
  'ESTADO',
  'FECHA Y HORA',
  'TIPO SOLICITUD',
  'TIEMPO PERMISO',
  'COLABORADOR',
  'ADJUNTOS'
]

//Lista de Estados de permisos
const estados = [
  'Pendiente',
  'Revisado',
  'Aprobado',
]

//Borrar permiso
const deletePermiso = async (id: any) => {
  await permisosStore.deletePermiso(id);
  permisos.value.splice(permisos.value.findIndex((item: any) => item.ID === id), 1);
}

const syncData = async () => {
  await permisosStore.getPermisos(user.value?.id, "COLABORADOR");
}

//obtener permisos del usuario
watchEffect(async () => {
  await permisosStore.getPermisos(user.value?.id, "COLABORADOR");
});
</script>
<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Solicitudes de Permisos</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button type="button" class="btn btn-sm btn-outline-secondary" title="sincronizar datos" @click="syncData">
          <!-- ico sincronizar -->
          <i class="bi bi-arrow-repeat"></i>
        </button>

        <routerLink to="/permission/new" class="btn btn-sm btn-outline-primary">
          <i class="bi bi-file-earmark-plus"></i>
          Nueva Solicitud
        </routerLink>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row" v-if="loading">
      <!-- loading center spinner-->
      <div class="d-flex justify-content-center align-items-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="alert alert-warning small">
        <!-- ico -->
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <span>
          <b>Nota:</b> Tenga en cuenta que los permisos se clasifican según su estado actual. Para verificar si su
          solicitud
          ha cambiado de estado, debe ingresar a la plataforma.
        </span>
      </div>
      <template v-for="(estado, index) in estados" :key="index">
        <!-- agrupar por tipo de estados -->
        <div class="col-12 col-lg-4 mb-5">
          <!-- emoji de tipo de estado -->
          <h6 class="text-center"
            :class="estado === 'Aprobado' ? 'text-success' : estado === 'Rechazado' ? 'text-danger' : estado === 'Pendiente' ? 'text-warning' : 'text-info'">
            <span class="text-center" v-if="estado === 'Aprobado'">👍</span>
            <span class="text-center" v-if="estado === 'Rechazado'">👎</span>
            <span class="text-center" v-if="estado === 'Pendiente'">🤔</span>
            <span class="text-center" v-if="estado === 'Revisado'">🔍</span>
            {{ estado }}
          </h6>
          <hr>
          <template v-for="permiso in permisos.filter(item => item.ESTADO === estado)" :key="permiso.ID">
            <div class="card mt-3">
              <div class="card-header d-flex justify-content-between bg"
                :class="estado === 'Aprobado' ? 'bg-success' : estado === 'Rechazado' ? 'bg-danger' : estado === 'Pendiente' ? 'bg-warning' : 'bg-info'">
                <div>
                  <span style="font-size: x-small;">TIPO SOLICITUD</span>
                  <!-- emojis por cada tipo de solicitud -->
                  <h6 class="card-subtitle mb-2 small">
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Medica'">🏥</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Personal'">🏠</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Calamidad'">🌪️</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Licencia'">📝</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Licencia Maternidad'">🤰</span>
                    <span class="text-center"
                      v-if="permiso['TIPO SOLICITUD'] === 'Licencia Paternidad'">👨‍👩‍👧‍👦</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Licencia Lactancia'">🤱</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Licencia Estudio'">📚</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Licencia Matrimonio'">💍</span>
                    <span class="text-center" v-if="permiso['TIPO SOLICITUD'] === 'Otro'">🤷</span>
                    {{ permiso['TIPO SOLICITUD'] }}
                  </h6>
                </div>
                <div>
                  <span style=" font-size: x-small;">FECHA SOLICITUD</span>
                  <h6 class="card-subtitle mb-2 small">{{ permiso["FECHA Y HORA"] }}</h6>
                </div>
              </div>
              <div class="card-body"
                :class="estado === 'Aprobado' ? 'bg-success-subtle' : estado === 'Rechazado' ? 'bg-danger-subtle' : estado === 'Pendiente' ? 'bg-warning-subtle' : 'bg-info-subtle'">
                <div class="row">
                  <template v-for="value, key in permiso" :key="key">
                    <div class="col-6 mb-2" v-if="!hiddenKeys.includes(String(key)) && value">
                      <span class="text-muted" style="font-size: x-small;">{{ key }}</span>
                      <p v-if="String(key) === 'REMUNERADA'"><i :class="{
                        'bi bi-check-circle-fill text-success': value === 'Y',
                        'bi bi-x-circle-fill text-danger': value === 'N',
                      }"></i></p>
                      <h6 v-else class="small">{{ value }}</h6>
                    </div>
                  </template>
                </div>
              </div>

              <div class="card-footer d-flex justify-content-between" v-if="estado === 'Pendiente'">
                <!-- CRUD -->
                <span class="text-muted" style="font-size: x-small;">OPCIONES</span>
                <div class="btn-group" role="group">
                  <router-link :to="`/permission/edit/${permiso.ID}`" class="btn btn-sm btn-outline-info"
                    title="Editar solicitud">
                    <!-- ico -->
                    <i class="bi bi-pencil-square"></i>
                  </router-link>
                  <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar solicitud"
                    @click="deletePermiso(permiso.ID)">
                    <!-- ico -->
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
