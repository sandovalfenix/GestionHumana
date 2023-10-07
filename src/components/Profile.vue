<script setup lang="ts">
import { watchEffect, ref, onMounted, onUpdated } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useColaboradoresStore } from '@/stores/colaboradores';

// store
const authStore = useAuthStore();
const colaboradoresStore = useColaboradoresStore();

// refs
const { user } = storeToRefs(authStore);
const colaborador = ref({} as any);
const loading = ref(true);

//ocultar keys de colaborador
const hiddenKeys = [
  '_RowNumber',
  'CONTRATO',
  'Related USUARIOSs',
]

//obtener colaborador del usuario
watchEffect(async () => {
  if (user.value?.id) {
    colaborador.value = await colaboradoresStore.getColaborador(user.value.id, "CEDULA")
    loading.value = false;
  }
});
</script>
<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Información de Perfil</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button type="button" class="btn btn-sm btn-outline-secondary">Modificar</button>
        <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Export</button> -->
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
      <div class="col-md-3">
        <!-- Foto Perfil -->
        <div class="card" style="background-color: #1e88e5;">
          <img :src="user?.photoURL" class="card-img-top" alt="Foto de Perfil">
        </div>
      </div>
      <div class="col">
        <!-- Información Colaborador -->
        <div class="card">
          <div class="card-body">
            <!-- label -->
            <span class="text-muted small">Nombre Completo</span>
            <h5 class="card-title">{{ colaborador?.NOMBRES }} </h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ colaborador?.APELLIDOS }}</h6>
            <hr>
            <div class="row">
              <template v-for="value, key in colaborador">
                <template v-if="value && !hiddenKeys.includes(String(key))">
                  <div class="col-12 col-md-6 col-lg-4">
                    <span class="text-muted" style="font-size:x-small">{{ String(key) }}</span>
                    <p v-if="!String(key).includes('FIRMA')" class="text-wrap text-uppercase fw-semibold">{{ value }}</p>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  border: 1px solid #eeeeee;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.card-text {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>