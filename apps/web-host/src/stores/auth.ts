import { defineStore } from "pinia";

import { getMe, login, logout as logoutApi, signup, type MeOut } from "../api/auth";
import { getHouseholds, type HouseholdOut } from "../api/households";
import { STORAGE_KEYS } from "../constants/storage";

function readJson<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as MeOut | null,
    households: [] as HouseholdOut[],
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    primaryHousehold: (state) => state.households[0] ?? null,
    isGuest: (state) => state.user?.role === "GUEST",
  },
  actions: {
    initializeFromStorage() {
      if (this.initialized) {
        return;
      }
      this.token = localStorage.getItem(STORAGE_KEYS.token);
      this.user = readJson<MeOut>(localStorage.getItem(STORAGE_KEYS.user));
      this.initialized = true;
    },
    async login(email: string, password: string) {
      const result = await login({ email, password });
      this.token = result.access_token;
      localStorage.setItem(STORAGE_KEYS.token, result.access_token);
      const me = await this.fetchMe();
      if (me.role !== "GUEST") {
        await this.fetchHouseholds();
      } else {
        this.households = [];
      }
    },
    async signup(email: string, displayName: string, password: string) {
      const result = await signup({ email, display_name: displayName, password });
      this.token = result.access_token;
      localStorage.setItem(STORAGE_KEYS.token, result.access_token);
      const me = await this.fetchMe();
      if (me.role !== "GUEST") {
        await this.fetchHouseholds();
      } else {
        this.households = [];
      }
    },
    async fetchMe() {
      const me = await getMe();
      this.user = me;
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(me));
      return me;
    },
    async fetchHouseholds() {
      this.households = await getHouseholds();
      return this.households;
    },
    async hydrate() {
      this.initializeFromStorage();
      if (!this.token) {
        return;
      }
      if (!this.user) {
        await this.fetchMe();
      }
      if (this.user?.role !== "GUEST" && this.households.length === 0) {
        await this.fetchHouseholds();
      } else if (this.user?.role === "GUEST") {
        this.households = [];
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.households = [];
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
    },
    async logoutWithAudit() {
      if (this.token) {
        try {
          await logoutApi();
        } catch {
          // ignore API errors; local session clear still needed
        }
      }
      this.logout();
    },
  },
});
