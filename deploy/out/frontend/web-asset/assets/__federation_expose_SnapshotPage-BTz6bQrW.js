import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { a as getNetworthSeries, b as getAllocation, g as getSummary } from './ui-CcTyauVO.js';
import { a as getHoldingsTable, g as getHoldingsPerformance } from './holdings-CZxu3Df1.js';
import { a as getPortfoliosTable, g as getLiabilitiesTable } from './portfolios-r6VxmkS0.js';
import { h as http, f as formatDateTimeSeoul } from './datetime-D3NoeBy6.js';
import { _ as _sfc_main$4, a as _sfc_main$5, b as _sfc_main$6, c as _sfc_main$7 } from './KpiPortfolioSummaryCard.vue_vue_type_script_setup_true_lang-DME2THZa.js';
import { u as useDashboardDataAdapter, b as _sfc_main$1, c as _sfc_main$2, _ as _sfc_main$3, a as _sfc_main$8 } from './useDashboardDataAdapter-BDktnABs.js';
import { u as useDisplayCurrency } from './useDisplayCurrency-HdS6Uz1W.js';

async function captureSnapshot(payload = {}) {
  const { data } = await http.post("/snapshots/capture", payload);
  return data;
}
async function getSnapshots(params = {}) {
  const { data } = await http.get("/snapshots", { params });
  return data;
}
async function getSnapshotSummary(snapshotId) {
  const { data } = await http.get(`/snapshots/${snapshotId}/summary`);
  return data;
}
async function getSnapshotAllocation(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/allocation`, { params });
  return data;
}
async function getSnapshotPortfoliosTable(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/portfolios/table`, { params });
  return data;
}
async function getSnapshotHoldingsTable(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/holdings/table`, { params });
  return data;
}
async function getSnapshotLiabilitiesTable(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/liabilities/table`, { params });
  return data;
}
async function getSnapshotSeries(params = {}) {
  const { data } = await http.get("/snapshots/series", { params });
  return data;
}
async function exportSnapshotCsv(snapshotId) {
  const response = await http.get(`/snapshots/${snapshotId}/export.csv`, { responseType: "blob" });
  return response.data;
}
async function previewSnapshotCsv(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await http.post("/snapshots/csv/preview", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}
async function deleteSnapshots(ids) {
  const { data } = await http.post("/snapshots/delete", { ids });
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,vModelCheckbox:_vModelCheckbox,withDirectives:_withDirectives,createTextVNode:_createTextVNode,renderList:_renderList,Fragment:_Fragment,vModelSelect:_vModelSelect,normalizeStyle:_normalizeStyle,vModelText:_vModelText,withModifiers:_withModifiers,createVNode:_createVNode,unref:_unref,createBlock:_createBlock,withCtx:_withCtx,createStaticVNode:_createStaticVNode} = await importShared('vue');

const _hoisted_1 = { class: "flex flex-col gap-6 p-4 md:p-6" };
const _hoisted_2 = { class: "order-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_4 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_5 = ["disabled"];
const _hoisted_6 = ["disabled"];
const _hoisted_7 = ["disabled"];
const _hoisted_8 = { class: "mt-3 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_9 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_10 = {
  key: 0,
  class: "mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
};
const _hoisted_11 = {
  key: 1,
  class: "mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_12 = { class: "order-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_13 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_14 = {
  key: 0,
  class: "mt-1 text-xs text-amber-600 dark:text-amber-300"
};
const _hoisted_15 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_16 = {
  key: 0,
  class: "mt-3 flex flex-wrap items-center gap-4 text-xs"
};
const _hoisted_17 = { class: "inline-flex items-center gap-2" };
const _hoisted_18 = { class: "inline-flex items-center gap-2" };
const _hoisted_19 = { class: "inline-flex items-center gap-2" };
const _hoisted_20 = {
  key: 1,
  class: "mt-3 flex flex-wrap items-center gap-2 text-xs"
};
const _hoisted_21 = ["value"];
const _hoisted_22 = {
  key: 2,
  class: "mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40"
};
const _hoisted_23 = { class: "grid gap-2 md:grid-cols-2" };
const _hoisted_24 = ["checked", "onChange"];
const _hoisted_25 = { class: "mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60" };
const _hoisted_26 = { class: "mb-3 grid gap-1 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300" };
const _hoisted_27 = {
  key: 0,
  class: "text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_28 = {
  key: 1,
  class: "text-sm text-rose-600 dark:text-rose-300"
};
const _hoisted_29 = {
  key: 2,
  class: "text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_30 = {
  key: 3,
  class: "space-y-2"
};
const _hoisted_31 = ["viewBox"];
const _hoisted_32 = ["d", "stroke"];
const _hoisted_33 = ["cx", "cy", "fill", "onMouseenter", "onClick"];
const _hoisted_34 = { class: "flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_35 = { class: "text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_36 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_37 = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
};
const _hoisted_38 = { class: "max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_39 = { class: "flex items-center justify-between" };
const _hoisted_40 = { class: "mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_41 = { class: "grid gap-2 md:grid-cols-4" };
const _hoisted_42 = { class: "mt-3 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700" };
const _hoisted_43 = { class: "min-w-[720px] text-xs" };
const _hoisted_44 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_45 = { class: "px-3 py-2 text-left" };
const _hoisted_46 = { class: "inline-flex items-center gap-2" };
const _hoisted_47 = ["checked"];
const _hoisted_48 = { key: 0 };
const _hoisted_49 = { key: 1 };
const _hoisted_50 = ["onClick", "onDblclick"];
const _hoisted_51 = ["checked", "onChange"];
const _hoisted_52 = { class: "px-3 py-2" };
const _hoisted_53 = { class: "px-3 py-2" };
const _hoisted_54 = { class: "px-3 py-2" };
const _hoisted_55 = ["onClick"];
const _hoisted_56 = { class: "mt-2 flex flex-wrap items-center gap-2" };
const _hoisted_57 = ["disabled"];
const _hoisted_58 = ["disabled"];
const _hoisted_59 = { class: "mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_60 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_61 = {
  key: 0,
  class: "text-xs text-slate-600 dark:text-slate-300"
};
const _hoisted_62 = ["disabled"];
const _hoisted_63 = {
  key: 0,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_64 = {
  key: 1,
  class: "mt-2 text-xs text-rose-600 dark:text-rose-300"
};
const _hoisted_65 = {
  key: 1,
  class: "fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4"
};
const _hoisted_66 = { class: "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_67 = { class: "mt-2 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_68 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_69 = ["disabled"];
const _hoisted_70 = ["disabled"];
const _hoisted_71 = { class: "rounded-2xl border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_72 = { class: "flex flex-wrap items-center gap-3 text-sm" };
const _hoisted_73 = { class: "inline-flex items-center gap-2" };
const _hoisted_74 = { class: "inline-flex items-center gap-2" };
const _hoisted_75 = ["onClick"];
const _hoisted_76 = { class: "inline-flex items-center gap-2" };
const _hoisted_77 = ["onClick"];
const _hoisted_78 = { class: "inline-flex items-center gap-2" };
const _hoisted_79 = ["value"];
const _hoisted_80 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_81 = ["disabled"];
const _hoisted_82 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-2" };
const {computed,nextTick,onMounted,reactive,ref,watch} = await importShared('vue');
const AMOUNT_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";
const SNAPSHOT_SECTION_STATE_STORAGE_KEY = "myasset:snapshot:section-expanded";
const chartWidth = 860;
const chartHeight = 260;
const chartPadding = 28;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "SnapshotPage",
  setup(__props) {
    function toNumber(value) {
      if (value == null) return 0;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    function toNullable(value) {
      if (value == null) return null;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: (currency || "KRW").toUpperCase(),
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatPercent(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function deriveReturnPct(rawReturnPct, profit, costBasis) {
      const normalized = toNullable(rawReturnPct);
      if (normalized != null) return normalized;
      if (costBasis > 0) {
        return profit / costBasis * 100;
      }
      if (Math.abs(profit) < 1e-9) {
        return 0;
      }
      return null;
    }
    function toLivePortfolioSortBy(sortBy) {
      switch (sortBy) {
        case "portfolio":
          return "name";
        case "current":
          return "gross_assets_total";
        case "invested_principal":
          return "net_contribution_total";
        case "portfolio_profit":
          return "portfolio_profit_total";
        case "return":
          return "total_return_pct";
        default:
          return sortBy;
      }
    }
    function toLiveHoldingSortBy(sortBy) {
      switch (sortBy) {
        case "portfolio":
          return "portfolio_name";
        case "asset":
          return "asset_name";
        case "price":
          return "current_price";
        case "avg_cost":
          return "avg_price";
        case "evaluated":
          return "evaluated_amount";
        case "cost_basis":
          return "invested_amount";
        case "profit":
          return "evaluated_amount";
        case "return":
          return "pnl_pct";
        case "symbol":
          return "asset_symbol";
        default:
          return sortBy;
      }
    }
    function toLiveLiabilitySortBy(sortBy) {
      switch (sortBy) {
        case "portfolio":
          return "portfolio_name";
        case "liability":
          return "name";
        case "balance":
          return "outstanding_balance";
        case "type":
          return "liability_type";
        default:
          return sortBy;
      }
    }
    function toCsvIds(values) {
      return values.filter((item) => Number.isFinite(item) && item > 0).join(",");
    }
    function downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
    function printSnapshotDashboard() {
      window.print();
    }
    function isCanvasBlank(canvas) {
      if (canvas.width === 0 || canvas.height === 0) {
        return true;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return true;
      }
      const sampleW = Math.min(canvas.width, 128);
      const sampleH = Math.min(canvas.height, 128);
      const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] !== 0) {
          return false;
        }
      }
      return true;
    }
    function drawDonutForExport(documentRef) {
      const donutNodes = documentRef.querySelectorAll("[data-export-donut='1']");
      donutNodes.forEach((node) => {
        const rawStops = node.dataset.donutStops ?? "";
        const startAngleDeg = Number(node.dataset.donutStartAngle ?? "0");
        const segments = rawStops.split("|").map((token) => token.trim()).filter((token) => token.length > 0).map((token) => {
          const [ratioText, color] = token.split(":");
          const ratio = Number(ratioText);
          return {
            ratioPct: Number.isFinite(ratio) ? Math.max(0, Math.min(100, ratio)) : 0,
            color: color || "#334155"
          };
        }).filter((item) => item.ratioPct > 0);
        const rect = node.getBoundingClientRect();
        const width = Math.max(1, Math.floor(node.clientWidth || rect.width || 1));
        const height = Math.max(1, Math.floor(node.clientHeight || rect.height || 1));
        const size = Math.max(1, Math.min(width, height));
        const canvas = documentRef.createElement("canvas");
        canvas.width = size * 2;
        canvas.height = size * 2;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.borderRadius = "9999px";
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        ctx.scale(2, 2);
        const center = size / 2;
        const outerRadius = center;
        const innerRadius = center * 0.5;
        let cursor = (startAngleDeg - 90) * Math.PI / 180;
        if (segments.length === 0) {
          ctx.beginPath();
          ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#334155";
          ctx.fill();
        } else {
          for (const segment of segments) {
            const angle = segment.ratioPct / 100 * Math.PI * 2;
            const next = cursor + angle;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, outerRadius, cursor, next);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            cursor = next;
          }
        }
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        node.style.background = "none";
        node.replaceChildren(canvas);
      });
    }
    function applyAmountMaskForExport(documentRef) {
      const maskedNodes = documentRef.querySelectorAll("[style*='blur(6px)'], .amount-mask");
      const calcMaskWidthCh = (text) => {
        const compactLength = text.replace(/\s+/g, "").length;
        if (compactLength <= 0) return 6;
        return Math.max(6, Math.min(24, Math.round(compactLength * 0.65)));
      };
      maskedNodes.forEach((node) => {
        const original = node.textContent ?? "";
        const maskWidth = calcMaskWidthCh(original);
        const maskBlock = documentRef.createElement("span");
        maskBlock.style.display = "inline-block";
        maskBlock.style.width = `${maskWidth}ch`;
        maskBlock.style.height = "1em";
        maskBlock.style.verticalAlign = "middle";
        maskBlock.style.borderRadius = "0.35em";
        maskBlock.style.background = "linear-gradient(180deg, rgba(148,163,184,0.62), rgba(100,116,139,0.58))";
        maskBlock.style.boxShadow = "inset 0 0 0 1px rgba(15,23,42,0.22), 0 1px 6px rgba(15,23,42,0.22)";
        maskBlock.style.filter = "blur(0.35px)";
        maskBlock.setAttribute("aria-hidden", "true");
        node.replaceChildren(maskBlock);
        node.style.filter = "none";
        node.style.webkitFilter = "none";
      });
    }
    async function ensureHtml2Canvas() {
      if (window.html2canvas) {
        return window.html2canvas;
      }
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-myasset-html2canvas="1"]');
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Failed to load html2canvas")), { once: true });
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js";
        script.async = true;
        script.dataset.myassetHtml2canvas = "1";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2canvas"));
        document.head.appendChild(script);
      });
      if (!window.html2canvas) {
        throw new Error("html2canvas not available");
      }
      return window.html2canvas;
    }
    async function exportSnapshotDashboardImage() {
      if (!snapshotDashboardRef.value) return;
      exportingDashboardImage.value = true;
      try {
        await nextTick();
        const target = snapshotDashboardRef.value;
        const rect = target.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) {
          throw new Error("Snapshot dashboard panel is not visible.");
        }
        const html2canvas = await ensureHtml2Canvas();
        const baseOptions = {
          backgroundColor: "#020617",
          scale: 2,
          useCORS: true,
          windowWidth: Math.max(document.documentElement.clientWidth, Math.ceil(rect.width)),
          windowHeight: Math.max(document.documentElement.clientHeight, Math.ceil(rect.height))
        };
        const onClone = (clonedDocument) => {
          drawDonutForExport(clonedDocument);
          if (amountMaskEnabled.value) {
            applyAmountMaskForExport(clonedDocument);
          }
        };
        let canvas;
        try {
          canvas = await html2canvas(target, {
            ...baseOptions,
            foreignObjectRendering: false,
            onclone: onClone
          });
        } catch {
          canvas = await html2canvas(target, {
            ...baseOptions,
            foreignObjectRendering: true,
            onclone: onClone
          });
        }
        if (isCanvasBlank(canvas)) {
          throw new Error("Captured image is blank. Retry after keeping panel fully visible.");
        }
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `myasset-snapshot-dashboard-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.png`;
        link.click();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to export image: ${message}. Try Print as fallback.`;
      } finally {
        exportingDashboardImage.value = false;
      }
    }
    function topNWithOthers(items, topN = 10) {
      if (items.length <= topN) return items;
      const sorted = [...items].sort((a, b) => b.value - a.value);
      const head = sorted.slice(0, topN);
      const tail = sorted.slice(topN);
      const others = tail.reduce(
        (acc, item) => ({
          value: acc.value + item.value,
          ratio: acc.ratio + item.ratioPct
        }),
        { value: 0, ratio: 0 }
      );
      if (others.value <= 0) return head;
      return [...head, { key: "others", label: "Others", value: others.value, ratioPct: others.ratio }];
    }
    const { displayCurrency, ensureInitialized } = useDisplayCurrency();
    const sourceType = ref("LIVE");
    const appliedSnapshotId = ref(null);
    const appliedCsvPreview = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const toastMessage = ref("");
    const captureLoading = ref(false);
    const dashboardExpanded = ref(false);
    const trendExpanded = ref(false);
    const portfoliosExpanded = ref(false);
    const holdingsExpanded = ref(false);
    const liabilitiesExpanded = ref(false);
    const amountMaskEnabled = ref(false);
    const exportingDashboardImage = ref(false);
    const snapshotDashboardRef = ref(null);
    const kpiMode = ref("SUMMARY");
    const dashboardTarget = ref("GROSS");
    const donutStart = ref("TOP");
    const holdingsPortfolioKey = ref("ALL");
    const snapshotSummary = ref(null);
    const portfolioRows = ref([]);
    const holdingRows = ref([]);
    const liabilityRows = ref([]);
    const liveHoldingPerformanceRows = ref([]);
    const portfolioTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "current",
      sortOrder: "desc",
      loading: false
    });
    const holdingTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "evaluated",
      sortOrder: "desc",
      q: "",
      loading: false
    });
    const liabilityTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "balance",
      sortOrder: "desc",
      q: "",
      loading: false
    });
    const tablePortfolioKey = ref("ALL");
    const tablePortfolioId = computed(() => {
      if (tablePortfolioKey.value === "ALL") return void 0;
      const parsed = Number(tablePortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const trendMode = ref("SUMMARY");
    const trendSettingsOpen = ref(false);
    const trendVisibility = reactive({ gross: true, liabilities: true, net: true });
    const trendSnapshotIds = ref([]);
    const trendPortfolioKey = ref("ALL");
    const trendHoldingIds = ref([]);
    const trendPoints = ref([]);
    const trendPortfolioLines = ref([]);
    const trendHoldingLines = ref([]);
    const trendLoading = ref(false);
    const trendError = ref("");
    const trendInspect = ref("");
    const snapshotCatalog = ref([]);
    const modalOpen = ref(false);
    const modalRows = ref([]);
    const modalLoading = ref(false);
    const modalTotal = ref(0);
    const modalSelectedId = ref(null);
    const modalCheckedIds = ref([]);
    const modalDeleteConfirmOpen = ref(false);
    const modalDeleteTargetIds = ref([]);
    const modalDeleting = ref(false);
    const modalQuery = reactive({
      page: 1,
      pageSize: 10,
      q: "",
      from: "",
      to: "",
      sortBy: "captured_at",
      sortOrder: "desc"
    });
    const csvPreviewLoading = ref(false);
    const csvPreviewError = ref("");
    const csvPreviewData = ref(null);
    const csvFileName = ref("");
    const snapshotDashboardData = useDashboardDataAdapter({
      target: dashboardTarget,
      portfolioKey: holdingsPortfolioKey,
      displayCurrency,
      loadSummary: async (targetCurrency) => {
        const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
        if (sourceType.value === "LIVE") {
          const out = await getSummary({ display_currency: normalizedCurrency });
          snapshotSummary.value = null;
          return mapSummaryFromLive(out);
        }
        if (sourceType.value === "SNAPSHOT") {
          if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
          const out = await getSnapshotSummary(appliedSnapshotId.value);
          snapshotSummary.value = out;
          return mapSummaryFromSnapshot(out, normalizedCurrency);
        }
        if (!appliedCsvPreview.value) throw new Error("CSV preview not applied");
        snapshotSummary.value = appliedCsvPreview.value.summary;
        return mapSummaryFromSnapshot(appliedCsvPreview.value.summary, normalizedCurrency);
      },
      loadAllocation: async ({ target, portfolioId, displayCurrency: targetCurrency }) => {
        const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
        if (sourceType.value === "LIVE") {
          const out = await getAllocation({
            target,
            group_by: target === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
            top_n: 10,
            portfolio_id: portfolioId,
            display_currency: normalizedCurrency
          });
          return {
            total: toNumber(out.total),
            items: out.items.map((item) => ({
              key: item.key,
              label: item.label,
              value: toNumber(item.value),
              ratioPct: toNumber(item.ratio_pct),
              returnPct: toNullable(item.return_pct)
            }))
          };
        }
        if (sourceType.value === "SNAPSHOT") {
          if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
          const out = await getSnapshotAllocation(appliedSnapshotId.value, {
            target,
            group_by: target === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
            top_n: 10,
            portfolio_id: portfolioId,
            display_currency: normalizedCurrency
          });
          return {
            total: toNumber(out.total),
            items: out.items.map((item) => ({
              key: item.key,
              label: item.label,
              value: toNumber(item.value),
              ratioPct: toNumber(item.ratio_pct),
              returnPct: toNullable(item.return_pct)
            }))
          };
        }
        return localAllocation(target, portfolioId);
      },
      resolveReturnPct: resolveAllocationReturnPct
    });
    const summaryVm = snapshotDashboardData.summary;
    const donutItems = snapshotDashboardData.donutItems;
    const donutTotal = snapshotDashboardData.donutTotal;
    const donutLoading = snapshotDashboardData.donutLoading;
    const donutError = snapshotDashboardData.donutError;
    const treemapItems = snapshotDashboardData.treemapItems;
    const treemapLoading = snapshotDashboardData.treemapLoading;
    const treemapError = snapshotDashboardData.treemapError;
    const modalAllChecked = computed(
      () => modalRows.value.length > 0 && modalRows.value.every((row) => modalCheckedIds.value.includes(row.id))
    );
    const appliedLabel = computed(() => {
      if (sourceType.value === "LIVE") return "Applied: Live data";
      if (sourceType.value === "SNAPSHOT") {
        return `Applied: Snapshot #${appliedSnapshotId.value ?? "-"} @ ${formatDateTime(snapshotSummary.value?.captured_at ?? null)}`;
      }
      return `Applied: CSV Preview (${appliedCsvPreview.value?.file_name || "-"})`;
    });
    const summaryCurrency = computed(() => displayCurrency.value === "USD" ? "USD" : "KRW");
    const kpiGrossProfit = computed(() => summaryVm.value ? summaryVm.value.gross - summaryVm.value.invested : 0);
    const kpiNetProfit = computed(() => summaryVm.value ? summaryVm.value.net - summaryVm.value.debtAdjusted : 0);
    const kpiGrossReturn = computed(
      () => summaryVm.value && summaryVm.value.invested > 0 ? (summaryVm.value.gross - summaryVm.value.invested) / summaryVm.value.invested * 100 : null
    );
    const kpiNetReturn = computed(
      () => summaryVm.value && summaryVm.value.debtAdjusted > 0 ? (summaryVm.value.net - summaryVm.value.debtAdjusted) / summaryVm.value.debtAdjusted * 100 : null
    );
    const asOfText = computed(() => formatDateTime(summaryVm.value?.asOf ?? null));
    const portfolioOptions = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const row of portfolioRows.value) {
        const key = row.portfolioId == null ? "UNASSIGNED" : String(row.portfolioId);
        if (!map.has(key)) map.set(key, row.name);
      }
      return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
    });
    const kpiPortfolioRows = computed(() => {
      if (holdingsPortfolioKey.value === "ALL") return portfolioRows.value;
      const pid = Number(holdingsPortfolioKey.value);
      if (!Number.isFinite(pid)) return portfolioRows.value;
      return portfolioRows.value.filter((item) => item.portfolioId === pid);
    });
    const kpiPortfolioCardRows = computed(
      () => kpiPortfolioRows.value.map((item) => ({
        id: item.id,
        owner_user_id: 0,
        name: item.name,
        type: item.type || "ETC",
        base_currency: summaryCurrency.value,
        exchange_code: null,
        category: null,
        memo: null,
        is_included: true,
        is_hidden: false,
        cumulative_deposit_amount: item.invested,
        cumulative_withdrawal_amount: 0,
        cashflow_source_type: "MANUAL",
        created_at: "",
        updated_at: "",
        holding_count: 0,
        liability_count: 0,
        gross_assets_total: item.current,
        liabilities_total: item.liabilities,
        net_assets_total: item.net,
        net_contribution_total: item.invested,
        principal_minus_debt_total: item.debtAdjusted,
        debt_adjusted_principal_total: item.debtAdjusted,
        net_assets_profit_total: item.net - item.debtAdjusted,
        net_assets_return_pct: item.debtAdjusted > 0 ? (item.net - item.debtAdjusted) / item.debtAdjusted * 100 : null,
        total_pnl_amount: item.profit,
        portfolio_profit_total: item.profit,
        total_return_pct: item.returnPct
      }))
    );
    const trendSnapshotOptions = computed(
      () => snapshotCatalog.value.map((row) => ({
        id: row.id,
        label: `${formatDateTime(row.captured_at)} · ${row.name || `Snapshot #${row.id}`}`
      }))
    );
    const trendPortfolioOptions = computed(
      () => portfolioOptions.value.filter((item) => item.key !== "UNASSIGNED")
    );
    const portfolioReturnByKey = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const row of portfolioRows.value) {
        const key = `portfolio:${row.portfolioId == null ? "none" : String(row.portfolioId)}`;
        map.set(key, row.returnPct ?? null);
      }
      return map;
    });
    const holdingTableReturnByAssetKey = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const row of holdingRows.value) {
        const key = `asset:${row.assetId ?? row.id}`;
        if (!map.has(key)) {
          map.set(key, row.returnPct ?? null);
        }
      }
      return map;
    });
    const liveHoldingReturnByAssetKey = computed(() => {
      const map = /* @__PURE__ */ new Map();
      const portfolioIdFilter = holdingsPortfolioKey.value === "ALL" ? null : Number(holdingsPortfolioKey.value);
      const byAsset = /* @__PURE__ */ new Map();
      for (const row of liveHoldingPerformanceRows.value) {
        if (portfolioIdFilter != null && row.portfolio_id !== portfolioIdFilter) continue;
        const assetId = Number(row.asset_id);
        if (!Number.isFinite(assetId)) continue;
        const invested = toNumber(row.invested_amount ?? row.cost_basis_total ?? 0);
        const pnl = toNumber(row.pnl_amount ?? 0);
        const fallbackPct = toNullable(row.pnl_pct ?? null);
        const prev = byAsset.get(assetId);
        if (!prev) {
          byAsset.set(assetId, { invested: Math.max(0, invested), pnl, fallbackPct });
          continue;
        }
        prev.invested += Math.max(0, invested);
        prev.pnl += pnl;
        if (prev.fallbackPct == null && fallbackPct != null) prev.fallbackPct = fallbackPct;
      }
      for (const [assetId, agg] of byAsset.entries()) {
        const key = `asset:${assetId}`;
        if (agg.invested > 0) {
          map.set(key, agg.pnl / agg.invested * 100);
        } else {
          map.set(key, agg.fallbackPct ?? null);
        }
      }
      return map;
    });
    function resolveAllocationReturnPct(rawReturnPct, target, key) {
      const normalized = toNullable(rawReturnPct);
      if (normalized != null) return normalized;
      if (target === "GROSS" || target === "NET") {
        return portfolioReturnByKey.value.get(key) ?? null;
      }
      if (target === "HOLDINGS") {
        return sourceType.value === "LIVE" ? liveHoldingReturnByAssetKey.value.get(key) ?? null : holdingTableReturnByAssetKey.value.get(key) ?? null;
      }
      return null;
    }
    function loadMaskFromStorage() {
      if (typeof window === "undefined") return;
      amountMaskEnabled.value = window.localStorage.getItem(AMOUNT_MASK_STORAGE_KEY) === "1";
    }
    function saveMaskToStorage() {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(AMOUNT_MASK_STORAGE_KEY, amountMaskEnabled.value ? "1" : "0");
    }
    function loadSectionStateFromStorage() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(SNAPSHOT_SECTION_STATE_STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.dashboard === "boolean") dashboardExpanded.value = parsed.dashboard;
        if (typeof parsed.trend === "boolean") trendExpanded.value = parsed.trend;
        if (typeof parsed.portfolios === "boolean") portfoliosExpanded.value = parsed.portfolios;
        if (typeof parsed.holdings === "boolean") holdingsExpanded.value = parsed.holdings;
        if (typeof parsed.liabilities === "boolean") liabilitiesExpanded.value = parsed.liabilities;
      } catch {
      }
    }
    function saveSectionStateToStorage() {
      if (typeof window === "undefined") return;
      const payload = {
        dashboard: dashboardExpanded.value,
        trend: trendExpanded.value,
        portfolios: portfoliosExpanded.value,
        holdings: holdingsExpanded.value,
        liabilities: liabilitiesExpanded.value
      };
      window.localStorage.setItem(SNAPSHOT_SECTION_STATE_STORAGE_KEY, JSON.stringify(payload));
    }
    function mapSummaryFromLive(row) {
      return {
        gross: toNumber(row.gross_assets_total),
        liabilities: toNumber(row.liabilities_total),
        net: toNumber(row.net_assets_total),
        invested: toNumber(row.net_contribution_total),
        debtAdjusted: toNumber(row.debt_adjusted_principal_total ?? row.principal_minus_debt_total),
        asOf: row.as_of
      };
    }
    function mapSummaryFromSnapshot(row, currency) {
      return {
        gross: currency === "USD" ? toNumber(row.gross_assets_usd) : toNumber(row.gross_assets_krw),
        liabilities: currency === "USD" ? toNumber(row.liabilities_usd) : toNumber(row.liabilities_krw),
        net: currency === "USD" ? toNumber(row.net_assets_usd) : toNumber(row.net_assets_krw),
        invested: currency === "USD" ? toNumber(row.invested_principal_usd) : toNumber(row.invested_principal_krw),
        debtAdjusted: currency === "USD" ? toNumber(row.debt_adjusted_principal_usd) : toNumber(row.debt_adjusted_principal_krw),
        asOf: row.as_of
      };
    }
    function mapPortfolioFromLive(row) {
      const invested = toNumber(row.net_contribution_total);
      const profit = toNumber(row.portfolio_profit_total ?? row.total_pnl_amount);
      return {
        id: row.id,
        portfolioId: row.id,
        name: row.name,
        type: row.type,
        current: toNumber(row.gross_assets_total),
        invested,
        profit,
        returnPct: deriveReturnPct(row.total_return_pct, profit, invested),
        liabilities: toNumber(row.liabilities_total),
        net: toNumber(row.net_assets_total),
        debtAdjusted: toNumber(row.debt_adjusted_principal_total ?? row.principal_minus_debt_total)
      };
    }
    function mapPortfolioFromSnapshot(row) {
      const invested = toNumber(row.invested_principal);
      const profit = toNumber(row.portfolio_profit);
      return {
        id: row.id,
        portfolioId: row.portfolio_id,
        name: row.portfolio_name,
        type: row.portfolio_type,
        current: toNumber(row.current),
        invested,
        profit,
        returnPct: deriveReturnPct(row.return_pct, profit, invested),
        liabilities: toNumber(row.liabilities),
        net: toNumber(row.net_assets),
        debtAdjusted: toNumber(row.debt_adjusted_principal)
      };
    }
    function mapHoldingFromLive(row) {
      const costBasis = toNumber(row.cost_basis_total);
      const profit = toNumber(row.pnl_amount);
      return {
        id: row.id,
        assetId: row.asset_id ?? null,
        portfolioId: row.portfolio_id,
        portfolioName: row.portfolio_name || "Unassigned",
        assetName: row.asset_name,
        symbol: row.asset_symbol,
        price: toNumber(row.current_price),
        priceCurrency: row.current_price_currency || "KRW",
        avgCost: toNumber(row.avg_cost),
        avgCostCurrency: row.avg_cost_currency || "KRW",
        evaluated: toNumber(row.evaluated_amount),
        costBasis,
        profit,
        returnPct: deriveReturnPct(row.pnl_pct, profit, costBasis)
      };
    }
    function mapHoldingFromSnapshot(row) {
      const costBasis = toNumber(row.cost_basis);
      const profit = toNumber(row.profit);
      return {
        id: row.id,
        assetId: row.asset_id ?? null,
        portfolioId: row.portfolio_id,
        portfolioName: row.portfolio_name,
        assetName: row.asset_name,
        symbol: row.symbol,
        price: toNumber(row.price),
        priceCurrency: row.price_currency,
        avgCost: toNumber(row.avg_cost),
        avgCostCurrency: row.avg_cost_currency,
        evaluated: toNumber(row.evaluated),
        costBasis,
        profit,
        returnPct: deriveReturnPct(row.return_pct, profit, costBasis)
      };
    }
    function mapLiabilityFromLive(row) {
      return {
        id: row.id,
        portfolioId: row.portfolio_id,
        portfolioName: row.portfolio_name || "Unassigned",
        name: row.name,
        type: row.liability_type,
        balance: toNumber(row.outstanding_balance),
        balanceCurrency: row.currency || "KRW"
      };
    }
    function mapLiabilityFromSnapshot(row) {
      return {
        id: row.id,
        portfolioId: row.portfolio_id,
        portfolioName: row.portfolio_name,
        name: row.liability_name,
        type: row.liability_type,
        balance: toNumber(row.balance),
        balanceCurrency: row.balance_currency
      };
    }
    function localAllocation(target, portfolioFilter) {
      const map = /* @__PURE__ */ new Map();
      if (target === "GROSS" || target === "HOLDINGS") {
        const rows = holdingRows.value.filter(
          (item) => target === "HOLDINGS" && portfolioFilter != null ? item.portfolioId === portfolioFilter : true
        );
        for (const row of rows) {
          const key = target === "HOLDINGS" ? `${row.assetName}:${row.symbol || "-"}` : `portfolio:${row.portfolioId ?? 0}`;
          const label = target === "HOLDINGS" ? `${row.assetName}${row.symbol ? ` (${row.symbol})` : ""}` : row.portfolioName;
          const prev = map.get(key);
          if (prev) {
            prev.value += row.evaluated;
          } else {
            map.set(key, {
              key,
              label,
              value: row.evaluated,
              ratioPct: 0,
              returnPct: target === "HOLDINGS" ? row.returnPct : null
            });
          }
        }
      } else if (target === "LIABILITIES") {
        for (const row of liabilityRows.value) {
          const key = `portfolio:${row.portfolioId ?? 0}`;
          const prev = map.get(key);
          if (prev) {
            prev.value += row.balance;
          } else {
            map.set(key, { key, label: row.portfolioName, value: row.balance, ratioPct: 0 });
          }
        }
      } else {
        for (const row of portfolioRows.value) {
          const key = `portfolio:${row.portfolioId ?? 0}`;
          map.set(key, { key, label: row.name, value: row.net, ratioPct: 0, returnPct: row.returnPct });
        }
      }
      const items = Array.from(map.values()).sort((a, b) => b.value - a.value);
      const total = items.reduce((sum, item) => sum + item.value, 0);
      for (const item of items) {
        item.ratioPct = total > 0 ? item.value / total * 100 : 0;
      }
      return { total, items: topNWithOthers(items, 10) };
    }
    async function loadLiveHoldingPerformanceRows() {
      if (sourceType.value !== "LIVE") {
        liveHoldingPerformanceRows.value = [];
        return;
      }
      const out = await getHoldingsPerformance({
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded_portfolios: false
      });
      liveHoldingPerformanceRows.value = out;
    }
    function applyCsvPortfolioTable() {
      if (!appliedCsvPreview.value) {
        portfolioRows.value = [];
        portfolioTable.total = 0;
        return;
      }
      let rows = appliedCsvPreview.value.portfolio_rows.map(mapPortfolioFromSnapshot);
      if (tablePortfolioId.value != null) {
        rows = rows.filter((item) => item.portfolioId === tablePortfolioId.value);
      }
      const key = portfolioTable.sortBy;
      rows.sort((a, b) => {
        if (key === "portfolio") return a.name.localeCompare(b.name, "ko");
        if (key === "invested_principal") return a.invested - b.invested;
        if (key === "portfolio_profit") return a.profit - b.profit;
        if (key === "return") return (a.returnPct ?? -999999) - (b.returnPct ?? -999999);
        return a.current - b.current;
      });
      if (portfolioTable.sortOrder === "desc") rows.reverse();
      portfolioTable.total = rows.length;
      const start = (portfolioTable.page - 1) * portfolioTable.pageSize;
      portfolioRows.value = rows.slice(start, start + portfolioTable.pageSize);
    }
    function applyCsvHoldingTable() {
      if (!appliedCsvPreview.value) {
        holdingRows.value = [];
        holdingTable.total = 0;
        return;
      }
      let rows = appliedCsvPreview.value.holding_rows.map(mapHoldingFromSnapshot);
      if (tablePortfolioId.value != null) {
        rows = rows.filter((item) => item.portfolioId === tablePortfolioId.value);
      }
      const q = holdingTable.q.trim().toLowerCase();
      if (q) {
        rows = rows.filter((item) => `${item.portfolioName} ${item.assetName} ${item.symbol || ""}`.toLowerCase().includes(q));
      }
      const key = holdingTable.sortBy;
      rows.sort((a, b) => {
        if (key === "portfolio" || key === "portfolio_name") return a.portfolioName.localeCompare(b.portfolioName, "ko");
        if (key === "asset" || key === "asset_name") return a.assetName.localeCompare(b.assetName, "ko");
        if (key === "price" || key === "current_price") return a.price - b.price;
        if (key === "avg_cost" || key === "avg_price") return a.avgCost - b.avgCost;
        if (key === "cost_basis" || key === "invested_amount") return a.costBasis - b.costBasis;
        if (key === "profit") return a.profit - b.profit;
        if (key === "return" || key === "pnl_pct") return (a.returnPct ?? -999999) - (b.returnPct ?? -999999);
        if (key === "symbol" || key === "asset_symbol") return (a.symbol || "").localeCompare(b.symbol || "", "ko");
        return a.evaluated - b.evaluated;
      });
      if (holdingTable.sortOrder === "desc") rows.reverse();
      holdingTable.total = rows.length;
      const start = (holdingTable.page - 1) * holdingTable.pageSize;
      holdingRows.value = rows.slice(start, start + holdingTable.pageSize);
    }
    function applyCsvLiabilityTable() {
      if (!appliedCsvPreview.value) {
        liabilityRows.value = [];
        liabilityTable.total = 0;
        return;
      }
      let rows = appliedCsvPreview.value.liability_rows.map(mapLiabilityFromSnapshot);
      if (tablePortfolioId.value != null) {
        rows = rows.filter((item) => item.portfolioId === tablePortfolioId.value);
      }
      const q = liabilityTable.q.trim().toLowerCase();
      if (q) {
        rows = rows.filter((item) => `${item.portfolioName} ${item.name} ${item.type}`.toLowerCase().includes(q));
      }
      const key = liabilityTable.sortBy;
      rows.sort((a, b) => {
        if (key === "portfolio" || key === "portfolio_name") return a.portfolioName.localeCompare(b.portfolioName, "ko");
        if (key === "liability" || key === "name") return a.name.localeCompare(b.name, "ko");
        if (key === "type" || key === "liability_type") return a.type.localeCompare(b.type, "ko");
        return a.balance - b.balance;
      });
      if (liabilityTable.sortOrder === "desc") rows.reverse();
      liabilityTable.total = rows.length;
      const start = (liabilityTable.page - 1) * liabilityTable.pageSize;
      liabilityRows.value = rows.slice(start, start + liabilityTable.pageSize);
    }
    async function loadPortfolioTable() {
      portfolioTable.loading = true;
      try {
        if (sourceType.value === "LIVE") {
          const out = await getPortfoliosTable({
            page: portfolioTable.page,
            page_size: portfolioTable.pageSize,
            sort_by: toLivePortfolioSortBy(portfolioTable.sortBy),
            sort_order: portfolioTable.sortOrder,
            portfolio_id: tablePortfolioId.value,
            display_currency: displayCurrency.value,
            include_hidden: false,
            include_excluded: false
          });
          portfolioRows.value = out.items.map(mapPortfolioFromLive);
          portfolioTable.total = out.total;
          return;
        }
        if (sourceType.value === "SNAPSHOT") {
          if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
          const out = await getSnapshotPortfoliosTable(appliedSnapshotId.value, {
            page: portfolioTable.page,
            page_size: portfolioTable.pageSize,
            sort_by: portfolioTable.sortBy,
            sort_order: portfolioTable.sortOrder,
            portfolio_id: tablePortfolioId.value,
            display_currency: displayCurrency.value
          });
          portfolioRows.value = out.items.map(mapPortfolioFromSnapshot);
          portfolioTable.total = out.total;
          return;
        }
        applyCsvPortfolioTable();
      } finally {
        portfolioTable.loading = false;
      }
    }
    async function loadHoldingTable() {
      holdingTable.loading = true;
      try {
        if (sourceType.value === "LIVE") {
          const out = await getHoldingsTable({
            page: holdingTable.page,
            page_size: holdingTable.pageSize,
            sort_by: toLiveHoldingSortBy(holdingTable.sortBy),
            sort_order: holdingTable.sortOrder,
            q: holdingTable.q || void 0,
            portfolio_id: tablePortfolioId.value,
            display_currency: displayCurrency.value,
            include_hidden: false,
            include_excluded_portfolios: false
          });
          holdingRows.value = out.items.map(mapHoldingFromLive);
          holdingTable.total = out.total;
          return;
        }
        if (sourceType.value === "SNAPSHOT") {
          if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
          const out = await getSnapshotHoldingsTable(appliedSnapshotId.value, {
            page: holdingTable.page,
            page_size: holdingTable.pageSize,
            sort_by: holdingTable.sortBy,
            sort_order: holdingTable.sortOrder,
            q: holdingTable.q || void 0,
            portfolio_id: tablePortfolioId.value,
            display_currency: displayCurrency.value
          });
          holdingRows.value = out.items.map(mapHoldingFromSnapshot);
          holdingTable.total = out.total;
          return;
        }
        applyCsvHoldingTable();
      } finally {
        holdingTable.loading = false;
      }
    }
    async function loadLiabilityTable() {
      liabilityTable.loading = true;
      try {
        if (sourceType.value === "LIVE") {
          const out = await getLiabilitiesTable({
            page: liabilityTable.page,
            page_size: liabilityTable.pageSize,
            sort_by: toLiveLiabilitySortBy(liabilityTable.sortBy),
            sort_order: liabilityTable.sortOrder,
            q: liabilityTable.q || void 0,
            portfolio_id: tablePortfolioId.value,
            display_currency: displayCurrency.value,
            include_hidden: false,
            include_excluded: false
          });
          liabilityRows.value = out.items.map(mapLiabilityFromLive);
          liabilityTable.total = out.total;
          return;
        }
        if (sourceType.value === "SNAPSHOT") {
          if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
          const out = await getSnapshotLiabilitiesTable(appliedSnapshotId.value, {
            page: liabilityTable.page,
            page_size: liabilityTable.pageSize,
            sort_by: liabilityTable.sortBy,
            sort_order: liabilityTable.sortOrder,
            q: liabilityTable.q || void 0,
            portfolio_id: tablePortfolioId.value,
            display_currency: displayCurrency.value
          });
          liabilityRows.value = out.items.map(mapLiabilityFromSnapshot);
          liabilityTable.total = out.total;
          return;
        }
        applyCsvLiabilityTable();
      } finally {
        liabilityTable.loading = false;
      }
    }
    async function loadSnapshotCatalog() {
      const out = await getSnapshots({
        page: 1,
        page_size: 200,
        sort_by: "captured_at",
        sort_order: "desc",
        display_currency: displayCurrency.value
      });
      snapshotCatalog.value = out.items;
      if (!trendSnapshotIds.value.length) {
        trendSnapshotIds.value = out.items.map((item) => item.id);
      }
    }
    async function loadTrend() {
      trendLoading.value = true;
      trendError.value = "";
      try {
        if (sourceType.value === "LIVE") {
          if (trendMode.value === "PORTFOLIO_RETURN") {
            trendPoints.value = [];
            trendPortfolioLines.value = [];
            trendHoldingLines.value = [];
            trendError.value = "Portfolio/Holdings trend requires an applied snapshot.";
            return;
          }
          const out2 = await getNetworthSeries({ display_currency: displayCurrency.value, bucket: "DAY", limit: 90 });
          trendPoints.value = out2.points.map((item, index) => ({
            snapshotId: index + 1,
            label: item.snapshot_date,
            gross: toNumber(item.gross_assets_total),
            liabilities: toNumber(item.liabilities_total),
            net: toNumber(item.net_assets_total)
          }));
          trendPortfolioLines.value = [];
          trendHoldingLines.value = [];
          return;
        }
        if (sourceType.value === "CSV_PREVIEW") {
          if (!appliedCsvPreview.value) return;
          const s = appliedCsvPreview.value.summary;
          trendPoints.value = [
            {
              snapshotId: s.id || 1,
              label: formatDateTime(s.captured_at),
              gross: summaryCurrency.value === "USD" ? toNumber(s.gross_assets_usd) : toNumber(s.gross_assets_krw),
              liabilities: summaryCurrency.value === "USD" ? toNumber(s.liabilities_usd) : toNumber(s.liabilities_krw),
              net: summaryCurrency.value === "USD" ? toNumber(s.net_assets_usd) : toNumber(s.net_assets_krw)
            }
          ];
          trendPortfolioLines.value = [];
          trendHoldingLines.value = [];
          return;
        }
        const selectedIds = trendSnapshotIds.value.length ? trendSnapshotIds.value : snapshotCatalog.value.map((item) => item.id);
        const out = await getSnapshotSeries({
          mode: trendMode.value,
          snapshot_ids: toCsvIds(selectedIds),
          portfolio_id: trendMode.value === "PORTFOLIO_RETURN" && trendPortfolioKey.value !== "ALL" ? Number(trendPortfolioKey.value) : void 0,
          holding_ids: trendMode.value === "PORTFOLIO_RETURN" ? toCsvIds(trendHoldingIds.value) : void 0,
          display_currency: displayCurrency.value
        });
        trendPoints.value = out.points.map((item) => ({
          snapshotId: item.snapshot_id,
          label: item.label,
          gross: toNumber(item.gross),
          liabilities: toNumber(item.liabilities),
          net: toNumber(item.net)
        }));
        trendPortfolioLines.value = out.portfolio_lines.map((line) => ({
          key: line.key,
          label: line.label,
          values: line.points.map((point) => ({ snapshotId: point.snapshot_id, value: toNumber(point.value) }))
        }));
        trendHoldingLines.value = out.holding_lines.map((line) => ({
          key: line.key,
          label: line.label,
          values: line.points.map((point) => ({ snapshotId: point.snapshot_id, value: toNumber(point.value) }))
        }));
      } catch (error) {
        trendPoints.value = [];
        trendPortfolioLines.value = [];
        trendHoldingLines.value = [];
        trendError.value = error instanceof Error ? error.message : "Failed to load trend";
      } finally {
        trendLoading.value = false;
      }
    }
    async function reloadAll(options) {
      if (!options?.preserveToast) {
        toastMessage.value = "";
      }
      loading.value = true;
      errorMessage.value = "";
      try {
        await snapshotDashboardData.refreshSummary();
        await Promise.all([loadPortfolioTable(), loadHoldingTable(), loadLiabilityTable(), loadLiveHoldingPerformanceRows()]);
        await snapshotDashboardData.refreshAllocation();
        if (sourceType.value !== "CSV_PREVIEW") {
          await loadSnapshotCatalog();
        }
        await loadTrend();
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : "Failed to load snapshot page";
      } finally {
        loading.value = false;
      }
    }
    async function takeSnapshotNow() {
      captureLoading.value = true;
      errorMessage.value = "";
      try {
        const created = await captureSnapshot({});
        sourceType.value = "SNAPSHOT";
        appliedSnapshotId.value = created.id;
        appliedCsvPreview.value = null;
        snapshotSummary.value = created;
        toastMessage.value = `Snapshot #${created.id} captured.`;
        await reloadAll({ preserveToast: true });
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : "Failed to capture snapshot";
      } finally {
        captureLoading.value = false;
      }
    }
    async function openLoadModal() {
      toastMessage.value = "";
      modalOpen.value = true;
      modalSelectedId.value = null;
      modalCheckedIds.value = [];
      csvPreviewData.value = null;
      csvFileName.value = "";
      await loadModalList();
    }
    function closeLoadModal() {
      modalOpen.value = false;
      modalDeleteConfirmOpen.value = false;
      modalDeleteTargetIds.value = [];
    }
    async function loadModalList() {
      modalLoading.value = true;
      try {
        const out = await getSnapshots({
          page: modalQuery.page,
          page_size: modalQuery.pageSize,
          q: modalQuery.q || void 0,
          from: modalQuery.from ? `${modalQuery.from}:00` : void 0,
          to: modalQuery.to ? `${modalQuery.to}:59` : void 0,
          sort_by: modalQuery.sortBy,
          sort_order: modalQuery.sortOrder,
          display_currency: displayCurrency.value
        });
        modalRows.value = out.items;
        modalTotal.value = out.total;
      } finally {
        modalLoading.value = false;
      }
    }
    async function applySelectedSnapshot() {
      if (!modalSelectedId.value) return;
      const selectedId = modalSelectedId.value;
      toastMessage.value = "";
      sourceType.value = "SNAPSHOT";
      appliedSnapshotId.value = selectedId;
      appliedCsvPreview.value = null;
      closeLoadModal();
      toastMessage.value = `Applied Snapshot #${selectedId}.`;
      await reloadAll();
    }
    async function onCsvFileInput(event) {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      csvPreviewLoading.value = true;
      csvPreviewError.value = "";
      try {
        const preview = await previewSnapshotCsv(file);
        csvPreviewData.value = preview;
        csvFileName.value = file.name;
      } catch (error) {
        csvPreviewError.value = error instanceof Error ? error.message : "Failed to parse CSV";
      } finally {
        csvPreviewLoading.value = false;
      }
    }
    async function applyCsvPreviewNow() {
      if (!csvPreviewData.value) return;
      toastMessage.value = "";
      sourceType.value = "CSV_PREVIEW";
      appliedCsvPreview.value = csvPreviewData.value;
      appliedSnapshotId.value = null;
      toastMessage.value = `Applied CSV Preview (${csvPreviewData.value.file_name || "file"}).`;
      closeLoadModal();
      await reloadAll();
    }
    async function backToLive() {
      toastMessage.value = "";
      sourceType.value = "LIVE";
      appliedSnapshotId.value = null;
      appliedCsvPreview.value = null;
      toastMessage.value = "Switched to Live data.";
      await reloadAll();
    }
    async function exportAppliedSnapshotCsv() {
      if (sourceType.value !== "SNAPSHOT" || !appliedSnapshotId.value) return;
      const blob = await exportSnapshotCsv(appliedSnapshotId.value);
      downloadBlob(blob, `snapshot_${appliedSnapshotId.value}.csv`);
    }
    function toggleModalChecked(id, checked) {
      const set = new Set(modalCheckedIds.value);
      if (checked) set.add(id);
      else set.delete(id);
      modalCheckedIds.value = Array.from(set);
    }
    function toggleModalAll(checked) {
      if (checked) {
        modalCheckedIds.value = modalRows.value.map((row) => row.id);
        return;
      }
      modalCheckedIds.value = [];
    }
    function askDeleteSnapshots(ids) {
      const uniqueIds = Array.from(new Set(ids.filter((id) => Number.isFinite(id) && id > 0)));
      if (!uniqueIds.length) return;
      modalDeleteTargetIds.value = uniqueIds;
      modalDeleteConfirmOpen.value = true;
    }
    function askDeleteSelectedSnapshots() {
      askDeleteSnapshots(modalCheckedIds.value);
    }
    function askDeleteSingleSnapshot(snapshotId) {
      askDeleteSnapshots([snapshotId]);
    }
    function closeDeleteConfirm() {
      if (modalDeleting.value) return;
      modalDeleteConfirmOpen.value = false;
      modalDeleteTargetIds.value = [];
    }
    async function confirmDeleteSnapshots() {
      if (!modalDeleteTargetIds.value.length) return;
      modalDeleting.value = true;
      try {
        const targetIds = [...modalDeleteTargetIds.value];
        const out = await deleteSnapshots(targetIds);
        const deletedSet = new Set(out.deleted_ids);
        modalCheckedIds.value = modalCheckedIds.value.filter((id) => !deletedSet.has(id));
        if (modalSelectedId.value != null && deletedSet.has(modalSelectedId.value)) {
          modalSelectedId.value = null;
        }
        if (appliedSnapshotId.value && deletedSet.has(appliedSnapshotId.value)) {
          sourceType.value = "LIVE";
          appliedSnapshotId.value = null;
          appliedCsvPreview.value = null;
          toastMessage.value = `Deleted ${out.deleted} snapshot(s). Applied snapshot was removed, switched to Live data.`;
        } else {
          toastMessage.value = `Deleted ${out.deleted} snapshot(s).`;
        }
        closeDeleteConfirm();
        await loadModalList();
        await reloadAll({ preserveToast: true });
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : "Failed to delete snapshots";
      } finally {
        modalDeleting.value = false;
      }
    }
    function toggleSort(target, key) {
      if (target.sortBy === key) {
        target.sortOrder = target.sortOrder === "asc" ? "desc" : "asc";
      } else {
        target.sortBy = key;
        target.sortOrder = key === "portfolio" || key === "asset" || key === "liability" || key === "symbol" ? "asc" : "desc";
      }
      target.page = 1;
    }
    function setTablePortfolioKey(value) {
      tablePortfolioKey.value = value;
      portfolioTable.page = 1;
      holdingTable.page = 1;
      liabilityTable.page = 1;
    }
    function selectAllPortfoliosForTables() {
      setTablePortfolioKey("ALL");
    }
    function lineColor(key) {
      const normalized = key.toLowerCase();
      if (normalized === "gross") return "#22c55e";
      if (normalized === "liabilities") return "#ef4444";
      if (normalized === "net") return "#0ea5e9";
      if (normalized.startsWith("portfolio:")) return "#a78bfa";
      if (normalized.startsWith("holding:")) return "#f59e0b";
      return "#94a3b8";
    }
    const chartLines = computed(() => {
      if (trendMode.value === "SUMMARY") {
        const lines = [];
        if (trendVisibility.gross) {
          lines.push({ key: "gross", label: "Gross", values: trendPoints.value.map((p) => ({ snapshotId: p.snapshotId, value: p.gross })) });
        }
        if (trendVisibility.liabilities) {
          lines.push({ key: "liabilities", label: "Liabilities", values: trendPoints.value.map((p) => ({ snapshotId: p.snapshotId, value: p.liabilities })) });
        }
        if (trendVisibility.net) {
          lines.push({ key: "net", label: "Net", values: trendPoints.value.map((p) => ({ snapshotId: p.snapshotId, value: p.net })) });
        }
        return lines;
      }
      return [...trendPortfolioLines.value, ...trendHoldingLines.value];
    });
    const chartRange = computed(() => {
      const values = chartLines.value.flatMap((line) => line.values.map((point) => point.value));
      if (!values.length) return { min: -1, max: 1 };
      const min = Math.min(...values);
      const max = Math.max(...values);
      return min === max ? { min: min - 1, max: max + 1 } : { min, max };
    });
    function chartX(index) {
      const total = trendPoints.value.length;
      if (total <= 1) return chartPadding;
      const usable = chartWidth - chartPadding * 2;
      return chartPadding + usable * index / (total - 1);
    }
    function chartY(value) {
      const usable = chartHeight - chartPadding * 2;
      const ratio = (value - chartRange.value.min) / (chartRange.value.max - chartRange.value.min || 1);
      return chartHeight - chartPadding - usable * ratio;
    }
    function linePath(values) {
      const ids = trendPoints.value.map((item) => item.snapshotId);
      const byId = new Map(values.map((item) => [item.snapshotId, item.value]));
      const pairs = ids.map((id, index) => ({ id, index, value: byId.get(id) })).filter((item) => item.value != null);
      return pairs.map((item, idx) => `${idx === 0 ? "M" : "L"} ${chartX(item.index)} ${chartY(item.value)}`).join(" ");
    }
    function pointX(snapshotId) {
      const idx = trendPoints.value.findIndex((item) => item.snapshotId === snapshotId);
      return chartX(idx < 0 ? 0 : idx);
    }
    function inspectPoint(lineLabel, snapshotId, value) {
      const point = trendPoints.value.find((item) => item.snapshotId === snapshotId);
      trendInspect.value = `${lineLabel} · ${point?.label || "-"} · ${trendMode.value === "SUMMARY" ? formatCurrency(value, summaryCurrency.value) : formatPercent(value)}`;
    }
    function toggleTrendSnapshot(id, checked) {
      const set = new Set(trendSnapshotIds.value);
      if (checked) set.add(id);
      else set.delete(id);
      trendSnapshotIds.value = Array.from(set);
    }
    onMounted(async () => {
      loadMaskFromStorage();
      loadSectionStateFromStorage();
      await ensureInitialized();
      await reloadAll();
    });
    watch(
      () => amountMaskEnabled.value,
      () => saveMaskToStorage()
    );
    watch(
      () => [dashboardExpanded.value, trendExpanded.value, portfoliosExpanded.value, holdingsExpanded.value, liabilitiesExpanded.value],
      () => saveSectionStateToStorage()
    );
    watch(
      () => displayCurrency.value,
      async (next, prev) => {
        if (next === prev) return;
        await reloadAll();
      }
    );
    watch(
      () => [dashboardTarget.value, holdingsPortfolioKey.value, sourceType.value],
      () => {
        void snapshotDashboardData.refreshAllocation();
      }
    );
    watch(
      () => [portfolioTable.page, portfolioTable.pageSize, portfolioTable.sortBy, portfolioTable.sortOrder, tablePortfolioKey.value, sourceType.value],
      () => void loadPortfolioTable()
    );
    watch(
      () => [holdingTable.page, holdingTable.pageSize, holdingTable.sortBy, holdingTable.sortOrder, holdingTable.q, tablePortfolioKey.value, sourceType.value],
      () => void loadHoldingTable()
    );
    watch(
      () => [liabilityTable.page, liabilityTable.pageSize, liabilityTable.sortBy, liabilityTable.sortOrder, liabilityTable.q, tablePortfolioKey.value, sourceType.value],
      () => void loadLiabilityTable()
    );
    watch(
      () => [trendMode.value, trendPortfolioKey.value, trendHoldingIds.value.join(","), trendSnapshotIds.value.join(","), sourceType.value],
      () => void loadTrend()
    );
    watch(
      () => [modalOpen.value, modalQuery.page, modalQuery.pageSize, modalQuery.q, modalQuery.from, modalQuery.to, modalQuery.sortBy, modalQuery.sortOrder, displayCurrency.value],
      () => {
        if (!modalOpen.value) return;
        void loadModalList();
      }
    );
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("main", _hoisted_1, [
        _cache[70] || (_cache[70] = _createStaticVNode('<header class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Snapshot</p><h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Snapshot Workspace</h1><p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> Preview-only analysis mode. Live Home/Report/Dashboard data is not modified. </p></div></div></header>', 1)),
        _createElementVNode("article", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[43] || (_cache[43] = _createElementVNode("div", null, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Snapshot Control"),
              _createElementVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, "Take, load, preview and export snapshot datasets.")
            ], -1)),
            _createElementVNode("div", _hoisted_4, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60",
                disabled: captureLoading.value,
                onClick: _cache[0] || (_cache[0] = ($event) => takeSnapshotNow())
              }, _toDisplayString(captureLoading.value ? "Capturing..." : "Take Snapshot"), 9, _hoisted_5),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[1] || (_cache[1] = ($event) => openLoadModal())
              }, " Load Snapshot "),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: sourceType.value === "LIVE",
                onClick: _cache[2] || (_cache[2] = ($event) => backToLive())
              }, " Back to Live ", 8, _hoisted_6),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: sourceType.value !== "SNAPSHOT",
                onClick: _cache[3] || (_cache[3] = ($event) => exportAppliedSnapshotCsv())
              }, " Export CSV ", 8, _hoisted_7),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[4] || (_cache[4] = ($event) => reloadAll())
              }, " Refresh "),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass([
                  "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                  amountMaskEnabled.value ? "border-amber-400 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                ]),
                onClick: _cache[5] || (_cache[5] = ($event) => amountMaskEnabled.value = !amountMaskEnabled.value)
              }, " Amount Blur " + _toDisplayString(amountMaskEnabled.value ? "ON" : "OFF"), 3)
            ])
          ]),
          _createElementVNode("p", _hoisted_8, _toDisplayString(appliedLabel.value), 1),
          _createElementVNode("p", _hoisted_9, "as_of: " + _toDisplayString(asOfText.value), 1),
          toastMessage.value ? (_openBlock(), _createElementBlock("p", _hoisted_10, _toDisplayString(toastMessage.value), 1)) : _createCommentVNode("", true),
          errorMessage.value ? (_openBlock(), _createElementBlock("p", _hoisted_11, _toDisplayString(errorMessage.value), 1)) : _createCommentVNode("", true)
        ]),
        _createElementVNode("article", _hoisted_12, [
          _createElementVNode("div", _hoisted_13, [
            _createElementVNode("div", null, [
              _cache[44] || (_cache[44] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Snapshot Trend", -1)),
              _cache[45] || (_cache[45] = _createElementVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, "Summary or portfolio return series over selected snapshots.", -1)),
              sourceType.value === "LIVE" ? (_openBlock(), _createElementBlock("p", _hoisted_14, " Live mode uses valuation snapshot history. Snapshot filter is applied only when a snapshot/CSV preview is loaded. ")) : _createCommentVNode("", true)
            ]),
            _createElementVNode("div", _hoisted_15, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[6] || (_cache[6] = ($event) => trendExpanded.value = !trendExpanded.value)
              }, _toDisplayString(trendExpanded.value ? "Collapse" : "Expand"), 1),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", trendMode.value === "SUMMARY" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[7] || (_cache[7] = ($event) => trendMode.value = "SUMMARY")
              }, "Summary", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", trendMode.value === "PORTFOLIO_RETURN" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[8] || (_cache[8] = ($event) => trendMode.value = "PORTFOLIO_RETURN")
              }, "Portfolio Return", 2),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[9] || (_cache[9] = ($event) => trendSettingsOpen.value = !trendSettingsOpen.value)
              }, _toDisplayString(trendSettingsOpen.value ? "Hide Settings" : "Settings"), 1)
            ])
          ]),
          trendExpanded.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            trendMode.value === "SUMMARY" ? (_openBlock(), _createElementBlock("div", _hoisted_16, [
              _createElementVNode("label", _hoisted_17, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => trendVisibility.gross = $event),
                  type: "checkbox",
                  class: "h-4 w-4 rounded"
                }, null, 512), [
                  [_vModelCheckbox, trendVisibility.gross]
                ]),
                _cache[46] || (_cache[46] = _createTextVNode(" Gross", -1))
              ]),
              _createElementVNode("label", _hoisted_18, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => trendVisibility.liabilities = $event),
                  type: "checkbox",
                  class: "h-4 w-4 rounded"
                }, null, 512), [
                  [_vModelCheckbox, trendVisibility.liabilities]
                ]),
                _cache[47] || (_cache[47] = _createTextVNode(" Liabilities", -1))
              ]),
              _createElementVNode("label", _hoisted_19, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => trendVisibility.net = $event),
                  type: "checkbox",
                  class: "h-4 w-4 rounded"
                }, null, 512), [
                  [_vModelCheckbox, trendVisibility.net]
                ]),
                _cache[48] || (_cache[48] = _createTextVNode(" Net", -1))
              ])
            ])) : (_openBlock(), _createElementBlock("div", _hoisted_20, [
              _cache[50] || (_cache[50] = _createElementVNode("span", { class: "font-semibold text-slate-600 dark:text-slate-300" }, "Portfolio", -1)),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => trendPortfolioKey.value = $event),
                class: "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }, [
                _cache[49] || (_cache[49] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(trendPortfolioOptions.value, (item) => {
                  return _openBlock(), _createElementBlock("option", {
                    key: `trend-${item.key}`,
                    value: item.key
                  }, _toDisplayString(item.label), 9, _hoisted_21);
                }), 128))
              ], 512), [
                [_vModelSelect, trendPortfolioKey.value]
              ])
            ])),
            trendSettingsOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_22, [
              _cache[51] || (_cache[51] = _createElementVNode("p", { class: "mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Snapshot Filter", -1)),
              _createElementVNode("div", _hoisted_23, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(trendSnapshotOptions.value, (item) => {
                  return _openBlock(), _createElementBlock("label", {
                    key: `snap-filter-${item.id}`,
                    class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  }, [
                    _createElementVNode("input", {
                      type: "checkbox",
                      class: "h-4 w-4 rounded",
                      checked: trendSnapshotIds.value.includes(item.id),
                      onChange: ($event) => toggleTrendSnapshot(item.id, $event.target.checked)
                    }, null, 40, _hoisted_24),
                    _createTextVNode(" " + _toDisplayString(item.label), 1)
                  ]);
                }), 128))
              ])
            ])) : _createCommentVNode("", true),
            _createElementVNode("div", _hoisted_25, [
              _createElementVNode("div", _hoisted_26, [
                _cache[53] || (_cache[53] = _createElementVNode("p", null, [
                  _createElementVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "X-axis:"),
                  _createTextVNode(" Snapshot captured time (selected snapshots) ")
                ], -1)),
                _createElementVNode("p", null, [
                  _cache[52] || (_cache[52] = _createElementVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Y-axis:", -1)),
                  _createTextVNode(" " + _toDisplayString(trendMode.value === "SUMMARY" ? `Amount (${summaryCurrency.value})` : "Return (%)"), 1)
                ])
              ]),
              trendLoading.value ? (_openBlock(), _createElementBlock("div", _hoisted_27, "Loading trend...")) : trendError.value ? (_openBlock(), _createElementBlock("div", _hoisted_28, _toDisplayString(trendError.value), 1)) : trendPoints.value.length < 1 || chartLines.value.length < 1 ? (_openBlock(), _createElementBlock("div", _hoisted_29, "Not enough points.")) : (_openBlock(), _createElementBlock("div", _hoisted_30, [
                (_openBlock(), _createElementBlock("svg", {
                  viewBox: `0 0 ${chartWidth} ${chartHeight}`,
                  class: "h-[18rem] w-full rounded-xl bg-slate-950/95 p-2"
                }, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(chartLines.value, (line) => {
                    return _openBlock(), _createElementBlock("g", {
                      key: `line-${line.key}`
                    }, [
                      _createElementVNode("path", {
                        d: linePath(line.values),
                        fill: "none",
                        stroke: lineColor(line.key),
                        "stroke-width": "2.25"
                      }, null, 8, _hoisted_32),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(line.values, (point) => {
                        return _openBlock(), _createElementBlock("circle", {
                          key: `point-${line.key}-${point.snapshotId}`,
                          cx: pointX(point.snapshotId),
                          cy: chartY(point.value),
                          r: "4",
                          fill: lineColor(line.key),
                          class: "cursor-pointer",
                          onMouseenter: ($event) => inspectPoint(line.label, point.snapshotId, point.value),
                          onClick: ($event) => inspectPoint(line.label, point.snapshotId, point.value)
                        }, null, 40, _hoisted_33);
                      }), 128))
                    ]);
                  }), 128))
                ], 8, _hoisted_31)),
                _createElementVNode("div", _hoisted_34, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(chartLines.value, (line) => {
                    return _openBlock(), _createElementBlock("span", {
                      key: `legend-${line.key}`,
                      class: "inline-flex items-center gap-1"
                    }, [
                      _createElementVNode("span", {
                        class: "h-2.5 w-2.5 rounded-full",
                        style: _normalizeStyle({ backgroundColor: lineColor(line.key) })
                      }, null, 4),
                      _createTextVNode(" " + _toDisplayString(line.label), 1)
                    ]);
                  }), 128))
                ]),
                _createElementVNode("p", _hoisted_35, _toDisplayString(trendInspect.value || "Hover/click a point to inspect value."), 1)
              ]))
            ])
          ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_36, "Collapsed. Click Expand to open Snapshot Trend."))
        ]),
        modalOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_37, [
          _createElementVNode("div", _hoisted_38, [
            _createElementVNode("div", _hoisted_39, [
              _cache[54] || (_cache[54] = _createElementVNode("div", null, [
                _createElementVNode("h3", { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Load Snapshot"),
                _createElementVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, "Select DB snapshot or CSV preview then apply.")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[14] || (_cache[14] = ($event) => closeLoadModal())
              }, "Close")
            ]),
            _createElementVNode("div", _hoisted_40, [
              _cache[62] || (_cache[62] = _createElementVNode("p", { class: "mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "DB Snapshot List", -1)),
              _createElementVNode("div", _hoisted_41, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => modalQuery.q = $event),
                  type: "text",
                  placeholder: "Search name/note...",
                  class: "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:col-span-2"
                }, null, 512), [
                  [_vModelText, modalQuery.q]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => modalQuery.from = $event),
                  type: "datetime-local",
                  class: "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }, null, 512), [
                  [_vModelText, modalQuery.from]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => modalQuery.to = $event),
                  type: "datetime-local",
                  class: "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }, null, 512), [
                  [_vModelText, modalQuery.to]
                ])
              ]),
              _createElementVNode("div", _hoisted_42, [
                _createElementVNode("table", _hoisted_43, [
                  _createElementVNode("thead", _hoisted_44, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_45, [
                        _createElementVNode("label", _hoisted_46, [
                          _createElementVNode("input", {
                            type: "checkbox",
                            class: "h-4 w-4 rounded",
                            checked: modalAllChecked.value,
                            onChange: _cache[18] || (_cache[18] = ($event) => toggleModalAll($event.target.checked))
                          }, null, 40, _hoisted_47),
                          _cache[55] || (_cache[55] = _createElementVNode("span", null, "All", -1))
                        ])
                      ]),
                      _cache[56] || (_cache[56] = _createElementVNode("th", { class: "px-3 py-2 text-left" }, "ID", -1)),
                      _cache[57] || (_cache[57] = _createElementVNode("th", { class: "px-3 py-2 text-left" }, "Captured At", -1)),
                      _cache[58] || (_cache[58] = _createElementVNode("th", { class: "px-3 py-2 text-left" }, "Name", -1)),
                      _cache[59] || (_cache[59] = _createElementVNode("th", { class: "px-3 py-2 text-left" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    modalLoading.value ? (_openBlock(), _createElementBlock("tr", _hoisted_48, [..._cache[60] || (_cache[60] = [
                      _createElementVNode("td", {
                        colspan: "5",
                        class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                      }, "Loading snapshots...", -1)
                    ])])) : modalRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_49, [..._cache[61] || (_cache[61] = [
                      _createElementVNode("td", {
                        colspan: "5",
                        class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                      }, "No snapshots found.", -1)
                    ])])) : _createCommentVNode("", true),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(modalRows.value, (row) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: `modal-${row.id}`,
                        class: _normalizeClass(["cursor-pointer border-t border-slate-200 dark:border-slate-800", modalSelectedId.value === row.id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""]),
                        onClick: ($event) => modalSelectedId.value = row.id,
                        onDblclick: ($event) => {
                          modalSelectedId.value = row.id;
                          applySelectedSnapshot();
                        }
                      }, [
                        _createElementVNode("td", {
                          class: "px-3 py-2",
                          onClick: _cache[19] || (_cache[19] = _withModifiers(() => {
                          }, ["stop"]))
                        }, [
                          _createElementVNode("input", {
                            type: "checkbox",
                            class: "h-4 w-4 rounded",
                            checked: modalCheckedIds.value.includes(row.id),
                            onChange: ($event) => toggleModalChecked(row.id, $event.target.checked)
                          }, null, 40, _hoisted_51)
                        ]),
                        _createElementVNode("td", _hoisted_52, "#" + _toDisplayString(row.id), 1),
                        _createElementVNode("td", _hoisted_53, _toDisplayString(formatDateTime(row.captured_at)), 1),
                        _createElementVNode("td", _hoisted_54, _toDisplayString(row.name || "-"), 1),
                        _createElementVNode("td", {
                          class: "px-3 py-2",
                          onClick: _cache[20] || (_cache[20] = _withModifiers(() => {
                          }, ["stop"]))
                        }, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                            onClick: ($event) => askDeleteSingleSnapshot(row.id)
                          }, " Delete ", 8, _hoisted_55)
                        ])
                      ], 42, _hoisted_50);
                    }), 128))
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_56, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50",
                  disabled: !modalSelectedId.value,
                  onClick: _cache[21] || (_cache[21] = ($event) => applySelectedSnapshot())
                }, "Apply Selected Snapshot", 8, _hoisted_57),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                  disabled: modalCheckedIds.value.length === 0 || modalDeleting.value,
                  onClick: _cache[22] || (_cache[22] = ($event) => askDeleteSelectedSnapshots())
                }, " Delete Checked (" + _toDisplayString(modalCheckedIds.value.length) + ") ", 9, _hoisted_58)
              ])
            ]),
            _createElementVNode("div", _hoisted_59, [
              _cache[63] || (_cache[63] = _createElementVNode("p", { class: "mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "CSV Preview", -1)),
              _createElementVNode("div", _hoisted_60, [
                _createElementVNode("input", {
                  type: "file",
                  accept: ".csv,text/csv",
                  class: "text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 dark:text-slate-300 dark:file:bg-slate-700 dark:file:text-slate-100",
                  onChange: onCsvFileInput
                }, null, 32),
                csvFileName.value ? (_openBlock(), _createElementBlock("span", _hoisted_61, _toDisplayString(csvFileName.value), 1)) : _createCommentVNode("", true),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50",
                  disabled: !csvPreviewData.value || csvPreviewLoading.value,
                  onClick: _cache[23] || (_cache[23] = ($event) => applyCsvPreviewNow())
                }, "Apply CSV Preview", 8, _hoisted_62)
              ]),
              csvPreviewLoading.value ? (_openBlock(), _createElementBlock("p", _hoisted_63, "Parsing CSV...")) : _createCommentVNode("", true),
              csvPreviewError.value ? (_openBlock(), _createElementBlock("p", _hoisted_64, _toDisplayString(csvPreviewError.value), 1)) : _createCommentVNode("", true)
            ])
          ])
        ])) : _createCommentVNode("", true),
        modalDeleteConfirmOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_65, [
          _createElementVNode("div", _hoisted_66, [
            _cache[64] || (_cache[64] = _createElementVNode("h3", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Delete Snapshots", -1)),
            _createElementVNode("p", _hoisted_67, " Selected snapshot " + _toDisplayString(modalDeleteTargetIds.value.length) + "건을 삭제할까요? 이 작업은 되돌릴 수 없습니다. ", 1),
            _createElementVNode("div", _hoisted_68, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: modalDeleting.value,
                onClick: _cache[24] || (_cache[24] = ($event) => closeDeleteConfirm())
              }, " Cancel ", 8, _hoisted_69),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30",
                disabled: modalDeleting.value,
                onClick: _cache[25] || (_cache[25] = ($event) => confirmDeleteSnapshots())
              }, _toDisplayString(modalDeleting.value ? "Deleting..." : "Delete"), 9, _hoisted_70)
            ])
          ])
        ])) : _createCommentVNode("", true),
        _createVNode(_sfc_main$1, {
          class: "order-4",
          title: "Holdings Table",
          subtitle: "Portfolio / Asset / Price / Avg Cost / Evaluated / Cost Basis / Profit / Return / Symbol",
          expanded: holdingsExpanded.value,
          loading: holdingTable.loading,
          rows: holdingRows.value,
          total: holdingTable.total,
          page: holdingTable.page,
          "page-size": holdingTable.pageSize,
          "sort-by": holdingTable.sortBy,
          "sort-order": holdingTable.sortOrder,
          "search-term": holdingTable.q,
          "mask-amounts": amountMaskEnabled.value,
          "display-currency": summaryCurrency.value,
          onToggle: _cache[26] || (_cache[26] = ($event) => holdingsExpanded.value = !holdingsExpanded.value),
          onSort: _cache[27] || (_cache[27] = ($event) => toggleSort(holdingTable, $event)),
          onSetPage: _cache[28] || (_cache[28] = ($event) => holdingTable.page = $event),
          "onUpdate:searchTerm": _cache[29] || (_cache[29] = ($event) => holdingTable.q = $event)
        }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "search-term", "mask-amounts", "display-currency"]),
        _createVNode(_sfc_main$2, {
          class: "order-5",
          title: "Liabilities Table",
          subtitle: "Portfolio / Liability / Balance / Type",
          expanded: liabilitiesExpanded.value,
          loading: liabilityTable.loading,
          rows: liabilityRows.value,
          total: liabilityTable.total,
          page: liabilityTable.page,
          "page-size": liabilityTable.pageSize,
          "sort-by": liabilityTable.sortBy,
          "sort-order": liabilityTable.sortOrder,
          "search-term": liabilityTable.q,
          "mask-amounts": amountMaskEnabled.value,
          onToggle: _cache[30] || (_cache[30] = ($event) => liabilitiesExpanded.value = !liabilitiesExpanded.value),
          onSort: _cache[31] || (_cache[31] = ($event) => toggleSort(liabilityTable, $event)),
          onSetPage: _cache[32] || (_cache[32] = ($event) => liabilityTable.page = $event),
          "onUpdate:searchTerm": _cache[33] || (_cache[33] = ($event) => liabilityTable.q = $event)
        }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "search-term", "mask-amounts"]),
        _createVNode(_sfc_main$3, {
          class: "order-2",
          title: "Snapshot Dashboard Panel",
          description: "KPI, Donut, Treemap from the applied snapshot dataset.",
          "source-mode": "SNAPSHOT",
          expanded: dashboardExpanded.value,
          "collapsed-message": "Collapsed. Click Expand to preview snapshot dashboard.",
          onToggle: _cache[37] || (_cache[37] = ($event) => dashboardExpanded.value = !dashboardExpanded.value)
        }, {
          controls: _withCtx(() => [
            _createElementVNode("div", _hoisted_71, [
              _createElementVNode("div", _hoisted_72, [
                _createElementVNode("div", _hoisted_73, [
                  _cache[65] || (_cache[65] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "KPI", -1)),
                  _createElementVNode("button", {
                    type: "button",
                    class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", kpiMode.value === "SUMMARY" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                    onClick: _cache[34] || (_cache[34] = ($event) => kpiMode.value = "SUMMARY")
                  }, " Summary ", 2),
                  _createElementVNode("button", {
                    type: "button",
                    class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", kpiMode.value === "PORTFOLIOS" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                    onClick: _cache[35] || (_cache[35] = ($event) => kpiMode.value = "PORTFOLIOS")
                  }, " Portfolios ", 2)
                ]),
                _createElementVNode("div", _hoisted_74, [
                  _cache[66] || (_cache[66] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Target", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["GROSS", "LIABILITIES", "NET", "HOLDINGS"], (target) => {
                    return _createElementVNode("button", {
                      key: target,
                      type: "button",
                      class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", dashboardTarget.value === target ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                      onClick: ($event) => dashboardTarget.value = target
                    }, _toDisplayString(target), 11, _hoisted_75);
                  }), 64))
                ]),
                _createElementVNode("div", _hoisted_76, [
                  _cache[67] || (_cache[67] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Start", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["TOP", "RIGHT", "LEFT"], (start) => {
                    return _createElementVNode("button", {
                      key: start,
                      type: "button",
                      class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", donutStart.value === start ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                      onClick: ($event) => donutStart.value = start
                    }, _toDisplayString(start), 11, _hoisted_77);
                  }), 64))
                ]),
                _createElementVNode("div", _hoisted_78, [
                  _cache[69] || (_cache[69] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Portfolio", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => holdingsPortfolioKey.value = $event),
                    class: "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }, [
                    _cache[68] || (_cache[68] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolioOptions.value, (item) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: `holdings-${item.key}`,
                        value: item.key
                      }, _toDisplayString(item.label), 9, _hoisted_79);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, holdingsPortfolioKey.value]
                  ])
                ]),
                _createElementVNode("div", _hoisted_80, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                    onClick: printSnapshotDashboard
                  }, " Print "),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
                    disabled: exportingDashboardImage.value || loading.value || !dashboardExpanded.value,
                    onClick: exportSnapshotDashboardImage
                  }, _toDisplayString(exportingDashboardImage.value ? "Exporting..." : "Export PNG"), 9, _hoisted_81)
                ])
              ])
            ])
          ]),
          default: _withCtx(() => [
            _createElementVNode("div", {
              ref_key: "snapshotDashboardRef",
              ref: snapshotDashboardRef,
              class: "space-y-4"
            }, [
              kpiMode.value === "SUMMARY" && _unref(summaryVm) ? (_openBlock(), _createBlock(_sfc_main$4, {
                key: 0,
                currency: summaryCurrency.value,
                "gross-assets-total": _unref(summaryVm).gross,
                "liabilities-total": _unref(summaryVm).liabilities,
                "net-assets-total": _unref(summaryVm).net,
                "invested-principal-total": _unref(summaryVm).invested,
                "principal-minus-debt-total": _unref(summaryVm).debtAdjusted,
                "gross-return-pct": kpiGrossReturn.value,
                "net-return-pct": kpiNetReturn.value,
                "gross-profit-total": kpiGrossProfit.value,
                "net-profit-total": kpiNetProfit.value,
                "as-of": asOfText.value,
                title: "KPI Summary",
                subtitle: "Included in snapshot analysis",
                "mask-amounts": amountMaskEnabled.value
              }, null, 8, ["currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "gross-return-pct", "net-return-pct", "gross-profit-total", "net-profit-total", "as-of", "mask-amounts"])) : _createCommentVNode("", true),
              kpiMode.value === "PORTFOLIOS" ? (_openBlock(), _createBlock(_sfc_main$5, {
                key: 1,
                currency: summaryCurrency.value,
                portfolios: kpiPortfolioCardRows.value,
                "mask-amounts": amountMaskEnabled.value,
                title: "KPI Portfolios",
                subtitle: "Portfolio-level KPI for the applied source"
              }, null, 8, ["currency", "portfolios", "mask-amounts"])) : _createCommentVNode("", true),
              _createElementVNode("div", _hoisted_82, [
                _createVNode(_sfc_main$6, {
                  title: `Allocation | ${dashboardTarget.value}`,
                  subtitle: `Top N + Others (${holdingsPortfolioKey.value === "ALL" ? "all portfolios" : "filtered portfolio"})`,
                  currency: summaryCurrency.value,
                  total: _unref(donutTotal),
                  items: _unref(donutItems),
                  "start-position": donutStart.value,
                  "mask-amounts": amountMaskEnabled.value,
                  loading: _unref(donutLoading),
                  error: _unref(donutError)
                }, null, 8, ["title", "subtitle", "currency", "total", "items", "start-position", "mask-amounts", "loading", "error"]),
                _createVNode(_sfc_main$7, {
                  title: "Treemap Holdings",
                  subtitle: dashboardTarget.value === "HOLDINGS" ? `Target=HOLDINGS | group_by=ASSET | color=return ${holdingsPortfolioKey.value === "ALL" ? "" : `| ${portfolioOptions.value.find((p) => p.key === holdingsPortfolioKey.value)?.label || "filtered portfolio"}`}` : `Target=${dashboardTarget.value} | group_by=PORTFOLIO | color=return`,
                  currency: summaryCurrency.value,
                  items: _unref(treemapItems),
                  "mask-amounts": amountMaskEnabled.value,
                  loading: _unref(treemapLoading),
                  error: _unref(treemapError)
                }, null, 8, ["subtitle", "currency", "items", "mask-amounts", "loading", "error"])
              ])
            ], 512)
          ]),
          _: 1
        }, 8, ["expanded"]),
        _createVNode(_sfc_main$8, {
          class: "order-3",
          title: "Portfolios Table",
          subtitle: "Portfolio / Current / Invested Principal / Profit / Return",
          expanded: portfoliosExpanded.value,
          loading: portfolioTable.loading,
          rows: portfolioRows.value,
          total: portfolioTable.total,
          page: portfolioTable.page,
          "page-size": portfolioTable.pageSize,
          "sort-by": portfolioTable.sortBy,
          "sort-order": portfolioTable.sortOrder,
          currency: summaryCurrency.value,
          "mask-amounts": amountMaskEnabled.value,
          "show-filter": true,
          "portfolio-key": tablePortfolioKey.value,
          "portfolio-options": portfolioOptions.value,
          onToggle: _cache[38] || (_cache[38] = ($event) => portfoliosExpanded.value = !portfoliosExpanded.value),
          onSort: _cache[39] || (_cache[39] = ($event) => toggleSort(portfolioTable, $event)),
          onSetPage: _cache[40] || (_cache[40] = ($event) => portfolioTable.page = $event),
          onSelectAll: _cache[41] || (_cache[41] = ($event) => selectAllPortfoliosForTables()),
          onSetPortfolioKey: _cache[42] || (_cache[42] = ($event) => setTablePortfolioKey($event))
        }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "currency", "mask-amounts", "portfolio-key", "portfolio-options"])
      ]);
    };
  }
});

export { _sfc_main as default };
