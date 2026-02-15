<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth";
import { useUiStore } from "../stores/ui";

const authStore = useAuthStore();
const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();

const form = reactive({
  email: "me@myasset.local",
  password: "pass1234",
});

const isSubmitting = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await authStore.login(form.email, form.password);
    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/home";
    await router.replace(redirect);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.detail ?? "로그인에 실패했습니다.";
    } else {
      errorMessage.value = "로그인에 실패했습니다.";
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800"
  >
    <div
      class="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            MyAsset
          </p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">로그인</h1>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="uiStore.toggleTheme()"
        >
          {{ uiStore.theme === "light" ? "Dark" : "Light" }}
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="username"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>

        <p v-if="errorMessage" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {{ isSubmitting ? "로그인 중..." : "로그인" }}
        </button>
      </form>
    </div>
  </div>
</template>

