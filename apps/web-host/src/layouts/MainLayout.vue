<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth";
import { useUiStore } from "../stores/ui";

type MenuItem = {
  to: string;
  label: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { to: "/home", label: "Home", icon: "⌂" },
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/report", label: "Report", icon: "◎" },
  { to: "/chat", label: "Chat", icon: "✦" },
  { to: "/budget", label: "Budget", icon: "₩" },
];

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const pageTitle = computed(() => {
  return menuItems.find((item) => route.path.startsWith(item.to))?.label ?? "MyAsset";
});

const userDisplayName = computed(() => authStore.user?.display_name ?? "Unknown User");
const householdName = computed(() => authStore.primaryHousehold?.name ?? "가구 미연결");

function navigate(to: string) {
  uiStore.closeMobileSidebar();
  router.push(to);
}

function logout() {
  authStore.logout();
  uiStore.closeMobileSidebar();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <header
      class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95"
    >
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg dark:border-slate-700"
        @click="uiStore.openMobileSidebar()"
      >
        ☰
      </button>
      <p class="text-sm font-semibold">{{ pageTitle }}</p>
      <button
        type="button"
        class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold dark:border-slate-700"
        @click="uiStore.toggleTheme()"
      >
        {{ uiStore.theme === "light" ? "Dark" : "Light" }}
      </button>
    </header>

    <div class="flex min-h-[calc(100vh-57px)] lg:min-h-screen">
      <div
        v-if="uiStore.mobileSidebarOpen"
        class="fixed inset-0 z-30 bg-slate-900/55 lg:hidden"
        @click="uiStore.closeMobileSidebar()"
      />

      <aside
        class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0"
        :class="[
          uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          uiStore.sidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
        ]"
      >
        <div class="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div v-if="!uiStore.sidebarCollapsed" class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">MyAsset</p>
            <p class="truncate text-sm text-slate-500 dark:text-slate-400">Personal Asset Assistant</p>
          </div>
          <button
            type="button"
            class="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-sm lg:inline-flex dark:border-slate-700"
            @click="uiStore.toggleSidebarCollapsed()"
          >
            {{ uiStore.sidebarCollapsed ? "»" : "«" }}
          </button>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 lg:hidden dark:border-slate-700"
            @click="uiStore.closeMobileSidebar()"
          >
            ×
          </button>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <button
            v-for="item in menuItems"
            :key="item.to"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition"
            :class="
              route.path.startsWith(item.to)
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            "
            @click="navigate(item.to)"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center text-base">{{ item.icon }}</span>
            <span v-if="!uiStore.sidebarCollapsed">{{ item.label }}</span>
          </button>
        </nav>

        <div class="border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            class="mb-3 flex w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700"
            @click="uiStore.toggleTheme()"
          >
            {{ uiStore.theme === "light" ? "Dark Theme" : "Light Theme" }}
          </button>

          <div
            class="rounded-xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-200"
            :class="uiStore.sidebarCollapsed ? 'text-center' : ''"
          >
            <template v-if="uiStore.sidebarCollapsed">
              {{ userDisplayName.slice(0, 1) }}
            </template>
            <template v-else>
              <p class="truncate font-semibold text-slate-900 dark:text-slate-100">{{ userDisplayName }}</p>
              <p class="truncate">{{ authStore.user?.email }}</p>
              <p class="mt-1 truncate text-emerald-700 dark:text-emerald-300">{{ householdName }}</p>
            </template>
          </div>

          <button
            type="button"
            class="mt-3 flex w-full items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 dark:border-rose-900 dark:text-rose-300"
            @click="logout()"
          >
            {{ uiStore.sidebarCollapsed ? "↩" : "로그아웃" }}
          </button>
        </div>
      </aside>

      <main class="flex-1 p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

