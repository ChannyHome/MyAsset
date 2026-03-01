import type { Pinia } from "pinia";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import {
  RemoteAgentPage,
  RemoteDashboardPage,
  RemoteHistoryPage,
  RemoteHomePage,
  RemoteLabPage,
  RemoteReportPage,
  RemoteSnapshotPage,
  RemoteTradePage,
} from "../remotes";
import BudgetComingSoonPage from "../pages/BudgetComingSoonPage.vue";
import ChatComingSoonPage from "../pages/ChatComingSoonPage.vue";
import ForbiddenPage from "../pages/ForbiddenPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import AppSettingsPage from "../pages/AppSettingsPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import { useAuthStore } from "../stores/auth";

const ROLE_LEVELS = {
  GUEST: 0,
  USER: 1,
  SUPERUSER: 1,
  MAINTAINER: 2,
  ADMIN: 3,
} as const;

type RoleName = keyof typeof ROLE_LEVELS;

function canAccessRole(userRole: string | undefined, minRole: string): boolean {
  const currentLevel = ROLE_LEVELS[(userRole as RoleName) ?? "GUEST"] ?? -1;
  const requiredLevel = ROLE_LEVELS[(minRole as RoleName) ?? "ADMIN"] ?? Number.MAX_SAFE_INTEGER;
  return currentLevel >= requiredLevel;
}

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
      { path: "snapshot", name: "snapshot", component: RemoteSnapshotPage },
      { path: "agent", name: "agent", component: RemoteAgentPage },
      { path: "trade", name: "trade", component: RemoteTradePage },
      { path: "report", name: "report", component: RemoteReportPage },
      { path: "history", name: "history", component: RemoteHistoryPage, meta: { minRole: "MAINTAINER" } },
      { path: "chat", name: "chat", component: ChatComingSoonPage },
      { path: "budget", name: "budget", component: BudgetComingSoonPage },
      { path: "app-settings", name: "app-settings", component: AppSettingsPage, meta: { minRole: "ADMIN" } },
      { path: "lab", name: "lab", component: RemoteLabPage, meta: { minRole: "MAINTAINER" } },
      { path: "settings", name: "settings", component: SettingsPage },
      { path: "forbidden", name: "forbidden", component: ForbiddenPage },
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

    const minRole = typeof to.meta.minRole === "string" ? to.meta.minRole : null;
    if (minRole && !canAccessRole(authStore.user?.role, minRole)) {
      return { path: "/forbidden" };
    }

    return true;
  });

  return router;
}
