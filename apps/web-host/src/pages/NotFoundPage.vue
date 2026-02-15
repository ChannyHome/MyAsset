<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <section
    class="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center dark:bg-slate-950"
  >
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">404</p>
    <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">페이지를 찾을 수 없습니다.</h1>
    <button
      type="button"
      class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
      @click="router.replace('/home')"
    >
      홈으로 이동
    </button>
  </section>
</template>

