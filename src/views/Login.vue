<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const handleSubmit = () => {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  console.log("Usuario autenticado:", user);
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="auth-view">
    <div class="col-md-4">
      <h1 class="text-center mb-4">Iniciar sesión</h1>
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col">
            <LoginForm :handleSubmit="handleSubmit" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>