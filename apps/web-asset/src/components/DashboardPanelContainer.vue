<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    sourceMode?: "LIVE" | "SNAPSHOT";
    expanded: boolean;
    collapsedMessage?: string;
  }>(),
  {
    sourceMode: "LIVE",
    collapsedMessage: "Collapsed. Click Expand to preview dashboard widgets.",
  },
);

const emit = defineEmits<{
  (e: "toggle"): void;
}>();
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ props.title }}</h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {{ props.description }}
        </p>
      </div>
      <button
        type="button"
        class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        @click="emit('toggle')"
      >
        {{ props.expanded ? "Collapse" : "Expand" }}
      </button>
    </div>

    <div v-if="props.expanded" class="mt-4 space-y-3">
      <slot name="controls" />
      <slot />
    </div>

    <p v-else class="mt-3 text-xs text-slate-500 dark:text-slate-400">
      {{ props.collapsedMessage }}
    </p>
  </article>
</template>
