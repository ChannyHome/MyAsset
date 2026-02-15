import { defineStore } from "pinia";

import { STORAGE_KEYS } from "../constants/storage";

export type ThemeName = "light" | "dark";

function applyTheme(theme: ThemeName) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useUiStore = defineStore("ui", {
  state: () => ({
    theme: "light" as ThemeName,
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    initialized: false,
  }),
  actions: {
    initialize() {
      if (this.initialized) {
        return;
      }
      const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
      const savedSidebar = localStorage.getItem(STORAGE_KEYS.sidebarCollapsed);

      if (savedTheme === "light" || savedTheme === "dark") {
        this.theme = savedTheme;
      }
      if (savedSidebar === "true" || savedSidebar === "false") {
        this.sidebarCollapsed = savedSidebar === "true";
      }

      applyTheme(this.theme);
      this.initialized = true;
    },
    setTheme(theme: ThemeName) {
      this.theme = theme;
      localStorage.setItem(STORAGE_KEYS.theme, theme);
      applyTheme(theme);
    },
    toggleTheme() {
      this.setTheme(this.theme === "light" ? "dark" : "light");
    },
    setSidebarCollapsed(value: boolean) {
      this.sidebarCollapsed = value;
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, value ? "true" : "false");
    },
    toggleSidebarCollapsed() {
      this.setSidebarCollapsed(!this.sidebarCollapsed);
    },
    openMobileSidebar() {
      this.mobileSidebarOpen = true;
    },
    closeMobileSidebar() {
      this.mobileSidebarOpen = false;
    },
  },
});

