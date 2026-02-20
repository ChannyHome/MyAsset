<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useNameClampStore } from "../stores/nameClamp";

const nameClampStore = useNameClampStore();
const { enabled } = storeToRefs(nameClampStore);

onMounted(() => {
  nameClampStore.initialize();
});
</script>

<template>
  <button
    type="button"
    class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
    @click="nameClampStore.toggle()"
  >
    Name Clamp {{ enabled ? "ON" : "OFF" }}
  </button>
</template>
