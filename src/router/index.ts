// middleware function to check if user is authenticated
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/components/Profile.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/components/Profile.vue"),
      },
      {
        path: "permissions",
        name: "permissions",
        component: () => import("@/components/Solicitudes/Permissions.vue"),
      },
      {
        path: "permission/new",
        name: "permission-new",
        component: () => import("@/components/Solicitudes/Form.vue"),
      },
      {
        path: "permission/edit/:id",
        name: "permission-edit",
        component: () => import("@/components/Solicitudes/Form.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkUserAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (isAuthenticated && to.name === "login") {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
