import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, A as AxiosError } from './http-DqETRxcr.js';
import { c as createHolding, b as createLiability, d as getHoldingsTable, e as getLiabilitiesTable, f as deleteHolding, u as updateHolding, h as deleteLiability, i as updateLiability } from './liabilities-Ca_kTHXz.js';

async function getAssetsTable(params = {}) {
  const { data } = await http.get("/assets/table", { params });
  return data;
}
async function createAsset(payload) {
  const { data } = await http.post("/assets", payload);
  return data;
}
async function updateAsset(assetId, payload) {
  const { data } = await http.patch(`/assets/${assetId}`, payload);
  return data;
}
async function deleteAsset(assetId) {
  await http.delete(`/assets/${assetId}`);
}

async function getMe() {
  const { data } = await http.get("/auth/me");
  return data;
}

async function getPortfoliosTable(params = {}) {
  const { data } = await http.get("/portfolios/table", { params });
  return data;
}
async function createPortfolio(payload) {
  const { data } = await http.post("/portfolios", payload);
  return data;
}
async function updatePortfolio(portfolioId, payload) {
  const { data } = await http.patch(`/portfolios/${portfolioId}`, payload);
  return data;
}
async function deletePortfolio(portfolioId) {
  await http.delete(`/portfolios/${portfolioId}`);
}

async function updateQuotesNow() {
  const { data } = await http.post("/quotes/update-now");
  return data;
}
async function upsertManualQuote(payload) {
  const { data } = await http.post("/quotes/manual", payload);
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,vModelText:_vModelText,withKeys:_withKeys,withDirectives:_withDirectives,createTextVNode:_createTextVNode,renderList:_renderList,Fragment:_Fragment,withModifiers:_withModifiers,normalizeClass:_normalizeClass,vModelSelect:_vModelSelect,vModelCheckbox:_vModelCheckbox} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_5 = ["disabled"];
const _hoisted_6 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_7 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = {
  key: 0,
  class: "mt-1 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_10 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_11 = ["disabled"];
const _hoisted_12 = ["disabled"];
const _hoisted_13 = { class: "mt-3 overflow-x-auto" };
const _hoisted_14 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_15 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_16 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_17 = { class: "opacity-70" };
const _hoisted_18 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_19 = { class: "opacity-70" };
const _hoisted_20 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_21 = { class: "opacity-70" };
const _hoisted_22 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_23 = { class: "opacity-70" };
const _hoisted_24 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_25 = { class: "opacity-70" };
const _hoisted_26 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_27 = { class: "opacity-70" };
const _hoisted_28 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_29 = { class: "opacity-70" };
const _hoisted_30 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_31 = { class: "opacity-70" };
const _hoisted_32 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_33 = { class: "opacity-70" };
const _hoisted_34 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_35 = { class: "opacity-70" };
const _hoisted_36 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_37 = { class: "opacity-70" };
const _hoisted_38 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_39 = { class: "opacity-70" };
const _hoisted_40 = ["onClick"];
const _hoisted_41 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_42 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_43 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_44 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_45 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_46 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_47 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_48 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_49 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_50 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_51 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_52 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_53 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_54 = { class: "flex flex-wrap gap-1" };
const _hoisted_55 = ["disabled", "onClick"];
const _hoisted_56 = ["disabled", "onClick"];
const _hoisted_57 = { key: 0 };
const _hoisted_58 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2" };
const _hoisted_59 = { class: "flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_60 = ["disabled"];
const _hoisted_61 = ["disabled"];
const _hoisted_62 = ["disabled"];
const _hoisted_63 = {
  key: 1,
  class: "mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
};
const _hoisted_64 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_65 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_66 = ["disabled"];
const _hoisted_67 = {
  key: 0,
  class: "mt-1 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_68 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_69 = {
  key: 2,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_70 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_71 = { class: "text-xs" };
const _hoisted_72 = ["value"];
const _hoisted_73 = { class: "text-xs" };
const _hoisted_74 = { class: "text-xs" };
const _hoisted_75 = { class: "text-xs" };
const _hoisted_76 = { class: "mt-3" };
const _hoisted_77 = ["disabled"];
const _hoisted_78 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_79 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_80 = ["disabled"];
const _hoisted_81 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_82 = ["disabled"];
const _hoisted_83 = ["disabled"];
const _hoisted_84 = { class: "mt-3 overflow-x-auto" };
const _hoisted_85 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_86 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_87 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_88 = { class: "opacity-70" };
const _hoisted_89 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_90 = { class: "opacity-70" };
const _hoisted_91 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_92 = { class: "opacity-70" };
const _hoisted_93 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_94 = { class: "opacity-70" };
const _hoisted_95 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_96 = { class: "opacity-70" };
const _hoisted_97 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_98 = { class: "opacity-70" };
const _hoisted_99 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_100 = { class: "opacity-70" };
const _hoisted_101 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_102 = { class: "opacity-70" };
const _hoisted_103 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_104 = { class: "opacity-70" };
const _hoisted_105 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_106 = { class: "opacity-70" };
const _hoisted_107 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_108 = { class: "opacity-70" };
const _hoisted_109 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_110 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_111 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_112 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_113 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_114 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_115 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_116 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_117 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_118 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_119 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_120 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_121 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_122 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_123 = { class: "flex flex-wrap gap-1" };
const _hoisted_124 = ["disabled", "onClick"];
const _hoisted_125 = ["disabled", "onClick"];
const _hoisted_126 = ["disabled", "onClick"];
const _hoisted_127 = { key: 0 };
const _hoisted_128 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_129 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_130 = ["disabled"];
const _hoisted_131 = ["disabled"];
const _hoisted_132 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_133 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_134 = { class: "mt-2" };
const _hoisted_135 = ["disabled"];
const _hoisted_136 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_137 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_138 = ["disabled"];
const _hoisted_139 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_140 = ["disabled"];
const _hoisted_141 = ["disabled"];
const _hoisted_142 = { class: "mt-3 overflow-x-auto" };
const _hoisted_143 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_144 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_145 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_146 = { class: "opacity-70" };
const _hoisted_147 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_148 = { class: "opacity-70" };
const _hoisted_149 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_150 = { class: "opacity-70" };
const _hoisted_151 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_152 = { class: "opacity-70" };
const _hoisted_153 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_154 = { class: "opacity-70" };
const _hoisted_155 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_156 = { class: "opacity-70" };
const _hoisted_157 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_158 = { class: "opacity-70" };
const _hoisted_159 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_160 = { class: "opacity-70" };
const _hoisted_161 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_162 = { class: "opacity-70" };
const _hoisted_163 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_164 = { class: "opacity-70" };
const _hoisted_165 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_166 = { class: "opacity-70" };
const _hoisted_167 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_168 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_169 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_170 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_171 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_172 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_173 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_174 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_175 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_176 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_177 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_178 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_179 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_180 = { class: "flex flex-wrap gap-1" };
const _hoisted_181 = ["disabled", "onClick"];
const _hoisted_182 = ["disabled", "onClick"];
const _hoisted_183 = { key: 0 };
const _hoisted_184 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_185 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_186 = ["disabled"];
const _hoisted_187 = ["disabled"];
const _hoisted_188 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_189 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_190 = { class: "mt-2" };
const _hoisted_191 = ["disabled"];
const _hoisted_192 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_193 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_194 = ["disabled"];
const _hoisted_195 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_196 = ["disabled"];
const _hoisted_197 = ["disabled"];
const _hoisted_198 = { class: "mt-3 overflow-x-auto" };
const _hoisted_199 = { class: "w-full min-w-[1100px] text-left text-xs leading-tight" };
const _hoisted_200 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_201 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_202 = { class: "opacity-70" };
const _hoisted_203 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_204 = { class: "opacity-70" };
const _hoisted_205 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_206 = { class: "opacity-70" };
const _hoisted_207 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_208 = { class: "opacity-70" };
const _hoisted_209 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_210 = { class: "opacity-70" };
const _hoisted_211 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_212 = { class: "opacity-70" };
const _hoisted_213 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_214 = { class: "opacity-70" };
const _hoisted_215 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_216 = { class: "opacity-70" };
const _hoisted_217 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_218 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_219 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_220 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_221 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_222 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_223 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_224 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_225 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_226 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_227 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_228 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_229 = { class: "flex flex-wrap gap-1" };
const _hoisted_230 = ["disabled", "onClick"];
const _hoisted_231 = ["disabled", "onClick"];
const _hoisted_232 = ["disabled", "onClick"];
const _hoisted_233 = { key: 0 };
const _hoisted_234 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_235 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_236 = ["disabled"];
const _hoisted_237 = ["disabled"];
const _hoisted_238 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_239 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_240 = { class: "mt-2" };
const _hoisted_241 = ["disabled"];
const _hoisted_242 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_243 = { class: "mt-3 max-h-72 space-y-2 overflow-y-auto" };
const _hoisted_244 = { class: "font-semibold" };
const _hoisted_245 = { class: "mt-0.5" };
const _hoisted_246 = { class: "mt-0.5 opacity-70" };
const _hoisted_247 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_248 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_249 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_250 = { class: "text-xs" };
const _hoisted_251 = { class: "text-xs" };
const _hoisted_252 = ["value"];
const _hoisted_253 = { class: "text-xs" };
const _hoisted_254 = { class: "text-xs" };
const _hoisted_255 = { class: "text-xs" };
const _hoisted_256 = ["value"];
const _hoisted_257 = { class: "text-xs" };
const _hoisted_258 = { class: "text-xs md:col-span-2" };
const _hoisted_259 = { class: "text-xs md:col-span-2" };
const _hoisted_260 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_261 = ["disabled"];
const _hoisted_262 = ["disabled"];
const _hoisted_263 = { class: "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_264 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_265 = { class: "mt-2 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_266 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_267 = ["disabled"];
const _hoisted_268 = ["disabled"];
const {computed,onBeforeUnmount,onMounted,reactive,ref,watch} = await importShared('vue');
const AUTO_SEARCH_DEBOUNCE_MS = 450;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "AgentPage",
  setup(__props) {
    const loading = reactive({ data: false, action: false, confirm: false });
    const me = ref(null);
    const assets = ref([]);
    const portfolioRows = ref([]);
    const holdingRows = ref([]);
    const liabilityRows = ref([]);
    const logs = ref([]);
    let nextLogId = 1;
    const assetsQuery = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
      sortBy: "updated_at",
      sortOrder: "desc",
      q: ""
    });
    const portfolioQuery = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "updated_at",
      sortOrder: "desc",
      q: ""
    });
    const holdingQuery = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "updated_at",
      sortOrder: "desc",
      q: ""
    });
    const liabilityQuery = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "updated_at",
      sortOrder: "desc",
      q: ""
    });
    const confirmModal = reactive({ open: false, title: "", message: "" });
    const pendingAction = ref(null);
    const assetModal = reactive({ open: false, mode: "CREATE" });
    const quoteActionsCollapsed = ref(true);
    const quickCreatePortfolioOpen = ref(false);
    const quickCreateHoldingOpen = ref(false);
    const quickCreateLiabilityOpen = ref(false);
    const assetForm = reactive({
      id: "",
      asset_class: "",
      symbol: "",
      name: "",
      currency: "",
      quote_mode: "",
      exchange_code: "",
      is_trade_supported: true,
      meta_json_text: ""
    });
    const manualQuoteForm = reactive({
      asset_id: "",
      price: "",
      currency: "KRW",
      as_of: "",
      source: "MANUAL"
    });
    const portfolioForm = reactive({
      name: "",
      type: "ETC",
      base_currency: "KRW",
      exchange_code: "",
      category: "ETC",
      memo: ""
    });
    const holdingForm = reactive({
      portfolio_id: "",
      asset_id: "",
      quantity: "",
      avg_price: "",
      invested_amount: "",
      source_type: "MANUAL",
      memo: ""
    });
    const liabilityForm = reactive({
      portfolio_id: "",
      name: "",
      liability_type: "ETC",
      currency: "KRW",
      outstanding_balance: "",
      interest_rate: "",
      monthly_payment: "",
      source_type: "MANUAL",
      memo: ""
    });
    const canManageAssets = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
    const canManageQuotes = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
    const isBusy = computed(() => loading.data || loading.action || loading.confirm);
    const selectedAssetForQuote = computed(() => assets.value.find((item) => String(item.id) === manualQuoteForm.asset_id) ?? null);
    const assetClassOptions = ["STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC"];
    const quoteModeOptions = ["AUTO", "MANUAL"];
    const totalPages = computed(() => Math.max(1, Math.ceil(assetsQuery.total / assetsQuery.pageSize)));
    const portfolioTotalPages = computed(() => Math.max(1, Math.ceil(portfolioQuery.total / portfolioQuery.pageSize)));
    const holdingTotalPages = computed(() => Math.max(1, Math.ceil(holdingQuery.total / holdingQuery.pageSize)));
    const liabilityTotalPages = computed(() => Math.max(1, Math.ceil(liabilityQuery.total / liabilityQuery.pageSize)));
    let searchDebounceTimer = null;
    let portfolioSearchDebounceTimer = null;
    let holdingSearchDebounceTimer = null;
    let liabilitySearchDebounceTimer = null;
    let refreshSequence = 0;
    function formatDateTime(value) {
      if (!value) return "-";
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return value;
      return dt.toLocaleString("ko-KR");
    }
    function normalizeUpper(value) {
      return value.trim().toUpperCase();
    }
    function toPositiveInt(value) {
      const num = Number(value.trim());
      if (!Number.isInteger(num) || num <= 0) throw new Error("ID must be a positive integer");
      return num;
    }
    function parseMetaJson(text) {
      const trimmed = text.trim();
      if (!trimmed) return null;
      const parsed = JSON.parse(trimmed);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("meta_json must be object");
      return parsed;
    }
    function formatMoney(value, currency) {
      const amount = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(amount)) return String(value);
      try {
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: normalizeUpper(currency),
          minimumFractionDigits: 0,
          maximumFractionDigits: normalizeUpper(currency) === "KRW" ? 0 : 8
        }).format(amount);
      } catch {
        return `${amount.toLocaleString("ko-KR")} ${currency}`;
      }
    }
    function quotePriceText(item) {
      if (item.quote_price === null || item.quote_price === void 0 || !item.quote_currency) return "-";
      return formatMoney(item.quote_price, item.quote_currency);
    }
    function quoteAsOfText(item) {
      return formatDateTime(item.quote_as_of);
    }
    function quoteSourceText(item) {
      return item.quote_source || "-";
    }
    function getErrorMessage(error) {
      if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail)) return detail.map((item) => String(item?.msg ?? item)).join(", ");
        return error.message;
      }
      if (error instanceof Error) return error.message;
      return "Unknown error";
    }
    function pushLog(action, status, message) {
      logs.value.unshift({ id: nextLogId++, at: (/* @__PURE__ */ new Date()).toISOString(), action, status, message });
      if (logs.value.length > 100) logs.value = logs.value.slice(0, 100);
    }
    function resetAssetFormForCreate() {
      assetForm.id = "";
      assetForm.asset_class = "";
      assetForm.symbol = "";
      assetForm.name = "";
      assetForm.currency = "";
      assetForm.quote_mode = "";
      assetForm.exchange_code = "";
      assetForm.is_trade_supported = true;
      assetForm.meta_json_text = "";
    }
    function fillAssetForm(item) {
      assetForm.id = String(item.id);
      assetForm.asset_class = item.asset_class;
      assetForm.symbol = item.symbol ?? "";
      assetForm.name = item.name;
      assetForm.currency = item.currency;
      assetForm.quote_mode = item.quote_mode;
      assetForm.exchange_code = item.exchange_code;
      assetForm.is_trade_supported = item.is_trade_supported;
      assetForm.meta_json_text = item.meta_json ? JSON.stringify(item.meta_json, null, 2) : "";
    }
    function openCreateAssetModal() {
      if (!canManageAssets.value) {
        pushLog("Asset Create", "ERROR", "Admin/Maintainer only");
        return;
      }
      resetAssetFormForCreate();
      assetModal.mode = "CREATE";
      assetModal.open = true;
    }
    function openEditAssetModal(item) {
      if (!canManageAssets.value) {
        pushLog("Asset Edit", "ERROR", "Admin/Maintainer only");
        return;
      }
      fillAssetForm(item);
      assetModal.mode = "EDIT";
      assetModal.open = true;
    }
    function selectAssetForQuote(item) {
      manualQuoteForm.asset_id = String(item.id);
    }
    function closeAssetModal() {
      if (loading.action || loading.confirm) return;
      assetModal.open = false;
    }
    function askConfirm(title, message, action) {
      confirmModal.open = true;
      confirmModal.title = title;
      confirmModal.message = message;
      pendingAction.value = action;
    }
    function closeConfirm() {
      if (loading.confirm) return;
      confirmModal.open = false;
      pendingAction.value = null;
    }
    async function executeConfirm() {
      if (!pendingAction.value) return;
      loading.confirm = true;
      try {
        await pendingAction.value();
      } finally {
        loading.confirm = false;
        closeConfirm();
      }
    }
    function runAction(action, title, message, task) {
      askConfirm(title, message, async () => {
        loading.action = true;
        try {
          await task();
          pushLog(action, "SUCCESS", "Completed");
          await refreshData();
        } catch (error) {
          pushLog(action, "ERROR", getErrorMessage(error));
        } finally {
          loading.action = false;
        }
      });
    }
    function buildAssetPayload() {
      const name = assetForm.name.trim();
      if (!name) throw new Error("Name is required");
      const assetClass = assetForm.asset_class.trim();
      if (!assetClass) throw new Error("Class is required");
      const currency = normalizeUpper(assetForm.currency);
      if (!currency) throw new Error("Currency is required");
      if (currency.length !== 3) throw new Error("Currency must be 3 letters");
      const quoteMode = assetForm.quote_mode.trim();
      if (!quoteMode) throw new Error("Quote mode is required");
      const exchangeCode = normalizeUpper(assetForm.exchange_code);
      if (!exchangeCode) throw new Error("Exchange code is required");
      return {
        asset_class: assetClass,
        symbol: normalizeUpper(assetForm.symbol) || null,
        name,
        currency,
        quote_mode: quoteMode,
        exchange_code: exchangeCode,
        is_trade_supported: assetForm.is_trade_supported,
        meta_json: parseMetaJson(assetForm.meta_json_text)
      };
    }
    function submitAssetForm() {
      if (!canManageAssets.value) {
        pushLog("Asset Form", "ERROR", "Admin/Maintainer only");
        return;
      }
      try {
        const payload = buildAssetPayload();
        if (assetModal.mode === "CREATE") {
          closeAssetModal();
          runAction("Asset Create", "Create Asset", "새 자산을 생성할까요?", async () => {
            await createAsset(payload);
          });
          return;
        }
        const assetId = toPositiveInt(assetForm.id);
        closeAssetModal();
        runAction("Asset Update", "Apply Asset Update", `Asset #${assetId} 정보를 수정할까요?`, async () => {
          await updateAsset(assetId, payload);
        });
      } catch (error) {
        pushLog("Asset Form", "ERROR", getErrorMessage(error));
      }
    }
    function askDeleteAsset(item) {
      if (!canManageAssets.value) {
        pushLog("Asset Delete", "ERROR", "Admin/Maintainer only");
        return;
      }
      runAction("Asset Delete", "Delete Asset", `Asset #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
        await deleteAsset(item.id);
      });
    }
    function askUpdateQuotesNow() {
      if (!canManageQuotes.value) {
        pushLog("Quote Update", "ERROR", "Admin/Maintainer only");
        return;
      }
      runAction("Quote Update", "Update Quotes", "AUTO 모드의 모든 자산 시세를 즉시 갱신합니다.", async () => {
        const result = await updateQuotesNow();
        pushLog("Quote Update", "INFO", `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`);
      });
    }
    function askApplyManualQuote() {
      if (!canManageQuotes.value) {
        pushLog("Manual Quote", "ERROR", "Admin/Maintainer only");
        return;
      }
      runAction("Manual Quote", "Manual Quote", "수동 시세를 반영할까요?", async () => {
        const payload = {
          asset_id: toPositiveInt(manualQuoteForm.asset_id),
          price: manualQuoteForm.price.trim(),
          currency: normalizeUpper(manualQuoteForm.currency),
          as_of: manualQuoteForm.as_of.trim() || null,
          source: manualQuoteForm.source.trim() || null
        };
        await upsertManualQuote(payload);
      });
    }
    function parseRequiredDecimal(value, field) {
      const trimmed = value.trim();
      if (!trimmed) throw new Error(`${field} is required`);
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed)) throw new Error(`${field} must be a number`);
      return trimmed;
    }
    function parseOptionalDecimal(value) {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed)) throw new Error("Invalid number");
      return trimmed;
    }
    function parseOptionalInt(value) {
      const trimmed = value.trim();
      if (!trimmed) return null;
      return toPositiveInt(trimmed);
    }
    function submitPortfolioCreate() {
      if (!canManageAssets.value) {
        pushLog("Portfolio Create", "ERROR", "Admin/Maintainer only");
        return;
      }
      try {
        const name = portfolioForm.name.trim();
        if (!name) throw new Error("Portfolio name is required");
        const baseCurrency = normalizeUpper(portfolioForm.base_currency);
        if (baseCurrency.length !== 3) throw new Error("Base currency must be 3 letters");
        runAction("Portfolio Create", "Create Portfolio", "새 포트폴리오를 생성할까요?", async () => {
          await createPortfolio({
            name,
            type: portfolioForm.type.trim() || "ETC",
            base_currency: baseCurrency,
            exchange_code: normalizeUpper(portfolioForm.exchange_code) || null,
            category: portfolioForm.category.trim() || null,
            memo: portfolioForm.memo.trim() || null
          });
          portfolioForm.name = "";
          portfolioForm.memo = "";
          portfolioForm.exchange_code = "";
          quickCreatePortfolioOpen.value = false;
        });
      } catch (error) {
        pushLog("Portfolio Create", "ERROR", getErrorMessage(error));
      }
    }
    function askDeletePortfolio(item) {
      runAction("Portfolio Delete", "Delete Portfolio", `Portfolio #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
        await deletePortfolio(item.id);
      });
    }
    function togglePortfolioIncluded(item) {
      runAction(
        "Portfolio Included",
        "Toggle Included",
        `Portfolio #${item.id} 집계 포함 값을 ${item.is_included ? "OFF" : "ON"}로 변경할까요?`,
        async () => {
          await updatePortfolio(item.id, { is_included: !item.is_included });
        }
      );
    }
    function togglePortfolioHidden(item) {
      runAction(
        "Portfolio Hidden",
        "Toggle Hidden",
        `Portfolio #${item.id} 숨김 값을 ${item.is_hidden ? "OFF" : "ON"}로 변경할까요?`,
        async () => {
          await updatePortfolio(item.id, { is_hidden: !item.is_hidden });
        }
      );
    }
    function submitHoldingCreate() {
      try {
        const assetId = toPositiveInt(holdingForm.asset_id.trim());
        const quantity = parseRequiredDecimal(holdingForm.quantity, "Quantity");
        const avgPrice = parseRequiredDecimal(holdingForm.avg_price, "Avg price");
        runAction("Holding Create", "Create Holding", "새 보유자산을 생성할까요?", async () => {
          await createHolding({
            portfolio_id: parseOptionalInt(holdingForm.portfolio_id),
            asset_id: assetId,
            quantity,
            avg_price: avgPrice,
            invested_amount: parseOptionalDecimal(holdingForm.invested_amount),
            source_type: holdingForm.source_type.trim() || "MANUAL",
            memo: holdingForm.memo.trim() || null
          });
          holdingForm.asset_id = "";
          holdingForm.quantity = "";
          holdingForm.avg_price = "";
          holdingForm.invested_amount = "";
          holdingForm.memo = "";
          quickCreateHoldingOpen.value = false;
        });
      } catch (error) {
        pushLog("Holding Create", "ERROR", getErrorMessage(error));
      }
    }
    function askDeleteHolding(item) {
      runAction("Holding Delete", "Delete Holding", `Holding #${item.id} (${item.asset_name}) 를 삭제할까요?`, async () => {
        await deleteHolding(item.id);
      });
    }
    function toggleHoldingHidden(item) {
      runAction(
        "Holding Hidden",
        "Toggle Hidden",
        `Holding #${item.id} 숨김 값을 ${item.is_hidden ? "OFF" : "ON"}로 변경할까요?`,
        async () => {
          await updateHolding(item.id, { is_hidden: !item.is_hidden });
        }
      );
    }
    function submitLiabilityCreate() {
      try {
        const name = liabilityForm.name.trim();
        if (!name) throw new Error("Liability name is required");
        const balance = parseRequiredDecimal(liabilityForm.outstanding_balance, "Outstanding balance");
        const currency = normalizeUpper(liabilityForm.currency);
        if (currency.length !== 3) throw new Error("Currency must be 3 letters");
        runAction("Liability Create", "Create Liability", "새 부채를 생성할까요?", async () => {
          await createLiability({
            portfolio_id: parseOptionalInt(liabilityForm.portfolio_id),
            name,
            liability_type: liabilityForm.liability_type.trim() || "ETC",
            currency,
            outstanding_balance: balance,
            interest_rate: parseOptionalDecimal(liabilityForm.interest_rate),
            monthly_payment: parseOptionalDecimal(liabilityForm.monthly_payment),
            source_type: liabilityForm.source_type.trim() || "MANUAL",
            memo: liabilityForm.memo.trim() || null
          });
          liabilityForm.name = "";
          liabilityForm.outstanding_balance = "";
          liabilityForm.interest_rate = "";
          liabilityForm.monthly_payment = "";
          liabilityForm.memo = "";
          quickCreateLiabilityOpen.value = false;
        });
      } catch (error) {
        pushLog("Liability Create", "ERROR", getErrorMessage(error));
      }
    }
    function askDeleteLiability(item) {
      runAction("Liability Delete", "Delete Liability", `Liability #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
        await deleteLiability(item.id);
      });
    }
    function toggleLiabilityIncluded(item) {
      runAction(
        "Liability Included",
        "Toggle Included",
        `Liability #${item.id} 순자산 포함 값을 ${item.is_included ? "OFF" : "ON"}로 변경할까요?`,
        async () => {
          await updateLiability(item.id, { is_included: !item.is_included });
        }
      );
    }
    function toggleLiabilityHidden(item) {
      runAction(
        "Liability Hidden",
        "Toggle Hidden",
        `Liability #${item.id} 숨김 값을 ${item.is_hidden ? "OFF" : "ON"}로 변경할까요?`,
        async () => {
          await updateLiability(item.id, { is_hidden: !item.is_hidden });
        }
      );
    }
    async function refreshData(options) {
      const refreshId = ++refreshSequence;
      const shouldLogRefresh = options?.logRefresh ?? true;
      loading.data = true;
      try {
        const [meOut, assetsOut, portfoliosOut, holdingsOut, liabilitiesOut] = await Promise.all([
          getMe(),
          getAssetsTable({
            page: assetsQuery.page,
            page_size: assetsQuery.pageSize,
            sort_by: assetsQuery.sortBy,
            sort_order: assetsQuery.sortOrder,
            q: assetsQuery.q.trim() || void 0
          }),
          getPortfoliosTable({
            page: portfolioQuery.page,
            page_size: portfolioQuery.pageSize,
            sort_by: portfolioQuery.sortBy,
            sort_order: portfolioQuery.sortOrder,
            q: portfolioQuery.q.trim() || void 0
          }),
          getHoldingsTable({
            page: holdingQuery.page,
            page_size: holdingQuery.pageSize,
            sort_by: holdingQuery.sortBy,
            sort_order: holdingQuery.sortOrder,
            q: holdingQuery.q.trim() || void 0
          }),
          getLiabilitiesTable({
            page: liabilityQuery.page,
            page_size: liabilityQuery.pageSize,
            sort_by: liabilityQuery.sortBy,
            sort_order: liabilityQuery.sortOrder,
            q: liabilityQuery.q.trim() || void 0
          })
        ]);
        if (refreshId !== refreshSequence) return;
        me.value = meOut;
        assets.value = assetsOut.items;
        portfolioRows.value = portfoliosOut.items;
        holdingRows.value = holdingsOut.items;
        liabilityRows.value = liabilitiesOut.items;
        assetsQuery.total = assetsOut.total;
        portfolioQuery.total = portfoliosOut.total;
        holdingQuery.total = holdingsOut.total;
        liabilityQuery.total = liabilitiesOut.total;
        const selectedStillExists = assetsOut.items.some((item) => String(item.id) === manualQuoteForm.asset_id);
        if (!selectedStillExists) {
          manualQuoteForm.asset_id = assetsOut.items[0] ? String(assetsOut.items[0].id) : "";
        }
        if (shouldLogRefresh) {
          pushLog(
            "Refresh",
            "INFO",
            `Agent data loaded (assets=${assetsOut.total}, portfolios=${portfoliosOut.total}, holdings=${holdingsOut.total}, liabilities=${liabilitiesOut.total})`
          );
        }
      } catch (error) {
        pushLog("Refresh", "ERROR", getErrorMessage(error));
      } finally {
        loading.data = false;
      }
    }
    function sortIndicatorFor(query, key) {
      if (query.sortBy !== key) return "↕";
      return query.sortOrder === "asc" ? "↑" : "↓";
    }
    async function toggleSortFor(query, key) {
      if (query.sortBy === key) {
        query.sortOrder = query.sortOrder === "asc" ? "desc" : "asc";
      } else {
        query.sortBy = key;
        query.sortOrder = "asc";
      }
      query.page = 1;
      await refreshData();
    }
    async function movePageFor(query, totalPagesCount, delta) {
      const next = query.page + delta;
      if (next < 1 || next > totalPagesCount) return;
      query.page = next;
      await refreshData();
    }
    const sortIndicator = (key) => sortIndicatorFor(assetsQuery, key);
    const portfolioSortIndicator = (key) => sortIndicatorFor(portfolioQuery, key);
    const holdingSortIndicator = (key) => sortIndicatorFor(holdingQuery, key);
    const liabilitySortIndicator = (key) => sortIndicatorFor(liabilityQuery, key);
    const toggleSort = async (key) => toggleSortFor(assetsQuery, key);
    const togglePortfolioSort = async (key) => toggleSortFor(portfolioQuery, key);
    const toggleHoldingSort = async (key) => toggleSortFor(holdingQuery, key);
    const toggleLiabilitySort = async (key) => toggleSortFor(liabilityQuery, key);
    const movePage = async (delta) => movePageFor(assetsQuery, totalPages.value, delta);
    const movePortfolioPage = async (delta) => movePageFor(portfolioQuery, portfolioTotalPages.value, delta);
    const moveHoldingPage = async (delta) => movePageFor(holdingQuery, holdingTotalPages.value, delta);
    const moveLiabilityPage = async (delta) => movePageFor(liabilityQuery, liabilityTotalPages.value, delta);
    async function applySearch() {
      clearSearchDebounce();
      assetsQuery.page = 1;
      await refreshData();
    }
    async function clearSearch() {
      clearSearchDebounce();
      if (!assetsQuery.q) return;
      assetsQuery.q = "";
      assetsQuery.page = 1;
      await refreshData();
    }
    function clearSearchDebounce() {
      if (!searchDebounceTimer) return;
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = null;
    }
    async function applyPortfolioSearch() {
      clearPortfolioSearchDebounce();
      portfolioQuery.page = 1;
      await refreshData();
    }
    async function clearPortfolioSearch() {
      clearPortfolioSearchDebounce();
      if (!portfolioQuery.q) return;
      portfolioQuery.q = "";
      portfolioQuery.page = 1;
      await refreshData();
    }
    function clearPortfolioSearchDebounce() {
      if (!portfolioSearchDebounceTimer) return;
      clearTimeout(portfolioSearchDebounceTimer);
      portfolioSearchDebounceTimer = null;
    }
    async function applyHoldingSearch() {
      clearHoldingSearchDebounce();
      holdingQuery.page = 1;
      await refreshData();
    }
    async function clearHoldingSearch() {
      clearHoldingSearchDebounce();
      if (!holdingQuery.q) return;
      holdingQuery.q = "";
      holdingQuery.page = 1;
      await refreshData();
    }
    function clearHoldingSearchDebounce() {
      if (!holdingSearchDebounceTimer) return;
      clearTimeout(holdingSearchDebounceTimer);
      holdingSearchDebounceTimer = null;
    }
    async function applyLiabilitySearch() {
      clearLiabilitySearchDebounce();
      liabilityQuery.page = 1;
      await refreshData();
    }
    async function clearLiabilitySearch() {
      clearLiabilitySearchDebounce();
      if (!liabilityQuery.q) return;
      liabilityQuery.q = "";
      liabilityQuery.page = 1;
      await refreshData();
    }
    function clearLiabilitySearchDebounce() {
      if (!liabilitySearchDebounceTimer) return;
      clearTimeout(liabilitySearchDebounceTimer);
      liabilitySearchDebounceTimer = null;
    }
    watch(
      () => assetsQuery.q,
      () => {
        clearSearchDebounce();
        searchDebounceTimer = setTimeout(async () => {
          assetsQuery.page = 1;
          await refreshData({ logRefresh: false });
        }, AUTO_SEARCH_DEBOUNCE_MS);
      }
    );
    watch(
      () => portfolioQuery.q,
      () => {
        clearPortfolioSearchDebounce();
        portfolioSearchDebounceTimer = setTimeout(async () => {
          portfolioQuery.page = 1;
          await refreshData({ logRefresh: false });
        }, AUTO_SEARCH_DEBOUNCE_MS);
      }
    );
    watch(
      () => holdingQuery.q,
      () => {
        clearHoldingSearchDebounce();
        holdingSearchDebounceTimer = setTimeout(async () => {
          holdingQuery.page = 1;
          await refreshData({ logRefresh: false });
        }, AUTO_SEARCH_DEBOUNCE_MS);
      }
    );
    watch(
      () => liabilityQuery.q,
      () => {
        clearLiabilitySearchDebounce();
        liabilitySearchDebounceTimer = setTimeout(async () => {
          liabilityQuery.page = 1;
          await refreshData({ logRefresh: false });
        }, AUTO_SEARCH_DEBOUNCE_MS);
      }
    );
    onMounted(refreshData);
    onBeforeUnmount(() => {
      clearSearchDebounce();
      clearPortfolioSearchDebounce();
      clearHoldingSearchDebounce();
      clearLiabilitySearchDebounce();
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock(_Fragment, null, [
        _createElementVNode("section", _hoisted_1, [
          _createElementVNode("header", _hoisted_2, [
            _createElementVNode("div", _hoisted_3, [
              _createElementVNode("div", null, [
                _cache[101] || (_cache[101] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300" }, "Agent", -1)),
                _cache[102] || (_cache[102] = _createElementVNode("h1", { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Asset Control Console", -1)),
                _createElementVNode("p", _hoisted_4, "Role: " + _toDisplayString(me.value?.role || "-") + " / " + _toDisplayString(me.value?.email || "-"), 1)
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: _cache[0] || (_cache[0] = ($event) => refreshData())
              }, _toDisplayString(loading.data ? "Loading..." : "Refresh Data"), 9, _hoisted_5)
            ])
          ]),
          _createElementVNode("article", _hoisted_6, [
            _createElementVNode("div", _hoisted_7, [
              _cache[103] || (_cache[103] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Current Assets Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "현재 등록된 자산 목록과 상태입니다. 행 클릭 시 Quote Actions와 동기화됩니다.")
              ], -1)),
              canManageQuotes.value ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500",
                disabled: isBusy.value,
                onClick: askUpdateQuotesNow
              }, " Update Quotes Now ", 8, _hoisted_8)) : _createCommentVNode("", true)
            ]),
            canManageQuotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_9, "AUTO mode인 모든 Asset 시세를 즉시 갱신합니다.")) : _createCommentVNode("", true),
            _createElementVNode("div", _hoisted_10, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => assetsQuery.q = $event),
                type: "text",
                placeholder: "Search name/symbol/exchange",
                class: "w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                onKeyup: _withKeys(applySearch, ["enter"])
              }, null, 544), [
                [_vModelText, assetsQuery.q]
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: applySearch
              }, " Search ", 8, _hoisted_11),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: clearSearch
              }, " Clear ", 8, _hoisted_12)
            ]),
            _createElementVNode("div", _hoisted_13, [
              _createElementVNode("table", _hoisted_14, [
                _createElementVNode("thead", _hoisted_15, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", _hoisted_16, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[2] || (_cache[2] = ($event) => toggleSort("id"))
                      }, [
                        _cache[104] || (_cache[104] = _createTextVNode("ID ", -1)),
                        _createElementVNode("span", _hoisted_17, _toDisplayString(sortIndicator("id")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_18, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[3] || (_cache[3] = ($event) => toggleSort("name"))
                      }, [
                        _cache[105] || (_cache[105] = _createTextVNode("Name ", -1)),
                        _createElementVNode("span", _hoisted_19, _toDisplayString(sortIndicator("name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_20, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[4] || (_cache[4] = ($event) => toggleSort("symbol"))
                      }, [
                        _cache[106] || (_cache[106] = _createTextVNode("Symbol ", -1)),
                        _createElementVNode("span", _hoisted_21, _toDisplayString(sortIndicator("symbol")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_22, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[5] || (_cache[5] = ($event) => toggleSort("price"))
                      }, [
                        _cache[107] || (_cache[107] = _createTextVNode("Price ", -1)),
                        _createElementVNode("span", _hoisted_23, _toDisplayString(sortIndicator("price")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_24, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[6] || (_cache[6] = ($event) => toggleSort("currency"))
                      }, [
                        _cache[108] || (_cache[108] = _createTextVNode("Currency ", -1)),
                        _createElementVNode("span", _hoisted_25, _toDisplayString(sortIndicator("currency")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_26, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[7] || (_cache[7] = ($event) => toggleSort("asset_class"))
                      }, [
                        _cache[109] || (_cache[109] = _createTextVNode("Class ", -1)),
                        _createElementVNode("span", _hoisted_27, _toDisplayString(sortIndicator("asset_class")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_28, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[8] || (_cache[8] = ($event) => toggleSort("updated_at"))
                      }, [
                        _cache[110] || (_cache[110] = _createTextVNode("Updated ", -1)),
                        _createElementVNode("span", _hoisted_29, _toDisplayString(sortIndicator("updated_at")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_30, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[9] || (_cache[9] = ($event) => toggleSort("quote_mode"))
                      }, [
                        _cache[111] || (_cache[111] = _createTextVNode("Quote ", -1)),
                        _createElementVNode("span", _hoisted_31, _toDisplayString(sortIndicator("quote_mode")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_32, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[10] || (_cache[10] = ($event) => toggleSort("quote_as_of"))
                      }, [
                        _cache[112] || (_cache[112] = _createTextVNode("Quote As Of ", -1)),
                        _createElementVNode("span", _hoisted_33, _toDisplayString(sortIndicator("quote_as_of")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_34, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[11] || (_cache[11] = ($event) => toggleSort("exchange_code"))
                      }, [
                        _cache[113] || (_cache[113] = _createTextVNode("Exchange ", -1)),
                        _createElementVNode("span", _hoisted_35, _toDisplayString(sortIndicator("exchange_code")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_36, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[12] || (_cache[12] = ($event) => toggleSort("source"))
                      }, [
                        _cache[114] || (_cache[114] = _createTextVNode("Source ", -1)),
                        _createElementVNode("span", _hoisted_37, _toDisplayString(sortIndicator("source")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_38, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[13] || (_cache[13] = ($event) => toggleSort("trade"))
                      }, [
                        _cache[115] || (_cache[115] = _createTextVNode("Trade ", -1)),
                        _createElementVNode("span", _hoisted_39, _toDisplayString(sortIndicator("trade")), 1)
                      ])
                    ]),
                    _cache[116] || (_cache[116] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                  ])
                ]),
                _createElementVNode("tbody", null, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (item) => {
                    return _openBlock(), _createElementBlock("tr", {
                      key: item.id,
                      class: _normalizeClass(["cursor-pointer border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40", String(item.id) === manualQuoteForm.asset_id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""]),
                      onClick: ($event) => selectAssetForQuote(item)
                    }, [
                      _createElementVNode("td", _hoisted_41, _toDisplayString(item.id), 1),
                      _createElementVNode("td", _hoisted_42, _toDisplayString(item.name), 1),
                      _createElementVNode("td", _hoisted_43, _toDisplayString(item.symbol || "-"), 1),
                      _createElementVNode("td", _hoisted_44, _toDisplayString(quotePriceText(item)), 1),
                      _createElementVNode("td", _hoisted_45, _toDisplayString(item.currency), 1),
                      _createElementVNode("td", _hoisted_46, _toDisplayString(item.asset_class), 1),
                      _createElementVNode("td", _hoisted_47, _toDisplayString(formatDateTime(item.updated_at)), 1),
                      _createElementVNode("td", _hoisted_48, _toDisplayString(item.quote_mode), 1),
                      _createElementVNode("td", _hoisted_49, _toDisplayString(quoteAsOfText(item)), 1),
                      _createElementVNode("td", _hoisted_50, _toDisplayString(item.exchange_code), 1),
                      _createElementVNode("td", _hoisted_51, _toDisplayString(quoteSourceText(item)), 1),
                      _createElementVNode("td", _hoisted_52, _toDisplayString(item.is_trade_supported ? "Y" : "N"), 1),
                      _createElementVNode("td", _hoisted_53, [
                        _createElementVNode("div", _hoisted_54, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                            disabled: !canManageAssets.value || isBusy.value,
                            onClick: _withModifiers(($event) => openEditAssetModal(item), ["stop"])
                          }, " Edit ", 8, _hoisted_55),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                            disabled: !canManageAssets.value || isBusy.value,
                            onClick: _withModifiers(($event) => askDeleteAsset(item), ["stop"])
                          }, " Delete ", 8, _hoisted_56)
                        ])
                      ])
                    ], 10, _hoisted_40);
                  }), 128)),
                  assets.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_57, [..._cache[117] || (_cache[117] = [
                    _createElementVNode("td", {
                      colspan: "13",
                      class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                    }, "No assets found", -1)
                  ])])) : _createCommentVNode("", true)
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_58, [
              _createElementVNode("div", _hoisted_59, [
                _createElementVNode("span", null, "Total: " + _toDisplayString(assetsQuery.total), 1),
                _cache[120] || (_cache[120] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("span", null, "Page " + _toDisplayString(assetsQuery.page) + " / " + _toDisplayString(totalPages.value), 1),
                _cache[121] || (_cache[121] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("label", null, [
                  _cache[119] || (_cache[119] = _createTextVNode(" Size ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => assetsQuery.pageSize = $event),
                    class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                    onChange: _cache[15] || (_cache[15] = ($event) => {
                      assetsQuery.page = 1;
                      refreshData();
                    })
                  }, [..._cache[118] || (_cache[118] = [
                    _createElementVNode("option", { value: 10 }, "10", -1),
                    _createElementVNode("option", { value: 20 }, "20", -1),
                    _createElementVNode("option", { value: 50 }, "50", -1),
                    _createElementVNode("option", { value: 100 }, "100", -1)
                  ])], 544), [
                    [
                      _vModelSelect,
                      assetsQuery.pageSize,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || assetsQuery.page <= 1,
                  onClick: _cache[16] || (_cache[16] = ($event) => movePage(-1))
                }, " Prev ", 8, _hoisted_60),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || assetsQuery.page >= totalPages.value,
                  onClick: _cache[17] || (_cache[17] = ($event) => movePage(1))
                }, " Next ", 8, _hoisted_61)
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                disabled: !canManageAssets.value || isBusy.value,
                onClick: openCreateAssetModal
              }, " Create Asset ", 8, _hoisted_62)
            ]),
            _cache[122] || (_cache[122] = _createElementVNode("p", { class: "mt-2 text-xs text-slate-500 dark:text-slate-400" }, "Create/Edit/Delete는 Admin/Maintainer 전용입니다.", -1)),
            !canManageAssets.value ? (_openBlock(), _createElementBlock("p", _hoisted_63, " USER/SUPERUSER는 Asset 생성/수정/삭제 권한이 없습니다. Admin/Maintainer에게 요청하세요. ")) : _createCommentVNode("", true)
          ]),
          _createElementVNode("article", _hoisted_64, [
            _createElementVNode("div", _hoisted_65, [
              _cache[123] || (_cache[123] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Quote Actions (Admin/Maintainer)", -1)),
              canManageQuotes.value ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                type: "button",
                class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: _cache[18] || (_cache[18] = ($event) => quoteActionsCollapsed.value = !quoteActionsCollapsed.value)
              }, _toDisplayString(quoteActionsCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_66)) : _createCommentVNode("", true)
            ]),
            selectedAssetForQuote.value ? (_openBlock(), _createElementBlock("p", _hoisted_67, " Selected: " + _toDisplayString(selectedAssetForQuote.value.name) + " (" + _toDisplayString(selectedAssetForQuote.value.exchange_code) + ") ", 1)) : _createCommentVNode("", true),
            !canManageQuotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_68, "권한이 없어 조회만 가능합니다.")) : quoteActionsCollapsed.value ? (_openBlock(), _createElementBlock("p", _hoisted_69, "폼이 접혀 있습니다. Expand 버튼으로 열어주세요.")) : (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
              _createElementVNode("div", _hoisted_70, [
                _createElementVNode("label", _hoisted_71, [
                  _cache[125] || (_cache[125] = _createTextVNode("Asset ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => manualQuoteForm.asset_id = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[124] || (_cache[124] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (item) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: item.id,
                        value: String(item.id)
                      }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ")", 9, _hoisted_72);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, manualQuoteForm.asset_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_73, [
                  _cache[126] || (_cache[126] = _createTextVNode("Price ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => manualQuoteForm.price = $event),
                    placeholder: "예: 810000000",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.price]
                  ])
                ]),
                _createElementVNode("label", _hoisted_74, [
                  _cache[127] || (_cache[127] = _createTextVNode("Currency ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => manualQuoteForm.currency = $event),
                    maxlength: "3",
                    placeholder: "KRW",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.currency]
                  ])
                ]),
                _createElementVNode("label", _hoisted_75, [
                  _cache[128] || (_cache[128] = _createTextVNode("As Of ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => manualQuoteForm.as_of = $event),
                    type: "datetime-local",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.as_of]
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_76, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500",
                  disabled: isBusy.value,
                  onClick: askApplyManualQuote
                }, " Apply Manual Quote ", 8, _hoisted_77)
              ])
            ], 64))
          ]),
          _createElementVNode("article", _hoisted_78, [
            _createElementVNode("div", _hoisted_79, [
              _cache[129] || (_cache[129] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Portfolios Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                disabled: !canManageAssets.value || isBusy.value,
                onClick: _cache[23] || (_cache[23] = ($event) => quickCreatePortfolioOpen.value = !quickCreatePortfolioOpen.value)
              }, _toDisplayString(quickCreatePortfolioOpen.value ? "Close Create" : "Quick Create Portfolio"), 9, _hoisted_80)
            ]),
            _createElementVNode("div", _hoisted_81, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => portfolioQuery.q = $event),
                type: "text",
                placeholder: "Search portfolio name/type/exchange",
                class: "w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                onKeyup: _withKeys(applyPortfolioSearch, ["enter"])
              }, null, 544), [
                [_vModelText, portfolioQuery.q]
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: applyPortfolioSearch
              }, "Search", 8, _hoisted_82),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: clearPortfolioSearch
              }, "Clear", 8, _hoisted_83)
            ]),
            _createElementVNode("div", _hoisted_84, [
              _createElementVNode("table", _hoisted_85, [
                _createElementVNode("thead", _hoisted_86, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", _hoisted_87, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[25] || (_cache[25] = ($event) => togglePortfolioSort("id"))
                      }, [
                        _cache[130] || (_cache[130] = _createTextVNode("ID ", -1)),
                        _createElementVNode("span", _hoisted_88, _toDisplayString(portfolioSortIndicator("id")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_89, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[26] || (_cache[26] = ($event) => togglePortfolioSort("name"))
                      }, [
                        _cache[131] || (_cache[131] = _createTextVNode("Name ", -1)),
                        _createElementVNode("span", _hoisted_90, _toDisplayString(portfolioSortIndicator("name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_91, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[27] || (_cache[27] = ($event) => togglePortfolioSort("type"))
                      }, [
                        _cache[132] || (_cache[132] = _createTextVNode("Type ", -1)),
                        _createElementVNode("span", _hoisted_92, _toDisplayString(portfolioSortIndicator("type")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_93, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[28] || (_cache[28] = ($event) => togglePortfolioSort("category"))
                      }, [
                        _cache[133] || (_cache[133] = _createTextVNode("Category ", -1)),
                        _createElementVNode("span", _hoisted_94, _toDisplayString(portfolioSortIndicator("category")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_95, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[29] || (_cache[29] = ($event) => togglePortfolioSort("exchange_code"))
                      }, [
                        _cache[134] || (_cache[134] = _createTextVNode("Exchange ", -1)),
                        _createElementVNode("span", _hoisted_96, _toDisplayString(portfolioSortIndicator("exchange_code")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_97, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[30] || (_cache[30] = ($event) => togglePortfolioSort("base_currency"))
                      }, [
                        _cache[135] || (_cache[135] = _createTextVNode("Currency ", -1)),
                        _createElementVNode("span", _hoisted_98, _toDisplayString(portfolioSortIndicator("base_currency")), 1)
                      ])
                    ]),
                    _cache[141] || (_cache[141] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Included", -1)),
                    _cache[142] || (_cache[142] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                    _createElementVNode("th", _hoisted_99, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[31] || (_cache[31] = ($event) => togglePortfolioSort("cumulative_deposit_amount"))
                      }, [
                        _cache[136] || (_cache[136] = _createTextVNode("Deposit ", -1)),
                        _createElementVNode("span", _hoisted_100, _toDisplayString(portfolioSortIndicator("cumulative_deposit_amount")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_101, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[32] || (_cache[32] = ($event) => togglePortfolioSort("cumulative_withdrawal_amount"))
                      }, [
                        _cache[137] || (_cache[137] = _createTextVNode("Withdrawal ", -1)),
                        _createElementVNode("span", _hoisted_102, _toDisplayString(portfolioSortIndicator("cumulative_withdrawal_amount")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_103, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[33] || (_cache[33] = ($event) => togglePortfolioSort("holding_count"))
                      }, [
                        _cache[138] || (_cache[138] = _createTextVNode("Holdings ", -1)),
                        _createElementVNode("span", _hoisted_104, _toDisplayString(portfolioSortIndicator("holding_count")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_105, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[34] || (_cache[34] = ($event) => togglePortfolioSort("liability_count"))
                      }, [
                        _cache[139] || (_cache[139] = _createTextVNode("Liabilities ", -1)),
                        _createElementVNode("span", _hoisted_106, _toDisplayString(portfolioSortIndicator("liability_count")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_107, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[35] || (_cache[35] = ($event) => togglePortfolioSort("updated_at"))
                      }, [
                        _cache[140] || (_cache[140] = _createTextVNode("Updated ", -1)),
                        _createElementVNode("span", _hoisted_108, _toDisplayString(portfolioSortIndicator("updated_at")), 1)
                      ])
                    ]),
                    _cache[143] || (_cache[143] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                  ])
                ]),
                _createElementVNode("tbody", null, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolioRows.value, (item) => {
                    return _openBlock(), _createElementBlock("tr", {
                      key: item.id,
                      class: "border-t border-slate-200 dark:border-slate-700"
                    }, [
                      _createElementVNode("td", _hoisted_109, _toDisplayString(item.id), 1),
                      _createElementVNode("td", _hoisted_110, _toDisplayString(item.name), 1),
                      _createElementVNode("td", _hoisted_111, _toDisplayString(item.type), 1),
                      _createElementVNode("td", _hoisted_112, _toDisplayString(item.category || "-"), 1),
                      _createElementVNode("td", _hoisted_113, _toDisplayString(item.exchange_code || "-"), 1),
                      _createElementVNode("td", _hoisted_114, _toDisplayString(item.base_currency), 1),
                      _createElementVNode("td", _hoisted_115, _toDisplayString(item.is_included ? "Y" : "N"), 1),
                      _createElementVNode("td", _hoisted_116, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                      _createElementVNode("td", _hoisted_117, _toDisplayString(formatMoney(item.cumulative_deposit_amount, item.base_currency)), 1),
                      _createElementVNode("td", _hoisted_118, _toDisplayString(formatMoney(item.cumulative_withdrawal_amount, item.base_currency)), 1),
                      _createElementVNode("td", _hoisted_119, _toDisplayString(item.holding_count), 1),
                      _createElementVNode("td", _hoisted_120, _toDisplayString(item.liability_count), 1),
                      _createElementVNode("td", _hoisted_121, _toDisplayString(formatDateTime(item.updated_at)), 1),
                      _createElementVNode("td", _hoisted_122, [
                        _createElementVNode("div", _hoisted_123, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            disabled: !canManageAssets.value || isBusy.value,
                            onClick: ($event) => togglePortfolioIncluded(item)
                          }, _toDisplayString(item.is_included ? "Exclude" : "Include"), 9, _hoisted_124),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            disabled: !canManageAssets.value || isBusy.value,
                            onClick: ($event) => togglePortfolioHidden(item)
                          }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_125),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                            disabled: !canManageAssets.value || isBusy.value,
                            onClick: ($event) => askDeletePortfolio(item)
                          }, "Delete", 8, _hoisted_126)
                        ])
                      ])
                    ]);
                  }), 128)),
                  portfolioRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_127, [..._cache[144] || (_cache[144] = [
                    _createElementVNode("td", {
                      colspan: "14",
                      class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                    }, "No portfolios found", -1)
                  ])])) : _createCommentVNode("", true)
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_128, [
              _createElementVNode("div", _hoisted_129, [
                _createElementVNode("span", null, "Total: " + _toDisplayString(portfolioQuery.total), 1),
                _cache[147] || (_cache[147] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("span", null, "Page " + _toDisplayString(portfolioQuery.page) + " / " + _toDisplayString(portfolioTotalPages.value), 1),
                _cache[148] || (_cache[148] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("label", null, [
                  _cache[146] || (_cache[146] = _createTextVNode("Size ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => portfolioQuery.pageSize = $event),
                    class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                    onChange: _cache[37] || (_cache[37] = ($event) => {
                      portfolioQuery.page = 1;
                      refreshData();
                    })
                  }, [..._cache[145] || (_cache[145] = [
                    _createElementVNode("option", { value: 10 }, "10", -1),
                    _createElementVNode("option", { value: 20 }, "20", -1),
                    _createElementVNode("option", { value: 50 }, "50", -1)
                  ])], 544), [
                    [
                      _vModelSelect,
                      portfolioQuery.pageSize,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || portfolioQuery.page <= 1,
                  onClick: _cache[38] || (_cache[38] = ($event) => movePortfolioPage(-1))
                }, "Prev", 8, _hoisted_130),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || portfolioQuery.page >= portfolioTotalPages.value,
                  onClick: _cache[39] || (_cache[39] = ($event) => movePortfolioPage(1))
                }, "Next", 8, _hoisted_131)
              ])
            ]),
            quickCreatePortfolioOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_132, [
              _createElementVNode("div", _hoisted_133, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[40] || (_cache[40] = ($event) => portfolioForm.name = $event),
                  placeholder: "Portfolio name",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioForm.name]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => portfolioForm.type = $event),
                  placeholder: "Type (BROKER/EXCHANGE/...)",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioForm.type]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[42] || (_cache[42] = ($event) => portfolioForm.base_currency = $event),
                  placeholder: "Base currency",
                  maxlength: "3",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioForm.base_currency]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[43] || (_cache[43] = ($event) => portfolioForm.exchange_code = $event),
                  placeholder: "Exchange code",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioForm.exchange_code]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[44] || (_cache[44] = ($event) => portfolioForm.category = $event),
                  placeholder: "Category",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioForm.category]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[45] || (_cache[45] = ($event) => portfolioForm.memo = $event),
                  placeholder: "Memo",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioForm.memo]
                ])
              ]),
              _createElementVNode("div", _hoisted_134, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                  disabled: !canManageAssets.value || isBusy.value,
                  onClick: submitPortfolioCreate
                }, "Create Portfolio", 8, _hoisted_135)
              ])
            ])) : _createCommentVNode("", true)
          ]),
          _createElementVNode("article", _hoisted_136, [
            _createElementVNode("div", _hoisted_137, [
              _cache[149] || (_cache[149] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Holdings Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                disabled: isBusy.value,
                onClick: _cache[46] || (_cache[46] = ($event) => quickCreateHoldingOpen.value = !quickCreateHoldingOpen.value)
              }, _toDisplayString(quickCreateHoldingOpen.value ? "Close Create" : "Quick Create Holding"), 9, _hoisted_138)
            ]),
            _createElementVNode("div", _hoisted_139, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[47] || (_cache[47] = ($event) => holdingQuery.q = $event),
                type: "text",
                placeholder: "Search asset/portfolio/symbol",
                class: "w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                onKeyup: _withKeys(applyHoldingSearch, ["enter"])
              }, null, 544), [
                [_vModelText, holdingQuery.q]
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: applyHoldingSearch
              }, "Search", 8, _hoisted_140),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: clearHoldingSearch
              }, "Clear", 8, _hoisted_141)
            ]),
            _createElementVNode("div", _hoisted_142, [
              _createElementVNode("table", _hoisted_143, [
                _createElementVNode("thead", _hoisted_144, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", _hoisted_145, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[48] || (_cache[48] = ($event) => toggleHoldingSort("id"))
                      }, [
                        _cache[150] || (_cache[150] = _createTextVNode("ID ", -1)),
                        _createElementVNode("span", _hoisted_146, _toDisplayString(holdingSortIndicator("id")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_147, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[49] || (_cache[49] = ($event) => toggleHoldingSort("portfolio_name"))
                      }, [
                        _cache[151] || (_cache[151] = _createTextVNode("Portfolio ", -1)),
                        _createElementVNode("span", _hoisted_148, _toDisplayString(holdingSortIndicator("portfolio_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_149, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[50] || (_cache[50] = ($event) => toggleHoldingSort("asset_name"))
                      }, [
                        _cache[152] || (_cache[152] = _createTextVNode("Asset ", -1)),
                        _createElementVNode("span", _hoisted_150, _toDisplayString(holdingSortIndicator("asset_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_151, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[51] || (_cache[51] = ($event) => toggleHoldingSort("asset_symbol"))
                      }, [
                        _cache[153] || (_cache[153] = _createTextVNode("Symbol ", -1)),
                        _createElementVNode("span", _hoisted_152, _toDisplayString(holdingSortIndicator("asset_symbol")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_153, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[52] || (_cache[52] = ($event) => toggleHoldingSort("quantity"))
                      }, [
                        _cache[154] || (_cache[154] = _createTextVNode("Qty ", -1)),
                        _createElementVNode("span", _hoisted_154, _toDisplayString(holdingSortIndicator("quantity")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_155, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[53] || (_cache[53] = ($event) => toggleHoldingSort("avg_price"))
                      }, [
                        _cache[155] || (_cache[155] = _createTextVNode("Avg ", -1)),
                        _createElementVNode("span", _hoisted_156, _toDisplayString(holdingSortIndicator("avg_price")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_157, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[54] || (_cache[54] = ($event) => toggleHoldingSort("invested_amount"))
                      }, [
                        _cache[156] || (_cache[156] = _createTextVNode("Invested ", -1)),
                        _createElementVNode("span", _hoisted_158, _toDisplayString(holdingSortIndicator("invested_amount")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_159, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[55] || (_cache[55] = ($event) => toggleHoldingSort("current_price"))
                      }, [
                        _cache[157] || (_cache[157] = _createTextVNode("Price ", -1)),
                        _createElementVNode("span", _hoisted_160, _toDisplayString(holdingSortIndicator("current_price")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_161, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[56] || (_cache[56] = ($event) => toggleHoldingSort("evaluated_amount"))
                      }, [
                        _cache[158] || (_cache[158] = _createTextVNode("Evaluated ", -1)),
                        _createElementVNode("span", _hoisted_162, _toDisplayString(holdingSortIndicator("evaluated_amount")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_163, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[57] || (_cache[57] = ($event) => toggleHoldingSort("pnl_pct"))
                      }, [
                        _cache[159] || (_cache[159] = _createTextVNode("PnL% ", -1)),
                        _createElementVNode("span", _hoisted_164, _toDisplayString(holdingSortIndicator("pnl_pct")), 1)
                      ])
                    ]),
                    _cache[161] || (_cache[161] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                    _createElementVNode("th", _hoisted_165, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[58] || (_cache[58] = ($event) => toggleHoldingSort("updated_at"))
                      }, [
                        _cache[160] || (_cache[160] = _createTextVNode("Updated ", -1)),
                        _createElementVNode("span", _hoisted_166, _toDisplayString(holdingSortIndicator("updated_at")), 1)
                      ])
                    ]),
                    _cache[162] || (_cache[162] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                  ])
                ]),
                _createElementVNode("tbody", null, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(holdingRows.value, (item) => {
                    return _openBlock(), _createElementBlock("tr", {
                      key: item.id,
                      class: "border-t border-slate-200 dark:border-slate-700"
                    }, [
                      _createElementVNode("td", _hoisted_167, _toDisplayString(item.id), 1),
                      _createElementVNode("td", _hoisted_168, _toDisplayString(item.portfolio_name || "-"), 1),
                      _createElementVNode("td", _hoisted_169, _toDisplayString(item.asset_name), 1),
                      _createElementVNode("td", _hoisted_170, _toDisplayString(item.asset_symbol || "-"), 1),
                      _createElementVNode("td", _hoisted_171, _toDisplayString(item.quantity), 1),
                      _createElementVNode("td", _hoisted_172, _toDisplayString(item.avg_price), 1),
                      _createElementVNode("td", _hoisted_173, _toDisplayString(item.invested_amount), 1),
                      _createElementVNode("td", _hoisted_174, _toDisplayString(item.current_price ?? "-"), 1),
                      _createElementVNode("td", _hoisted_175, _toDisplayString(item.evaluated_amount), 1),
                      _createElementVNode("td", _hoisted_176, _toDisplayString(item.pnl_pct === null ? "-" : `${Number(item.pnl_pct).toFixed(2)}%`), 1),
                      _createElementVNode("td", _hoisted_177, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                      _createElementVNode("td", _hoisted_178, _toDisplayString(formatDateTime(item.updated_at)), 1),
                      _createElementVNode("td", _hoisted_179, [
                        _createElementVNode("div", _hoisted_180, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            disabled: isBusy.value,
                            onClick: ($event) => toggleHoldingHidden(item)
                          }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_181),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                            disabled: isBusy.value,
                            onClick: ($event) => askDeleteHolding(item)
                          }, "Delete", 8, _hoisted_182)
                        ])
                      ])
                    ]);
                  }), 128)),
                  holdingRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_183, [..._cache[163] || (_cache[163] = [
                    _createElementVNode("td", {
                      colspan: "13",
                      class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                    }, "No holdings found", -1)
                  ])])) : _createCommentVNode("", true)
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_184, [
              _createElementVNode("div", _hoisted_185, [
                _createElementVNode("span", null, "Total: " + _toDisplayString(holdingQuery.total), 1),
                _cache[166] || (_cache[166] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("span", null, "Page " + _toDisplayString(holdingQuery.page) + " / " + _toDisplayString(holdingTotalPages.value), 1),
                _cache[167] || (_cache[167] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("label", null, [
                  _cache[165] || (_cache[165] = _createTextVNode("Size ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[59] || (_cache[59] = ($event) => holdingQuery.pageSize = $event),
                    class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                    onChange: _cache[60] || (_cache[60] = ($event) => {
                      holdingQuery.page = 1;
                      refreshData();
                    })
                  }, [..._cache[164] || (_cache[164] = [
                    _createElementVNode("option", { value: 10 }, "10", -1),
                    _createElementVNode("option", { value: 20 }, "20", -1),
                    _createElementVNode("option", { value: 50 }, "50", -1)
                  ])], 544), [
                    [
                      _vModelSelect,
                      holdingQuery.pageSize,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || holdingQuery.page <= 1,
                  onClick: _cache[61] || (_cache[61] = ($event) => moveHoldingPage(-1))
                }, "Prev", 8, _hoisted_186),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || holdingQuery.page >= holdingTotalPages.value,
                  onClick: _cache[62] || (_cache[62] = ($event) => moveHoldingPage(1))
                }, "Next", 8, _hoisted_187)
              ])
            ]),
            quickCreateHoldingOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_188, [
              _createElementVNode("div", _hoisted_189, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[63] || (_cache[63] = ($event) => holdingForm.portfolio_id = $event),
                  placeholder: "Portfolio ID (optional)",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingForm.portfolio_id]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[64] || (_cache[64] = ($event) => holdingForm.asset_id = $event),
                  placeholder: "Asset ID",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingForm.asset_id]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[65] || (_cache[65] = ($event) => holdingForm.quantity = $event),
                  placeholder: "Quantity",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingForm.quantity]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[66] || (_cache[66] = ($event) => holdingForm.avg_price = $event),
                  placeholder: "Avg Price",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingForm.avg_price]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[67] || (_cache[67] = ($event) => holdingForm.invested_amount = $event),
                  placeholder: "Invested (optional)",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingForm.invested_amount]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[68] || (_cache[68] = ($event) => holdingForm.source_type = $event),
                  placeholder: "Source type",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingForm.source_type]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[69] || (_cache[69] = ($event) => holdingForm.memo = $event),
                  placeholder: "Memo",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                }, null, 512), [
                  [_vModelText, holdingForm.memo]
                ])
              ]),
              _createElementVNode("div", _hoisted_190, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                  disabled: isBusy.value,
                  onClick: submitHoldingCreate
                }, "Create Holding", 8, _hoisted_191)
              ])
            ])) : _createCommentVNode("", true)
          ]),
          _createElementVNode("article", _hoisted_192, [
            _createElementVNode("div", _hoisted_193, [
              _cache[168] || (_cache[168] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Liabilities Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                disabled: isBusy.value,
                onClick: _cache[70] || (_cache[70] = ($event) => quickCreateLiabilityOpen.value = !quickCreateLiabilityOpen.value)
              }, _toDisplayString(quickCreateLiabilityOpen.value ? "Close Create" : "Quick Create Liability"), 9, _hoisted_194)
            ]),
            _createElementVNode("div", _hoisted_195, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[71] || (_cache[71] = ($event) => liabilityQuery.q = $event),
                type: "text",
                placeholder: "Search liability/portfolio/type",
                class: "w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                onKeyup: _withKeys(applyLiabilitySearch, ["enter"])
              }, null, 544), [
                [_vModelText, liabilityQuery.q]
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: applyLiabilitySearch
              }, "Search", 8, _hoisted_196),
              _createElementVNode("button", {
                type: "button",
                class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: clearLiabilitySearch
              }, "Clear", 8, _hoisted_197)
            ]),
            _createElementVNode("div", _hoisted_198, [
              _createElementVNode("table", _hoisted_199, [
                _createElementVNode("thead", _hoisted_200, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", _hoisted_201, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[72] || (_cache[72] = ($event) => toggleLiabilitySort("id"))
                      }, [
                        _cache[169] || (_cache[169] = _createTextVNode("ID ", -1)),
                        _createElementVNode("span", _hoisted_202, _toDisplayString(liabilitySortIndicator("id")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_203, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[73] || (_cache[73] = ($event) => toggleLiabilitySort("portfolio_name"))
                      }, [
                        _cache[170] || (_cache[170] = _createTextVNode("Portfolio ", -1)),
                        _createElementVNode("span", _hoisted_204, _toDisplayString(liabilitySortIndicator("portfolio_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_205, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[74] || (_cache[74] = ($event) => toggleLiabilitySort("name"))
                      }, [
                        _cache[171] || (_cache[171] = _createTextVNode("Name ", -1)),
                        _createElementVNode("span", _hoisted_206, _toDisplayString(liabilitySortIndicator("name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_207, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[75] || (_cache[75] = ($event) => toggleLiabilitySort("liability_type"))
                      }, [
                        _cache[172] || (_cache[172] = _createTextVNode("Type ", -1)),
                        _createElementVNode("span", _hoisted_208, _toDisplayString(liabilitySortIndicator("liability_type")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_209, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[76] || (_cache[76] = ($event) => toggleLiabilitySort("outstanding_balance"))
                      }, [
                        _cache[173] || (_cache[173] = _createTextVNode("Balance ", -1)),
                        _createElementVNode("span", _hoisted_210, _toDisplayString(liabilitySortIndicator("outstanding_balance")), 1)
                      ])
                    ]),
                    _cache[177] || (_cache[177] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Currency", -1)),
                    _createElementVNode("th", _hoisted_211, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[77] || (_cache[77] = ($event) => toggleLiabilitySort("interest_rate"))
                      }, [
                        _cache[174] || (_cache[174] = _createTextVNode("Rate ", -1)),
                        _createElementVNode("span", _hoisted_212, _toDisplayString(liabilitySortIndicator("interest_rate")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_213, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[78] || (_cache[78] = ($event) => toggleLiabilitySort("monthly_payment"))
                      }, [
                        _cache[175] || (_cache[175] = _createTextVNode("Monthly ", -1)),
                        _createElementVNode("span", _hoisted_214, _toDisplayString(liabilitySortIndicator("monthly_payment")), 1)
                      ])
                    ]),
                    _cache[178] || (_cache[178] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Included", -1)),
                    _cache[179] || (_cache[179] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                    _createElementVNode("th", _hoisted_215, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[79] || (_cache[79] = ($event) => toggleLiabilitySort("updated_at"))
                      }, [
                        _cache[176] || (_cache[176] = _createTextVNode("Updated ", -1)),
                        _createElementVNode("span", _hoisted_216, _toDisplayString(liabilitySortIndicator("updated_at")), 1)
                      ])
                    ]),
                    _cache[180] || (_cache[180] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                  ])
                ]),
                _createElementVNode("tbody", null, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(liabilityRows.value, (item) => {
                    return _openBlock(), _createElementBlock("tr", {
                      key: item.id,
                      class: "border-t border-slate-200 dark:border-slate-700"
                    }, [
                      _createElementVNode("td", _hoisted_217, _toDisplayString(item.id), 1),
                      _createElementVNode("td", _hoisted_218, _toDisplayString(item.portfolio_name || "-"), 1),
                      _createElementVNode("td", _hoisted_219, _toDisplayString(item.name), 1),
                      _createElementVNode("td", _hoisted_220, _toDisplayString(item.liability_type), 1),
                      _createElementVNode("td", _hoisted_221, _toDisplayString(formatMoney(item.outstanding_balance, item.currency)), 1),
                      _createElementVNode("td", _hoisted_222, _toDisplayString(item.currency), 1),
                      _createElementVNode("td", _hoisted_223, _toDisplayString(item.interest_rate ?? "-"), 1),
                      _createElementVNode("td", _hoisted_224, _toDisplayString(item.monthly_payment ?? "-"), 1),
                      _createElementVNode("td", _hoisted_225, _toDisplayString(item.is_included ? "Y" : "N"), 1),
                      _createElementVNode("td", _hoisted_226, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                      _createElementVNode("td", _hoisted_227, _toDisplayString(formatDateTime(item.updated_at)), 1),
                      _createElementVNode("td", _hoisted_228, [
                        _createElementVNode("div", _hoisted_229, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            disabled: isBusy.value,
                            onClick: ($event) => toggleLiabilityIncluded(item)
                          }, _toDisplayString(item.is_included ? "Exclude" : "Include"), 9, _hoisted_230),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            disabled: isBusy.value,
                            onClick: ($event) => toggleLiabilityHidden(item)
                          }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_231),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                            disabled: isBusy.value,
                            onClick: ($event) => askDeleteLiability(item)
                          }, "Delete", 8, _hoisted_232)
                        ])
                      ])
                    ]);
                  }), 128)),
                  liabilityRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_233, [..._cache[181] || (_cache[181] = [
                    _createElementVNode("td", {
                      colspan: "12",
                      class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                    }, "No liabilities found", -1)
                  ])])) : _createCommentVNode("", true)
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_234, [
              _createElementVNode("div", _hoisted_235, [
                _createElementVNode("span", null, "Total: " + _toDisplayString(liabilityQuery.total), 1),
                _cache[184] || (_cache[184] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("span", null, "Page " + _toDisplayString(liabilityQuery.page) + " / " + _toDisplayString(liabilityTotalPages.value), 1),
                _cache[185] || (_cache[185] = _createElementVNode("span", null, "|", -1)),
                _createElementVNode("label", null, [
                  _cache[183] || (_cache[183] = _createTextVNode("Size ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[80] || (_cache[80] = ($event) => liabilityQuery.pageSize = $event),
                    class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                    onChange: _cache[81] || (_cache[81] = ($event) => {
                      liabilityQuery.page = 1;
                      refreshData();
                    })
                  }, [..._cache[182] || (_cache[182] = [
                    _createElementVNode("option", { value: 10 }, "10", -1),
                    _createElementVNode("option", { value: 20 }, "20", -1),
                    _createElementVNode("option", { value: 50 }, "50", -1)
                  ])], 544), [
                    [
                      _vModelSelect,
                      liabilityQuery.pageSize,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || liabilityQuery.page <= 1,
                  onClick: _cache[82] || (_cache[82] = ($event) => moveLiabilityPage(-1))
                }, "Prev", 8, _hoisted_236),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value || liabilityQuery.page >= liabilityTotalPages.value,
                  onClick: _cache[83] || (_cache[83] = ($event) => moveLiabilityPage(1))
                }, "Next", 8, _hoisted_237)
              ])
            ]),
            quickCreateLiabilityOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_238, [
              _createElementVNode("div", _hoisted_239, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[84] || (_cache[84] = ($event) => liabilityForm.portfolio_id = $event),
                  placeholder: "Portfolio ID (optional)",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.portfolio_id]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[85] || (_cache[85] = ($event) => liabilityForm.name = $event),
                  placeholder: "Liability name",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.name]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[86] || (_cache[86] = ($event) => liabilityForm.liability_type = $event),
                  placeholder: "Type",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.liability_type]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[87] || (_cache[87] = ($event) => liabilityForm.outstanding_balance = $event),
                  placeholder: "Outstanding balance",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.outstanding_balance]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[88] || (_cache[88] = ($event) => liabilityForm.currency = $event),
                  placeholder: "Currency",
                  maxlength: "3",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.currency]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[89] || (_cache[89] = ($event) => liabilityForm.interest_rate = $event),
                  placeholder: "Interest rate (optional)",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.interest_rate]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[90] || (_cache[90] = ($event) => liabilityForm.monthly_payment = $event),
                  placeholder: "Monthly payment (optional)",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.monthly_payment]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[91] || (_cache[91] = ($event) => liabilityForm.source_type = $event),
                  placeholder: "Source type",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.source_type]
                ]),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[92] || (_cache[92] = ($event) => liabilityForm.memo = $event),
                  placeholder: "Memo",
                  class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityForm.memo]
                ])
              ]),
              _createElementVNode("div", _hoisted_240, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                  disabled: isBusy.value,
                  onClick: submitLiabilityCreate
                }, "Create Liability", 8, _hoisted_241)
              ])
            ])) : _createCommentVNode("", true)
          ]),
          _createElementVNode("article", _hoisted_242, [
            _cache[186] || (_cache[186] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Execution Log", -1)),
            _createElementVNode("ul", _hoisted_243, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(logs.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.id,
                  class: _normalizeClass([
                    "rounded-lg border px-3 py-2 text-xs",
                    item.status === "SUCCESS" ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30" : item.status === "ERROR" ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/30" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40"
                  ])
                }, [
                  _createElementVNode("p", _hoisted_244, _toDisplayString(item.action) + " · " + _toDisplayString(item.status), 1),
                  _createElementVNode("p", _hoisted_245, _toDisplayString(item.message), 1),
                  _createElementVNode("p", _hoisted_246, _toDisplayString(formatDateTime(item.at)), 1)
                ], 2);
              }), 128))
            ])
          ])
        ]),
        assetModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeAssetModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_247, [
            _createElementVNode("h3", _hoisted_248, _toDisplayString(assetModal.mode === "CREATE" ? "Create Asset" : `Edit Asset #${assetForm.id}`), 1),
            _cache[197] || (_cache[197] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "필수 입력: Name, Class, Currency, Quote Mode, Exchange", -1)),
            _createElementVNode("div", _hoisted_249, [
              _createElementVNode("label", _hoisted_250, [
                _cache[187] || (_cache[187] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[93] || (_cache[93] = ($event) => assetForm.name = $event),
                  placeholder: "예: 삼성전자",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_251, [
                _cache[189] || (_cache[189] = _createTextVNode("Class ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[94] || (_cache[94] = ($event) => assetForm.asset_class = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[188] || (_cache[188] = _createElementVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Select class", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(assetClassOptions, (item) => {
                    return _createElementVNode("option", {
                      key: item,
                      value: item
                    }, _toDisplayString(item), 9, _hoisted_252);
                  }), 64))
                ], 512), [
                  [_vModelSelect, assetForm.asset_class]
                ])
              ]),
              _createElementVNode("label", _hoisted_253, [
                _cache[190] || (_cache[190] = _createTextVNode("Symbol ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[95] || (_cache[95] = ($event) => assetForm.symbol = $event),
                  placeholder: "예: 005930 또는 BTC",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.symbol]
                ])
              ]),
              _createElementVNode("label", _hoisted_254, [
                _cache[191] || (_cache[191] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[96] || (_cache[96] = ($event) => assetForm.currency = $event),
                  maxlength: "3",
                  placeholder: "예: KRW",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_255, [
                _cache[193] || (_cache[193] = _createTextVNode("Quote Mode ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[97] || (_cache[97] = ($event) => assetForm.quote_mode = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[192] || (_cache[192] = _createElementVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Select quote mode", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(quoteModeOptions, (item) => {
                    return _createElementVNode("option", {
                      key: item,
                      value: item
                    }, _toDisplayString(item), 9, _hoisted_256);
                  }), 64))
                ], 512), [
                  [_vModelSelect, assetForm.quote_mode]
                ])
              ]),
              _createElementVNode("label", _hoisted_257, [
                _cache[194] || (_cache[194] = _createTextVNode("Exchange ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[98] || (_cache[98] = ($event) => assetForm.exchange_code = $event),
                  placeholder: "예: KRX / UPBIT / KORBIT",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.exchange_code]
                ])
              ]),
              _createElementVNode("label", _hoisted_258, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[99] || (_cache[99] = ($event) => assetForm.is_trade_supported = $event),
                  type: "checkbox"
                }, null, 512), [
                  [_vModelCheckbox, assetForm.is_trade_supported]
                ]),
                _cache[195] || (_cache[195] = _createElementVNode("span", { class: "ml-1" }, "Trade Supported", -1))
              ]),
              _createElementVNode("label", _hoisted_259, [
                _cache[196] || (_cache[196] = _createTextVNode("Meta JSON ", -1)),
                _withDirectives(_createElementVNode("textarea", {
                  "onUpdate:modelValue": _cache[100] || (_cache[100] = ($event) => assetForm.meta_json_text = $event),
                  rows: "4",
                  placeholder: '예: {"address":"경기 수원시 영통구 청명북로 33"}',
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.meta_json_text]
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_260, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeAssetModal
              }, " Cancel ", 8, _hoisted_261),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitAssetForm
              }, _toDisplayString(assetModal.mode === "CREATE" ? "Create" : "Apply"), 9, _hoisted_262)
            ])
          ])
        ])) : _createCommentVNode("", true),
        confirmModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 1,
          class: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeConfirm, ["self"])
        }, [
          _createElementVNode("section", _hoisted_263, [
            _createElementVNode("h3", _hoisted_264, _toDisplayString(confirmModal.title), 1),
            _createElementVNode("p", _hoisted_265, _toDisplayString(confirmModal.message), 1),
            _createElementVNode("div", _hoisted_266, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.confirm,
                onClick: closeConfirm
              }, " Cancel ", 8, _hoisted_267),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.confirm,
                onClick: executeConfirm
              }, _toDisplayString(loading.confirm ? "Running..." : "Confirm"), 9, _hoisted_268)
            ])
          ])
        ])) : _createCommentVNode("", true)
      ], 64);
    };
  }
});

export { _sfc_main as default };
