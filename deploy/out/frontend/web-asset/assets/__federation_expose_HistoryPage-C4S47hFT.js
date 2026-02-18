import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, A as AxiosError } from './http-nYGPWehe.js';

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
const _hoisted_24 = { class: "divide-y divide-slate-100 dark:divide-slate-800" };
const _hoisted_25 = { key: 0 };
const _hoisted_26 = { class: "px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_27 = { class: "px-3 py-2 text-slate-700 dark:text-slate-200" };
const _hoisted_28 = { class: "whitespace-nowrap" };
const _hoisted_29 = { class: "mt-0.5 max-w-[16rem] truncate text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_30 = { class: "px-3 py-2 text-slate-700 dark:text-slate-200" };
const _hoisted_31 = ["title"];
const _hoisted_32 = { class: "px-3 py-2 whitespace-nowrap" };
const _hoisted_33 = { class: "px-3 py-2 text-right whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_34 = { class: "px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200" };
const _hoisted_35 = { class: "px-3 py-2 text-center" };
const _hoisted_36 = ["onClick"];
const _hoisted_37 = { class: "flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs dark:border-slate-800" };
const _hoisted_38 = { class: "text-slate-500 dark:text-slate-400" };
const _hoisted_39 = { class: "font-semibold text-slate-700 dark:text-slate-200" };
const _hoisted_40 = { class: "inline-flex items-center gap-2" };
const _hoisted_41 = ["disabled"];
const _hoisted_42 = { class: "text-slate-600 dark:text-slate-300" };
const _hoisted_43 = ["disabled"];
const _hoisted_44 = { class: "w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_45 = { class: "flex items-start justify-between gap-3" };
const _hoisted_46 = { class: "mt-2 text-lg font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_47 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_48 = { class: "mt-4 grid grid-cols-1 gap-3 text-xs md:grid-cols-2" };
const _hoisted_49 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_50 = { class: "mt-1 text-slate-600 dark:text-slate-300" };
const _hoisted_51 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_52 = { class: "mt-1 text-slate-600 dark:text-slate-300" };
const _hoisted_53 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_54 = { class: "mt-1 text-slate-600 dark:text-slate-300" };
const _hoisted_55 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_56 = { class: "mt-1 break-all text-slate-600 dark:text-slate-300" };
const _hoisted_57 = { class: "mt-1 break-all text-slate-500 dark:text-slate-400" };
const _hoisted_58 = { class: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" };
const _hoisted_59 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_60 = { class: "mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100" };
const _hoisted_61 = { class: "rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" };
const _hoisted_62 = { class: "mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100" };
const {computed,onMounted,reactive,ref,watch} = await importShared('vue');
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
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pagination.pageSize)));
    const hasRows = computed(() => items.value.length > 0);
    function formatDateTime(value) {
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return value;
      return dt.toLocaleString("ko-KR");
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
        page_size: pagination.pageSize
      };
      if (filters.from.trim()) params.from = filters.from.trim();
      if (filters.to.trim()) params.to = filters.to.trim();
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
      pagination.page = 1;
      await loadHistory();
    }
    async function resetFilters() {
      filters.from = "";
      filters.to = "";
      filters.userId = "";
      filters.method = "";
      filters.pathContains = "";
      filters.statusCode = "";
      pagination.page = 1;
      await loadHistory();
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
        pagination.page = 1;
        await loadHistory();
      }
    );
    onMounted(async () => {
      await loadHistory();
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[11] || (_cache[11] = _createElementVNode("div", null, [
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
              _cache[12] || (_cache[12] = _createTextVNode(" From ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filters.from = $event),
                type: "datetime-local",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.from]
              ])
            ]),
            _createElementVNode("label", _hoisted_8, [
              _cache[13] || (_cache[13] = _createTextVNode(" To ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filters.to = $event),
                type: "datetime-local",
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.to]
              ])
            ]),
            _createElementVNode("label", _hoisted_9, [
              _cache[14] || (_cache[14] = _createTextVNode(" User ID ", -1)),
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
              _cache[16] || (_cache[16] = _createTextVNode(" Method ", -1)),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => filters.method = $event),
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
              }, [
                _cache[15] || (_cache[15] = _createElementVNode("option", { value: "" }, "ALL", -1)),
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
              _cache[17] || (_cache[17] = _createTextVNode(" Path Contains ", -1)),
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
              _cache[18] || (_cache[18] = _createTextVNode(" Status Code ", -1)),
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
              _cache[19] || (_cache[19] = _createElementVNode("span", null, "Page Size", -1)),
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
              _cache[21] || (_cache[21] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800/80" }, [
                _createElementVNode("tr", null, [
                  _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "Time"),
                  _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "Actor"),
                  _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "Action"),
                  _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "Endpoint"),
                  _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "Status"),
                  _createElementVNode("th", { class: "px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300" }, "Latency"),
                  _createElementVNode("th", { class: "px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300" }, "IP"),
                  _createElementVNode("th", { class: "px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300" }, "Detail")
                ])
              ], -1)),
              _createElementVNode("tbody", _hoisted_24, [
                !loading.value && !hasRows.value ? (_openBlock(), _createElementBlock("tr", _hoisted_25, [..._cache[20] || (_cache[20] = [
                  _createElementVNode("td", {
                    colspan: "8",
                    class: "px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                  }, " 조회 결과가 없습니다. ", -1)
                ])])) : _createCommentVNode("", true),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items.value, (item) => {
                  return _openBlock(), _createElementBlock("tr", {
                    key: item.id,
                    class: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  }, [
                    _createElementVNode("td", _hoisted_26, _toDisplayString(formatDateTime(item.timestamp)), 1),
                    _createElementVNode("td", _hoisted_27, [
                      _createElementVNode("p", _hoisted_28, _toDisplayString(actorText(item)), 1),
                      _createElementVNode("p", _hoisted_29, _toDisplayString(item.actor_email || "-"), 1)
                    ]),
                    _createElementVNode("td", _hoisted_30, _toDisplayString(item.action_name || "-"), 1),
                    _createElementVNode("td", {
                      class: "px-3 py-2 max-w-[30rem] truncate text-slate-700 dark:text-slate-200",
                      title: endpointText(item)
                    }, _toDisplayString(endpointText(item)), 9, _hoisted_31),
                    _createElementVNode("td", _hoisted_32, [
                      _createElementVNode("span", {
                        class: _normalizeClass(["inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold", statusClass(item.status_code)])
                      }, _toDisplayString(item.status_code), 3)
                    ]),
                    _createElementVNode("td", _hoisted_33, _toDisplayString(item.duration_ms) + " ms", 1),
                    _createElementVNode("td", _hoisted_34, _toDisplayString(item.client_ip || "-"), 1),
                    _createElementVNode("td", _hoisted_35, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                        onClick: ($event) => selectedItem.value = item
                      }, " View ", 8, _hoisted_36)
                    ])
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode("div", _hoisted_37, [
            _createElementVNode("p", _hoisted_38, [
              _cache[22] || (_cache[22] = _createTextVNode(" total: ", -1)),
              _createElementVNode("span", _hoisted_39, _toDisplayString(total.value), 1)
            ]),
            _createElementVNode("div", _hoisted_40, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: loading.value || pagination.page <= 1,
                onClick: _cache[7] || (_cache[7] = ($event) => movePage(pagination.page - 1))
              }, " Prev ", 8, _hoisted_41),
              _createElementVNode("span", _hoisted_42, "page " + _toDisplayString(pagination.page) + " / " + _toDisplayString(totalPages.value), 1),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: loading.value || pagination.page >= totalPages.value,
                onClick: _cache[8] || (_cache[8] = ($event) => movePage(pagination.page + 1))
              }, " Next ", 8, _hoisted_43)
            ])
          ])
        ]),
        selectedItem.value ? (_openBlock(), _createElementBlock("div", {
          key: 1,
          class: "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55 p-3 md:items-center",
          onClick: _cache[10] || (_cache[10] = _withModifiers(($event) => selectedItem.value = null, ["self"]))
        }, [
          _createElementVNode("section", _hoisted_44, [
            _createElementVNode("div", _hoisted_45, [
              _createElementVNode("div", null, [
                _cache[23] || (_cache[23] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300" }, "History Detail", -1)),
                _createElementVNode("h2", _hoisted_46, " #" + _toDisplayString(selectedItem.value.id) + " " + _toDisplayString(selectedItem.value.method) + " " + _toDisplayString(selectedItem.value.path), 1),
                _createElementVNode("p", _hoisted_47, _toDisplayString(formatDateTime(selectedItem.value.timestamp)), 1)
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[9] || (_cache[9] = ($event) => selectedItem.value = null)
              }, " Close ")
            ]),
            _createElementVNode("div", _hoisted_48, [
              _createElementVNode("div", _hoisted_49, [
                _cache[24] || (_cache[24] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Actor", -1)),
                _createElementVNode("p", _hoisted_50, _toDisplayString(actorText(selectedItem.value)), 1)
              ]),
              _createElementVNode("div", _hoisted_51, [
                _cache[25] || (_cache[25] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Result", -1)),
                _createElementVNode("p", _hoisted_52, _toDisplayString(selectedItem.value.result || "-"), 1)
              ]),
              _createElementVNode("div", _hoisted_53, [
                _cache[26] || (_cache[26] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Status / Latency", -1)),
                _createElementVNode("p", _hoisted_54, _toDisplayString(selectedItem.value.status_code) + " / " + _toDisplayString(selectedItem.value.duration_ms) + " ms", 1)
              ]),
              _createElementVNode("div", _hoisted_55, [
                _cache[27] || (_cache[27] = _createElementVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "IP / Agent", -1)),
                _createElementVNode("p", _hoisted_56, _toDisplayString(selectedItem.value.client_ip || "-"), 1),
                _createElementVNode("p", _hoisted_57, _toDisplayString(selectedItem.value.user_agent || "-"), 1)
              ])
            ]),
            _createElementVNode("div", _hoisted_58, [
              _createElementVNode("article", _hoisted_59, [
                _cache[28] || (_cache[28] = _createElementVNode("h3", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300" }, "Request (masked)", -1)),
                _createElementVNode("pre", _hoisted_60, _toDisplayString(selectedItem.value.request_body_masked || "-"), 1)
              ]),
              _createElementVNode("article", _hoisted_61, [
                _cache[29] || (_cache[29] = _createElementVNode("h3", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300" }, "Response (masked)", -1)),
                _createElementVNode("pre", _hoisted_62, _toDisplayString(selectedItem.value.response_body_masked || "-"), 1)
              ])
            ])
          ])
        ])) : _createCommentVNode("", true)
      ]);
    };
  }
});

export { _sfc_main as default };
