import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul, s as seoulDateToUtcNaiveIso, A as AxiosError } from './datetime-BbzyLRcb.js';

async function getAdminHistory(params) {
  const { data } = await http.get("/admin/history", { params });
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,vModelText:_vModelText,withDirectives:_withDirectives,createTextVNode:_createTextVNode,renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,vModelSelect:_vModelSelect,createCommentVNode:_createCommentVNode,normalizeClass:_normalizeClass,withModifiers:_withModifiers} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-center justify-between gap-3" };
const _hoisted_4 = ["disabled"];
const _hoisted_5 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_6 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" };
const _hoisted_7 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_8 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_9 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_10 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_11 = ["value"];
const _hoisted_12 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_13 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_14 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2" };
const _hoisted_15 = { class: "flex items-center gap-2" };
const _hoisted_16 = ["disabled"];
const _hoisted_17 = ["disabled"];
const _hoisted_18 = { class: "inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_19 = ["value"];
const _hoisted_20 = {
  key: 0,
  class: "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_21 = { class: "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_22 = { class: "overflow-x-auto" };
const _hoisted_23 = { class: "min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800" };
const _hoisted_24 = { class: "bg-slate-50 dark:bg-slate-800/80" };
const _hoisted_25 = { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_26 = { class: "opacity-70" };
const _hoisted_27 = { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_28 = { class: "opacity-70" };
const _hoisted_29 = { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_30 = { class: "opacity-70" };
const _hoisted_31 = { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_32 = { class: "opacity-70" };
const _hoisted_33 = { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_34 = { class: "opacity-70" };
const _hoisted_35 = { class: "px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_36 = { class: "opacity-70" };
const _hoisted_37 = { class: "divide-y divide-slate-100 dark:divide-slate-800" };
const _hoisted_38 = { key: 0 };
const _hoisted_39 = { class: "px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_40 = { class: "px-3 py-2 text-slate-700 dark:text-slate-200" };
const _hoisted_41 = { class: "whitespace-nowrap" };
const _hoisted_42 = { class: "mt-0.5 max-w-[16rem] truncate text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_43 = { class: "px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_44 = { class: "px-3 py-2 text-slate-700 dark:text-slate-200" };
const _hoisted_45 = ["title"];
const _hoisted_46 = { class: "px-3 py-2 whitespace-nowrap" };
const _hoisted_47 = { class: "px-3 py-2 text-right whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_48 = { class: "px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_49 = { class: "px-3 py-2 text-center" };
const _hoisted_50 = ["onClick"];
const _hoisted_51 = { class: "flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs dark:border-slate-800" };
const _hoisted_52 = { class: "text-slate-500 dark:text-slate-400" };
const _hoisted_53 = { class: "font-semibold text-slate-700 dark:text-slate-200" };
const _hoisted_54 = { class: "inline-flex items-center gap-2" };
const _hoisted_55 = ["disabled"];
const _hoisted_56 = { class: "text-slate-600 dark:text-slate-300" };
const _hoisted_57 = ["disabled"];
const _hoisted_58 = { class: "w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_59 = { class: "flex items-start justify-between gap-3" };
const _hoisted_60 = { class: "mt-2 text-lg font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_61 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_62 = { class: "mt-4 grid grid-cols-1 gap-3 text-xs md:grid-cols-2" };
const _hoisted_63 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_64 = { class: "mt-1 text-slate-600 dark:text-slate-300" };
const _hoisted_65 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_66 = { class: "mt-1 text-slate-600 dark:text-slate-300" };
const _hoisted_67 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_68 = { class: "mt-1 text-slate-600 dark:text-slate-300" };
const _hoisted_69 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_70 = { class: "mt-1 break-all text-slate-600 dark:text-slate-300" };
const _hoisted_71 = { class: "mt-1 break-all text-slate-500 dark:text-slate-400" };
const _hoisted_72 = { class: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" };
const _hoisted_73 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_74 = { class: "mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100" };
const _hoisted_75 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_76 = { class: "mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100" };
const {computed,onBeforeUnmount,onMounted,reactive,ref,watch} = await importShared('vue');
const AUTO_SEARCH_DEBOUNCE_MS = 450;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "HistoryPage",
  setup(__props) {
    const loading = ref(false);
    const errorMessage = ref("");
    const items = ref([]);
    const total = ref(0);
    const selectedItem = ref(null);
    const filters = reactive({
      from: "",
      to: "",
      userId: "",
      method: "",
      pathContains: "",
      statusCode: ""
    });
    const pagination = reactive({
      page: 1,
      pageSize: 20
    });
    const methodOptions = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    const pageSizeOptions = [20, 50, 100];
    const sortBy = ref("timestamp");
    const sortOrder = ref("desc");
    let filterDebounceTimer = null;
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pagination.pageSize)));
    const hasRows = computed(() => items.value.length > 0);
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function actorText(item) {
      if (!item.user_id) return "anonymous";
      const role = item.role ? ` (${item.role})` : "";
      return `#${item.user_id}${role}`;
    }
    function endpointText(item) {
      if (!item.query) return item.path;
      return `${item.path}?${item.query}`;
    }
    function statusClass(statusCode) {
      if (statusCode >= 500) {
        return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200";
      }
      if (statusCode >= 400) {
        return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200";
      }
      return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200";
    }
    function buildQuery() {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        sort_by: sortBy.value,
        sort_order: sortOrder.value
      };
      const fromIso = seoulDateToUtcNaiveIso(filters.from, false);
      const toIso = seoulDateToUtcNaiveIso(filters.to, true);
      if (fromIso) params.from = fromIso;
      if (toIso) params.to = toIso;
      if (filters.pathContains.trim()) params.path_contains = filters.pathContains.trim();
      if (filters.method) params.method = filters.method;
      if (filters.userId.trim()) {
        const userId = Number(filters.userId.trim());
        if (Number.isInteger(userId) && userId > 0) {
          params.user_id = userId;
        }
      }
      if (filters.statusCode.trim()) {
        const statusCode = Number(filters.statusCode.trim());
        if (Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599) {
          params.status_code = statusCode;
        }
      }
      return params;
    }
    function toggleSort(next) {
      if (sortBy.value === next) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortBy.value = next;
        sortOrder.value = "desc";
      }
      pagination.page = 1;
      void loadHistory();
    }
    function sortIndicator(next) {
      if (sortBy.value !== next) return "";
      return sortOrder.value === "asc" ? "▲" : "▼";
    }
    function parseApiError(error) {
      if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail;
        if (detail) return detail;
        if (error.response?.status === 403) return "권한이 없습니다. Maintainer/Admin 계정으로 확인해 주세요.";
      }
      if (error instanceof Error) return error.message;
      return "Unknown error";
    }
    async function loadHistory() {
      loading.value = true;
      errorMessage.value = "";
      try {
        const out = await getAdminHistory(buildQuery());
        items.value = out.items;
        total.value = out.total;
      } catch (error) {
        items.value = [];
        total.value = 0;
        errorMessage.value = `Failed to load history: ${parseApiError(error)}`;
      } finally {
        loading.value = false;
      }
    }
    async function applyFilters() {
      clearFilterDebounce();
      pagination.page = 1;
      await loadHistory();
    }
    async function resetFilters() {
      clearFilterDebounce();
      filters.from = "";
      filters.to = "";
      filters.userId = "";
      filters.method = "";
      filters.pathContains = "";
      filters.statusCode = "";
      pagination.page = 1;
      await loadHistory();
    }
    function clearFilterDebounce() {
      if (!filterDebounceTimer) return;
      clearTimeout(filterDebounceTimer);
      filterDebounceTimer = null;
    }
    function queueFilterSearch() {
      clearFilterDebounce();
      filterDebounceTimer = setTimeout(async () => {
        pagination.page = 1;
        await loadHistory();
      }, AUTO_SEARCH_DEBOUNCE_MS);
    }
    async function movePage(nextPage) {
      const clamped = Math.min(Math.max(1, nextPage), totalPages.value);
      if (clamped === pagination.page) return;
      pagination.page = clamped;
      await loadHistory();
    }
    watch(
      () => pagination.pageSize,
      async () => {
        clearFilterDebounce();
        pagination.page = 1;
        await loadHistory();
      }
    );
    watch(
      () => filters.pathContains,
      () => {
        queueFilterSearch();
      }
    );
    onBeforeUnmount(() => {
      clearFilterDebounce();
    });
    onMounted(async () => {
      await loadHistory();
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[17] || (_cache[17] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300" }, "History"),
              _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "API Audit History"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " 사용자 액션, 엔드포인트 호출 결과, 마스킹된 요청/응답을 조회합니다. ")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              disabled: loading.value,
              onClick: loadHistory
            }, _toDisplayString(loading.value ? "Loading..." : "Refresh"), 9, _hoisted_4)
          ])
        ]),
        _createElementVNode("article", _hoisted_5, [
          _createElementVNode("div", _hoisted_6, [
            _createElementVNode("label", _hoisted_7, [
              _cache[18] || (_cache[18] = _createTextVNode(" From ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filters.from = $event),
                type: "date",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.from]
              ])
            ]),
            _createElementVNode("label", _hoisted_8, [
              _cache[19] || (_cache[19] = _createTextVNode(" To ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filters.to = $event),
                type: "date",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.to]
              ])
            ]),
            _createElementVNode("label", _hoisted_9, [
              _cache[20] || (_cache[20] = _createTextVNode(" User ID ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filters.userId = $event),
                type: "number",
                min: "1",
                placeholder: "e.g. 1",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.userId]
              ])
            ]),
            _createElementVNode("label", _hoisted_10, [
              _cache[22] || (_cache[22] = _createTextVNode(" Method ", -1)),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => filters.method = $event),
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, [
                _cache[21] || (_cache[21] = _createElementVNode("option", { value: "" }, "ALL", -1)),
                (_openBlock(), _createElementBlock(_Fragment, null, _renderList(methodOptions, (method) => {
                  return _createElementVNode("option", {
                    key: method,
                    value: method
                  }, _toDisplayString(method), 9, _hoisted_11);
                }), 64))
              ], 512), [
                [_vModelSelect, filters.method]
              ])
            ]),
            _createElementVNode("label", _hoisted_12, [
              _cache[23] || (_cache[23] = _createTextVNode(" Path Contains ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => filters.pathContains = $event),
                type: "text",
                placeholder: "/holdings",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.pathContains]
              ])
            ]),
            _createElementVNode("label", _hoisted_13, [
              _cache[24] || (_cache[24] = _createTextVNode(" Status Code ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => filters.statusCode = $event),
                type: "number",
                min: "100",
                max: "599",
                placeholder: "200",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.statusCode]
              ])
            ])
          ]),
          _createElementVNode("div", _hoisted_14, [
            _createElementVNode("div", _hoisted_15, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70",
                disabled: loading.value,
                onClick: applyFilters
              }, " Search ", 8, _hoisted_16),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: loading.value,
                onClick: resetFilters
              }, " Reset ", 8, _hoisted_17)
            ]),
            _createElementVNode("label", _hoisted_18, [
              _cache[25] || (_cache[25] = _createElementVNode("span", null, "Page Size", -1)),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => pagination.pageSize = $event),
                class: "rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
              }, [
                (_openBlock(), _createElementBlock(_Fragment, null, _renderList(pageSizeOptions, (size) => {
                  return _createElementVNode("option", {
                    key: size,
                    value: size
                  }, _toDisplayString(size), 9, _hoisted_19);
                }), 64))
              ], 512), [
                [
                  _vModelSelect,
                  pagination.pageSize,
                  void 0,
                  { number: true }
                ]
              ])
            ])
          ])
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_20, _toDisplayString(errorMessage.value), 1)) : _createCommentVNode("", true),
        _createElementVNode("article", _hoisted_21, [
          _createElementVNode("div", _hoisted_22, [
            _createElementVNode("table", _hoisted_23, [
              _createElementVNode("thead", _hoisted_24, [
                _createElementVNode("tr", null, [
                  _createElementVNode("th", _hoisted_25, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 hover:underline",
                      onClick: _cache[7] || (_cache[7] = ($event) => toggleSort("timestamp"))
                    }, [
                      _cache[26] || (_cache[26] = _createTextVNode(" Time ", -1)),
                      _createElementVNode("span", _hoisted_26, _toDisplayString(sortIndicator("timestamp")), 1)
                    ])
                  ]),
                  _createElementVNode("th", _hoisted_27, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 hover:underline",
                      onClick: _cache[8] || (_cache[8] = ($event) => toggleSort("user_id"))
                    }, [
                      _cache[27] || (_cache[27] = _createTextVNode(" Actor ", -1)),
                      _createElementVNode("span", _hoisted_28, _toDisplayString(sortIndicator("user_id")), 1)
                    ])
                  ]),
                  _createElementVNode("th", _hoisted_29, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 hover:underline",
                      onClick: _cache[9] || (_cache[9] = ($event) => toggleSort("method"))
                    }, [
                      _cache[28] || (_cache[28] = _createTextVNode(" Method ", -1)),
                      _createElementVNode("span", _hoisted_30, _toDisplayString(sortIndicator("method")), 1)
                    ])
                  ]),
                  _cache[32] || (_cache[32] = _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "Action", -1)),
                  _createElementVNode("th", _hoisted_31, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 hover:underline",
                      onClick: _cache[10] || (_cache[10] = ($event) => toggleSort("path"))
                    }, [
                      _cache[29] || (_cache[29] = _createTextVNode(" Endpoint ", -1)),
                      _createElementVNode("span", _hoisted_32, _toDisplayString(sortIndicator("path")), 1)
                    ])
                  ]),
                  _createElementVNode("th", _hoisted_33, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 hover:underline",
                      onClick: _cache[11] || (_cache[11] = ($event) => toggleSort("status_code"))
                    }, [
                      _cache[30] || (_cache[30] = _createTextVNode(" Status ", -1)),
                      _createElementVNode("span", _hoisted_34, _toDisplayString(sortIndicator("status_code")), 1)
                    ])
                  ]),
                  _createElementVNode("th", _hoisted_35, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 hover:underline",
                      onClick: _cache[12] || (_cache[12] = ($event) => toggleSort("duration_ms"))
                    }, [
                      _cache[31] || (_cache[31] = _createTextVNode(" Latency ", -1)),
                      _createElementVNode("span", _hoisted_36, _toDisplayString(sortIndicator("duration_ms")), 1)
                    ])
                  ]),
                  _cache[33] || (_cache[33] = _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "IP", -1)),
                  _cache[34] || (_cache[34] = _createElementVNode("th", { class: "px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300" }, "Detail", -1))
                ])
              ]),
              _createElementVNode("tbody", _hoisted_37, [
                !loading.value && !hasRows.value ? (_openBlock(), _createElementBlock("tr", _hoisted_38, [..._cache[35] || (_cache[35] = [
                  _createElementVNode("td", {
                    colspan: "9",
                    class: "px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                  }, " 조회 결과가 없습니다. ", -1)
                ])])) : _createCommentVNode("", true),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items.value, (item) => {
                  return _openBlock(), _createElementBlock("tr", {
                    key: item.id,
                    class: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  }, [
                    _createElementVNode("td", _hoisted_39, _toDisplayString(formatDateTime(item.timestamp)), 1),
                    _createElementVNode("td", _hoisted_40, [
                      _createElementVNode("p", _hoisted_41, _toDisplayString(actorText(item)), 1),
                      _createElementVNode("p", _hoisted_42, _toDisplayString(item.actor_email || "-"), 1)
                    ]),
                    _createElementVNode("td", _hoisted_43, _toDisplayString(item.method), 1),
                    _createElementVNode("td", _hoisted_44, _toDisplayString(item.action_name || "-"), 1),
                    _createElementVNode("td", {
                      class: "px-3 py-2 max-w-[30rem] truncate text-slate-700 dark:text-slate-200",
                      title: endpointText(item)
                    }, _toDisplayString(endpointText(item)), 9, _hoisted_45),
                    _createElementVNode("td", _hoisted_46, [
                      _createElementVNode("span", {
                        class: _normalizeClass(["inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold", statusClass(item.status_code)])
                      }, _toDisplayString(item.status_code), 3)
                    ]),
                    _createElementVNode("td", _hoisted_47, _toDisplayString(item.duration_ms) + " ms", 1),
                    _createElementVNode("td", _hoisted_48, _toDisplayString(item.client_ip || "-"), 1),
                    _createElementVNode("td", _hoisted_49, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                        onClick: ($event) => selectedItem.value = item
                      }, " View ", 8, _hoisted_50)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode("div", _hoisted_51, [
            _createElementVNode("p", _hoisted_52, [
              _cache[36] || (_cache[36] = _createTextVNode(" total: ", -1)),
              _createElementVNode("span", _hoisted_53, _toDisplayString(total.value), 1)
            ]),
            _createElementVNode("div", _hoisted_54, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: loading.value || pagination.page <= 1,
                onClick: _cache[13] || (_cache[13] = ($event) => movePage(pagination.page - 1))
              }, " Prev ", 8, _hoisted_55),
              _createElementVNode("span", _hoisted_56, "page " + _toDisplayString(pagination.page) + " / " + _toDisplayString(totalPages.value), 1),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: loading.value || pagination.page >= totalPages.value,
                onClick: _cache[14] || (_cache[14] = ($event) => movePage(pagination.page + 1))
              }, " Next ", 8, _hoisted_57)
            ])
          ])
        ]),
        selectedItem.value ? (_openBlock(), _createElementBlock("div", {
          key: 1,
          class: "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55 p-3 md:items-center",
          onClick: _cache[16] || (_cache[16] = _withModifiers(($event) => selectedItem.value = null, ["self"]))
        }, [
          _createElementVNode("section", _hoisted_58, [
            _createElementVNode("div", _hoisted_59, [
              _createElementVNode("div", null, [
                _cache[37] || (_cache[37] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300" }, "History Detail", -1)),
                _createElementVNode("h2", _hoisted_60, " #" + _toDisplayString(selectedItem.value.id) + " " + _toDisplayString(selectedItem.value.method) + " " + _toDisplayString(selectedItem.value.path), 1),
                _createElementVNode("p", _hoisted_61, _toDisplayString(formatDateTime(selectedItem.value.timestamp)), 1)
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[15] || (_cache[15] = ($event) => selectedItem.value = null)
              }, " Close ")
            ]),
            _createElementVNode("div", _hoisted_62, [
              _createElementVNode("div", _hoisted_63, [
                _cache[38] || (_cache[38] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Actor", -1)),
                _createElementVNode("p", _hoisted_64, _toDisplayString(actorText(selectedItem.value)), 1)
              ]),
              _createElementVNode("div", _hoisted_65, [
                _cache[39] || (_cache[39] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Result", -1)),
                _createElementVNode("p", _hoisted_66, _toDisplayString(selectedItem.value.result || "-"), 1)
              ]),
              _createElementVNode("div", _hoisted_67, [
                _cache[40] || (_cache[40] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Status / Latency", -1)),
                _createElementVNode("p", _hoisted_68, _toDisplayString(selectedItem.value.status_code) + " / " + _toDisplayString(selectedItem.value.duration_ms) + " ms", 1)
              ]),
              _createElementVNode("div", _hoisted_69, [
                _cache[41] || (_cache[41] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "IP / Agent", -1)),
                _createElementVNode("p", _hoisted_70, _toDisplayString(selectedItem.value.client_ip || "-"), 1),
                _createElementVNode("p", _hoisted_71, _toDisplayString(selectedItem.value.user_agent || "-"), 1)
              ])
            ]),
            _createElementVNode("div", _hoisted_72, [
              _createElementVNode("article", _hoisted_73, [
                _cache[42] || (_cache[42] = _createElementVNode("h3", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300" }, "Request (masked)", -1)),
                _createElementVNode("pre", _hoisted_74, _toDisplayString(selectedItem.value.request_body_masked || "-"), 1)
              ]),
              _createElementVNode("article", _hoisted_75, [
                _cache[43] || (_cache[43] = _createElementVNode("h3", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300" }, "Response (masked)", -1)),
                _createElementVNode("pre", _hoisted_76, _toDisplayString(selectedItem.value.response_body_masked || "-"), 1)
              ])
            ])
          ])
        ])) : _createCommentVNode("", true)
      ]);
    };
  }
});

export { _sfc_main as default };
