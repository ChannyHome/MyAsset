import type { Pinia } from "pinia";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import { RemoteDashboardPage, RemoteHomePage, RemoteReportPage } from "../remotes";
import BudgetComingSoonPage from "../pages/BudgetComingSoonPage.vue";
import ChatComingSoonPage from "../pages/ChatComingSoonPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/home" },
      { path: "home", name: "home", component: RemoteHomePage },
      { path: "dashboard", name: "dashboard", component: RemoteDashboardPage },
      { path: "report", name: "report", component: RemoteReportPage },
      { path: "chat", name: "chat", component: ChatComingSoonPage },
      { path: "budget", name: "budget", component: BudgetComingSoonPage },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
  },
];

export function createAppRouter(pinia: Pinia) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach(async (to) => {
    const authStore = useAuthStore(pinia);
    authStore.initializeFromStorage();

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return { path: "/home" };
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { path: "/login", query: { redirect: to.fullPath } };
    }

    if (authStore.isAuthenticated && !authStore.user) {
      try {
        await authStore.hydrate();
      } catch {
        authStore.logout();
        return { path: "/login" };
      }
    }

    return true;
  });

  return router;
}

