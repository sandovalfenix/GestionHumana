<script setup lang="ts">
import { onBeforeMount } from 'vue';
import DashboardHeader from '@/components/Dashboard/DashboardHeader.vue';
import Sidebar from '@/components/Sidebar.vue';
</script>
<template>
  <div>
    <DashboardHeader />
    <div class="container-fluid">
      <!-- sidebar left bootstrap -->
      <div class="row">
        <Sidebar />
      </div>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>