import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul, A as AxiosError, t as toDateTimeLocalSeoul } from './datetime-D3NoeBy6.js';
import { c as createAsset, u as updateAsset, g as getAssetsTable, a as getAssets, d as deleteAsset } from './assets-RV6m6tbW.js';
import { u as useDisplayCurrency } from './useDisplayCurrency-HdS6Uz1W.js';
import { c as createHolding, r as rebaselineHolding, u as updateHolding, a as getHoldingsTable, d as deleteHolding } from './holdings-CZxu3Df1.js';
import { d as createPortfolio, r as rebaselinePortfolio, u as updatePortfolio, e as getPortfolioCashAccounts, s as setPortfolioCashAccount, f as createLiability, h as rebaselineLiability, i as updateLiability, a as getPortfoliosTable, g as getLiabilitiesTable, c as getPortfolios, j as deletePortfolio, k as deleteLiability } from './portfolios-r6VxmkS0.js';
import { c as createReleaseNote, u as updateReleaseNote, g as getReleaseNotes, a as unpublishReleaseNote } from './releaseNotes-CR0dehqN.js';

async function getMe() {
  const { data } = await http.get("/auth/me");
  return data;
}

async function updateQuotesNow() {
  const { data } = await http.post("/quotes/update-now");
  return data;
}
async function getQuoteUpdateJobStatus(jobId) {
  const { data } = await http.get(`/quotes/update-jobs/${jobId}`);
  return data;
}
async function testQuoteForAsset(assetId) {
  const { data } = await http.post(`/quotes/test/${assetId}`);
  return data;
}
async function upsertManualQuote(payload) {
  const { data } = await http.post("/quotes/manual", payload);
  return data;
}
async function getLatestUsdKrwFxRate() {
  const { data } = await http.get("/quotes/fx/usd-krw/latest");
  return data;
}

async function getFxStaleMinutes() {
  const { data } = await http.get("/settings/fx-stale-minutes");
  return data;
}

async function listAppSecrets(params) {
  const { data } = await http.get("/admin/secrets", { params });
  return data;
}
async function createAppSecret(payload) {
  const { data } = await http.post("/admin/secrets", payload);
  return data;
}
async function updateAppSecret(secretId, payload) {
  const { data } = await http.patch(`/admin/secrets/${secretId}`, payload);
  return data;
}
async function deactivateAppSecret(secretId) {
  const { data } = await http.delete(`/admin/secrets/${secretId}`);
  return data;
}

async function getEntityHistory(params) {
  const { data } = await http.get("/admin/entity-history", { params });
  return data;
}
async function revertEntityHistory(historyId) {
  const { data } = await http.post(`/admin/entity-history/${historyId}/revert`);
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,vModelText:_vModelText,withDirectives:_withDirectives,createTextVNode:_createTextVNode,vModelCheckbox:_vModelCheckbox,renderList:_renderList,Fragment:_Fragment,normalizeClass:_normalizeClass,withKeys:_withKeys,withModifiers:_withModifiers,vModelSelect:_vModelSelect,vModelRadio:_vModelRadio} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_5 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_6 = ["disabled"];
const _hoisted_7 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_8 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_9 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_10 = ["disabled"];
const _hoisted_11 = ["disabled"];
const _hoisted_12 = {
  key: 0,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_13 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_14 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_15 = { class: "text-xs" };
const _hoisted_16 = { class: "text-xs" };
const _hoisted_17 = { class: "text-xs md:col-span-2" };
const _hoisted_18 = { class: "text-xs md:col-span-2" };
const _hoisted_19 = { class: "text-xs md:col-span-2" };
const _hoisted_20 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_21 = ["disabled"];
const _hoisted_22 = {
  key: 0,
  class: "text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_23 = { class: "mt-3 overflow-x-auto" };
const _hoisted_24 = { class: "w-full min-w-[980px] text-left text-xs leading-tight" };
const _hoisted_25 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_26 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_27 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_28 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_29 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_30 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_31 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_32 = { class: "flex flex-wrap gap-1" };
const _hoisted_33 = ["disabled", "onClick"];
const _hoisted_34 = ["disabled", "onClick"];
const _hoisted_35 = { key: 0 };
const _hoisted_36 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_37 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_38 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_39 = ["disabled"];
const _hoisted_40 = ["disabled"];
const _hoisted_41 = {
  key: 0,
  class: "mt-1 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_42 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_43 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_44 = ["disabled"];
const _hoisted_45 = ["disabled"];
const _hoisted_46 = { class: "mt-3 overflow-x-auto" };
const _hoisted_47 = { class: "w-full min-w-[2120px] text-left text-xs leading-tight" };
const _hoisted_48 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_49 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_50 = { class: "opacity-70" };
const _hoisted_51 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_52 = { class: "opacity-70" };
const _hoisted_53 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_54 = { class: "opacity-70" };
const _hoisted_55 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_56 = { class: "opacity-70" };
const _hoisted_57 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_58 = { class: "opacity-70" };
const _hoisted_59 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_60 = { class: "opacity-70" };
const _hoisted_61 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_62 = { class: "opacity-70" };
const _hoisted_63 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_64 = { class: "opacity-70" };
const _hoisted_65 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_66 = { class: "opacity-70" };
const _hoisted_67 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_68 = { class: "opacity-70" };
const _hoisted_69 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_70 = { class: "opacity-70" };
const _hoisted_71 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_72 = { class: "opacity-70" };
const _hoisted_73 = ["onClick"];
const _hoisted_74 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_75 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_76 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_77 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_78 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_79 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_80 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_81 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_82 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_83 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_84 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_85 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_86 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_87 = { class: "flex min-w-max flex-nowrap gap-1" };
const _hoisted_88 = ["disabled", "onClick"];
const _hoisted_89 = ["disabled", "onClick"];
const _hoisted_90 = ["disabled", "onClick"];
const _hoisted_91 = { class: "inline-flex items-center gap-1" };
const _hoisted_92 = {
  key: 0,
  class: "inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
};
const _hoisted_93 = ["disabled", "onClick"];
const _hoisted_94 = { key: 0 };
const _hoisted_95 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2" };
const _hoisted_96 = { class: "flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_97 = ["disabled"];
const _hoisted_98 = ["disabled"];
const _hoisted_99 = ["disabled"];
const _hoisted_100 = {
  key: 1,
  class: "mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
};
const _hoisted_101 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_102 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_103 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_104 = ["disabled"];
const _hoisted_105 = {
  key: 0,
  class: "mt-1 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_106 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_107 = {
  key: 2,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_108 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_109 = { class: "text-xs" };
const _hoisted_110 = ["value"];
const _hoisted_111 = { class: "text-xs" };
const _hoisted_112 = { class: "text-xs" };
const _hoisted_113 = { class: "text-xs" };
const _hoisted_114 = { class: "mt-3" };
const _hoisted_115 = ["disabled"];
const _hoisted_116 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_117 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_118 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_119 = ["disabled"];
const _hoisted_120 = ["disabled"];
const _hoisted_121 = {
  key: 0,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_122 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_123 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_124 = { class: "text-xs" };
const _hoisted_125 = { class: "text-xs" };
const _hoisted_126 = { class: "text-xs md:col-span-2" };
const _hoisted_127 = { class: "text-xs md:col-span-2" };
const _hoisted_128 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_129 = ["disabled"];
const _hoisted_130 = {
  key: 0,
  class: "text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_131 = { class: "mt-3 overflow-x-auto" };
const _hoisted_132 = { class: "w-full min-w-[980px] text-left text-xs leading-tight" };
const _hoisted_133 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_134 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_135 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_136 = { class: "px-2 py-1.5" };
const _hoisted_137 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_138 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_139 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_140 = { class: "flex flex-wrap gap-1" };
const _hoisted_141 = ["disabled", "onClick"];
const _hoisted_142 = ["disabled", "onClick"];
const _hoisted_143 = { key: 0 };
const _hoisted_144 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_145 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_146 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_147 = ["disabled"];
const _hoisted_148 = ["disabled"];
const _hoisted_149 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_150 = ["disabled"];
const _hoisted_151 = ["disabled"];
const _hoisted_152 = { class: "mt-3 overflow-x-auto" };
const _hoisted_153 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_154 = { class: "bg-slate-50 dark:bg-slate-800" };
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
const _hoisted_168 = { class: "opacity-70" };
const _hoisted_169 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_170 = { class: "opacity-70" };
const _hoisted_171 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_172 = { class: "opacity-70" };
const _hoisted_173 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_174 = { class: "opacity-70" };
const _hoisted_175 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_176 = { class: "opacity-70" };
const _hoisted_177 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_178 = { class: "opacity-70" };
const _hoisted_179 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_180 = { class: "opacity-70" };
const _hoisted_181 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_182 = { class: "opacity-70" };
const _hoisted_183 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_184 = { class: "opacity-70" };
const _hoisted_185 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_186 = { class: "opacity-70" };
const _hoisted_187 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_188 = { class: "opacity-70" };
const _hoisted_189 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_190 = { class: "opacity-70" };
const _hoisted_191 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_192 = { class: "opacity-70" };
const _hoisted_193 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_194 = { class: "opacity-70" };
const _hoisted_195 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_196 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_197 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_198 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_199 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_200 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_201 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_202 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_203 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_204 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_205 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_206 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_207 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_208 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_209 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_210 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_211 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_212 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_213 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_214 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_215 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_216 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_217 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_218 = { class: "flex min-w-max flex-nowrap gap-1" };
const _hoisted_219 = ["disabled", "onClick"];
const _hoisted_220 = ["disabled", "onClick"];
const _hoisted_221 = ["disabled", "onClick"];
const _hoisted_222 = ["disabled", "onClick"];
const _hoisted_223 = ["disabled", "onClick"];
const _hoisted_224 = { key: 0 };
const _hoisted_225 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_226 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_227 = ["disabled"];
const _hoisted_228 = ["disabled"];
const _hoisted_229 = { class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_230 = { class: "mt-2 grid grid-cols-1 gap-2 md:grid-cols-4" };
const _hoisted_231 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_232 = ["disabled"];
const _hoisted_233 = ["value"];
const _hoisted_234 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_235 = ["disabled"];
const _hoisted_236 = { class: "text-xs text-slate-600 dark:text-slate-300 md:col-span-2" };
const _hoisted_237 = ["disabled"];
const _hoisted_238 = ["value"];
const _hoisted_239 = { class: "mt-2" };
const _hoisted_240 = ["disabled"];
const _hoisted_241 = { class: "mt-3 overflow-x-auto" };
const _hoisted_242 = { class: "w-full min-w-[560px] text-left text-xs leading-tight" };
const _hoisted_243 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_244 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_245 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_246 = { class: "opacity-70" };
const _hoisted_247 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_248 = { key: 0 };
const _hoisted_249 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_250 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_251 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_252 = ["value"];
const _hoisted_253 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_254 = ["value"];
const _hoisted_255 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_256 = ["value"];
const _hoisted_257 = { class: "mt-2" };
const _hoisted_258 = ["disabled"];
const _hoisted_259 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_260 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_261 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_262 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_263 = ["disabled"];
const _hoisted_264 = ["disabled"];
const _hoisted_265 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_266 = ["disabled"];
const _hoisted_267 = ["disabled"];
const _hoisted_268 = { class: "mt-3 overflow-x-auto" };
const _hoisted_269 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_270 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_271 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_272 = { class: "opacity-70" };
const _hoisted_273 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_274 = { class: "opacity-70" };
const _hoisted_275 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_276 = { class: "opacity-70" };
const _hoisted_277 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_278 = { class: "opacity-70" };
const _hoisted_279 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_280 = { class: "opacity-70" };
const _hoisted_281 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_282 = { class: "opacity-70" };
const _hoisted_283 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_284 = { class: "opacity-70" };
const _hoisted_285 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_286 = { class: "opacity-70" };
const _hoisted_287 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_288 = { class: "opacity-70" };
const _hoisted_289 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_290 = { class: "opacity-70" };
const _hoisted_291 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_292 = { class: "opacity-70" };
const _hoisted_293 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_294 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_295 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_296 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_297 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_298 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_299 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_300 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_301 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_302 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_303 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_304 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_305 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_306 = { class: "flex flex-wrap gap-1" };
const _hoisted_307 = ["disabled", "onClick"];
const _hoisted_308 = ["disabled", "onClick"];
const _hoisted_309 = ["disabled", "onClick"];
const _hoisted_310 = ["disabled", "onClick"];
const _hoisted_311 = { key: 0 };
const _hoisted_312 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_313 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_314 = ["disabled"];
const _hoisted_315 = ["disabled"];
const _hoisted_316 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_317 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_318 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_319 = ["disabled"];
const _hoisted_320 = ["value"];
const _hoisted_321 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_322 = ["disabled"];
const _hoisted_323 = ["value"];
const _hoisted_324 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_325 = ["disabled"];
const _hoisted_326 = ["value"];
const _hoisted_327 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_328 = ["disabled"];
const _hoisted_329 = ["value"];
const _hoisted_330 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_331 = ["value"];
const _hoisted_332 = { class: "mt-2" };
const _hoisted_333 = ["disabled"];
const _hoisted_334 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_335 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_336 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_337 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_338 = ["disabled"];
const _hoisted_339 = ["disabled"];
const _hoisted_340 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_341 = ["disabled"];
const _hoisted_342 = ["disabled"];
const _hoisted_343 = { class: "mt-3 overflow-x-auto" };
const _hoisted_344 = { class: "w-full min-w-[1100px] text-left text-xs leading-tight" };
const _hoisted_345 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_346 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_347 = { class: "opacity-70" };
const _hoisted_348 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_349 = { class: "opacity-70" };
const _hoisted_350 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_351 = { class: "opacity-70" };
const _hoisted_352 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_353 = { class: "opacity-70" };
const _hoisted_354 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_355 = { class: "opacity-70" };
const _hoisted_356 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_357 = { class: "opacity-70" };
const _hoisted_358 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_359 = { class: "opacity-70" };
const _hoisted_360 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_361 = { class: "opacity-70" };
const _hoisted_362 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_363 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_364 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_365 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_366 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_367 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_368 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_369 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_370 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_371 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_372 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_373 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_374 = { class: "flex flex-wrap gap-1" };
const _hoisted_375 = ["disabled", "onClick"];
const _hoisted_376 = ["disabled", "onClick"];
const _hoisted_377 = ["disabled", "onClick"];
const _hoisted_378 = ["disabled", "onClick"];
const _hoisted_379 = ["disabled", "onClick"];
const _hoisted_380 = { key: 0 };
const _hoisted_381 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_382 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_383 = ["disabled"];
const _hoisted_384 = ["disabled"];
const _hoisted_385 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_386 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_387 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_388 = ["disabled"];
const _hoisted_389 = ["value"];
const _hoisted_390 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_391 = ["value"];
const _hoisted_392 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_393 = ["value"];
const _hoisted_394 = { class: "mt-2" };
const _hoisted_395 = ["disabled"];
const _hoisted_396 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_397 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_398 = { class: "mt-3 max-h-72 space-y-2 overflow-y-auto" };
const _hoisted_399 = { class: "font-semibold" };
const _hoisted_400 = { class: "mt-0.5" };
const _hoisted_401 = { class: "mt-0.5 opacity-70" };
const _hoisted_402 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_403 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_404 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_405 = { class: "text-xs" };
const _hoisted_406 = { class: "text-xs" };
const _hoisted_407 = ["value"];
const _hoisted_408 = { class: "text-xs" };
const _hoisted_409 = { class: "text-xs" };
const _hoisted_410 = { class: "text-xs" };
const _hoisted_411 = ["value"];
const _hoisted_412 = { class: "text-xs" };
const _hoisted_413 = { class: "text-xs md:col-span-2" };
const _hoisted_414 = { class: "text-xs md:col-span-2" };
const _hoisted_415 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_416 = ["disabled"];
const _hoisted_417 = ["disabled"];
const _hoisted_418 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_419 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_420 = { class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_421 = { class: "mt-2 flex flex-wrap items-center gap-4 text-xs" };
const _hoisted_422 = { class: "inline-flex items-center gap-2" };
const _hoisted_423 = { class: "inline-flex items-center gap-2" };
const _hoisted_424 = ["disabled"];
const _hoisted_425 = {
  key: 0,
  class: "mt-2 text-[11px] text-amber-600 dark:text-amber-300"
};
const _hoisted_426 = { class: "mt-2 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_427 = { class: "text-xs" };
const _hoisted_428 = { class: "text-xs" };
const _hoisted_429 = {
  key: 2,
  class: "mt-2 text-[11px] text-rose-600 dark:text-rose-300"
};
const _hoisted_430 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_431 = { class: "text-xs" };
const _hoisted_432 = { class: "text-xs" };
const _hoisted_433 = ["value"];
const _hoisted_434 = { class: "text-xs" };
const _hoisted_435 = { class: "text-xs" };
const _hoisted_436 = { class: "text-xs" };
const _hoisted_437 = ["value"];
const _hoisted_438 = { class: "text-xs" };
const _hoisted_439 = ["value"];
const _hoisted_440 = { class: "text-xs" };
const _hoisted_441 = { class: "text-xs" };
const _hoisted_442 = { class: "text-xs md:col-span-2" };
const _hoisted_443 = { class: "text-xs md:col-span-2 flex flex-wrap items-center gap-4" };
const _hoisted_444 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_445 = ["disabled"];
const _hoisted_446 = ["disabled"];
const _hoisted_447 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_448 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_449 = { class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_450 = { class: "mt-2 flex flex-wrap items-center gap-4 text-xs" };
const _hoisted_451 = { class: "inline-flex items-center gap-2" };
const _hoisted_452 = { class: "inline-flex items-center gap-2" };
const _hoisted_453 = ["disabled"];
const _hoisted_454 = {
  key: 0,
  class: "mt-2 text-[11px] text-amber-600 dark:text-amber-300"
};
const _hoisted_455 = { class: "mt-2 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_456 = { class: "text-xs" };
const _hoisted_457 = { class: "text-xs" };
const _hoisted_458 = {
  key: 2,
  class: "mt-2 text-[11px] text-rose-600 dark:text-rose-300"
};
const _hoisted_459 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_460 = { class: "text-xs" };
const _hoisted_461 = ["disabled"];
const _hoisted_462 = ["value"];
const _hoisted_463 = { class: "text-xs" };
const _hoisted_464 = ["disabled"];
const _hoisted_465 = ["value"];
const _hoisted_466 = { class: "text-xs" };
const _hoisted_467 = { class: "text-xs" };
const _hoisted_468 = { class: "text-xs" };
const _hoisted_469 = ["value"];
const _hoisted_470 = { class: "text-xs" };
const _hoisted_471 = { class: "text-xs" };
const _hoisted_472 = ["value"];
const _hoisted_473 = { class: "text-xs" };
const _hoisted_474 = ["disabled"];
const _hoisted_475 = ["value"];
const _hoisted_476 = { class: "text-xs md:col-span-2" };
const _hoisted_477 = { class: "text-xs md:col-span-2" };
const _hoisted_478 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_479 = ["disabled"];
const _hoisted_480 = ["disabled"];
const _hoisted_481 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_482 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_483 = { class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_484 = { class: "mt-2 flex flex-wrap items-center gap-4 text-xs" };
const _hoisted_485 = { class: "inline-flex items-center gap-2" };
const _hoisted_486 = { class: "inline-flex items-center gap-2" };
const _hoisted_487 = ["disabled"];
const _hoisted_488 = {
  key: 0,
  class: "mt-2 text-[11px] text-amber-600 dark:text-amber-300"
};
const _hoisted_489 = { class: "mt-2 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_490 = { class: "text-xs" };
const _hoisted_491 = { class: "text-xs" };
const _hoisted_492 = {
  key: 2,
  class: "mt-2 text-[11px] text-rose-600 dark:text-rose-300"
};
const _hoisted_493 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_494 = { class: "text-xs" };
const _hoisted_495 = ["disabled"];
const _hoisted_496 = ["value"];
const _hoisted_497 = { class: "text-xs" };
const _hoisted_498 = { class: "text-xs" };
const _hoisted_499 = ["value"];
const _hoisted_500 = { class: "text-xs" };
const _hoisted_501 = ["disabled"];
const _hoisted_502 = { class: "text-xs" };
const _hoisted_503 = { class: "text-xs" };
const _hoisted_504 = { class: "text-xs" };
const _hoisted_505 = { class: "text-xs" };
const _hoisted_506 = ["value"];
const _hoisted_507 = { class: "text-xs md:col-span-2" };
const _hoisted_508 = { class: "text-xs md:col-span-2 flex flex-wrap items-center gap-4" };
const _hoisted_509 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_510 = ["disabled"];
const _hoisted_511 = ["disabled"];
const _hoisted_512 = { class: "w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_513 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_514 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_515 = ["disabled"];
const _hoisted_516 = {
  key: 0,
  class: "mt-4 rounded-lg border border-slate-200 px-3 py-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400"
};
const _hoisted_517 = {
  key: 1,
  class: "mt-4 rounded-lg border border-slate-200 px-3 py-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400"
};
const _hoisted_518 = {
  key: 2,
  class: "mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1"
};
const _hoisted_519 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_520 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_521 = { class: "font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_522 = ["disabled", "onClick"];
const _hoisted_523 = {
  key: 0,
  class: "mt-1 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_524 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_525 = { class: "font-medium text-slate-700 dark:text-slate-200" };
const _hoisted_526 = { class: "mt-2 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_527 = { class: "mt-1 max-h-40 overflow-auto rounded-lg bg-slate-50 p-2 text-[11px] leading-tight text-slate-700 dark:bg-slate-950 dark:text-slate-200" };
const _hoisted_528 = { class: "mt-1 max-h-40 overflow-auto rounded-lg bg-slate-50 p-2 text-[11px] leading-tight text-slate-700 dark:bg-slate-950 dark:text-slate-200" };
const _hoisted_529 = { class: "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_530 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_531 = { class: "mt-2 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_532 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_533 = ["disabled"];
const _hoisted_534 = ["disabled"];
const {computed,onBeforeUnmount,onMounted,reactive,ref,watch} = await importShared('vue');
const COLLAPSE_STATE_STORAGE_KEY = "myasset.agent.collapse.v1";
const AUTO_SEARCH_DEBOUNCE_MS = 450;
const QUOTE_UPDATE_POLL_MS = 1500;
const QUOTE_UPDATE_POLL_TIMEOUT_MS = 5 * 60 * 1e3;
const realEstateMetaJsonExample = `{
  "jibun": "1046-1",
  "area_m2": 119.871,
  "lawd_cd": "41117",
  "apt_name": "청명마을삼성",
  "lookback_months": 12
}`;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "AgentPage",
  setup(__props) {
    function loadCollapseState() {
      if (typeof window === "undefined") return {};
      try {
        const raw = window.localStorage.getItem(COLLAPSE_STATE_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
        return parsed;
      } catch {
        return {};
      }
    }
    function saveCollapseState(next) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(COLLAPSE_STATE_STORAGE_KEY, JSON.stringify(next));
      } catch {
      }
    }
    const initialCollapseState = loadCollapseState();
    const loading = reactive({ data: false, action: false, confirm: false });
    const me = ref(null);
    const assets = ref([]);
    const holdingAssetOptions = ref([]);
    const holdingPortfolioOptions = ref([]);
    const portfolioRows = ref([]);
    const holdingRows = ref([]);
    const liabilityRows = ref([]);
    const portfolioCashAccounts = ref([]);
    const appSecrets = ref([]);
    const releaseNotes = ref([]);
    const usdKrwFx = ref(null);
    const logs = ref([]);
    const { displayCurrency, ensureInitialized } = useDisplayCurrency();
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
    const portfolioEditModal = reactive({ open: false });
    const holdingEditModal = reactive({ open: false });
    const liabilityEditModal = reactive({ open: false });
    const entityHistoryModal = reactive({ open: false });
    const quoteActionsCollapsed = ref(initialCollapseState.quoteActionsCollapsed ?? true);
    const secretsVaultCollapsed = ref(initialCollapseState.secretsVaultCollapsed ?? true);
    const releaseNotesSectionCollapsed = ref(initialCollapseState.releaseNotesSectionCollapsed ?? true);
    const quoteTestingAssetId = ref(null);
    const assetsSectionCollapsed = ref(initialCollapseState.assetsSectionCollapsed ?? true);
    const portfoliosSectionCollapsed = ref(initialCollapseState.portfoliosSectionCollapsed ?? true);
    const holdingsSectionCollapsed = ref(initialCollapseState.holdingsSectionCollapsed ?? true);
    const liabilitiesSectionCollapsed = ref(initialCollapseState.liabilitiesSectionCollapsed ?? true);
    const quickCreatePortfolioOpen = ref(false);
    const quickCreateHoldingOpen = ref(false);
    const quickCreateLiabilityOpen = ref(false);
    const cashAccountLookupLoading = ref(false);
    const lookupLoading = ref(false);
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
    const fxStaleMinutesForm = ref("30");
    const fxStaleSource = ref("env");
    const portfolioForm = reactive({
      name: "",
      type: "ETC",
      base_currency: "KRW",
      exchange_code: "",
      category: "ETC",
      cashflow_source_type: "MANUAL",
      memo: ""
    });
    const holdingForm = reactive({
      portfolio_id: "",
      asset_id: "",
      quantity: "",
      avg_price: "",
      avg_price_currency: "KRW",
      invested_amount: "",
      invested_amount_currency: "KRW",
      source_type: "MANUAL",
      memo: ""
    });
    const portfolioCashMapForm = reactive({
      portfolio_id: "",
      currency: "KRW",
      asset_id: ""
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
    const portfolioEditForm = reactive({
      id: "",
      name: "",
      type: "ETC",
      base_currency: "KRW",
      exchange_code: "",
      category: "",
      cashflow_source_type: "MANUAL",
      cumulative_deposit_amount: "0",
      cumulative_withdrawal_amount: "0",
      is_included: true,
      is_hidden: false,
      memo: "",
      edit_mode: "SAFE",
      effective_at: "",
      reason: ""
    });
    const holdingEditForm = reactive({
      id: "",
      portfolio_id: "",
      asset_id: "",
      quantity: "",
      avg_price: "",
      avg_price_currency: "KRW",
      invested_amount: "",
      invested_amount_currency: "KRW",
      source_type: "MANUAL",
      is_hidden: false,
      memo: "",
      edit_mode: "SAFE",
      effective_at: "",
      reason: "",
      original_portfolio_id: "",
      original_asset_id: ""
    });
    const liabilityEditForm = reactive({
      id: "",
      portfolio_id: "",
      name: "",
      liability_type: "ETC",
      currency: "KRW",
      outstanding_balance: "",
      interest_rate: "",
      monthly_payment: "",
      source_type: "MANUAL",
      is_included: true,
      is_hidden: false,
      memo: "",
      edit_mode: "SAFE",
      effective_at: "",
      reason: "",
      original_portfolio_id: "",
      original_currency: "KRW"
    });
    const entityHistoryState = reactive({
      entity_type: "HOLDING",
      entity_id: 0,
      title: "",
      loading: false,
      reverting_id: 0,
      items: []
    });
    const secretForm = reactive({
      id: "",
      provider: "DATA_GO_KR",
      key_name: "",
      secret_value: "",
      description: "",
      is_active: true
    });
    const releaseNoteForm = reactive({
      id: "",
      released_at: "",
      title: "",
      summary: "",
      is_published: true
    });
    const canManageAssets = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
    const canManageQuotes = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
    const canManageAppSecrets = computed(() => me.value?.role === "ADMIN");
    const canManageReleaseNotes = computed(() => me.value?.role === "ADMIN");
    const canHardEdit = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
    const canManageEntityHistory = computed(() => canHardEdit.value);
    const isBusy = computed(() => loading.data || loading.action || loading.confirm);
    const selectedAssetForQuote = computed(() => assets.value.find((item) => String(item.id) === manualQuoteForm.asset_id) ?? null);
    const assetClassOptions = ["STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC"];
    const quoteModeOptions = ["AUTO", "MANUAL"];
    const holdingSourceTypeOptions = ["MANUAL", "AUTO"];
    const holdingCurrencyOptions = ["KRW", "USD"];
    const portfolioTypeOptions = ["BROKER", "EXCHANGE", "BANK", "CASH", "ETC"];
    const portfolioCategoryOptions = ["KR_STOCK", "US_STOCK", "CRYPTO", "REAL_ESTATE", "BOND", "CASH", "DEPOSIT_SAVING", "ETC"];
    const portfolioCashflowSourceTypeOptions = ["MANUAL", "AUTO"];
    const liabilityTypeOptions = ["MORTGAGE", "CREDIT_LOAN", "CARD", "ETC"];
    const liabilitySourceTypeOptions = ["MANUAL", "AUTO"];
    const totalPages = computed(() => Math.max(1, Math.ceil(assetsQuery.total / assetsQuery.pageSize)));
    const portfolioTotalPages = computed(() => Math.max(1, Math.ceil(portfolioQuery.total / portfolioQuery.pageSize)));
    const holdingTotalPages = computed(() => Math.max(1, Math.ceil(holdingQuery.total / holdingQuery.pageSize)));
    const liabilityTotalPages = computed(() => Math.max(1, Math.ceil(liabilityQuery.total / liabilityQuery.pageSize)));
    const sortedHoldingAssetOptions = computed(
      () => [...holdingAssetOptions.value].sort((a, b) => {
        const byName = a.name.localeCompare(b.name, "ko");
        if (byName !== 0) return byName;
        const byExchange = (a.exchange_code || "").localeCompare(b.exchange_code || "", "ko");
        if (byExchange !== 0) return byExchange;
        return a.id - b.id;
      })
    );
    const sortedHoldingPortfolioOptions = computed(
      () => [...holdingPortfolioOptions.value].sort((a, b) => {
        const byName = a.name.localeCompare(b.name, "ko");
        if (byName !== 0) return byName;
        return a.id - b.id;
      })
    );
    const cashBalanceAssetOptions = computed(
      () => sortedHoldingAssetOptions.value.filter((asset) => isCashBalanceAssetOption(asset))
    );
    const cashMapAssetOptions = computed(() => {
      const currency = normalizeUpper(portfolioCashMapForm.currency || "KRW");
      return cashBalanceAssetOptions.value.filter((asset) => normalizeUpper(asset.currency) === currency);
    });
    let searchDebounceTimer = null;
    let portfolioSearchDebounceTimer = null;
    let holdingSearchDebounceTimer = null;
    let liabilitySearchDebounceTimer = null;
    let quoteUpdatePollTimer = null;
    let refreshSequence = 0;
    const quoteUpdatePolling = ref(false);
    const quoteUpdateJobId = ref("");
    const quoteUpdateLastProcessed = ref(-1);
    const quoteUpdateJobStatus = ref("IDLE");
    const quoteUpdateProcessed = ref(0);
    const quoteUpdateTotal = ref(0);
    const quoteUpdateStatusLabel = computed(() => {
      if (quoteUpdatePolling.value) {
        const progress = quoteUpdateTotal.value > 0 ? ` ${quoteUpdateProcessed.value}/${quoteUpdateTotal.value}` : "";
        return `${quoteUpdateJobStatus.value}${progress}`;
      }
      return quoteUpdateJobStatus.value;
    });
    const quoteUpdateStatusClass = computed(() => {
      switch (quoteUpdateJobStatus.value) {
        case "QUEUED":
          return "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:bg-amber-900/20";
        case "RUNNING":
          return "border-sky-300 text-sky-700 bg-sky-50 dark:border-sky-800 dark:text-sky-200 dark:bg-sky-900/20";
        case "COMPLETED":
          return "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-200 dark:bg-emerald-900/20";
        case "FAILED":
          return "border-rose-300 text-rose-700 bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:bg-rose-900/20";
        default:
          return "border-slate-300 text-slate-600 bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800/40";
      }
    });
    const assetMetaJsonPlaceholder = `예시 (부동산) :
${realEstateMetaJsonExample}`;
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function formatDateTimeLocalInput(value) {
      return toDateTimeLocalSeoul(value);
    }
    function nowDateTimeLocalInput() {
      return toDateTimeLocalSeoul((/* @__PURE__ */ new Date()).toISOString());
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
    function formatQuantity(value) {
      const amount = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(amount)) return String(value);
      const fixed = amount.toFixed(8);
      const trimmed = fixed.replace(/\.?0+$/, "");
      const normalized = trimmed === "-0" ? "0" : trimmed;
      const [intPart, fracPart] = normalized.split(".");
      const grouped = Number(intPart).toLocaleString("ko-KR");
      return fracPart ? `${grouped}.${fracPart}` : grouped;
    }
    function formatPct(value) {
      if (value === null || value === void 0) return "-";
      const amount = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(amount)) return String(value);
      return `${amount.toFixed(2)}%`;
    }
    function formatFxRate(value) {
      const amount = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(amount)) return String(value);
      return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(amount);
    }
    function holdingCurrencyCode(item) {
      return normalizeUpper(item.current_price_currency || item.asset_currency || "KRW");
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
    function isCashBalanceAssetOption(asset) {
      const symbol = normalizeUpper(asset.symbol || "");
      if (symbol.startsWith("CASH_")) return true;
      const meta = asset.meta_json;
      if (!meta || typeof meta !== "object" || Array.isArray(meta)) return false;
      return normalizeUpper(String(meta.asset_subtype || "")) === "CASH_BALANCE";
    }
    function normalizeQuoteJobStatus(value) {
      const upper = String(value || "").toUpperCase();
      if (upper === "QUEUED" || upper === "RUNNING" || upper === "COMPLETED" || upper === "FAILED") {
        return upper;
      }
      return "RUNNING";
    }
    function clearQuoteUpdatePolling() {
      if (quoteUpdatePollTimer) {
        clearTimeout(quoteUpdatePollTimer);
        quoteUpdatePollTimer = null;
      }
      quoteUpdatePolling.value = false;
    }
    function applyQuoteUpdateJobResult(result) {
      pushLog(
        "Quote Update",
        "SUCCESS",
        `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`
      );
      if (result.fx_rate) {
        usdKrwFx.value = result.fx_rate;
        pushLog(
          "FX Update",
          "INFO",
          `${result.fx_rate.base_currency}/${result.fx_rate.quote_currency}=${formatFxRate(result.fx_rate.rate)} @ ${formatDateTime(result.fx_rate.as_of)}`
        );
      } else if (result.fx_error) {
        pushLog("FX Update", "ERROR", result.fx_error);
      }
    }
    function formatPortfolioPrincipalNet(item) {
      const aliased = Number(item.net_contribution_total);
      if (Number.isFinite(aliased)) {
        return formatMoney(aliased, item.base_currency);
      }
      const deposit = typeof item.cumulative_deposit_amount === "number" ? item.cumulative_deposit_amount : Number(item.cumulative_deposit_amount);
      const withdrawal = typeof item.cumulative_withdrawal_amount === "number" ? item.cumulative_withdrawal_amount : Number(item.cumulative_withdrawal_amount);
      if (!Number.isFinite(deposit) || !Number.isFinite(withdrawal)) return "-";
      return formatMoney(deposit - withdrawal, item.base_currency);
    }
    async function pollQuoteUpdateJob(jobId, startedAtMs) {
      try {
        const result = await getQuoteUpdateJobStatus(jobId);
        quoteUpdateJobStatus.value = normalizeQuoteJobStatus(result.status);
        const processed = Number(result.processed_assets || 0);
        const total = Number(result.total_assets || 0);
        quoteUpdateProcessed.value = processed;
        quoteUpdateTotal.value = total;
        if (processed !== quoteUpdateLastProcessed.value) {
          quoteUpdateLastProcessed.value = processed;
          pushLog("Quote Update", "INFO", `progress ${processed}/${total}`);
        }
        if (result.status === "COMPLETED") {
          clearQuoteUpdatePolling();
          applyQuoteUpdateJobResult(result);
          await refreshData({ logRefresh: false });
          return;
        }
        if (result.status === "FAILED") {
          clearQuoteUpdatePolling();
          const message = result.errors.length > 0 ? result.errors[result.errors.length - 1] ?? "Quote update job failed" : "Quote update job failed";
          pushLog("Quote Update", "ERROR", message);
          return;
        }
        if (Date.now() - startedAtMs > QUOTE_UPDATE_POLL_TIMEOUT_MS) {
          clearQuoteUpdatePolling();
          quoteUpdateJobStatus.value = "FAILED";
          pushLog("Quote Update", "ERROR", "Polling timeout. Check job status manually.");
          return;
        }
        quoteUpdatePollTimer = setTimeout(() => {
          void pollQuoteUpdateJob(jobId, startedAtMs);
        }, QUOTE_UPDATE_POLL_MS);
      } catch (error) {
        clearQuoteUpdatePolling();
        quoteUpdateJobStatus.value = "FAILED";
        pushLog("Quote Update", "ERROR", getErrorMessage(error));
      }
    }
    function applyQuoteToAssetRow(assetId, quote) {
      const index = assets.value.findIndex((item) => item.id === assetId);
      if (index < 0) return;
      const current = assets.value[index];
      if (!current) return;
      assets.value[index] = {
        ...current,
        quote_price: quote.price,
        quote_currency: quote.currency,
        quote_as_of: quote.as_of,
        quote_source: quote.source
      };
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
      manualQuoteForm.currency = normalizeUpper(item.currency || "KRW");
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
    function runAction(action, title, message, task, hooks) {
      askConfirm(title, message, async () => {
        hooks?.onStart?.();
        loading.action = true;
        try {
          await task();
          pushLog(action, "SUCCESS", "Completed");
          await refreshData();
        } catch (error) {
          pushLog(action, "ERROR", getErrorMessage(error));
        } finally {
          loading.action = false;
          hooks?.onFinally?.();
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
      if (quoteUpdatePolling.value) {
        pushLog("Quote Update", "INFO", `Already running (job=${quoteUpdateJobId.value || "-"})`);
        return;
      }
      runAction("Quote Update", "Update Quotes", "AUTO 모드의 모든 자산 시세를 즉시 갱신합니다.", async () => {
        const job = await updateQuotesNow();
        quoteUpdateJobId.value = job.job_id;
        quoteUpdateJobStatus.value = normalizeQuoteJobStatus(job.status);
        quoteUpdateProcessed.value = 0;
        quoteUpdateTotal.value = Number(job.total_assets || 0);
        quoteUpdatePolling.value = true;
        quoteUpdateLastProcessed.value = -1;
        pushLog("Quote Update", "INFO", `Job started: ${job.job_id} (assets=${job.total_assets})`);
        void pollQuoteUpdateJob(job.job_id, Date.now());
      });
    }
    function askQuoteTestAsset(item) {
      if (!canManageQuotes.value) {
        pushLog("Quote Test", "ERROR", "Admin/Maintainer only");
        return;
      }
      if (item.quote_mode !== "AUTO") {
        pushLog("Quote Test", "ERROR", "Quote Test is available only for AUTO mode assets");
        return;
      }
      selectAssetForQuote(item);
      runAction(
        "Quote Test",
        "Quote Test",
        `${item.name} (${item.exchange_code}) 현재가를 단건 테스트 갱신할까요?`,
        async () => {
          const result = await testQuoteForAsset(item.id);
          applyQuoteToAssetRow(item.id, result);
          pushLog("Quote Test", "INFO", `${item.name}: ${formatMoney(result.price, result.currency)} @ ${formatDateTime(result.as_of)}`);
        },
        {
          onStart: () => {
            quoteTestingAssetId.value = item.id;
          },
          onFinally: () => {
            quoteTestingAssetId.value = null;
          }
        }
      );
    }
    function askApplyManualQuote() {
      if (!canManageQuotes.value) {
        pushLog("Manual Quote", "ERROR", "Admin/Maintainer only");
        return;
      }
      if (!manualQuoteForm.asset_id.trim()) {
        pushLog("Manual Quote", "ERROR", "Asset is required");
        return;
      }
      const normalizedPrice = manualQuoteForm.price.trim().replace(/,/g, "");
      const parsedPrice = Number(normalizedPrice);
      if (!normalizedPrice || !Number.isFinite(parsedPrice)) {
        pushLog("Manual Quote", "ERROR", "Price must be a valid number");
        return;
      }
      if (parsedPrice < 0) {
        pushLog("Manual Quote", "ERROR", "Price must be 0 or greater");
        return;
      }
      const normalizedCurrency = normalizeUpper(manualQuoteForm.currency);
      if (!normalizedCurrency || normalizedCurrency.length !== 3) {
        pushLog("Manual Quote", "ERROR", "Currency must be 3 letters");
        return;
      }
      runAction("Manual Quote", "Manual Quote", "수동 시세를 반영할까요?", async () => {
        const payload = {
          asset_id: toPositiveInt(manualQuoteForm.asset_id),
          price: normalizedPrice,
          currency: normalizedCurrency,
          as_of: manualQuoteForm.as_of.trim() || null,
          source: manualQuoteForm.source.trim() || null
        };
        const result = await upsertManualQuote(payload);
        applyQuoteToAssetRow(result.asset_id, result);
      });
    }
    function resetSecretForm() {
      secretForm.id = "";
      secretForm.provider = "DATA_GO_KR";
      secretForm.key_name = "";
      secretForm.secret_value = "";
      secretForm.description = "";
      secretForm.is_active = true;
    }
    function fillSecretForm(item) {
      secretForm.id = String(item.id);
      secretForm.provider = item.provider;
      secretForm.key_name = item.key_name;
      secretForm.secret_value = "";
      secretForm.description = item.description || "";
      secretForm.is_active = item.is_active;
    }
    function submitSecretForm() {
      if (!canManageAppSecrets.value) {
        pushLog("Secret Vault", "ERROR", "ADMIN only");
        return;
      }
      try {
        const provider = normalizeUpper(secretForm.provider);
        const keyName = normalizeUpper(secretForm.key_name);
        const secretValue = secretForm.secret_value.trim();
        const description = secretForm.description.trim() || null;
        if (!provider) throw new Error("Provider is required");
        if (!keyName) throw new Error("Key name is required");
        if (!secretForm.id) {
          if (!secretValue) throw new Error("Secret value is required");
          runAction("Secret Create", "Create Secret", `Create ${provider}/${keyName}?`, async () => {
            await createAppSecret({
              provider,
              key_name: keyName,
              secret_value: secretValue,
              description
            });
            resetSecretForm();
          });
          return;
        }
        const secretId = toPositiveInt(secretForm.id);
        runAction("Secret Update", "Update Secret", `Update secret #${secretId}?`, async () => {
          await updateAppSecret(secretId, {
            secret_value: secretValue || void 0,
            description,
            is_active: secretForm.is_active
          });
          resetSecretForm();
        });
      } catch (error) {
        pushLog("Secret Vault", "ERROR", getErrorMessage(error));
      }
    }
    function askDeactivateSecret(item) {
      if (!canManageAppSecrets.value) {
        pushLog("Secret Vault", "ERROR", "ADMIN only");
        return;
      }
      runAction("Secret Deactivate", "Deactivate Secret", `Deactivate ${item.provider}/${item.key_name}?`, async () => {
        await deactivateAppSecret(item.id);
        if (secretForm.id === String(item.id)) {
          resetSecretForm();
        }
      });
    }
    function resetReleaseNoteForm() {
      releaseNoteForm.id = "";
      releaseNoteForm.released_at = "";
      releaseNoteForm.title = "";
      releaseNoteForm.summary = "";
      releaseNoteForm.is_published = true;
    }
    function fillReleaseNoteForm(item) {
      releaseNoteForm.id = String(item.id);
      releaseNoteForm.released_at = formatDateTimeLocalInput(item.released_at);
      releaseNoteForm.title = item.title;
      releaseNoteForm.summary = item.summary;
      releaseNoteForm.is_published = item.is_published;
    }
    function submitReleaseNoteForm() {
      if (!canManageReleaseNotes.value) {
        pushLog("Release Note", "ERROR", "ADMIN only");
        return;
      }
      try {
        const title = releaseNoteForm.title.trim();
        const summary = releaseNoteForm.summary.trim();
        if (!title) throw new Error("Title is required");
        if (!summary) throw new Error("Summary is required");
        const releasedAt = releaseNoteForm.released_at.trim();
        const payload = {
          released_at: releasedAt ? new Date(releasedAt).toISOString() : null,
          title,
          summary,
          is_published: releaseNoteForm.is_published
        };
        if (!releaseNoteForm.id) {
          runAction("Release Note Create", "Create Release Note", "새 Release Note를 생성할까요?", async () => {
            await createReleaseNote(payload);
            resetReleaseNoteForm();
          });
          return;
        }
        const releaseNoteId = toPositiveInt(releaseNoteForm.id);
        runAction("Release Note Update", "Update Release Note", `Release Note #${releaseNoteId}를 수정할까요?`, async () => {
          await updateReleaseNote(releaseNoteId, payload);
          resetReleaseNoteForm();
        });
      } catch (error) {
        pushLog("Release Note", "ERROR", getErrorMessage(error));
      }
    }
    function askUnpublishReleaseNote(item) {
      if (!canManageReleaseNotes.value) {
        pushLog("Release Note", "ERROR", "ADMIN only");
        return;
      }
      runAction("Release Note Unpublish", "Unpublish Release Note", `Release Note #${item.id}를 비공개 처리할까요?`, async () => {
        await unpublishReleaseNote(item.id);
        if (releaseNoteForm.id === String(item.id)) {
          resetReleaseNoteForm();
        }
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
    function parseEffectiveAt(value) {
      const trimmed = value.trim();
      if (!trimmed) throw new Error("effective_at is required");
      const parsed = new Date(trimmed);
      if (Number.isNaN(parsed.getTime())) throw new Error("effective_at is invalid");
      return parsed.toISOString();
    }
    async function loadHoldingLookupOptions(force = false) {
      if (lookupLoading.value) return;
      if (!force && holdingAssetOptions.value.length > 0 && holdingPortfolioOptions.value.length > 0) return;
      lookupLoading.value = true;
      try {
        const [assetsOut, portfoliosOut] = await Promise.all([getAssets(), getPortfolios()]);
        holdingAssetOptions.value = assetsOut;
        holdingPortfolioOptions.value = portfoliosOut;
        if (holdingForm.asset_id && !assetsOut.some((item) => String(item.id) === holdingForm.asset_id)) {
          holdingForm.asset_id = "";
        }
        if (holdingForm.portfolio_id && !portfoliosOut.some((item) => String(item.id) === holdingForm.portfolio_id)) {
          holdingForm.portfolio_id = "";
        }
      } catch (error) {
        pushLog("Holding Lookup", "ERROR", getErrorMessage(error));
      } finally {
        lookupLoading.value = false;
      }
    }
    function toggleQuickCreateHolding() {
      quickCreateHoldingOpen.value = !quickCreateHoldingOpen.value;
      if (quickCreateHoldingOpen.value) {
        void loadHoldingLookupOptions(true);
      }
    }
    function toggleQuickCreateLiability() {
      quickCreateLiabilityOpen.value = !quickCreateLiabilityOpen.value;
      if (quickCreateLiabilityOpen.value) {
        void loadHoldingLookupOptions(true);
      }
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
            cashflow_source_type: portfolioForm.cashflow_source_type.trim() || "MANUAL",
            memo: portfolioForm.memo.trim() || null
          });
          portfolioForm.name = "";
          portfolioForm.type = "ETC";
          portfolioForm.base_currency = "KRW";
          portfolioForm.category = "ETC";
          portfolioForm.cashflow_source_type = "MANUAL";
          portfolioForm.memo = "";
          portfolioForm.exchange_code = "";
          quickCreatePortfolioOpen.value = false;
        });
      } catch (error) {
        pushLog("Portfolio Create", "ERROR", getErrorMessage(error));
      }
    }
    function fillPortfolioEditForm(item) {
      portfolioEditForm.id = String(item.id);
      portfolioEditForm.name = item.name;
      portfolioEditForm.type = item.type || "ETC";
      portfolioEditForm.base_currency = item.base_currency || "KRW";
      portfolioEditForm.exchange_code = item.exchange_code || "";
      portfolioEditForm.category = item.category || "";
      portfolioEditForm.cashflow_source_type = item.cashflow_source_type || "MANUAL";
      portfolioEditForm.cumulative_deposit_amount = String(item.cumulative_deposit_amount ?? "0");
      portfolioEditForm.cumulative_withdrawal_amount = String(item.cumulative_withdrawal_amount ?? "0");
      portfolioEditForm.is_included = item.is_included;
      portfolioEditForm.is_hidden = item.is_hidden;
      portfolioEditForm.memo = item.memo || "";
      portfolioEditForm.edit_mode = "SAFE";
      portfolioEditForm.effective_at = nowDateTimeLocalInput();
      portfolioEditForm.reason = "";
    }
    function openEditPortfolioModal(item) {
      if (!canManageAssets.value) {
        pushLog("Portfolio Edit", "ERROR", "Admin/Maintainer only");
        return;
      }
      fillPortfolioEditForm(item);
      portfolioEditModal.open = true;
    }
    function closePortfolioEditModal() {
      if (loading.action || loading.confirm) return;
      portfolioEditModal.open = false;
    }
    function submitPortfolioEdit() {
      if (!canManageAssets.value) {
        pushLog("Portfolio Edit", "ERROR", "Admin/Maintainer only");
        return;
      }
      try {
        const portfolioId = toPositiveInt(portfolioEditForm.id);
        const name = portfolioEditForm.name.trim();
        if (!name) throw new Error("Portfolio name is required");
        const baseCurrency = normalizeUpper(portfolioEditForm.base_currency);
        if (baseCurrency.length !== 3) throw new Error("Base currency must be 3 letters");
        const deposit = parseRequiredDecimal(portfolioEditForm.cumulative_deposit_amount, "Cumulative deposit");
        const withdrawal = parseRequiredDecimal(portfolioEditForm.cumulative_withdrawal_amount, "Cumulative withdrawal");
        const editMode = portfolioEditForm.edit_mode;
        if (editMode === "HARD" && !canHardEdit.value) {
          throw new Error("HARD edit requires MAINTAINER+");
        }
        closePortfolioEditModal();
        runAction(
          "Portfolio Update",
          "Apply Portfolio Update",
          editMode === "SAFE" ? `Portfolio #${portfolioId}를 Rebaseline 기준으로 수정할까요? (기준일 이전 DEPOSIT/WITHDRAW VOID)` : `Portfolio #${portfolioId}를 HARD 모드로 수정할까요? (다음 sync/rebuild에서 덮어써질 수 있음)`,
          async () => {
            if (editMode === "SAFE") {
              const rebaselinePayload = {
                effective_at: parseEffectiveAt(portfolioEditForm.effective_at),
                cumulative_deposit_amount: deposit,
                cumulative_withdrawal_amount: withdrawal,
                reason: portfolioEditForm.reason.trim() || null
              };
              const rebased = await rebaselinePortfolio(portfolioId, rebaselinePayload);
              pushLog(
                "Portfolio Rebaseline",
                "INFO",
                `voided=${rebased.voided_transactions}, baseline=${rebased.baseline_transaction_ids.join(",") || "-"}`
              );
              await updatePortfolio(
                portfolioId,
                {
                  name,
                  type: portfolioEditForm.type.trim() || "ETC",
                  base_currency: baseCurrency,
                  exchange_code: normalizeUpper(portfolioEditForm.exchange_code) || null,
                  category: portfolioEditForm.category.trim() || null,
                  cashflow_source_type: portfolioEditForm.cashflow_source_type.trim() || "MANUAL",
                  is_included: portfolioEditForm.is_included,
                  is_hidden: portfolioEditForm.is_hidden,
                  memo: portfolioEditForm.memo.trim() || null
                },
                { edit_mode: "SAFE" }
              );
              return;
            }
            await updatePortfolio(
              portfolioId,
              {
                name,
                type: portfolioEditForm.type.trim() || "ETC",
                base_currency: baseCurrency,
                exchange_code: normalizeUpper(portfolioEditForm.exchange_code) || null,
                category: portfolioEditForm.category.trim() || null,
                cashflow_source_type: portfolioEditForm.cashflow_source_type.trim() || "MANUAL",
                cumulative_deposit_amount: deposit,
                cumulative_withdrawal_amount: withdrawal,
                is_included: portfolioEditForm.is_included,
                is_hidden: portfolioEditForm.is_hidden,
                memo: portfolioEditForm.memo.trim() || null
              },
              { edit_mode: "HARD" }
            );
          }
        );
      } catch (error) {
        pushLog("Portfolio Edit", "ERROR", getErrorMessage(error));
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
    async function loadPortfolioCashAccounts() {
      const portfolioId = parseOptionalInt(portfolioCashMapForm.portfolio_id);
      if (!portfolioId) {
        portfolioCashAccounts.value = [];
        portfolioCashMapForm.asset_id = "";
        return;
      }
      cashAccountLookupLoading.value = true;
      try {
        await loadHoldingLookupOptions();
        const rows = await getPortfolioCashAccounts(portfolioId);
        portfolioCashAccounts.value = rows;
        const byCurrency = rows.find((row) => normalizeUpper(row.currency) === normalizeUpper(portfolioCashMapForm.currency));
        portfolioCashMapForm.asset_id = byCurrency ? String(byCurrency.asset_id) : "";
      } catch (error) {
        pushLog("Cash Mapping", "ERROR", getErrorMessage(error));
      } finally {
        cashAccountLookupLoading.value = false;
      }
    }
    function submitPortfolioCashMapping() {
      if (!canManageAssets.value) {
        pushLog("Cash Mapping", "ERROR", "Admin/Maintainer only");
        return;
      }
      try {
        const portfolioId = toPositiveInt(portfolioCashMapForm.portfolio_id);
        const currency = normalizeUpper(portfolioCashMapForm.currency);
        if (!currency) throw new Error("Currency is required");
        if (currency.length !== 3) throw new Error("Currency must be 3 letters");
        const assetId = toPositiveInt(portfolioCashMapForm.asset_id);
        runAction(
          "Cash Mapping",
          "Apply Cash Mapping",
          `Portfolio #${portfolioId} ${currency} 대표 cash asset을 #${assetId}로 변경할까요?`,
          async () => {
            await setPortfolioCashAccount(portfolioId, currency, { asset_id: assetId });
            await loadPortfolioCashAccounts();
          }
        );
      } catch (error) {
        pushLog("Cash Mapping", "ERROR", getErrorMessage(error));
      }
    }
    function submitHoldingCreate() {
      try {
        const assetId = toPositiveInt(holdingForm.asset_id.trim());
        const quantity = parseRequiredDecimal(holdingForm.quantity, "Quantity");
        const avgPrice = parseRequiredDecimal(holdingForm.avg_price, "Avg cost");
        runAction("Holding Create", "Create Holding", "새 보유자산을 생성할까요?", async () => {
          await createHolding({
            portfolio_id: parseOptionalInt(holdingForm.portfolio_id),
            asset_id: assetId,
            quantity,
            avg_price: avgPrice,
            avg_price_currency: normalizeUpper(holdingForm.avg_price_currency) || "KRW",
            invested_amount: parseOptionalDecimal(holdingForm.invested_amount),
            invested_amount_currency: normalizeUpper(holdingForm.invested_amount_currency) || "KRW",
            source_type: holdingForm.source_type.trim() || "MANUAL",
            memo: holdingForm.memo.trim() || null
          });
          holdingForm.asset_id = "";
          holdingForm.quantity = "";
          holdingForm.avg_price = "";
          holdingForm.avg_price_currency = "KRW";
          holdingForm.invested_amount = "";
          holdingForm.invested_amount_currency = "KRW";
          holdingForm.memo = "";
          quickCreateHoldingOpen.value = false;
        });
      } catch (error) {
        pushLog("Holding Create", "ERROR", getErrorMessage(error));
      }
    }
    function fillHoldingEditForm(item) {
      holdingEditForm.id = String(item.id);
      holdingEditForm.portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
      holdingEditForm.asset_id = String(item.asset_id);
      holdingEditForm.quantity = String(item.quantity);
      holdingEditForm.avg_price = String(item.avg_price);
      holdingEditForm.avg_price_currency = item.avg_price_currency || "KRW";
      holdingEditForm.invested_amount = item.invested_amount === null ? "" : String(item.invested_amount);
      holdingEditForm.invested_amount_currency = item.invested_amount_currency || "KRW";
      holdingEditForm.source_type = item.source_type || "MANUAL";
      holdingEditForm.is_hidden = item.is_hidden;
      holdingEditForm.memo = item.memo || "";
      holdingEditForm.edit_mode = "SAFE";
      holdingEditForm.effective_at = nowDateTimeLocalInput();
      holdingEditForm.reason = "";
      holdingEditForm.original_portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
      holdingEditForm.original_asset_id = String(item.asset_id);
    }
    function openEditHoldingModal(item) {
      fillHoldingEditForm(item);
      holdingEditModal.open = true;
      void loadHoldingLookupOptions(true);
    }
    function closeHoldingEditModal() {
      if (loading.action || loading.confirm) return;
      holdingEditModal.open = false;
    }
    function submitHoldingEdit() {
      try {
        const holdingId = toPositiveInt(holdingEditForm.id);
        const assetId = toPositiveInt(holdingEditForm.asset_id);
        const quantity = parseRequiredDecimal(holdingEditForm.quantity, "Quantity");
        const avgPrice = parseRequiredDecimal(holdingEditForm.avg_price, "Avg cost");
        const editMode = holdingEditForm.edit_mode;
        if (editMode === "HARD" && !canHardEdit.value) {
          throw new Error("HARD edit requires MAINTAINER+");
        }
        const nextPortfolioId = holdingEditForm.portfolio_id.trim();
        if (editMode === "SAFE" && nextPortfolioId !== holdingEditForm.original_portfolio_id) {
          throw new Error("SAFE(Rebaseline) mode에서는 portfolio 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
        }
        if (editMode === "SAFE" && String(assetId) !== holdingEditForm.original_asset_id) {
          throw new Error("SAFE(Rebaseline) mode에서는 asset 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
        }
        closeHoldingEditModal();
        runAction(
          "Holding Update",
          "Apply Holding Update",
          editMode === "SAFE" ? `Holding #${holdingId}를 Rebaseline 기준으로 수정할까요? (기준일 이전 BUY/SELL VOID)` : `Holding #${holdingId}를 HARD 모드로 수정할까요? (다음 sync/rebuild에서 덮어써질 수 있음)`,
          async () => {
            if (editMode === "SAFE") {
              const rebaselinePayload = {
                effective_at: parseEffectiveAt(holdingEditForm.effective_at),
                quantity,
                avg_price: avgPrice,
                avg_price_currency: normalizeUpper(holdingEditForm.avg_price_currency) || "KRW",
                invested_amount: parseOptionalDecimal(holdingEditForm.invested_amount),
                invested_amount_currency: normalizeUpper(holdingEditForm.invested_amount_currency) || "KRW",
                reason: holdingEditForm.reason.trim() || null
              };
              const rebased = await rebaselineHolding(holdingId, rebaselinePayload);
              pushLog(
                "Holding Rebaseline",
                "INFO",
                `voided=${rebased.voided_transactions}, baseline=${rebased.baseline_transaction_ids.join(",") || "-"}`
              );
              await updateHolding(
                holdingId,
                {
                  is_hidden: holdingEditForm.is_hidden,
                  memo: holdingEditForm.memo.trim() || null
                },
                { edit_mode: "SAFE" }
              );
              return;
            }
            await updateHolding(
              holdingId,
              {
                portfolio_id: parseOptionalInt(holdingEditForm.portfolio_id),
                asset_id: assetId,
                quantity,
                avg_price: avgPrice,
                avg_price_currency: normalizeUpper(holdingEditForm.avg_price_currency) || "KRW",
                invested_amount: parseOptionalDecimal(holdingEditForm.invested_amount),
                invested_amount_currency: normalizeUpper(holdingEditForm.invested_amount_currency) || "KRW",
                source_type: holdingEditForm.source_type.trim() || "MANUAL",
                is_hidden: holdingEditForm.is_hidden,
                memo: holdingEditForm.memo.trim() || null
              },
              { edit_mode: "HARD" }
            );
          }
        );
      } catch (error) {
        pushLog("Holding Edit", "ERROR", getErrorMessage(error));
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
          const created = await createLiability({
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
          if (created.auto_cash_holding_created) {
            pushLog(
              "Auto Cash Holding",
              "INFO",
              `Auto cash holding created (${currency}) for portfolio #${created.portfolio_id ?? "-"}.`
            );
          }
          liabilityForm.portfolio_id = "";
          liabilityForm.name = "";
          liabilityForm.liability_type = "ETC";
          liabilityForm.currency = "KRW";
          liabilityForm.outstanding_balance = "";
          liabilityForm.interest_rate = "";
          liabilityForm.monthly_payment = "";
          liabilityForm.source_type = "MANUAL";
          liabilityForm.memo = "";
          quickCreateLiabilityOpen.value = false;
        });
      } catch (error) {
        pushLog("Liability Create", "ERROR", getErrorMessage(error));
      }
    }
    function fillLiabilityEditForm(item) {
      liabilityEditForm.id = String(item.id);
      liabilityEditForm.portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
      liabilityEditForm.name = item.name;
      liabilityEditForm.liability_type = item.liability_type || "ETC";
      liabilityEditForm.currency = item.currency || "KRW";
      liabilityEditForm.outstanding_balance = String(item.outstanding_balance);
      liabilityEditForm.interest_rate = item.interest_rate === null ? "" : String(item.interest_rate);
      liabilityEditForm.monthly_payment = item.monthly_payment === null ? "" : String(item.monthly_payment);
      liabilityEditForm.source_type = item.source_type || "MANUAL";
      liabilityEditForm.is_included = item.is_included;
      liabilityEditForm.is_hidden = item.is_hidden;
      liabilityEditForm.memo = item.memo || "";
      liabilityEditForm.edit_mode = "SAFE";
      liabilityEditForm.effective_at = nowDateTimeLocalInput();
      liabilityEditForm.reason = "";
      liabilityEditForm.original_portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
      liabilityEditForm.original_currency = item.currency || "KRW";
    }
    function openEditLiabilityModal(item) {
      fillLiabilityEditForm(item);
      liabilityEditModal.open = true;
      void loadHoldingLookupOptions(true);
    }
    function closeLiabilityEditModal() {
      if (loading.action || loading.confirm) return;
      liabilityEditModal.open = false;
    }
    function submitLiabilityEdit() {
      try {
        const liabilityId = toPositiveInt(liabilityEditForm.id);
        const name = liabilityEditForm.name.trim();
        if (!name) throw new Error("Liability name is required");
        const balance = parseRequiredDecimal(liabilityEditForm.outstanding_balance, "Outstanding balance");
        const currency = normalizeUpper(liabilityEditForm.currency);
        if (currency.length !== 3) throw new Error("Currency must be 3 letters");
        const editMode = liabilityEditForm.edit_mode;
        if (editMode === "HARD" && !canHardEdit.value) {
          throw new Error("HARD edit requires MAINTAINER+");
        }
        if (editMode === "SAFE" && liabilityEditForm.portfolio_id.trim() !== liabilityEditForm.original_portfolio_id) {
          throw new Error("SAFE(Rebaseline) mode에서는 portfolio 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
        }
        if (editMode === "SAFE" && currency !== normalizeUpper(liabilityEditForm.original_currency)) {
          throw new Error("SAFE(Rebaseline) mode에서는 currency 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
        }
        closeLiabilityEditModal();
        runAction(
          "Liability Update",
          "Apply Liability Update",
          editMode === "SAFE" ? `Liability #${liabilityId}를 Rebaseline 기준으로 수정할까요? (기준일 이전 LOAN_BORROW/LOAN_REPAY VOID)` : `Liability #${liabilityId}를 HARD 모드로 수정할까요? (다음 sync/rebuild에서 덮어써질 수 있음)`,
          async () => {
            if (editMode === "SAFE") {
              const rebaselinePayload = {
                effective_at: parseEffectiveAt(liabilityEditForm.effective_at),
                outstanding_balance: balance,
                reason: liabilityEditForm.reason.trim() || null
              };
              const rebased = await rebaselineLiability(liabilityId, rebaselinePayload);
              pushLog(
                "Liability Rebaseline",
                "INFO",
                `voided=${rebased.voided_transactions}, baseline=${rebased.baseline_transaction_ids.join(",") || "-"}`
              );
              const updatedSafe = await updateLiability(
                liabilityId,
                {
                  name,
                  liability_type: liabilityEditForm.liability_type.trim() || "ETC",
                  interest_rate: parseOptionalDecimal(liabilityEditForm.interest_rate),
                  monthly_payment: parseOptionalDecimal(liabilityEditForm.monthly_payment),
                  source_type: liabilityEditForm.source_type.trim() || "MANUAL",
                  is_included: liabilityEditForm.is_included,
                  is_hidden: liabilityEditForm.is_hidden,
                  memo: liabilityEditForm.memo.trim() || null
                },
                { edit_mode: "SAFE" }
              );
              if (updatedSafe.auto_cash_holding_created) {
                pushLog(
                  "Auto Cash Holding",
                  "INFO",
                  `Auto cash holding created (${currency}) for portfolio #${updatedSafe.portfolio_id ?? "-"}.`
                );
              }
              return;
            }
            const updatedHard = await updateLiability(
              liabilityId,
              {
                portfolio_id: parseOptionalInt(liabilityEditForm.portfolio_id),
                name,
                liability_type: liabilityEditForm.liability_type.trim() || "ETC",
                currency,
                outstanding_balance: balance,
                interest_rate: parseOptionalDecimal(liabilityEditForm.interest_rate),
                monthly_payment: parseOptionalDecimal(liabilityEditForm.monthly_payment),
                source_type: liabilityEditForm.source_type.trim() || "MANUAL",
                is_included: liabilityEditForm.is_included,
                is_hidden: liabilityEditForm.is_hidden,
                memo: liabilityEditForm.memo.trim() || null
              },
              { edit_mode: "HARD" }
            );
            if (updatedHard.auto_cash_holding_created) {
              pushLog(
                "Auto Cash Holding",
                "INFO",
                `Auto cash holding created (${currency}) for portfolio #${updatedHard.portfolio_id ?? "-"}.`
              );
            }
          }
        );
      } catch (error) {
        pushLog("Liability Edit", "ERROR", getErrorMessage(error));
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
    async function loadEntityHistory(entityType, entityId, title) {
      entityHistoryState.entity_type = entityType;
      entityHistoryState.entity_id = entityId;
      entityHistoryState.title = title;
      entityHistoryState.loading = true;
      try {
        const page = await getEntityHistory({
          entity_type: entityType,
          entity_id: entityId,
          page: 1,
          page_size: 30,
          sort_by: "created_at",
          sort_order: "desc"
        });
        entityHistoryState.items = page.items;
      } catch (error) {
        pushLog("Entity History", "ERROR", getErrorMessage(error));
        entityHistoryState.items = [];
      } finally {
        entityHistoryState.loading = false;
      }
    }
    function openEntityHistory(entityType, entityId, title) {
      entityHistoryModal.open = true;
      void loadEntityHistory(entityType, entityId, title);
    }
    function closeEntityHistory() {
      if (loading.action || loading.confirm) return;
      entityHistoryModal.open = false;
      entityHistoryState.reverting_id = 0;
    }
    function askRevertEntityHistory(item) {
      runAction(
        "Entity Revert",
        "Revert Change",
        `History #${item.id} 변경을 원복할까요?`,
        async () => {
          entityHistoryState.reverting_id = item.id;
          await revertEntityHistory(item.id);
          await loadEntityHistory(
            entityHistoryState.entity_type,
            entityHistoryState.entity_id,
            entityHistoryState.title
          );
        },
        {
          onFinally: () => {
            entityHistoryState.reverting_id = 0;
          }
        }
      );
    }
    async function refreshData(options) {
      const refreshId = ++refreshSequence;
      const shouldLogRefresh = options?.logRefresh ?? true;
      loading.data = true;
      try {
        const meOut = await getMe();
        const [assetsOut, portfoliosOut, holdingsOut, liabilitiesOut, fxOut, staleOut, secretsOut, releaseNotesOut] = await Promise.all([
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
            display_currency: displayCurrency.value,
            q: portfolioQuery.q.trim() || void 0
          }),
          getHoldingsTable({
            page: holdingQuery.page,
            page_size: holdingQuery.pageSize,
            sort_by: holdingQuery.sortBy,
            sort_order: holdingQuery.sortOrder,
            display_currency: displayCurrency.value,
            q: holdingQuery.q.trim() || void 0
          }),
          getLiabilitiesTable({
            page: liabilityQuery.page,
            page_size: liabilityQuery.pageSize,
            sort_by: liabilityQuery.sortBy,
            sort_order: liabilityQuery.sortOrder,
            display_currency: displayCurrency.value,
            q: liabilityQuery.q.trim() || void 0
          }),
          getLatestUsdKrwFxRate().catch(() => null),
          getFxStaleMinutes().catch(() => null),
          meOut.role === "ADMIN" ? listAppSecrets() : Promise.resolve([]),
          meOut.role === "ADMIN" ? getReleaseNotes({ limit: 100, offset: 0, include_unpublished: true }) : Promise.resolve([])
        ]);
        if (refreshId !== refreshSequence) return;
        me.value = meOut;
        assets.value = assetsOut.items;
        portfolioRows.value = portfoliosOut.items;
        holdingRows.value = holdingsOut.items;
        liabilityRows.value = liabilitiesOut.items;
        usdKrwFx.value = fxOut;
        if (staleOut) {
          fxStaleMinutesForm.value = String(staleOut.minutes);
          fxStaleSource.value = staleOut.source;
        }
        appSecrets.value = secretsOut;
        releaseNotes.value = releaseNotesOut;
        assetsQuery.total = assetsOut.total;
        portfolioQuery.total = portfoliosOut.total;
        holdingQuery.total = holdingsOut.total;
        liabilityQuery.total = liabilitiesOut.total;
        if (portfolioCashMapForm.portfolio_id && !portfoliosOut.items.some((item) => String(item.id) === portfolioCashMapForm.portfolio_id)) {
          portfolioCashMapForm.portfolio_id = "";
          portfolioCashAccounts.value = [];
          portfolioCashMapForm.asset_id = "";
        }
        const firstPortfolio = portfoliosOut.items[0];
        if (!portfolioCashMapForm.portfolio_id && firstPortfolio) {
          portfolioCashMapForm.portfolio_id = String(firstPortfolio.id);
        }
        if (!portfolioCashMapForm.currency) {
          portfolioCashMapForm.currency = "KRW";
        }
        const selectedStillExists = assetsOut.items.some((item) => String(item.id) === manualQuoteForm.asset_id);
        if (!selectedStillExists) {
          manualQuoteForm.asset_id = assetsOut.items[0] ? String(assetsOut.items[0].id) : "";
        }
        if (meOut.role !== "ADMIN") {
          resetSecretForm();
          resetReleaseNoteForm();
        }
        if (shouldLogRefresh) {
          const adminInfo = meOut.role === "ADMIN" ? `, secrets=${secretsOut.length}, release_notes=${releaseNotesOut.length}` : "";
          pushLog(
            "Refresh",
            "INFO",
            `Agent data loaded (assets=${assetsOut.total}, portfolios=${portfoliosOut.total}, holdings=${holdingsOut.total}, liabilities=${liabilitiesOut.total}${adminInfo})`
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
    watch(
      () => portfolioCashMapForm.portfolio_id,
      () => {
        void loadPortfolioCashAccounts();
      }
    );
    watch(
      () => portfolioCashMapForm.currency,
      () => {
        const byCurrency = portfolioCashAccounts.value.find(
          (row) => normalizeUpper(row.currency) === normalizeUpper(portfolioCashMapForm.currency)
        );
        portfolioCashMapForm.asset_id = byCurrency ? String(byCurrency.asset_id) : "";
      }
    );
    watch(
      () => manualQuoteForm.asset_id,
      (next) => {
        if (!next) return;
        const selected = assets.value.find((item) => String(item.id) === next);
        if (!selected) return;
        manualQuoteForm.currency = normalizeUpper(selected.currency || "KRW");
      }
    );
    watch(
      [
        quoteActionsCollapsed,
        secretsVaultCollapsed,
        releaseNotesSectionCollapsed,
        assetsSectionCollapsed,
        portfoliosSectionCollapsed,
        holdingsSectionCollapsed,
        liabilitiesSectionCollapsed
      ],
      (values) => {
        const [
          nextQuoteActionsCollapsed,
          nextSecretsVaultCollapsed,
          nextReleaseNotesSectionCollapsed,
          nextAssetsSectionCollapsed,
          nextPortfoliosSectionCollapsed,
          nextHoldingsSectionCollapsed,
          nextLiabilitiesSectionCollapsed
        ] = values;
        saveCollapseState({
          quoteActionsCollapsed: nextQuoteActionsCollapsed,
          secretsVaultCollapsed: nextSecretsVaultCollapsed,
          releaseNotesSectionCollapsed: nextReleaseNotesSectionCollapsed,
          assetsSectionCollapsed: nextAssetsSectionCollapsed,
          portfoliosSectionCollapsed: nextPortfoliosSectionCollapsed,
          holdingsSectionCollapsed: nextHoldingsSectionCollapsed,
          liabilitiesSectionCollapsed: nextLiabilitiesSectionCollapsed
        });
      }
    );
    watch(
      () => displayCurrency.value,
      (next, prev) => {
        if (me.value && prev && next !== prev) {
          void refreshData({ logRefresh: false });
        }
      }
    );
    onMounted(async () => {
      await ensureInitialized();
      await refreshData();
    });
    onBeforeUnmount(() => {
      clearSearchDebounce();
      clearPortfolioSearchDebounce();
      clearHoldingSearchDebounce();
      clearLiabilitySearchDebounce();
      clearQuoteUpdatePolling();
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock(_Fragment, null, [
        _createElementVNode("section", _hoisted_1, [
          _createElementVNode("header", _hoisted_2, [
            _createElementVNode("div", _hoisted_3, [
              _createElementVNode("div", null, [
                _cache[173] || (_cache[173] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300" }, "Agent", -1)),
                _cache[174] || (_cache[174] = _createElementVNode("h1", { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Asset Control Console", -1)),
                _createElementVNode("p", _hoisted_4, "Role: " + _toDisplayString(me.value?.role || "-") + " / " + _toDisplayString(me.value?.email || "-"), 1)
              ]),
              _createElementVNode("div", _hoisted_5, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[0] || (_cache[0] = ($event) => refreshData())
                }, _toDisplayString(loading.data ? "Loading..." : "Refresh Data"), 9, _hoisted_6)
              ])
            ])
          ]),
          _createElementVNode("article", _hoisted_7, [
            _createElementVNode("div", _hoisted_8, [
              _cache[175] || (_cache[175] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Secrets Vault (Admin)"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Manage exchange/broker/bank/API credentials by provider+key. List values are masked.")
              ], -1)),
              _createElementVNode("div", _hoisted_9, [
                canManageAppSecrets.value && !secretsVaultCollapsed.value ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: resetSecretForm
                }, " Reset Form ", 8, _hoisted_10)) : _createCommentVNode("", true),
                canManageAppSecrets.value ? (_openBlock(), _createElementBlock("button", {
                  key: 1,
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[1] || (_cache[1] = ($event) => secretsVaultCollapsed.value = !secretsVaultCollapsed.value)
                }, _toDisplayString(secretsVaultCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_11)) : _createCommentVNode("", true)
              ])
            ]),
            !canManageAppSecrets.value ? (_openBlock(), _createElementBlock("p", _hoisted_12, " Only ADMIN can view/create/update/deactivate secrets. ")) : secretsVaultCollapsed.value ? (_openBlock(), _createElementBlock("p", _hoisted_13, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.")) : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _createElementVNode("div", _hoisted_14, [
                _createElementVNode("label", _hoisted_15, [
                  _cache[176] || (_cache[176] = _createTextVNode("Provider ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => secretForm.provider = $event),
                    placeholder: "e.g. DATA_GO_KR / UPBIT / KIWOOM / KORBANK",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, secretForm.provider]
                  ])
                ]),
                _createElementVNode("label", _hoisted_16, [
                  _cache[177] || (_cache[177] = _createTextVNode("Key Name ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => secretForm.key_name = $event),
                    placeholder: "e.g. SERVICE_KEY / ACCESS_TOKEN",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, secretForm.key_name]
                  ])
                ]),
                _createElementVNode("label", _hoisted_17, [
                  _createTextVNode("Secret Value " + _toDisplayString(secretForm.id ? "(leave blank to keep current value)" : "") + " ", 1),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => secretForm.secret_value = $event),
                    type: "password",
                    placeholder: "actual token/key",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, secretForm.secret_value]
                  ])
                ]),
                _createElementVNode("label", _hoisted_18, [
                  _cache[178] || (_cache[178] = _createTextVNode("Description ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => secretForm.description = $event),
                    placeholder: "description (optional)",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, secretForm.description]
                  ])
                ]),
                _createElementVNode("label", _hoisted_19, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => secretForm.is_active = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, secretForm.is_active]
                  ]),
                  _cache[179] || (_cache[179] = _createElementVNode("span", { class: "ml-1" }, "Active", -1))
                ])
              ]),
              _createElementVNode("div", _hoisted_20, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500",
                  disabled: isBusy.value,
                  onClick: submitSecretForm
                }, _toDisplayString(secretForm.id ? "Update Secret" : "Create Secret"), 9, _hoisted_21),
                secretForm.id ? (_openBlock(), _createElementBlock("span", _hoisted_22, "Editing #" + _toDisplayString(secretForm.id), 1)) : _createCommentVNode("", true)
              ]),
              _createElementVNode("div", _hoisted_23, [
                _createElementVNode("table", _hoisted_24, [
                  _cache[181] || (_cache[181] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "ID"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Provider"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Key"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Masked"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Active"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Updated"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action")
                    ])
                  ], -1)),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(appSecrets.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_25, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_26, _toDisplayString(item.provider), 1),
                        _createElementVNode("td", _hoisted_27, _toDisplayString(item.key_name), 1),
                        _createElementVNode("td", _hoisted_28, _toDisplayString(item.masked_value), 1),
                        _createElementVNode("td", _hoisted_29, _toDisplayString(item.is_active ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_30, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_31, [
                          _createElementVNode("div", _hoisted_32, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => fillSecretForm(item)
                            }, " Edit ", 8, _hoisted_33),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                              disabled: isBusy.value || !item.is_active,
                              onClick: ($event) => askDeactivateSecret(item)
                            }, " Disable ", 8, _hoisted_34)
                          ])
                        ])
                      ]);
                    }), 128)),
                    appSecrets.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_35, [..._cache[180] || (_cache[180] = [
                      _createElementVNode("td", {
                        colspan: "7",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No secrets registered", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ])
            ], 64))
          ]),
          _createElementVNode("article", _hoisted_36, [
            _createElementVNode("div", _hoisted_37, [
              _cache[182] || (_cache[182] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Current Assets Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "현재 등록된 자산 목록과 상태입니다. 행 클릭 시 Quote Actions와 동기화됩니다.")
              ], -1)),
              _createElementVNode("div", _hoisted_38, [
                canManageQuotes.value ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500",
                  disabled: isBusy.value || quoteUpdatePolling.value,
                  onClick: askUpdateQuotesNow
                }, _toDisplayString(quoteUpdatePolling.value ? "Update Quotes Running..." : "Update Quotes Now"), 9, _hoisted_39)) : _createCommentVNode("", true),
                canManageQuotes.value ? (_openBlock(), _createElementBlock("span", {
                  key: 1,
                  class: _normalizeClass(["inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold", quoteUpdateStatusClass.value])
                }, _toDisplayString(quoteUpdateStatusLabel.value), 3)) : _createCommentVNode("", true),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[7] || (_cache[7] = ($event) => assetsSectionCollapsed.value = !assetsSectionCollapsed.value)
                }, _toDisplayString(assetsSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_40)
              ])
            ]),
            !assetsSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              canManageQuotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_41, " AUTO mode인 모든 Asset 시세를 즉시 갱신합니다. Action 컬럼의 Quote 버튼으로 단건 테스트도 가능합니다. ")) : _createCommentVNode("", true),
              _createElementVNode("p", _hoisted_42, [
                usdKrwFx.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                  _createTextVNode(_toDisplayString(formatDateTime(usdKrwFx.value.as_of)) + " 기준 USD/KRW " + _toDisplayString(formatFxRate(usdKrwFx.value.rate)) + " (source: " + _toDisplayString(usdKrwFx.value.source) + ") ", 1)
                ], 64)) : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                  _createTextVNode(" USD/KRW 환율 정보가 아직 없습니다. Update Quotes Now 실행 시 갱신됩니다. ")
                ], 64))
              ]),
              _createElementVNode("div", _hoisted_43, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => assetsQuery.q = $event),
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
                }, " Search ", 8, _hoisted_44),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearSearch
                }, " Clear ", 8, _hoisted_45)
              ]),
              _createElementVNode("div", _hoisted_46, [
                _createElementVNode("table", _hoisted_47, [
                  _createElementVNode("thead", _hoisted_48, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_49, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[9] || (_cache[9] = ($event) => toggleSort("id"))
                        }, [
                          _cache[183] || (_cache[183] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_50, _toDisplayString(sortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_51, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[10] || (_cache[10] = ($event) => toggleSort("name"))
                        }, [
                          _cache[184] || (_cache[184] = _createTextVNode("Name ", -1)),
                          _createElementVNode("span", _hoisted_52, _toDisplayString(sortIndicator("name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_53, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[11] || (_cache[11] = ($event) => toggleSort("symbol"))
                        }, [
                          _cache[185] || (_cache[185] = _createTextVNode("Symbol ", -1)),
                          _createElementVNode("span", _hoisted_54, _toDisplayString(sortIndicator("symbol")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_55, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[12] || (_cache[12] = ($event) => toggleSort("price"))
                        }, [
                          _cache[186] || (_cache[186] = _createTextVNode("Price ", -1)),
                          _createElementVNode("span", _hoisted_56, _toDisplayString(sortIndicator("price")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_57, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[13] || (_cache[13] = ($event) => toggleSort("currency"))
                        }, [
                          _cache[187] || (_cache[187] = _createTextVNode("Currency ", -1)),
                          _createElementVNode("span", _hoisted_58, _toDisplayString(sortIndicator("currency")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_59, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[14] || (_cache[14] = ($event) => toggleSort("asset_class"))
                        }, [
                          _cache[188] || (_cache[188] = _createTextVNode("Class ", -1)),
                          _createElementVNode("span", _hoisted_60, _toDisplayString(sortIndicator("asset_class")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_61, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[15] || (_cache[15] = ($event) => toggleSort("updated_at"))
                        }, [
                          _cache[189] || (_cache[189] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_62, _toDisplayString(sortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_63, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[16] || (_cache[16] = ($event) => toggleSort("quote_mode"))
                        }, [
                          _cache[190] || (_cache[190] = _createTextVNode("Quote ", -1)),
                          _createElementVNode("span", _hoisted_64, _toDisplayString(sortIndicator("quote_mode")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_65, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[17] || (_cache[17] = ($event) => toggleSort("quote_as_of"))
                        }, [
                          _cache[191] || (_cache[191] = _createTextVNode("Quote As Of ", -1)),
                          _createElementVNode("span", _hoisted_66, _toDisplayString(sortIndicator("quote_as_of")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_67, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[18] || (_cache[18] = ($event) => toggleSort("exchange_code"))
                        }, [
                          _cache[192] || (_cache[192] = _createTextVNode("Exchange ", -1)),
                          _createElementVNode("span", _hoisted_68, _toDisplayString(sortIndicator("exchange_code")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_69, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[19] || (_cache[19] = ($event) => toggleSort("source"))
                        }, [
                          _cache[193] || (_cache[193] = _createTextVNode("Source ", -1)),
                          _createElementVNode("span", _hoisted_70, _toDisplayString(sortIndicator("source")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_71, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[20] || (_cache[20] = ($event) => toggleSort("trade"))
                        }, [
                          _cache[194] || (_cache[194] = _createTextVNode("Trade ", -1)),
                          _createElementVNode("span", _hoisted_72, _toDisplayString(sortIndicator("trade")), 1)
                        ])
                      ]),
                      _cache[195] || (_cache[195] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: _normalizeClass(["cursor-pointer border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40", String(item.id) === manualQuoteForm.asset_id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""]),
                        onClick: ($event) => selectAssetForQuote(item)
                      }, [
                        _createElementVNode("td", _hoisted_74, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_75, _toDisplayString(item.name), 1),
                        _createElementVNode("td", _hoisted_76, _toDisplayString(item.symbol || "-"), 1),
                        _createElementVNode("td", _hoisted_77, _toDisplayString(quotePriceText(item)), 1),
                        _createElementVNode("td", _hoisted_78, _toDisplayString(item.currency), 1),
                        _createElementVNode("td", _hoisted_79, _toDisplayString(item.asset_class), 1),
                        _createElementVNode("td", _hoisted_80, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_81, _toDisplayString(item.quote_mode), 1),
                        _createElementVNode("td", _hoisted_82, _toDisplayString(quoteAsOfText(item)), 1),
                        _createElementVNode("td", _hoisted_83, _toDisplayString(item.exchange_code), 1),
                        _createElementVNode("td", _hoisted_84, _toDisplayString(quoteSourceText(item)), 1),
                        _createElementVNode("td", _hoisted_85, _toDisplayString(item.is_trade_supported ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_86, [
                          _createElementVNode("div", _hoisted_87, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: _withModifiers(($event) => openEditAssetModal(item), ["stop"])
                            }, " Edit ", 8, _hoisted_88),
                            canManageEntityHistory.value ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: _withModifiers(($event) => openEntityHistory("ASSET", item.id, `Asset #${item.id} ${item.name}`), ["stop"])
                            }, " History ", 8, _hoisted_89)) : _createCommentVNode("", true),
                            item.quote_mode === "AUTO" ? (_openBlock(), _createElementBlock("button", {
                              key: 1,
                              type: "button",
                              class: "rounded border border-sky-300 px-2 py-0.5 text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:focus:ring-sky-700",
                              disabled: !canManageQuotes.value || isBusy.value,
                              onClick: _withModifiers(($event) => askQuoteTestAsset(item), ["stop"])
                            }, [
                              _createElementVNode("span", _hoisted_91, [
                                quoteTestingAssetId.value === item.id && loading.action ? (_openBlock(), _createElementBlock("span", _hoisted_92)) : _createCommentVNode("", true),
                                _createElementVNode("span", null, _toDisplayString(quoteTestingAssetId.value === item.id && loading.action ? "Testing..." : "Quote"), 1)
                              ])
                            ], 8, _hoisted_90)) : _createCommentVNode("", true),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: _withModifiers(($event) => askDeleteAsset(item), ["stop"])
                            }, " Delete ", 8, _hoisted_93)
                          ])
                        ])
                      ], 10, _hoisted_73);
                    }), 128)),
                    assets.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_94, [..._cache[196] || (_cache[196] = [
                      _createElementVNode("td", {
                        colspan: "13",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No assets found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_95, [
                _createElementVNode("div", _hoisted_96, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(assetsQuery.total), 1),
                  _cache[199] || (_cache[199] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(assetsQuery.page) + " / " + _toDisplayString(totalPages.value), 1),
                  _cache[200] || (_cache[200] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[198] || (_cache[198] = _createTextVNode(" Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => assetsQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[22] || (_cache[22] = ($event) => {
                        assetsQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[197] || (_cache[197] = [
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
                    onClick: _cache[23] || (_cache[23] = ($event) => movePage(-1))
                  }, " Prev ", 8, _hoisted_97),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || assetsQuery.page >= totalPages.value,
                    onClick: _cache[24] || (_cache[24] = ($event) => movePage(1))
                  }, " Next ", 8, _hoisted_98)
                ]),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: !canManageAssets.value || isBusy.value,
                  onClick: openCreateAssetModal
                }, " Create Asset ", 8, _hoisted_99)
              ]),
              _cache[201] || (_cache[201] = _createElementVNode("p", { class: "mt-2 text-xs text-slate-500 dark:text-slate-400" }, "Create/Edit/Delete는 Admin/Maintainer 전용입니다.", -1)),
              !canManageAssets.value ? (_openBlock(), _createElementBlock("p", _hoisted_100, " USER/SUPERUSER는 Asset 생성/수정/삭제 권한이 없습니다. Admin/Maintainer에게 요청하세요. ")) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_101, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_102, [
            _createElementVNode("div", _hoisted_103, [
              _cache[202] || (_cache[202] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Quote Actions (Admin/Maintainer)", -1)),
              canManageQuotes.value ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                type: "button",
                class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: _cache[25] || (_cache[25] = ($event) => quoteActionsCollapsed.value = !quoteActionsCollapsed.value)
              }, _toDisplayString(quoteActionsCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_104)) : _createCommentVNode("", true)
            ]),
            selectedAssetForQuote.value ? (_openBlock(), _createElementBlock("p", _hoisted_105, " Selected: " + _toDisplayString(selectedAssetForQuote.value.name) + " (" + _toDisplayString(selectedAssetForQuote.value.exchange_code) + ") ", 1)) : _createCommentVNode("", true),
            !canManageQuotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_106, "권한이 없어 조회만 가능합니다.")) : quoteActionsCollapsed.value ? (_openBlock(), _createElementBlock("p", _hoisted_107, "폼이 접혀 있습니다. Expand 버튼으로 열어주세요.")) : (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
              _createElementVNode("div", _hoisted_108, [
                _createElementVNode("label", _hoisted_109, [
                  _cache[204] || (_cache[204] = _createTextVNode("Asset ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => manualQuoteForm.asset_id = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[203] || (_cache[203] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (item) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: item.id,
                        value: String(item.id)
                      }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ")", 9, _hoisted_110);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, manualQuoteForm.asset_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_111, [
                  _cache[205] || (_cache[205] = _createTextVNode("Price ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => manualQuoteForm.price = $event),
                    placeholder: "예: 810000000",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.price]
                  ])
                ]),
                _createElementVNode("label", _hoisted_112, [
                  _cache[206] || (_cache[206] = _createTextVNode("Currency ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => manualQuoteForm.currency = $event),
                    maxlength: "3",
                    placeholder: "KRW",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.currency]
                  ])
                ]),
                _createElementVNode("label", _hoisted_113, [
                  _cache[207] || (_cache[207] = _createTextVNode("As Of ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => manualQuoteForm.as_of = $event),
                    type: "datetime-local",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.as_of]
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_114, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500",
                  disabled: isBusy.value,
                  onClick: askApplyManualQuote
                }, " Apply Manual Quote ", 8, _hoisted_115)
              ])
            ], 64))
          ]),
          _createElementVNode("article", _hoisted_116, [
            _createElementVNode("div", _hoisted_117, [
              _cache[208] || (_cache[208] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Release Notes (Admin)"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Home 하단 Release Notes 카드를 Agent에서 직접 관리합니다.")
              ], -1)),
              _createElementVNode("div", _hoisted_118, [
                canManageReleaseNotes.value && !releaseNotesSectionCollapsed.value ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                  disabled: isBusy.value,
                  onClick: resetReleaseNoteForm
                }, " Reset Form ", 8, _hoisted_119)) : _createCommentVNode("", true),
                canManageReleaseNotes.value ? (_openBlock(), _createElementBlock("button", {
                  key: 1,
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                  disabled: isBusy.value,
                  onClick: _cache[30] || (_cache[30] = ($event) => releaseNotesSectionCollapsed.value = !releaseNotesSectionCollapsed.value)
                }, _toDisplayString(releaseNotesSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_120)) : _createCommentVNode("", true)
              ])
            ]),
            !canManageReleaseNotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_121, " Only ADMIN can view/create/update/unpublish release notes. ")) : releaseNotesSectionCollapsed.value ? (_openBlock(), _createElementBlock("p", _hoisted_122, " 섹션이 접혀 있습니다. Expand 버튼으로 열어주세요. ")) : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _createElementVNode("div", _hoisted_123, [
                _createElementVNode("label", _hoisted_124, [
                  _cache[209] || (_cache[209] = _createTextVNode("Released At (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => releaseNoteForm.released_at = $event),
                    type: "datetime-local",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, releaseNoteForm.released_at]
                  ])
                ]),
                _createElementVNode("label", _hoisted_125, [
                  _cache[210] || (_cache[210] = _createTextVNode("Title ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => releaseNoteForm.title = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, releaseNoteForm.title]
                  ])
                ]),
                _createElementVNode("label", _hoisted_126, [
                  _cache[211] || (_cache[211] = _createTextVNode("Summary ", -1)),
                  _withDirectives(_createElementVNode("textarea", {
                    "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => releaseNoteForm.summary = $event),
                    rows: "3",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, releaseNoteForm.summary]
                  ])
                ]),
                _createElementVNode("label", _hoisted_127, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => releaseNoteForm.is_published = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, releaseNoteForm.is_published]
                  ]),
                  _cache[212] || (_cache[212] = _createElementVNode("span", { class: "ml-1" }, "Published", -1))
                ])
              ]),
              _createElementVNode("div", _hoisted_128, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500",
                  disabled: isBusy.value,
                  onClick: submitReleaseNoteForm
                }, _toDisplayString(releaseNoteForm.id ? "Update Release Note" : "Create Release Note"), 9, _hoisted_129),
                releaseNoteForm.id ? (_openBlock(), _createElementBlock("span", _hoisted_130, "Editing #" + _toDisplayString(releaseNoteForm.id), 1)) : _createCommentVNode("", true)
              ]),
              _createElementVNode("div", _hoisted_131, [
                _createElementVNode("table", _hoisted_132, [
                  _cache[214] || (_cache[214] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "ID"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Released At"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Title"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Summary"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Published"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Updated"),
                      _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action")
                    ])
                  ], -1)),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(releaseNotes.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_133, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_134, _toDisplayString(formatDateTime(item.released_at)), 1),
                        _createElementVNode("td", _hoisted_135, _toDisplayString(item.title), 1),
                        _createElementVNode("td", _hoisted_136, _toDisplayString(item.summary), 1),
                        _createElementVNode("td", _hoisted_137, _toDisplayString(item.is_published ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_138, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_139, [
                          _createElementVNode("div", _hoisted_140, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => fillReleaseNoteForm(item)
                            }, " Edit ", 8, _hoisted_141),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                              disabled: isBusy.value || !item.is_published,
                              onClick: ($event) => askUnpublishReleaseNote(item)
                            }, " Unpublish ", 8, _hoisted_142)
                          ])
                        ])
                      ]);
                    }), 128)),
                    releaseNotes.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_143, [..._cache[213] || (_cache[213] = [
                      _createElementVNode("td", {
                        colspan: "7",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No release notes", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ])
            ], 64))
          ]),
          _createElementVNode("article", _hoisted_144, [
            _createElementVNode("div", _hoisted_145, [
              _cache[215] || (_cache[215] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Portfolios Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("div", _hoisted_146, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: !canManageAssets.value || isBusy.value,
                  onClick: _cache[35] || (_cache[35] = ($event) => quickCreatePortfolioOpen.value = !quickCreatePortfolioOpen.value)
                }, _toDisplayString(quickCreatePortfolioOpen.value ? "Close Create" : "Quick Create Portfolio"), 9, _hoisted_147),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[36] || (_cache[36] = ($event) => portfoliosSectionCollapsed.value = !portfoliosSectionCollapsed.value)
                }, _toDisplayString(portfoliosSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_148)
              ])
            ]),
            !portfoliosSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("div", _hoisted_149, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => portfolioQuery.q = $event),
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
                }, "Search", 8, _hoisted_150),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearPortfolioSearch
                }, "Clear", 8, _hoisted_151)
              ]),
              _createElementVNode("div", _hoisted_152, [
                _createElementVNode("table", _hoisted_153, [
                  _createElementVNode("thead", _hoisted_154, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_155, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[38] || (_cache[38] = ($event) => togglePortfolioSort("id"))
                        }, [
                          _cache[216] || (_cache[216] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_156, _toDisplayString(portfolioSortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_157, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[39] || (_cache[39] = ($event) => togglePortfolioSort("name"))
                        }, [
                          _cache[217] || (_cache[217] = _createTextVNode("Name ", -1)),
                          _createElementVNode("span", _hoisted_158, _toDisplayString(portfolioSortIndicator("name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_159, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[40] || (_cache[40] = ($event) => togglePortfolioSort("type"))
                        }, [
                          _cache[218] || (_cache[218] = _createTextVNode("Type ", -1)),
                          _createElementVNode("span", _hoisted_160, _toDisplayString(portfolioSortIndicator("type")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_161, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[41] || (_cache[41] = ($event) => togglePortfolioSort("category"))
                        }, [
                          _cache[219] || (_cache[219] = _createTextVNode("Category ", -1)),
                          _createElementVNode("span", _hoisted_162, _toDisplayString(portfolioSortIndicator("category")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_163, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[42] || (_cache[42] = ($event) => togglePortfolioSort("exchange_code"))
                        }, [
                          _cache[220] || (_cache[220] = _createTextVNode("Exchange ", -1)),
                          _createElementVNode("span", _hoisted_164, _toDisplayString(portfolioSortIndicator("exchange_code")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_165, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[43] || (_cache[43] = ($event) => togglePortfolioSort("base_currency"))
                        }, [
                          _cache[221] || (_cache[221] = _createTextVNode("Currency ", -1)),
                          _createElementVNode("span", _hoisted_166, _toDisplayString(portfolioSortIndicator("base_currency")), 1)
                        ])
                      ]),
                      _cache[236] || (_cache[236] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Included", -1)),
                      _cache[237] || (_cache[237] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                      _createElementVNode("th", _hoisted_167, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[44] || (_cache[44] = ($event) => togglePortfolioSort("cumulative_deposit_amount"))
                        }, [
                          _cache[222] || (_cache[222] = _createTextVNode("Deposit ", -1)),
                          _createElementVNode("span", _hoisted_168, _toDisplayString(portfolioSortIndicator("cumulative_deposit_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_169, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[45] || (_cache[45] = ($event) => togglePortfolioSort("cumulative_withdrawal_amount"))
                        }, [
                          _cache[223] || (_cache[223] = _createTextVNode("Withdrawal ", -1)),
                          _createElementVNode("span", _hoisted_170, _toDisplayString(portfolioSortIndicator("cumulative_withdrawal_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_171, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[46] || (_cache[46] = ($event) => togglePortfolioSort("principal_net"))
                        }, [
                          _cache[224] || (_cache[224] = _createTextVNode("Net Contribution ", -1)),
                          _createElementVNode("span", _hoisted_172, _toDisplayString(portfolioSortIndicator("principal_net")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_173, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[47] || (_cache[47] = ($event) => togglePortfolioSort("gross_assets_total"))
                        }, [
                          _cache[225] || (_cache[225] = _createTextVNode("Gross Assets ", -1)),
                          _createElementVNode("span", _hoisted_174, _toDisplayString(portfolioSortIndicator("gross_assets_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_175, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[48] || (_cache[48] = ($event) => togglePortfolioSort("liabilities_total"))
                        }, [
                          _cache[226] || (_cache[226] = _createTextVNode("Liabilities ", -1)),
                          _createElementVNode("span", _hoisted_176, _toDisplayString(portfolioSortIndicator("liabilities_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_177, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[49] || (_cache[49] = ($event) => togglePortfolioSort("net_assets_total"))
                        }, [
                          _cache[227] || (_cache[227] = _createTextVNode("Net Assets ", -1)),
                          _createElementVNode("span", _hoisted_178, _toDisplayString(portfolioSortIndicator("net_assets_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_179, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[50] || (_cache[50] = ($event) => togglePortfolioSort("debt_adjusted_principal_total"))
                        }, [
                          _cache[228] || (_cache[228] = _createTextVNode("Debt-Adjusted Principal ", -1)),
                          _createElementVNode("span", _hoisted_180, _toDisplayString(portfolioSortIndicator("debt_adjusted_principal_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_181, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[51] || (_cache[51] = ($event) => togglePortfolioSort("net_assets_profit_total"))
                        }, [
                          _cache[229] || (_cache[229] = _createTextVNode("Net Profit ", -1)),
                          _createElementVNode("span", _hoisted_182, _toDisplayString(portfolioSortIndicator("net_assets_profit_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_183, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[52] || (_cache[52] = ($event) => togglePortfolioSort("net_assets_return_pct"))
                        }, [
                          _cache[230] || (_cache[230] = _createTextVNode("Net Return% ", -1)),
                          _createElementVNode("span", _hoisted_184, _toDisplayString(portfolioSortIndicator("net_assets_return_pct")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_185, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[53] || (_cache[53] = ($event) => togglePortfolioSort("portfolio_profit_total"))
                        }, [
                          _cache[231] || (_cache[231] = _createTextVNode("Portfolio Profit ", -1)),
                          _createElementVNode("span", _hoisted_186, _toDisplayString(portfolioSortIndicator("portfolio_profit_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_187, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[54] || (_cache[54] = ($event) => togglePortfolioSort("total_return_pct"))
                        }, [
                          _cache[232] || (_cache[232] = _createTextVNode("Return% ", -1)),
                          _createElementVNode("span", _hoisted_188, _toDisplayString(portfolioSortIndicator("total_return_pct")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_189, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[55] || (_cache[55] = ($event) => togglePortfolioSort("holding_count"))
                        }, [
                          _cache[233] || (_cache[233] = _createTextVNode("Holdings ", -1)),
                          _createElementVNode("span", _hoisted_190, _toDisplayString(portfolioSortIndicator("holding_count")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_191, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[56] || (_cache[56] = ($event) => togglePortfolioSort("liability_count"))
                        }, [
                          _cache[234] || (_cache[234] = _createTextVNode("Liabilities ", -1)),
                          _createElementVNode("span", _hoisted_192, _toDisplayString(portfolioSortIndicator("liability_count")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_193, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[57] || (_cache[57] = ($event) => togglePortfolioSort("updated_at"))
                        }, [
                          _cache[235] || (_cache[235] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_194, _toDisplayString(portfolioSortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _cache[238] || (_cache[238] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolioRows.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_195, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_196, _toDisplayString(item.name), 1),
                        _createElementVNode("td", _hoisted_197, _toDisplayString(item.type), 1),
                        _createElementVNode("td", _hoisted_198, _toDisplayString(item.category || "-"), 1),
                        _createElementVNode("td", _hoisted_199, _toDisplayString(item.exchange_code || "-"), 1),
                        _createElementVNode("td", _hoisted_200, _toDisplayString(item.base_currency), 1),
                        _createElementVNode("td", _hoisted_201, _toDisplayString(item.is_included ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_202, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_203, _toDisplayString(formatMoney(item.cumulative_deposit_amount, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_204, _toDisplayString(formatMoney(item.cumulative_withdrawal_amount, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_205, _toDisplayString(formatPortfolioPrincipalNet(item)), 1),
                        _createElementVNode("td", _hoisted_206, _toDisplayString(formatMoney(item.gross_assets_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_207, _toDisplayString(formatMoney(item.liabilities_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_208, _toDisplayString(formatMoney(item.net_assets_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_209, _toDisplayString(formatMoney(item.debt_adjusted_principal_total ?? item.principal_minus_debt_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_210, _toDisplayString(formatMoney(item.net_assets_profit_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_211, _toDisplayString(formatPct(item.net_assets_return_pct)), 1),
                        _createElementVNode("td", _hoisted_212, _toDisplayString(formatMoney(item.portfolio_profit_total ?? item.total_pnl_amount, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_213, _toDisplayString(formatPct(item.total_return_pct)), 1),
                        _createElementVNode("td", _hoisted_214, _toDisplayString(item.holding_count), 1),
                        _createElementVNode("td", _hoisted_215, _toDisplayString(item.liability_count), 1),
                        _createElementVNode("td", _hoisted_216, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_217, [
                          _createElementVNode("div", _hoisted_218, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => openEditPortfolioModal(item)
                            }, " Edit ", 8, _hoisted_219),
                            canManageEntityHistory.value ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEntityHistory("PORTFOLIO", item.id, `Portfolio #${item.id} ${item.name}`)
                            }, " History ", 8, _hoisted_220)) : _createCommentVNode("", true),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => togglePortfolioIncluded(item)
                            }, _toDisplayString(item.is_included ? "Exclude" : "Include"), 9, _hoisted_221),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => togglePortfolioHidden(item)
                            }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_222),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => askDeletePortfolio(item)
                            }, "Delete", 8, _hoisted_223)
                          ])
                        ])
                      ]);
                    }), 128)),
                    portfolioRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_224, [..._cache[239] || (_cache[239] = [
                      _createElementVNode("td", {
                        colspan: "23",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No portfolios found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_225, [
                _createElementVNode("div", _hoisted_226, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(portfolioQuery.total), 1),
                  _cache[242] || (_cache[242] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(portfolioQuery.page) + " / " + _toDisplayString(portfolioTotalPages.value), 1),
                  _cache[243] || (_cache[243] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[241] || (_cache[241] = _createTextVNode("Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[58] || (_cache[58] = ($event) => portfolioQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[59] || (_cache[59] = ($event) => {
                        portfolioQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[240] || (_cache[240] = [
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
                    onClick: _cache[60] || (_cache[60] = ($event) => movePortfolioPage(-1))
                  }, "Prev", 8, _hoisted_227),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || portfolioQuery.page >= portfolioTotalPages.value,
                    onClick: _cache[61] || (_cache[61] = ($event) => movePortfolioPage(1))
                  }, "Next", 8, _hoisted_228)
                ])
              ]),
              _createElementVNode("div", _hoisted_229, [
                _cache[251] || (_cache[251] = _createElementVNode("div", { class: "flex flex-wrap items-start justify-between gap-2" }, [
                  _createElementVNode("div", null, [
                    _createElementVNode("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Representative Cash Mapping"),
                    _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, " Portfolio + Currency 별 대표 cash asset을 고정합니다. (입출금/Auto Cash Flow 시 이 매핑 우선) ")
                  ])
                ], -1)),
                _createElementVNode("div", _hoisted_230, [
                  _createElementVNode("label", _hoisted_231, [
                    _cache[245] || (_cache[245] = _createTextVNode(" Portfolio ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[62] || (_cache[62] = ($event) => portfolioCashMapForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value || cashAccountLookupLoading.value
                    }, [
                      _cache[244] || (_cache[244] = _createElementVNode("option", { value: "" }, "Select", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `cash-map-${item.id}`,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_233);
                      }), 128))
                    ], 8, _hoisted_232), [
                      [_vModelSelect, portfolioCashMapForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_234, [
                    _cache[246] || (_cache[246] = _createTextVNode(" Currency ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[63] || (_cache[63] = ($event) => portfolioCashMapForm.currency = $event),
                      maxlength: "3",
                      placeholder: "KRW",
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950",
                      disabled: isBusy.value || cashAccountLookupLoading.value
                    }, null, 8, _hoisted_235), [
                      [_vModelText, portfolioCashMapForm.currency]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_236, [
                    _cache[248] || (_cache[248] = _createTextVNode(" Cash Asset ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[64] || (_cache[64] = ($event) => portfolioCashMapForm.asset_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: isBusy.value || cashAccountLookupLoading.value
                    }, [
                      _cache[247] || (_cache[247] = _createElementVNode("option", { value: "" }, "Select", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(cashMapAssetOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `cash-asset-${item.id}`,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.currency) + ") ", 9, _hoisted_238);
                      }), 128))
                    ], 8, _hoisted_237), [
                      [_vModelSelect, portfolioCashMapForm.asset_id]
                    ])
                  ])
                ]),
                _createElementVNode("div", _hoisted_239, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60",
                    disabled: !canManageAssets.value || isBusy.value || cashAccountLookupLoading.value,
                    onClick: submitPortfolioCashMapping
                  }, " Set Representative Cash ", 8, _hoisted_240)
                ]),
                _createElementVNode("div", _hoisted_241, [
                  _createElementVNode("table", _hoisted_242, [
                    _cache[250] || (_cache[250] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
                      _createElementVNode("tr", null, [
                        _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Currency"),
                        _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Asset ID"),
                        _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Asset"),
                        _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Updated")
                      ])
                    ], -1)),
                    _createElementVNode("tbody", null, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolioCashAccounts.value, (item) => {
                        return _openBlock(), _createElementBlock("tr", {
                          key: item.id,
                          class: "border-t border-slate-200 dark:border-slate-700"
                        }, [
                          _createElementVNode("td", _hoisted_243, _toDisplayString(item.currency), 1),
                          _createElementVNode("td", _hoisted_244, _toDisplayString(item.asset_id), 1),
                          _createElementVNode("td", _hoisted_245, [
                            _createTextVNode(_toDisplayString(item.asset_name || "-") + " ", 1),
                            _createElementVNode("span", _hoisted_246, _toDisplayString(item.asset_symbol || ""), 1)
                          ]),
                          _createElementVNode("td", _hoisted_247, _toDisplayString(formatDateTime(item.updated_at)), 1)
                        ]);
                      }), 128)),
                      portfolioCashAccounts.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_248, [..._cache[249] || (_cache[249] = [
                        _createElementVNode("td", {
                          colspan: "4",
                          class: "px-3 py-3 text-center text-xs text-slate-500 dark:text-slate-400"
                        }, "No cash mapping", -1)
                      ])])) : _createCommentVNode("", true)
                    ])
                  ])
                ])
              ]),
              quickCreatePortfolioOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_249, [
                _createElementVNode("div", _hoisted_250, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[65] || (_cache[65] = ($event) => portfolioForm.name = $event),
                    placeholder: "Portfolio name",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, portfolioForm.name]
                  ]),
                  _createElementVNode("label", _hoisted_251, [
                    _cache[252] || (_cache[252] = _createTextVNode(" Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[66] || (_cache[66] = ($event) => portfolioForm.type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_252);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, portfolioForm.type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[67] || (_cache[67] = ($event) => portfolioForm.base_currency = $event),
                    placeholder: "Base currency",
                    maxlength: "3",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, portfolioForm.base_currency]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[68] || (_cache[68] = ($event) => portfolioForm.exchange_code = $event),
                    placeholder: "Exchange code",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, portfolioForm.exchange_code]
                  ]),
                  _createElementVNode("label", _hoisted_253, [
                    _cache[253] || (_cache[253] = _createTextVNode(" Category ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[69] || (_cache[69] = ($event) => portfolioForm.category = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCategoryOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_254);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, portfolioForm.category]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_255, [
                    _cache[254] || (_cache[254] = _createTextVNode(" Cashflow Source ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[70] || (_cache[70] = ($event) => portfolioForm.cashflow_source_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCashflowSourceTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_256);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, portfolioForm.cashflow_source_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[71] || (_cache[71] = ($event) => portfolioForm.memo = $event),
                    placeholder: "Memo",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                  }, null, 512), [
                    [_vModelText, portfolioForm.memo]
                  ])
                ]),
                _createElementVNode("div", _hoisted_257, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                    disabled: !canManageAssets.value || isBusy.value,
                    onClick: submitPortfolioCreate
                  }, "Create Portfolio", 8, _hoisted_258)
                ])
              ])) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_259, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_260, [
            _createElementVNode("div", _hoisted_261, [
              _cache[255] || (_cache[255] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Holdings Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("div", _hoisted_262, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: isBusy.value,
                  onClick: toggleQuickCreateHolding
                }, _toDisplayString(quickCreateHoldingOpen.value ? "Close Create" : "Quick Create Holding"), 9, _hoisted_263),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[72] || (_cache[72] = ($event) => holdingsSectionCollapsed.value = !holdingsSectionCollapsed.value)
                }, _toDisplayString(holdingsSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_264)
              ])
            ]),
            !holdingsSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("div", _hoisted_265, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[73] || (_cache[73] = ($event) => holdingQuery.q = $event),
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
                }, "Search", 8, _hoisted_266),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearHoldingSearch
                }, "Clear", 8, _hoisted_267)
              ]),
              _createElementVNode("div", _hoisted_268, [
                _createElementVNode("table", _hoisted_269, [
                  _createElementVNode("thead", _hoisted_270, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_271, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[74] || (_cache[74] = ($event) => toggleHoldingSort("id"))
                        }, [
                          _cache[256] || (_cache[256] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_272, _toDisplayString(holdingSortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_273, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[75] || (_cache[75] = ($event) => toggleHoldingSort("portfolio_name"))
                        }, [
                          _cache[257] || (_cache[257] = _createTextVNode("Portfolio ", -1)),
                          _createElementVNode("span", _hoisted_274, _toDisplayString(holdingSortIndicator("portfolio_name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_275, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[76] || (_cache[76] = ($event) => toggleHoldingSort("asset_name"))
                        }, [
                          _cache[258] || (_cache[258] = _createTextVNode("Asset ", -1)),
                          _createElementVNode("span", _hoisted_276, _toDisplayString(holdingSortIndicator("asset_name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_277, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[77] || (_cache[77] = ($event) => toggleHoldingSort("asset_symbol"))
                        }, [
                          _cache[259] || (_cache[259] = _createTextVNode("Symbol ", -1)),
                          _createElementVNode("span", _hoisted_278, _toDisplayString(holdingSortIndicator("asset_symbol")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_279, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[78] || (_cache[78] = ($event) => toggleHoldingSort("quantity"))
                        }, [
                          _cache[260] || (_cache[260] = _createTextVNode("Qty ", -1)),
                          _createElementVNode("span", _hoisted_280, _toDisplayString(holdingSortIndicator("quantity")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_281, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[79] || (_cache[79] = ($event) => toggleHoldingSort("avg_price"))
                        }, [
                          _cache[261] || (_cache[261] = _createTextVNode("Avg Cost ", -1)),
                          _createElementVNode("span", _hoisted_282, _toDisplayString(holdingSortIndicator("avg_price")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_283, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[80] || (_cache[80] = ($event) => toggleHoldingSort("invested_amount"))
                        }, [
                          _cache[262] || (_cache[262] = _createTextVNode("Cost Basis ", -1)),
                          _createElementVNode("span", _hoisted_284, _toDisplayString(holdingSortIndicator("invested_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_285, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[81] || (_cache[81] = ($event) => toggleHoldingSort("current_price"))
                        }, [
                          _cache[263] || (_cache[263] = _createTextVNode("Price ", -1)),
                          _createElementVNode("span", _hoisted_286, _toDisplayString(holdingSortIndicator("current_price")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_287, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[82] || (_cache[82] = ($event) => toggleHoldingSort("evaluated_amount"))
                        }, [
                          _cache[264] || (_cache[264] = _createTextVNode("Evaluated ", -1)),
                          _createElementVNode("span", _hoisted_288, _toDisplayString(holdingSortIndicator("evaluated_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_289, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[83] || (_cache[83] = ($event) => toggleHoldingSort("pnl_pct"))
                        }, [
                          _cache[265] || (_cache[265] = _createTextVNode("Profit % ", -1)),
                          _createElementVNode("span", _hoisted_290, _toDisplayString(holdingSortIndicator("pnl_pct")), 1)
                        ])
                      ]),
                      _cache[267] || (_cache[267] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                      _createElementVNode("th", _hoisted_291, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[84] || (_cache[84] = ($event) => toggleHoldingSort("updated_at"))
                        }, [
                          _cache[266] || (_cache[266] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_292, _toDisplayString(holdingSortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _cache[268] || (_cache[268] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(holdingRows.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_293, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_294, _toDisplayString(item.portfolio_name || "-"), 1),
                        _createElementVNode("td", _hoisted_295, _toDisplayString(item.asset_name), 1),
                        _createElementVNode("td", _hoisted_296, _toDisplayString(item.asset_symbol || "-"), 1),
                        _createElementVNode("td", _hoisted_297, _toDisplayString(formatQuantity(item.quantity)), 1),
                        _createElementVNode("td", _hoisted_298, _toDisplayString(formatMoney(item.avg_cost ?? item.avg_price, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_299, _toDisplayString(item.cost_basis_total === null || item.cost_basis_total === void 0 ? item.invested_amount === null ? "-" : formatMoney(item.invested_amount, holdingCurrencyCode(item)) : formatMoney(item.cost_basis_total, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_300, _toDisplayString(item.current_price === null ? "-" : formatMoney(item.current_price, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_301, _toDisplayString(formatMoney(item.evaluated_amount, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_302, _toDisplayString(item.pnl_pct === null ? "-" : `${Number(item.pnl_pct).toFixed(2)}%`), 1),
                        _createElementVNode("td", _hoisted_303, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_304, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_305, [
                          _createElementVNode("div", _hoisted_306, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEditHoldingModal(item)
                            }, " Edit ", 8, _hoisted_307),
                            canManageEntityHistory.value ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEntityHistory("HOLDING", item.id, `Holding #${item.id} ${item.asset_name}`)
                            }, " History ", 8, _hoisted_308)) : _createCommentVNode("", true),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: isBusy.value,
                              onClick: ($event) => toggleHoldingHidden(item)
                            }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_309),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                              disabled: isBusy.value,
                              onClick: ($event) => askDeleteHolding(item)
                            }, "Delete", 8, _hoisted_310)
                          ])
                        ])
                      ]);
                    }), 128)),
                    holdingRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_311, [..._cache[269] || (_cache[269] = [
                      _createElementVNode("td", {
                        colspan: "13",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No holdings found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_312, [
                _createElementVNode("div", _hoisted_313, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(holdingQuery.total), 1),
                  _cache[272] || (_cache[272] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(holdingQuery.page) + " / " + _toDisplayString(holdingTotalPages.value), 1),
                  _cache[273] || (_cache[273] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[271] || (_cache[271] = _createTextVNode("Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[85] || (_cache[85] = ($event) => holdingQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[86] || (_cache[86] = ($event) => {
                        holdingQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[270] || (_cache[270] = [
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
                    onClick: _cache[87] || (_cache[87] = ($event) => moveHoldingPage(-1))
                  }, "Prev", 8, _hoisted_314),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || holdingQuery.page >= holdingTotalPages.value,
                    onClick: _cache[88] || (_cache[88] = ($event) => moveHoldingPage(1))
                  }, "Next", 8, _hoisted_315)
                ])
              ]),
              quickCreateHoldingOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_316, [
                _createElementVNode("div", _hoisted_317, [
                  _createElementVNode("label", _hoisted_318, [
                    _cache[275] || (_cache[275] = _createTextVNode(" Portfolio (optional) ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[89] || (_cache[89] = ($event) => holdingForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value
                    }, [
                      _cache[274] || (_cache[274] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: item.id,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_320);
                      }), 128))
                    ], 8, _hoisted_319), [
                      [_vModelSelect, holdingForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_321, [
                    _cache[277] || (_cache[277] = _createTextVNode(" Asset ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[90] || (_cache[90] = ($event) => holdingForm.asset_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value
                    }, [
                      _cache[276] || (_cache[276] = _createElementVNode("option", { value: "" }, "Select Asset", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingAssetOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: item.id,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ") ", 9, _hoisted_323);
                      }), 128))
                    ], 8, _hoisted_322), [
                      [_vModelSelect, holdingForm.asset_id]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[91] || (_cache[91] = ($event) => holdingForm.quantity = $event),
                    placeholder: "Quantity",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, holdingForm.quantity]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[92] || (_cache[92] = ($event) => holdingForm.avg_price = $event),
                    placeholder: "Avg Cost",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, holdingForm.avg_price]
                  ]),
                  _createElementVNode("label", _hoisted_324, [
                    _cache[278] || (_cache[278] = _createTextVNode(" Avg Cost Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[93] || (_cache[93] = ($event) => holdingForm.avg_price_currency = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: isBusy.value
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: `holding-create-avg-${opt}`,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_326);
                      }), 64))
                    ], 8, _hoisted_325), [
                      [_vModelSelect, holdingForm.avg_price_currency]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[94] || (_cache[94] = ($event) => holdingForm.invested_amount = $event),
                    placeholder: "Cost Basis (optional)",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, holdingForm.invested_amount]
                  ]),
                  _createElementVNode("label", _hoisted_327, [
                    _cache[279] || (_cache[279] = _createTextVNode(" Cost Basis Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[95] || (_cache[95] = ($event) => holdingForm.invested_amount_currency = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: isBusy.value
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: `holding-create-invested-${opt}`,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_329);
                      }), 64))
                    ], 8, _hoisted_328), [
                      [_vModelSelect, holdingForm.invested_amount_currency]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_330, [
                    _cache[280] || (_cache[280] = _createTextVNode(" Source Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[96] || (_cache[96] = ($event) => holdingForm.source_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingSourceTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_331);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, holdingForm.source_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[97] || (_cache[97] = ($event) => holdingForm.memo = $event),
                    placeholder: "Memo",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                  }, null, 512), [
                    [_vModelText, holdingForm.memo]
                  ])
                ]),
                _createElementVNode("div", _hoisted_332, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                    disabled: isBusy.value,
                    onClick: submitHoldingCreate
                  }, "Create Holding", 8, _hoisted_333)
                ])
              ])) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_334, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_335, [
            _createElementVNode("div", _hoisted_336, [
              _cache[281] || (_cache[281] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Liabilities Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("div", _hoisted_337, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: isBusy.value,
                  onClick: toggleQuickCreateLiability
                }, _toDisplayString(quickCreateLiabilityOpen.value ? "Close Create" : "Quick Create Liability"), 9, _hoisted_338),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[98] || (_cache[98] = ($event) => liabilitiesSectionCollapsed.value = !liabilitiesSectionCollapsed.value)
                }, _toDisplayString(liabilitiesSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_339)
              ])
            ]),
            !liabilitiesSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("div", _hoisted_340, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[99] || (_cache[99] = ($event) => liabilityQuery.q = $event),
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
                }, "Search", 8, _hoisted_341),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearLiabilitySearch
                }, "Clear", 8, _hoisted_342)
              ]),
              _createElementVNode("div", _hoisted_343, [
                _createElementVNode("table", _hoisted_344, [
                  _createElementVNode("thead", _hoisted_345, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_346, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[100] || (_cache[100] = ($event) => toggleLiabilitySort("id"))
                        }, [
                          _cache[282] || (_cache[282] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_347, _toDisplayString(liabilitySortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_348, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[101] || (_cache[101] = ($event) => toggleLiabilitySort("portfolio_name"))
                        }, [
                          _cache[283] || (_cache[283] = _createTextVNode("Portfolio ", -1)),
                          _createElementVNode("span", _hoisted_349, _toDisplayString(liabilitySortIndicator("portfolio_name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_350, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[102] || (_cache[102] = ($event) => toggleLiabilitySort("name"))
                        }, [
                          _cache[284] || (_cache[284] = _createTextVNode("Name ", -1)),
                          _createElementVNode("span", _hoisted_351, _toDisplayString(liabilitySortIndicator("name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_352, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[103] || (_cache[103] = ($event) => toggleLiabilitySort("liability_type"))
                        }, [
                          _cache[285] || (_cache[285] = _createTextVNode("Type ", -1)),
                          _createElementVNode("span", _hoisted_353, _toDisplayString(liabilitySortIndicator("liability_type")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_354, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[104] || (_cache[104] = ($event) => toggleLiabilitySort("outstanding_balance"))
                        }, [
                          _cache[286] || (_cache[286] = _createTextVNode("Balance ", -1)),
                          _createElementVNode("span", _hoisted_355, _toDisplayString(liabilitySortIndicator("outstanding_balance")), 1)
                        ])
                      ]),
                      _cache[290] || (_cache[290] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Currency", -1)),
                      _createElementVNode("th", _hoisted_356, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[105] || (_cache[105] = ($event) => toggleLiabilitySort("interest_rate"))
                        }, [
                          _cache[287] || (_cache[287] = _createTextVNode("Rate ", -1)),
                          _createElementVNode("span", _hoisted_357, _toDisplayString(liabilitySortIndicator("interest_rate")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_358, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[106] || (_cache[106] = ($event) => toggleLiabilitySort("monthly_payment"))
                        }, [
                          _cache[288] || (_cache[288] = _createTextVNode("Monthly ", -1)),
                          _createElementVNode("span", _hoisted_359, _toDisplayString(liabilitySortIndicator("monthly_payment")), 1)
                        ])
                      ]),
                      _cache[291] || (_cache[291] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Included", -1)),
                      _cache[292] || (_cache[292] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                      _createElementVNode("th", _hoisted_360, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[107] || (_cache[107] = ($event) => toggleLiabilitySort("updated_at"))
                        }, [
                          _cache[289] || (_cache[289] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_361, _toDisplayString(liabilitySortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _cache[293] || (_cache[293] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(liabilityRows.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_362, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_363, _toDisplayString(item.portfolio_name || "-"), 1),
                        _createElementVNode("td", _hoisted_364, _toDisplayString(item.name), 1),
                        _createElementVNode("td", _hoisted_365, _toDisplayString(item.liability_type), 1),
                        _createElementVNode("td", _hoisted_366, _toDisplayString(formatMoney(item.outstanding_balance, item.currency)), 1),
                        _createElementVNode("td", _hoisted_367, _toDisplayString(item.currency), 1),
                        _createElementVNode("td", _hoisted_368, _toDisplayString(item.interest_rate ?? "-"), 1),
                        _createElementVNode("td", _hoisted_369, _toDisplayString(item.monthly_payment === null ? "-" : formatMoney(item.monthly_payment, item.currency)), 1),
                        _createElementVNode("td", _hoisted_370, _toDisplayString(item.is_included ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_371, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_372, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_373, [
                          _createElementVNode("div", _hoisted_374, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEditLiabilityModal(item)
                            }, " Edit ", 8, _hoisted_375),
                            canManageEntityHistory.value ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEntityHistory("LIABILITY", item.id, `Liability #${item.id} ${item.name}`)
                            }, " History ", 8, _hoisted_376)) : _createCommentVNode("", true),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: isBusy.value,
                              onClick: ($event) => toggleLiabilityIncluded(item)
                            }, _toDisplayString(item.is_included ? "Exclude" : "Include"), 9, _hoisted_377),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: isBusy.value,
                              onClick: ($event) => toggleLiabilityHidden(item)
                            }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_378),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                              disabled: isBusy.value,
                              onClick: ($event) => askDeleteLiability(item)
                            }, "Delete", 8, _hoisted_379)
                          ])
                        ])
                      ]);
                    }), 128)),
                    liabilityRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_380, [..._cache[294] || (_cache[294] = [
                      _createElementVNode("td", {
                        colspan: "12",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No liabilities found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_381, [
                _createElementVNode("div", _hoisted_382, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(liabilityQuery.total), 1),
                  _cache[297] || (_cache[297] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(liabilityQuery.page) + " / " + _toDisplayString(liabilityTotalPages.value), 1),
                  _cache[298] || (_cache[298] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[296] || (_cache[296] = _createTextVNode("Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[108] || (_cache[108] = ($event) => liabilityQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[109] || (_cache[109] = ($event) => {
                        liabilityQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[295] || (_cache[295] = [
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
                    onClick: _cache[110] || (_cache[110] = ($event) => moveLiabilityPage(-1))
                  }, "Prev", 8, _hoisted_383),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || liabilityQuery.page >= liabilityTotalPages.value,
                    onClick: _cache[111] || (_cache[111] = ($event) => moveLiabilityPage(1))
                  }, "Next", 8, _hoisted_384)
                ])
              ]),
              quickCreateLiabilityOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_385, [
                _createElementVNode("div", _hoisted_386, [
                  _createElementVNode("label", _hoisted_387, [
                    _cache[300] || (_cache[300] = _createTextVNode(" Portfolio (optional) ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[112] || (_cache[112] = ($event) => liabilityForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value
                    }, [
                      _cache[299] || (_cache[299] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: item.id,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_389);
                      }), 128))
                    ], 8, _hoisted_388), [
                      [_vModelSelect, liabilityForm.portfolio_id]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[113] || (_cache[113] = ($event) => liabilityForm.name = $event),
                    placeholder: "Liability name",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.name]
                  ]),
                  _createElementVNode("label", _hoisted_390, [
                    _cache[301] || (_cache[301] = _createTextVNode(" Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[114] || (_cache[114] = ($event) => liabilityForm.liability_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilityTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_391);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, liabilityForm.liability_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[115] || (_cache[115] = ($event) => liabilityForm.outstanding_balance = $event),
                    placeholder: "Outstanding balance",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.outstanding_balance]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[116] || (_cache[116] = ($event) => liabilityForm.currency = $event),
                    placeholder: "Currency",
                    maxlength: "3",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.currency]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[117] || (_cache[117] = ($event) => liabilityForm.interest_rate = $event),
                    placeholder: "Interest rate (optional)",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.interest_rate]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[118] || (_cache[118] = ($event) => liabilityForm.monthly_payment = $event),
                    placeholder: "Monthly payment (optional)",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.monthly_payment]
                  ]),
                  _createElementVNode("label", _hoisted_392, [
                    _cache[302] || (_cache[302] = _createTextVNode(" Source Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[119] || (_cache[119] = ($event) => liabilityForm.source_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilitySourceTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_393);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, liabilityForm.source_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[120] || (_cache[120] = ($event) => liabilityForm.memo = $event),
                    placeholder: "Memo",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                  }, null, 512), [
                    [_vModelText, liabilityForm.memo]
                  ])
                ]),
                _createElementVNode("div", _hoisted_394, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                    disabled: isBusy.value,
                    onClick: submitLiabilityCreate
                  }, "Create Liability", 8, _hoisted_395)
                ])
              ])) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_396, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_397, [
            _cache[303] || (_cache[303] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Execution Log", -1)),
            _createElementVNode("ul", _hoisted_398, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(logs.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.id,
                  class: _normalizeClass([
                    "rounded-lg border px-3 py-2 text-xs",
                    item.status === "SUCCESS" ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30" : item.status === "ERROR" ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/30" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40"
                  ])
                }, [
                  _createElementVNode("p", _hoisted_399, _toDisplayString(item.action) + " · " + _toDisplayString(item.status), 1),
                  _createElementVNode("p", _hoisted_400, _toDisplayString(item.message), 1),
                  _createElementVNode("p", _hoisted_401, _toDisplayString(formatDateTime(item.at)), 1)
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
          _createElementVNode("section", _hoisted_402, [
            _createElementVNode("h3", _hoisted_403, _toDisplayString(assetModal.mode === "CREATE" ? "Create Asset" : `Edit Asset #${assetForm.id}`), 1),
            _cache[314] || (_cache[314] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "필수 입력: Name, Class, Currency, Quote Mode, Exchange", -1)),
            _createElementVNode("div", _hoisted_404, [
              _createElementVNode("label", _hoisted_405, [
                _cache[304] || (_cache[304] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[121] || (_cache[121] = ($event) => assetForm.name = $event),
                  placeholder: "예: 삼성전자",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_406, [
                _cache[306] || (_cache[306] = _createTextVNode("Class ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[122] || (_cache[122] = ($event) => assetForm.asset_class = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[305] || (_cache[305] = _createElementVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Select class", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(assetClassOptions, (item) => {
                    return _createElementVNode("option", {
                      key: item,
                      value: item
                    }, _toDisplayString(item), 9, _hoisted_407);
                  }), 64))
                ], 512), [
                  [_vModelSelect, assetForm.asset_class]
                ])
              ]),
              _createElementVNode("label", _hoisted_408, [
                _cache[307] || (_cache[307] = _createTextVNode("Symbol ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[123] || (_cache[123] = ($event) => assetForm.symbol = $event),
                  placeholder: "예: 005930 또는 BTC",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.symbol]
                ])
              ]),
              _createElementVNode("label", _hoisted_409, [
                _cache[308] || (_cache[308] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[124] || (_cache[124] = ($event) => assetForm.currency = $event),
                  maxlength: "3",
                  placeholder: "예: KRW",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_410, [
                _cache[310] || (_cache[310] = _createTextVNode("Quote Mode ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[125] || (_cache[125] = ($event) => assetForm.quote_mode = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[309] || (_cache[309] = _createElementVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Select quote mode", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(quoteModeOptions, (item) => {
                    return _createElementVNode("option", {
                      key: item,
                      value: item
                    }, _toDisplayString(item), 9, _hoisted_411);
                  }), 64))
                ], 512), [
                  [_vModelSelect, assetForm.quote_mode]
                ])
              ]),
              _createElementVNode("label", _hoisted_412, [
                _cache[311] || (_cache[311] = _createTextVNode("Exchange ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[126] || (_cache[126] = ($event) => assetForm.exchange_code = $event),
                  placeholder: "예: KRX / UPBIT / KORBIT",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.exchange_code]
                ])
              ]),
              _createElementVNode("label", _hoisted_413, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[127] || (_cache[127] = ($event) => assetForm.is_trade_supported = $event),
                  type: "checkbox"
                }, null, 512), [
                  [_vModelCheckbox, assetForm.is_trade_supported]
                ]),
                _cache[312] || (_cache[312] = _createElementVNode("span", { class: "ml-1" }, "Trade Supported", -1))
              ]),
              _createElementVNode("label", _hoisted_414, [
                _cache[313] || (_cache[313] = _createTextVNode("Meta JSON ", -1)),
                _withDirectives(_createElementVNode("textarea", {
                  "onUpdate:modelValue": _cache[128] || (_cache[128] = ($event) => assetForm.meta_json_text = $event),
                  rows: "4",
                  placeholder: assetMetaJsonPlaceholder,
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.meta_json_text]
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_415, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeAssetModal
              }, " Cancel ", 8, _hoisted_416),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitAssetForm
              }, _toDisplayString(assetModal.mode === "CREATE" ? "Create" : "Apply"), 9, _hoisted_417)
            ])
          ])
        ])) : _createCommentVNode("", true),
        portfolioEditModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 1,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closePortfolioEditModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_418, [
            _createElementVNode("h3", _hoisted_419, "Edit Portfolio #" + _toDisplayString(portfolioEditForm.id), 1),
            _cache[335] || (_cache[335] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "핵심 운영값(집계 포함/숨김/입출금 누적/메모)을 수정할 수 있습니다.", -1)),
            _createElementVNode("div", _hoisted_420, [
              _cache[320] || (_cache[320] = _createElementVNode("p", { class: "text-xs font-semibold text-slate-700 dark:text-slate-200" }, "Edit Mode", -1)),
              _createElementVNode("div", _hoisted_421, [
                _createElementVNode("label", _hoisted_422, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[129] || (_cache[129] = ($event) => portfolioEditForm.edit_mode = $event),
                    type: "radio",
                    value: "SAFE"
                  }, null, 512), [
                    [_vModelRadio, portfolioEditForm.edit_mode]
                  ]),
                  _cache[315] || (_cache[315] = _createElementVNode("span", null, "Rebaseline (Recommended)", -1))
                ]),
                _createElementVNode("label", _hoisted_423, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[130] || (_cache[130] = ($event) => portfolioEditForm.edit_mode = $event),
                    type: "radio",
                    value: "HARD",
                    disabled: !canHardEdit.value || loading.action || loading.confirm
                  }, null, 8, _hoisted_424), [
                    [_vModelRadio, portfolioEditForm.edit_mode]
                  ]),
                  _cache[316] || (_cache[316] = _createElementVNode("span", null, "Edit(Hard)", -1))
                ])
              ]),
              !canHardEdit.value ? (_openBlock(), _createElementBlock("p", _hoisted_425, " HARD 모드는 MAINTAINER+ 권한이 필요합니다. ")) : _createCommentVNode("", true),
              portfolioEditForm.edit_mode === "SAFE" ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                _createElementVNode("div", _hoisted_426, [
                  _createElementVNode("label", _hoisted_427, [
                    _cache[317] || (_cache[317] = _createTextVNode(" Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[131] || (_cache[131] = ($event) => portfolioEditForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, portfolioEditForm.effective_at]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_428, [
                    _cache[318] || (_cache[318] = _createTextVNode(" Reason (optional) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[132] || (_cache[132] = ($event) => portfolioEditForm.reason = $event),
                      placeholder: "예: 월말 정산 기준점 보정",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, portfolioEditForm.reason]
                    ])
                  ])
                ]),
                _cache[319] || (_cache[319] = _createElementVNode("p", { class: "mt-2 text-[11px] text-slate-500 dark:text-slate-400" }, " SAFE는 기준일 이전 DEPOSIT/WITHDRAW 거래를 VOID하고 baseline을 생성합니다. ", -1))
              ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_429, " HARD는 임시 강제값입니다. 이후 sync/rebuild에서 원장값으로 덮어써질 수 있습니다. "))
            ]),
            _createElementVNode("div", _hoisted_430, [
              _createElementVNode("label", _hoisted_431, [
                _cache[321] || (_cache[321] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[133] || (_cache[133] = ($event) => portfolioEditForm.name = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_432, [
                _cache[322] || (_cache[322] = _createTextVNode("Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[134] || (_cache[134] = ($event) => portfolioEditForm.type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_433);
                  }), 64))
                ], 512), [
                  [_vModelSelect, portfolioEditForm.type]
                ])
              ]),
              _createElementVNode("label", _hoisted_434, [
                _cache[323] || (_cache[323] = _createTextVNode("Base Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[135] || (_cache[135] = ($event) => portfolioEditForm.base_currency = $event),
                  maxlength: "3",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.base_currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_435, [
                _cache[324] || (_cache[324] = _createTextVNode("Exchange Code ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[136] || (_cache[136] = ($event) => portfolioEditForm.exchange_code = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.exchange_code]
                ])
              ]),
              _createElementVNode("label", _hoisted_436, [
                _cache[326] || (_cache[326] = _createTextVNode("Category ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[137] || (_cache[137] = ($event) => portfolioEditForm.category = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[325] || (_cache[325] = _createElementVNode("option", { value: "" }, "(none)", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCategoryOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_437);
                  }), 64))
                ], 512), [
                  [_vModelSelect, portfolioEditForm.category]
                ])
              ]),
              _createElementVNode("label", _hoisted_438, [
                _cache[327] || (_cache[327] = _createTextVNode("Cashflow Source ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[138] || (_cache[138] = ($event) => portfolioEditForm.cashflow_source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCashflowSourceTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_439);
                  }), 64))
                ], 512), [
                  [_vModelSelect, portfolioEditForm.cashflow_source_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_440, [
                _cache[328] || (_cache[328] = _createTextVNode("Cumulative Deposit ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[139] || (_cache[139] = ($event) => portfolioEditForm.cumulative_deposit_amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.cumulative_deposit_amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_441, [
                _cache[329] || (_cache[329] = _createTextVNode("Cumulative Withdrawal ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[140] || (_cache[140] = ($event) => portfolioEditForm.cumulative_withdrawal_amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.cumulative_withdrawal_amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_442, [
                _cache[330] || (_cache[330] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[141] || (_cache[141] = ($event) => portfolioEditForm.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.memo]
                ])
              ]),
              _createElementVNode("label", _hoisted_443, [
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[142] || (_cache[142] = ($event) => portfolioEditForm.is_included = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, portfolioEditForm.is_included]
                  ]),
                  _cache[331] || (_cache[331] = _createTextVNode()),
                  _cache[332] || (_cache[332] = _createElementVNode("span", { class: "ml-1" }, "Included", -1))
                ]),
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[143] || (_cache[143] = ($event) => portfolioEditForm.is_hidden = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, portfolioEditForm.is_hidden]
                  ]),
                  _cache[333] || (_cache[333] = _createTextVNode()),
                  _cache[334] || (_cache[334] = _createElementVNode("span", { class: "ml-1" }, "Hidden", -1))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_444, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closePortfolioEditModal
              }, " Cancel ", 8, _hoisted_445),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitPortfolioEdit
              }, " Apply ", 8, _hoisted_446)
            ])
          ])
        ])) : _createCommentVNode("", true),
        holdingEditModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 2,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeHoldingEditModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_447, [
            _createElementVNode("h3", _hoisted_448, "Edit Holding #" + _toDisplayString(holdingEditForm.id), 1),
            _cache[354] || (_cache[354] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Asset/포트폴리오/수량/평단/투입금/숨김/메모를 수정합니다.", -1)),
            _createElementVNode("div", _hoisted_449, [
              _cache[341] || (_cache[341] = _createElementVNode("p", { class: "text-xs font-semibold text-slate-700 dark:text-slate-200" }, "Edit Mode", -1)),
              _createElementVNode("div", _hoisted_450, [
                _createElementVNode("label", _hoisted_451, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[144] || (_cache[144] = ($event) => holdingEditForm.edit_mode = $event),
                    type: "radio",
                    value: "SAFE"
                  }, null, 512), [
                    [_vModelRadio, holdingEditForm.edit_mode]
                  ]),
                  _cache[336] || (_cache[336] = _createElementVNode("span", null, "Rebaseline (Recommended)", -1))
                ]),
                _createElementVNode("label", _hoisted_452, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[145] || (_cache[145] = ($event) => holdingEditForm.edit_mode = $event),
                    type: "radio",
                    value: "HARD",
                    disabled: !canHardEdit.value || loading.action || loading.confirm
                  }, null, 8, _hoisted_453), [
                    [_vModelRadio, holdingEditForm.edit_mode]
                  ]),
                  _cache[337] || (_cache[337] = _createElementVNode("span", null, "Edit(Hard)", -1))
                ])
              ]),
              !canHardEdit.value ? (_openBlock(), _createElementBlock("p", _hoisted_454, " HARD 모드는 MAINTAINER+ 권한이 필요합니다. ")) : _createCommentVNode("", true),
              holdingEditForm.edit_mode === "SAFE" ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                _createElementVNode("div", _hoisted_455, [
                  _createElementVNode("label", _hoisted_456, [
                    _cache[338] || (_cache[338] = _createTextVNode(" Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[146] || (_cache[146] = ($event) => holdingEditForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, holdingEditForm.effective_at]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_457, [
                    _cache[339] || (_cache[339] = _createTextVNode(" Reason (optional) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[147] || (_cache[147] = ($event) => holdingEditForm.reason = $event),
                      placeholder: "예: 과거 수동 입력 정합화",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, holdingEditForm.reason]
                    ])
                  ])
                ]),
                _cache[340] || (_cache[340] = _createElementVNode("p", { class: "mt-2 text-[11px] text-slate-500 dark:text-slate-400" }, " SAFE는 기준일 이전 BUY/SELL 거래를 VOID하고 baseline BUY를 생성합니다. SAFE에서는 Asset/Portfolio 구조 변경이 불가합니다. ", -1))
              ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_458, " HARD는 임시 강제값입니다. 이후 sync/rebuild에서 원장값으로 덮어써질 수 있습니다. "))
            ]),
            _createElementVNode("div", _hoisted_459, [
              _createElementVNode("label", _hoisted_460, [
                _cache[343] || (_cache[343] = _createTextVNode("Asset ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[148] || (_cache[148] = ($event) => holdingEditForm.asset_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: lookupLoading.value || loading.action || loading.confirm || holdingEditForm.edit_mode === "SAFE"
                }, [
                  _cache[342] || (_cache[342] = _createElementVNode("option", { value: "" }, "Select Asset", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingAssetOptions.value, (item) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: item.id,
                      value: String(item.id)
                    }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ") ", 9, _hoisted_462);
                  }), 128))
                ], 8, _hoisted_461), [
                  [_vModelSelect, holdingEditForm.asset_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_463, [
                _cache[345] || (_cache[345] = _createTextVNode("Portfolio (optional) ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[149] || (_cache[149] = ($event) => holdingEditForm.portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: lookupLoading.value || loading.action || loading.confirm || holdingEditForm.edit_mode === "SAFE"
                }, [
                  _cache[344] || (_cache[344] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: item.id,
                      value: String(item.id)
                    }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_465);
                  }), 128))
                ], 8, _hoisted_464), [
                  [_vModelSelect, holdingEditForm.portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_466, [
                _cache[346] || (_cache[346] = _createTextVNode("Quantity ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[150] || (_cache[150] = ($event) => holdingEditForm.quantity = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.quantity]
                ])
              ]),
              _createElementVNode("label", _hoisted_467, [
                _cache[347] || (_cache[347] = _createTextVNode("Avg Cost ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[151] || (_cache[151] = ($event) => holdingEditForm.avg_price = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.avg_price]
                ])
              ]),
              _createElementVNode("label", _hoisted_468, [
                _cache[348] || (_cache[348] = _createTextVNode("Avg Cost Currency ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[152] || (_cache[152] = ($event) => holdingEditForm.avg_price_currency = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: `holding-edit-avg-${opt}`,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_469);
                  }), 64))
                ], 512), [
                  [_vModelSelect, holdingEditForm.avg_price_currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_470, [
                _cache[349] || (_cache[349] = _createTextVNode("Cost Basis (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[153] || (_cache[153] = ($event) => holdingEditForm.invested_amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.invested_amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_471, [
                _cache[350] || (_cache[350] = _createTextVNode("Cost Basis Currency ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[154] || (_cache[154] = ($event) => holdingEditForm.invested_amount_currency = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: `holding-edit-invested-${opt}`,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_472);
                  }), 64))
                ], 512), [
                  [_vModelSelect, holdingEditForm.invested_amount_currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_473, [
                _cache[351] || (_cache[351] = _createTextVNode("Source Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[155] || (_cache[155] = ($event) => holdingEditForm.source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: holdingEditForm.edit_mode === "SAFE"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingSourceTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_475);
                  }), 64))
                ], 8, _hoisted_474), [
                  [_vModelSelect, holdingEditForm.source_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_476, [
                _cache[352] || (_cache[352] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[156] || (_cache[156] = ($event) => holdingEditForm.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.memo]
                ])
              ]),
              _createElementVNode("label", _hoisted_477, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[157] || (_cache[157] = ($event) => holdingEditForm.is_hidden = $event),
                  type: "checkbox"
                }, null, 512), [
                  [_vModelCheckbox, holdingEditForm.is_hidden]
                ]),
                _cache[353] || (_cache[353] = _createElementVNode("span", { class: "ml-1" }, "Hidden", -1))
              ])
            ]),
            _createElementVNode("div", _hoisted_478, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeHoldingEditModal
              }, " Cancel ", 8, _hoisted_479),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitHoldingEdit
              }, " Apply ", 8, _hoisted_480)
            ])
          ])
        ])) : _createCommentVNode("", true),
        liabilityEditModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 3,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeLiabilityEditModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_481, [
            _createElementVNode("h3", _hoisted_482, "Edit Liability #" + _toDisplayString(liabilityEditForm.id), 1),
            _cache[375] || (_cache[375] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "부채 메타/잔액/금리/월납입/포함/숨김 상태를 수정합니다.", -1)),
            _createElementVNode("div", _hoisted_483, [
              _cache[360] || (_cache[360] = _createElementVNode("p", { class: "text-xs font-semibold text-slate-700 dark:text-slate-200" }, "Edit Mode", -1)),
              _createElementVNode("div", _hoisted_484, [
                _createElementVNode("label", _hoisted_485, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[158] || (_cache[158] = ($event) => liabilityEditForm.edit_mode = $event),
                    type: "radio",
                    value: "SAFE"
                  }, null, 512), [
                    [_vModelRadio, liabilityEditForm.edit_mode]
                  ]),
                  _cache[355] || (_cache[355] = _createElementVNode("span", null, "Rebaseline (Recommended)", -1))
                ]),
                _createElementVNode("label", _hoisted_486, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[159] || (_cache[159] = ($event) => liabilityEditForm.edit_mode = $event),
                    type: "radio",
                    value: "HARD",
                    disabled: !canHardEdit.value || loading.action || loading.confirm
                  }, null, 8, _hoisted_487), [
                    [_vModelRadio, liabilityEditForm.edit_mode]
                  ]),
                  _cache[356] || (_cache[356] = _createElementVNode("span", null, "Edit(Hard)", -1))
                ])
              ]),
              !canHardEdit.value ? (_openBlock(), _createElementBlock("p", _hoisted_488, " HARD 모드는 MAINTAINER+ 권한이 필요합니다. ")) : _createCommentVNode("", true),
              liabilityEditForm.edit_mode === "SAFE" ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                _createElementVNode("div", _hoisted_489, [
                  _createElementVNode("label", _hoisted_490, [
                    _cache[357] || (_cache[357] = _createTextVNode(" Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[160] || (_cache[160] = ($event) => liabilityEditForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, liabilityEditForm.effective_at]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_491, [
                    _cache[358] || (_cache[358] = _createTextVNode(" Reason (optional) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[161] || (_cache[161] = ($event) => liabilityEditForm.reason = $event),
                      placeholder: "예: 대출잔액 재기준점",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, liabilityEditForm.reason]
                    ])
                  ])
                ]),
                _cache[359] || (_cache[359] = _createElementVNode("p", { class: "mt-2 text-[11px] text-slate-500 dark:text-slate-400" }, " SAFE는 기준일 이전 LOAN_BORROW/LOAN_REPAY를 VOID하고 baseline LOAN_BORROW를 생성합니다. LOAN_INTEREST는 원금 비영향으로 유지됩니다. ", -1))
              ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_492, " HARD는 임시 강제값입니다. 이후 sync/rebuild에서 원장값으로 덮어써질 수 있습니다. "))
            ]),
            _createElementVNode("div", _hoisted_493, [
              _createElementVNode("label", _hoisted_494, [
                _cache[362] || (_cache[362] = _createTextVNode("Portfolio (optional) ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[162] || (_cache[162] = ($event) => liabilityEditForm.portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: lookupLoading.value || loading.action || loading.confirm || liabilityEditForm.edit_mode === "SAFE"
                }, [
                  _cache[361] || (_cache[361] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: item.id,
                      value: String(item.id)
                    }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_496);
                  }), 128))
                ], 8, _hoisted_495), [
                  [_vModelSelect, liabilityEditForm.portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_497, [
                _cache[363] || (_cache[363] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[163] || (_cache[163] = ($event) => liabilityEditForm.name = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_498, [
                _cache[364] || (_cache[364] = _createTextVNode("Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[164] || (_cache[164] = ($event) => liabilityEditForm.liability_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilityTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_499);
                  }), 64))
                ], 512), [
                  [_vModelSelect, liabilityEditForm.liability_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_500, [
                _cache[365] || (_cache[365] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[165] || (_cache[165] = ($event) => liabilityEditForm.currency = $event),
                  maxlength: "3",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950",
                  disabled: liabilityEditForm.edit_mode === "SAFE"
                }, null, 8, _hoisted_501), [
                  [_vModelText, liabilityEditForm.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_502, [
                _cache[366] || (_cache[366] = _createTextVNode("Outstanding Balance ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[166] || (_cache[166] = ($event) => liabilityEditForm.outstanding_balance = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.outstanding_balance]
                ])
              ]),
              _createElementVNode("label", _hoisted_503, [
                _cache[367] || (_cache[367] = _createTextVNode("Interest Rate (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[167] || (_cache[167] = ($event) => liabilityEditForm.interest_rate = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.interest_rate]
                ])
              ]),
              _createElementVNode("label", _hoisted_504, [
                _cache[368] || (_cache[368] = _createTextVNode("Monthly Payment (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[168] || (_cache[168] = ($event) => liabilityEditForm.monthly_payment = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.monthly_payment]
                ])
              ]),
              _createElementVNode("label", _hoisted_505, [
                _cache[369] || (_cache[369] = _createTextVNode("Source Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[169] || (_cache[169] = ($event) => liabilityEditForm.source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilitySourceTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_506);
                  }), 64))
                ], 512), [
                  [_vModelSelect, liabilityEditForm.source_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_507, [
                _cache[370] || (_cache[370] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[170] || (_cache[170] = ($event) => liabilityEditForm.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.memo]
                ])
              ]),
              _createElementVNode("label", _hoisted_508, [
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[171] || (_cache[171] = ($event) => liabilityEditForm.is_included = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, liabilityEditForm.is_included]
                  ]),
                  _cache[371] || (_cache[371] = _createTextVNode()),
                  _cache[372] || (_cache[372] = _createElementVNode("span", { class: "ml-1" }, "Included", -1))
                ]),
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[172] || (_cache[172] = ($event) => liabilityEditForm.is_hidden = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, liabilityEditForm.is_hidden]
                  ]),
                  _cache[373] || (_cache[373] = _createTextVNode()),
                  _cache[374] || (_cache[374] = _createElementVNode("span", { class: "ml-1" }, "Hidden", -1))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_509, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeLiabilityEditModal
              }, " Cancel ", 8, _hoisted_510),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitLiabilityEdit
              }, " Apply ", 8, _hoisted_511)
            ])
          ])
        ])) : _createCommentVNode("", true),
        entityHistoryModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 4,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeEntityHistory, ["self"])
        }, [
          _createElementVNode("section", _hoisted_512, [
            _createElementVNode("div", _hoisted_513, [
              _createElementVNode("div", null, [
                _cache[376] || (_cache[376] = _createElementVNode("h3", { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Entity History", -1)),
                _createElementVNode("p", _hoisted_514, _toDisplayString(entityHistoryState.title) + " · " + _toDisplayString(entityHistoryState.entity_type) + " #" + _toDisplayString(entityHistoryState.entity_id), 1)
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeEntityHistory
              }, " Close ", 8, _hoisted_515)
            ]),
            entityHistoryState.loading ? (_openBlock(), _createElementBlock("div", _hoisted_516, " Loading history... ")) : entityHistoryState.items.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_517, " No history found. ")) : (_openBlock(), _createElementBlock("div", _hoisted_518, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(entityHistoryState.items, (item) => {
                return _openBlock(), _createElementBlock("article", {
                  key: item.id,
                  class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                }, [
                  _createElementVNode("div", _hoisted_519, [
                    _createElementVNode("div", _hoisted_520, [
                      _createElementVNode("span", _hoisted_521, "#" + _toDisplayString(item.id) + " " + _toDisplayString(item.action), 1),
                      _cache[377] || (_cache[377] = _createElementVNode("span", { class: "mx-1" }, "·", -1)),
                      _createElementVNode("span", null, _toDisplayString(formatDateTime(item.created_at)), 1),
                      _cache[378] || (_cache[378] = _createElementVNode("span", { class: "mx-1" }, "·", -1)),
                      _createElementVNode("span", null, _toDisplayString(item.actor_email || "-"), 1)
                    ]),
                    _createElementVNode("button", {
                      type: "button",
                      class: "rounded border border-rose-300 px-2 py-0.5 text-xs text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                      disabled: isBusy.value || entityHistoryState.reverting_id === item.id,
                      onClick: ($event) => askRevertEntityHistory(item)
                    }, _toDisplayString(entityHistoryState.reverting_id === item.id ? "Reverting..." : "Revert"), 9, _hoisted_522)
                  ]),
                  item.reason ? (_openBlock(), _createElementBlock("p", _hoisted_523, "reason: " + _toDisplayString(item.reason), 1)) : _createCommentVNode("", true),
                  _createElementVNode("p", _hoisted_524, [
                    _cache[379] || (_cache[379] = _createTextVNode(" changed: ", -1)),
                    _createElementVNode("span", _hoisted_525, _toDisplayString(item.changed_fields && item.changed_fields.length > 0 ? item.changed_fields.join(", ") : "-"), 1)
                  ]),
                  _createElementVNode("div", _hoisted_526, [
                    _createElementVNode("div", null, [
                      _cache[380] || (_cache[380] = _createElementVNode("p", { class: "text-[11px] font-semibold text-slate-600 dark:text-slate-300" }, "before", -1)),
                      _createElementVNode("pre", _hoisted_527, _toDisplayString(JSON.stringify(item.before ?? {}, null, 2)), 1)
                    ]),
                    _createElementVNode("div", null, [
                      _cache[381] || (_cache[381] = _createElementVNode("p", { class: "text-[11px] font-semibold text-slate-600 dark:text-slate-300" }, "after", -1)),
                      _createElementVNode("pre", _hoisted_528, _toDisplayString(JSON.stringify(item.after ?? {}, null, 2)), 1)
                    ])
                  ])
                ]);
              }), 128))
            ]))
          ])
        ])) : _createCommentVNode("", true),
        confirmModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 5,
          class: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeConfirm, ["self"])
        }, [
          _createElementVNode("section", _hoisted_529, [
            _createElementVNode("h3", _hoisted_530, _toDisplayString(confirmModal.title), 1),
            _createElementVNode("p", _hoisted_531, _toDisplayString(confirmModal.message), 1),
            _createElementVNode("div", _hoisted_532, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.confirm,
                onClick: closeConfirm
              }, " Cancel ", 8, _hoisted_533),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.confirm,
                onClick: executeConfirm
              }, _toDisplayString(loading.confirm ? "Running..." : "Confirm"), 9, _hoisted_534)
            ])
          ])
        ])) : _createCommentVNode("", true)
      ], 64);
    };
  }
});

export { _sfc_main as default };
