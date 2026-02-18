<script setup lang="ts">
import type { Component } from "vue";
import { computed } from "vue";
import {
  Bot,
  ChartColumn,
  FlaskConical,
  Home,
  History as HistoryIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoonStar,
  Settings,
  SunMedium,
  Wallet,
  X,
} from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

import GuestDemoPage from "../pages/GuestDemoPage.vue";
import { useAuthStore } from "../stores/auth";
import { useUiStore } from "../stores/ui";

type MenuItem = {
  to: string;
  label: string;
  icon: Component;
  minRole?: "MAINTAINER" | "ADMIN";
};

const menuItems: MenuItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agent", label: "Agent", icon: Bot },
  { to: "/report", label: "Report", icon: ChartColumn },
  { to: "/history", label: "History", icon: HistoryIcon, minRole: "MAINTAINER" },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/budget", label: "Budget", icon: Wallet },
  { to: "/lab", label: "Lab", icon: FlaskConical },
];

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const pageTitle = computed(() => {
  if (route.path.startsWith("/forbidden")) {
    return "Forbidden";
  }
  if (route.path.startsWith("/settings")) {
    return "Settings";
  }
  return menuItems.find((item) => route.path.startsWith(item.to))?.label ?? "MyAsset";
});

const userDisplayName = computed(() => authStore.user?.display_name ?? "Unknown User");
const userEmail = computed(() => authStore.user?.email ?? "-");
const householdName = computed(() => authStore.primaryHousehold?.name ?? "No household");
const isGuestMode = computed(() => authStore.user?.role === "GUEST");
const showGuestDemo = computed(() => isGuestMode.value && !route.path.startsWith("/forbidden"));
const isMaintainerOrAdmin = computed(
  () => authStore.user?.role === "MAINTAINER" || authStore.user?.role === "ADMIN",
);
const visibleMenuItems = computed(() =>
  menuItems.filter((item) => (item.minRole === "MAINTAINER" ? isMaintainerOrAdmin.value : true)),
);

function isDesktopViewport() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function openSidebar() {
  if (isDesktopViewport()) {
    uiStore.setSidebarCollapsed(false);
    return;
  }
  uiStore.openMobileSidebar();
}

function closeSidebar() {
  if (isDesktopViewport()) {
    uiStore.setSidebarCollapsed(true);
    return;
  }
  uiStore.closeMobileSidebar();
}

function navigate(to: string) {
  if (uiStore.mobileSidebarOpen) {
    uiStore.closeMobileSidebar();
  }
  router.push(to);
}

async function logout() {
  await authStore.logoutWithAudit();
  uiStore.closeMobileSidebar();
  router.push("/login");
}

function goSettings() {
  if (uiStore.mobileSidebarOpen) {
    uiStore.closeMobileSidebar();
  }
  router.push("/settings");
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <header
      class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95"
    >
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-slate-700 dark:hover:bg-slate-800"
        aria-label="Open sidebar"
        @click="openSidebar()"
      >
        <Menu class="h-5 w-5" />
      </button>
      <p class="text-base font-semibold">{{ pageTitle }}</p>
      <button
        type="button"
        class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-slate-700 dark:hover:bg-slate-800"
        @click="uiStore.toggleTheme()"
      >
        <span class="inline-flex items-center gap-1">
          <MoonStar v-if="uiStore.theme === 'light'" class="h-3.5 w-3.5" />
          <SunMedium v-else class="h-3.5 w-3.5" />
          {{ uiStore.theme === "light" ? "Dark" : "Light" }}
        </span>
      </button>
    </header>

    <button
      v-if="uiStore.sidebarCollapsed"
      type="button"
      class="fixed left-4 top-4 z-30 hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white/95 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 md:inline-flex dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Open sidebar"
      title="Open sidebar"
      @click="openSidebar()"
    >
      <Menu class="h-5 w-5" />
    </button>

    <div class="flex min-h-[calc(100vh-57px)] md:min-h-screen">
      <div
        v-if="uiStore.mobileSidebarOpen"
        class="fixed inset-0 z-30 bg-slate-900/55 md:hidden"
        @click="uiStore.closeMobileSidebar()"
      />

      <aside
        class="fixed inset-y-0 left-0 z-40 flex w-[84vw] max-w-[22rem] flex-col overflow-hidden border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:w-72 md:max-w-none"
        :class="[
          uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          uiStore.sidebarCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0',
        ]"
      >
        <div class="relative flex items-center border-b border-slate-200 p-4 dark:border-slate-800">
          <div
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-base font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          >
            MA
          </div>
          <div class="ml-3 min-w-0 overflow-hidden">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              MyAsset
            </p>
            <p class="truncate text-sm text-slate-500 dark:text-slate-400">Personal Asset Assistant</p>
          </div>
          <button
            type="button"
            class="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-300 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
            title="Close sidebar"
            @click="closeSidebar()"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <button
            v-for="item in visibleMenuItems"
            :key="item.to"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition"
            :class="
              route.path.startsWith(item.to)
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            "
            :aria-label="item.label"
            @click="navigate(item.to)"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center">
              <component :is="item.icon" class="h-4 w-4" />
            </span>
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <div class="border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            class="mb-3 flex w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-slate-700 dark:hover:bg-slate-800"
            @click="uiStore.toggleTheme()"
          >
            <span class="inline-flex items-center gap-1">
              <MoonStar v-if="uiStore.theme === 'light'" class="h-3.5 w-3.5" />
              <SunMedium v-else class="h-3.5 w-3.5" />
              {{ uiStore.theme === "light" ? "Dark Theme" : "Light Theme" }}
            </span>
          </button>

          <div class="rounded-xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            <div class="mb-1 flex items-center justify-between gap-2">
              <p class="truncate font-semibold text-slate-900 dark:text-slate-100">{{ userDisplayName }}</p>
              <button
                type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-[11px] transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-slate-600 dark:hover:bg-slate-700"
                aria-label="Open settings"
                title="Settings"
                @click="goSettings()"
              >
                <Settings class="h-3.5 w-3.5" />
              </button>
            </div>
            <p class="truncate">{{ userEmail }}</p>
            <p class="mt-1 truncate text-emerald-700 dark:text-emerald-300">{{ householdName }}</p>
          </div>

          <button
            type="button"
            class="mt-3 flex w-full items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
            aria-label="Logout"
            title="Logout"
            @click="logout()"
          >
            <span class="inline-flex items-center gap-1">
              <LogOut class="h-3.5 w-3.5" />
              <span>Logout</span>
            </span>
          </button>
        </div>
      </aside>

      <main class="min-w-0 flex-1 p-4 md:p-6" :class="{ 'md:ml-72': !uiStore.sidebarCollapsed }">
        <GuestDemoPage v-if="showGuestDemo" />
        <RouterView v-else />
      </main>
    </div>
  </div>
</template>
