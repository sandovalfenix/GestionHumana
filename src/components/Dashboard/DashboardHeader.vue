<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const router = useRouter();

const colaborador = ref({} as any)

const logout = () => {
  authStore.signOut();
  router.push('/login');
};
</script>
<template>
  <header class="navbar sticky-top flex-md-nowrap p-0 shadow bg-primary">
    <!-- logo -->
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 bg-white d-inline-flex" href="#">
      <img
        src="https://www.appsheet.com:443/fsimage.png?appid=c1c1a289-6afd-4f7d-814e-175cf6e328b8&datasource=google&filename=DocId%3D1UC12s9RSgsao6hYCVwIf3YJfrhj_3qF8&signature=206f37a263554d8080d9c1cfd56b9ca173d0c01a6feee916f54b20cd49d9aa1d&tableprovider=google&userid=378797"
        alt="logo" width="30" height="30" class="d-inline-block align-text-top">
      <span class="h6 ms-2 my-auto">Gestión Humana</span>
    </a>
    <!-- menu -->
    <ul class="navbar-toggler nav justify-content-end flex-row p-1 border-0">
      <li class="nav-item dropdown d-none d-md-block">
        <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button"
          data-bs-toggle="dropdown" aria-expanded="false">
          <img :src="user?.photoURL" alt="avatar" width="25" height="25" class="rounded-circle">
          <span class="ms-2 text-wrap h6">{{ user?.displayName }}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li>
            <routerLink class="dropdown-item" to="/profile">Perfil</routerLink>
          </li>
          <li>
            <hr class="dropdown-divider">
          </li>
          <li><a class="dropdown-item" href="#" @click="logout">Cerrar sesión</a></li>
        </ul>
      </li>
      <li class="nav-item my-auto">
        <a class="navbar-toggler d-md-none collapsed border-0 pb-2" href="javascript:;" data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </a>
      </li>
    </ul>
  </header>
</template>