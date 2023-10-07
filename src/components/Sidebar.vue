<script setup lang="ts">
import router from '@/router';
import { onMounted, ref } from 'vue';


//nav sidebar
const navSidebar = ref([
  {
    name: 'Inicio',
    icon: 'bi bi-house-door',
    link: 'profile',
    active: false,
  },
  {
    name: 'Permisos',
    icon: 'bi bi-file-earmark-text',
    link: 'permissions',
    active: false,
  },
]);

//obtener ruta activa
const getActiveNav = (index: number) => {
  navSidebar.value.forEach((nav, i) => {
    nav.active = i === index ? true : false;
  });
};
</script>
<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-5">
      <ul class="nav flex-column">
        <li class="nav-item" v-for="(nav, index) in navSidebar" :key="index" @click="getActiveNav(index)">
          <router-link :to="{ name: nav.link }" class="nav-link" :class="{ active: nav.active }">
            <i :class="nav.icon"></i>
            {{ nav.name }}
          </router-link>
        </li>
      </ul>

      <!-- <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
				<span>Saved reports</span>
				<a class="link-secondary" href="#" aria-label="Add a new report">
					<span data-feather="plus-circle"></span>
				</a>
			</h6>
			<ul class="nav flex-column mb-2">
				<li class="nav-item">
					<a class="nav-link" href="#">
						<span data-feather="file-text"></span>
						Current month
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">
						<span data-feather="file-text"></span>
						Last quarter
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">
						<span data-feather="file-text"></span>
						Social engagement
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">
						<span data-feather="file-text"></span>
						Year-end sale
					</a>
				</li>
			</ul> -->
    </div>
  </nav>
</template>