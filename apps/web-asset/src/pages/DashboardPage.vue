<script setup lang="ts">
import { computed, reactive, ref } from "vue";

type WidgetType =
  | "kpi_summary"
  | "donut_allocation"
  | "treemap_holdings"
  | "networth_line"
  | "dividend_bar_monthly"
  | "market_board";

type ToolboxItem = {
  type: WidgetType;
  label: string;
  description: string;
};

type CanvasWidget = {
  id: number;
  type: WidgetType;
  label: string;
};

type DashboardPreset = {
  id: string;
  name: string;
  widgets: WidgetType[];
  note: string;
};

const toolboxSections: Array<{ title: string; items: ToolboxItem[] }> = [
  {
    title: "기본 위젯",
    items: [
      { type: "kpi_summary", label: "KPI 요약", description: "총자산/순자산/부채" },
      { type: "market_board", label: "마켓 보드", description: "지수·코인 요약" },
    ],
  },
  {
    title: "차트",
    items: [
      { type: "donut_allocation", label: "도넛 비중", description: "Top N + 기타" },
      { type: "treemap_holdings", label: "트리맵", description: "크기=평가금, 색=등락" },
      { type: "networth_line", label: "순자산 추이", description: "일/주/월 스냅샷" },
      { type: "dividend_bar_monthly", label: "배당 월별", description: "세금 토글 가능" },
    ],
  },
];

const dashboardPresets: DashboardPreset[] = [
  {
    id: "default-main",
    name: "Default Main",
    widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "market_board"],
    note: "기본 홈 대시보드",
  },
  {
    id: "income-focus",
    name: "Income Focus",
    widgets: ["kpi_summary", "dividend_bar_monthly", "networth_line", "market_board"],
    note: "현금흐름 중심",
  },
  {
    id: "risk-focus",
    name: "Risk Focus",
    widgets: ["kpi_summary", "treemap_holdings", "networth_line"],
    note: "변동성 확인 중심",
  },
];

const widgetDictionary = new Map<WidgetType, ToolboxItem>(
  toolboxSections.flatMap((section) => section.items).map((item) => [item.type, item]),
);

const search = ref("");
const canvasWidgets = ref<CanvasWidget[]>([
  { id: 1, type: "kpi_summary", label: "KPI 요약" },
  { id: 2, type: "donut_allocation", label: "도넛 비중" },
]);
const nextWidgetId = ref(3);
const activeDashboardName = ref("Default Main");

const compareModalOpen = ref(false);
const compare = reactive({
  left: "default-main",
  right: "income-focus",
});

const filteredSections = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) {
    return toolboxSections;
  }
  return toolboxSections
    .map((section) => ({
      title: section.title,
      items: section.items.filter((item) => {
        const target = `${item.label} ${item.description} ${item.type}`.toLowerCase();
        return target.includes(keyword);
      }),
    }))
    .filter((section) => section.items.length > 0);
});

const compareRows = computed(() => {
  const left = dashboardPresets.find((item) => item.id === compare.left);
  const right = dashboardPresets.find((item) => item.id === compare.right);
  if (!left || !right) {
    return [];
  }

  const allTypes = Array.from(new Set([...left.widgets, ...right.widgets]));
  return allTypes.map((type) => ({
    type,
    left: left.widgets.includes(type),
    right: right.widgets.includes(type),
  }));
});

function buildWidgetsFromPreset(presetId: string) {
  const preset = dashboardPresets.find((item) => item.id === presetId);
  if (!preset) {
    return;
  }
  canvasWidgets.value = preset.widgets.map((type) => {
    const item = widgetDictionary.get(type);
    return {
      id: nextWidgetId.value++,
      type,
      label: item?.label ?? type,
    };
  });
  activeDashboardName.value = preset.name;
}

function addWidget(item: ToolboxItem) {
  canvasWidgets.value.push({
    id: nextWidgetId.value++,
    type: item.type,
    label: item.label,
  });
}

function removeWidget(id: number) {
  canvasWidgets.value = canvasWidgets.value.filter((item) => item.id !== id);
}

function onDragStart(event: DragEvent, item: ToolboxItem) {
  if (!event.dataTransfer) {
    return;
  }
  event.dataTransfer.setData("application/myasset-widget", item.type);
  event.dataTransfer.effectAllowed = "copy";
}

function onDropCanvas(event: DragEvent) {
  const type = event.dataTransfer?.getData("application/myasset-widget") as WidgetType;
  if (!type) {
    return;
  }
  const item = widgetDictionary.get(type);
  if (item) {
    addWidget(item);
  }
}
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Dashboard</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">대시보드 편집기</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            WPF 도구상자 느낌으로 차트를 더블클릭 또는 드래그해서 추가합니다.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="compareModalOpen = true"
          >
            Dashboard 비교
          </button>
          <button
            type="button"
            class="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            저장
          </button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">현재 편집 중: {{ activeDashboardName }}</p>
    </header>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-lg">
        <div class="border-b border-slate-700 px-4 py-3">
          <p class="text-sm font-semibold">도구 상자</p>
          <p class="mt-0.5 text-xs text-slate-400">차트 더블클릭 또는 캔버스로 드래그</p>
        </div>

        <div class="border-b border-slate-700 p-3">
          <input
            v-model="search"
            type="text"
            placeholder="검색 도구 상자"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 transition focus:ring-2"
          />
        </div>

        <div class="max-h-[60vh] overflow-y-auto p-3">
          <section v-for="section in filteredSections" :key="section.title" class="mb-4">
            <h2 class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">{{ section.title }}</h2>
            <div class="space-y-1">
              <button
                v-for="item in section.items"
                :key="item.type"
                type="button"
                draggable="true"
                class="flex w-full items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-left hover:border-indigo-400 hover:bg-slate-800"
                @dragstart="onDragStart($event, item)"
                @dblclick="addWidget(item)"
              >
                <span class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded border border-slate-600 text-[10px] text-slate-300">
                  +
                </span>
                <span>
                  <span class="block text-sm font-medium text-slate-100">{{ item.label }}</span>
                  <span class="block text-xs text-slate-400">{{ item.description }}</span>
                </span>
              </button>
            </div>
          </section>
        </div>
      </aside>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          class="min-h-[420px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40"
          @dragover.prevent
          @drop.prevent="onDropCanvas"
        >
          <div v-if="canvasWidgets.length === 0" class="flex h-[360px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            도구상자에서 위젯을 드래그하거나 더블클릭해서 추가하세요.
          </div>

          <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div
              v-for="widget in canvasWidgets"
              :key="widget.id"
              class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="mb-3 flex items-center justify-between">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ widget.label }}</p>
                <button
                  type="button"
                  class="rounded-md border border-rose-300 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:text-rose-300"
                  @click="removeWidget(widget.id)"
                >
                  삭제
                </button>
              </div>
              <div class="h-24 rounded-lg bg-slate-100 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <div class="flex h-full items-center justify-center">type: {{ widget.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div
      v-if="compareModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4"
      @click.self="compareModalOpen = false"
    >
      <section class="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Dashboard 비교</h2>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700"
            @click="compareModalOpen = false"
          >
            닫기
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label class="block text-sm">
            <span class="mb-1 block font-medium text-slate-700 dark:text-slate-200">왼쪽</span>
            <select v-model="compare.left" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
              <option v-for="preset in dashboardPresets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
            </select>
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-medium text-slate-700 dark:text-slate-200">오른쪽</span>
            <select v-model="compare.right" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
              <option v-for="preset in dashboardPresets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
            </select>
          </label>
        </div>

        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="w-full min-w-[420px] text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th class="px-3 py-2">Widget</th>
                <th class="px-3 py-2">Left</th>
                <th class="px-3 py-2">Right</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in compareRows" :key="row.type" class="border-t border-slate-200 dark:border-slate-700">
                <td class="px-3 py-2">{{ row.type }}</td>
                <td class="px-3 py-2">{{ row.left ? "O" : "-" }}</td>
                <td class="px-3 py-2">{{ row.right ? "O" : "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
            @click="buildWidgetsFromPreset(compare.left); compareModalOpen = false"
          >
            왼쪽 적용
          </button>
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            @click="buildWidgetsFromPreset(compare.right); compareModalOpen = false"
          >
            오른쪽 적용
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

