import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, u as useDisplayCurrency, _ as _sfc_main$1, c as createLiability, b as updateLiability, g as getLiabilitiesTable, d as getLatestUsdKrwFxRate, e as getFxStaleMinutes, A as AxiosError, f as updateQuotesNow, t as testQuoteForAsset, i as upsertManualQuote, j as deleteLiability, k as getQuoteUpdateJobStatus } from './useDisplayCurrency-BZ-Ikfwn.js';
import { c as createHolding, u as updateHolding, a as getHoldingsTable, d as deleteHolding } from './holdings-0W50Tt_V.js';
import { c as createPortfolio, u as updatePortfolio, g as getPortfoliosTable, a as getPortfolios, d as deletePortfolio } from './portfolios-BgDo5vhb.js';
import { c as createReleaseNote, u as updateReleaseNote, g as getReleaseNotes, a as unpublishReleaseNote } from './releaseNotes-BlDYVT2V.js';

async function getAssets() {
  const { data } = await http.get("/assets");
  return data;
}
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

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,unref:_unref,createVNode:_createVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,vModelText:_vModelText,withDirectives:_withDirectives,createTextVNode:_createTextVNode,vModelCheckbox:_vModelCheckbox,renderList:_renderList,Fragment:_Fragment,normalizeClass:_normalizeClass,withKeys:_withKeys,withModifiers:_withModifiers,vModelSelect:_vModelSelect} = await importShared('vue');

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
const _hoisted_90 = { class: "inline-flex items-center gap-1" };
const _hoisted_91 = {
  key: 0,
  class: "inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
};
const _hoisted_92 = ["disabled", "onClick"];
const _hoisted_93 = { key: 0 };
const _hoisted_94 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2" };
const _hoisted_95 = { class: "flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_96 = ["disabled"];
const _hoisted_97 = ["disabled"];
const _hoisted_98 = ["disabled"];
const _hoisted_99 = {
  key: 1,
  class: "mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
};
const _hoisted_100 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_101 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_102 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_103 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_104 = ["disabled"];
const _hoisted_105 = ["disabled"];
const _hoisted_106 = {
  key: 0,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_107 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_108 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_109 = { class: "text-xs" };
const _hoisted_110 = { class: "text-xs" };
const _hoisted_111 = { class: "text-xs md:col-span-2" };
const _hoisted_112 = { class: "text-xs md:col-span-2" };
const _hoisted_113 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_114 = ["disabled"];
const _hoisted_115 = {
  key: 0,
  class: "text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_116 = { class: "mt-3 overflow-x-auto" };
const _hoisted_117 = { class: "w-full min-w-[980px] text-left text-xs leading-tight" };
const _hoisted_118 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_119 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_120 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_121 = { class: "px-2 py-1.5" };
const _hoisted_122 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_123 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_124 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_125 = { class: "flex flex-wrap gap-1" };
const _hoisted_126 = ["disabled", "onClick"];
const _hoisted_127 = ["disabled", "onClick"];
const _hoisted_128 = { key: 0 };
const _hoisted_129 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_130 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_131 = ["disabled"];
const _hoisted_132 = {
  key: 0,
  class: "mt-1 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_133 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_134 = {
  key: 2,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_135 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_136 = { class: "text-xs" };
const _hoisted_137 = ["value"];
const _hoisted_138 = { class: "text-xs" };
const _hoisted_139 = { class: "text-xs" };
const _hoisted_140 = { class: "text-xs" };
const _hoisted_141 = { class: "mt-3" };
const _hoisted_142 = ["disabled"];
const _hoisted_143 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_144 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_145 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_146 = ["disabled"];
const _hoisted_147 = ["disabled"];
const _hoisted_148 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_149 = ["disabled"];
const _hoisted_150 = ["disabled"];
const _hoisted_151 = { class: "mt-3 overflow-x-auto" };
const _hoisted_152 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_153 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_154 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_155 = { class: "opacity-70" };
const _hoisted_156 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_157 = { class: "opacity-70" };
const _hoisted_158 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_159 = { class: "opacity-70" };
const _hoisted_160 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_161 = { class: "opacity-70" };
const _hoisted_162 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_163 = { class: "opacity-70" };
const _hoisted_164 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_165 = { class: "opacity-70" };
const _hoisted_166 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_167 = { class: "opacity-70" };
const _hoisted_168 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_169 = { class: "opacity-70" };
const _hoisted_170 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_171 = { class: "opacity-70" };
const _hoisted_172 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_173 = { class: "opacity-70" };
const _hoisted_174 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_175 = { class: "opacity-70" };
const _hoisted_176 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_177 = { class: "opacity-70" };
const _hoisted_178 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_179 = { class: "opacity-70" };
const _hoisted_180 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_181 = { class: "opacity-70" };
const _hoisted_182 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_183 = { class: "opacity-70" };
const _hoisted_184 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_185 = { class: "opacity-70" };
const _hoisted_186 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_187 = { class: "opacity-70" };
const _hoisted_188 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_189 = { class: "opacity-70" };
const _hoisted_190 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_191 = { class: "opacity-70" };
const _hoisted_192 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_193 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_194 = { class: "px-2 py-1.5 whitespace-nowrap" };
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
const _hoisted_214 = { class: "flex min-w-max flex-nowrap gap-1" };
const _hoisted_215 = ["disabled", "onClick"];
const _hoisted_216 = ["disabled", "onClick"];
const _hoisted_217 = ["disabled", "onClick"];
const _hoisted_218 = ["disabled", "onClick"];
const _hoisted_219 = { key: 0 };
const _hoisted_220 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_221 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_222 = ["disabled"];
const _hoisted_223 = ["disabled"];
const _hoisted_224 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_225 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_226 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_227 = ["value"];
const _hoisted_228 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_229 = ["value"];
const _hoisted_230 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_231 = ["value"];
const _hoisted_232 = { class: "mt-2" };
const _hoisted_233 = ["disabled"];
const _hoisted_234 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_235 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_236 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_237 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_238 = ["disabled"];
const _hoisted_239 = ["disabled"];
const _hoisted_240 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_241 = ["disabled"];
const _hoisted_242 = ["disabled"];
const _hoisted_243 = { class: "mt-3 overflow-x-auto" };
const _hoisted_244 = { class: "w-full min-w-[1220px] text-left text-xs leading-tight" };
const _hoisted_245 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_246 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_247 = { class: "opacity-70" };
const _hoisted_248 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_249 = { class: "opacity-70" };
const _hoisted_250 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_251 = { class: "opacity-70" };
const _hoisted_252 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_253 = { class: "opacity-70" };
const _hoisted_254 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_255 = { class: "opacity-70" };
const _hoisted_256 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_257 = { class: "opacity-70" };
const _hoisted_258 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_259 = { class: "opacity-70" };
const _hoisted_260 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_261 = { class: "opacity-70" };
const _hoisted_262 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_263 = { class: "opacity-70" };
const _hoisted_264 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_265 = { class: "opacity-70" };
const _hoisted_266 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_267 = { class: "opacity-70" };
const _hoisted_268 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_269 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_270 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_271 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_272 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_273 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_274 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_275 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_276 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_277 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_278 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_279 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_280 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_281 = { class: "flex flex-wrap gap-1" };
const _hoisted_282 = ["disabled", "onClick"];
const _hoisted_283 = ["disabled", "onClick"];
const _hoisted_284 = ["disabled", "onClick"];
const _hoisted_285 = { key: 0 };
const _hoisted_286 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_287 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_288 = ["disabled"];
const _hoisted_289 = ["disabled"];
const _hoisted_290 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_291 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_292 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_293 = ["disabled"];
const _hoisted_294 = ["value"];
const _hoisted_295 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_296 = ["disabled"];
const _hoisted_297 = ["value"];
const _hoisted_298 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_299 = ["disabled"];
const _hoisted_300 = ["value"];
const _hoisted_301 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_302 = ["disabled"];
const _hoisted_303 = ["value"];
const _hoisted_304 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_305 = ["value"];
const _hoisted_306 = { class: "mt-2" };
const _hoisted_307 = ["disabled"];
const _hoisted_308 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_309 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_310 = { class: "flex flex-wrap items-start justify-between gap-2" };
const _hoisted_311 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_312 = ["disabled"];
const _hoisted_313 = ["disabled"];
const _hoisted_314 = { class: "mt-3 flex flex-wrap items-center gap-2" };
const _hoisted_315 = ["disabled"];
const _hoisted_316 = ["disabled"];
const _hoisted_317 = { class: "mt-3 overflow-x-auto" };
const _hoisted_318 = { class: "w-full min-w-[1100px] text-left text-xs leading-tight" };
const _hoisted_319 = { class: "bg-slate-50 dark:bg-slate-800" };
const _hoisted_320 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_321 = { class: "opacity-70" };
const _hoisted_322 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_323 = { class: "opacity-70" };
const _hoisted_324 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_325 = { class: "opacity-70" };
const _hoisted_326 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_327 = { class: "opacity-70" };
const _hoisted_328 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_329 = { class: "opacity-70" };
const _hoisted_330 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_331 = { class: "opacity-70" };
const _hoisted_332 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_333 = { class: "opacity-70" };
const _hoisted_334 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_335 = { class: "opacity-70" };
const _hoisted_336 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_337 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_338 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_339 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_340 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_341 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_342 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_343 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_344 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_345 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_346 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_347 = { class: "px-2 py-1.5 whitespace-nowrap" };
const _hoisted_348 = { class: "flex flex-wrap gap-1" };
const _hoisted_349 = ["disabled", "onClick"];
const _hoisted_350 = ["disabled", "onClick"];
const _hoisted_351 = ["disabled", "onClick"];
const _hoisted_352 = ["disabled", "onClick"];
const _hoisted_353 = { key: 0 };
const _hoisted_354 = { class: "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_355 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_356 = ["disabled"];
const _hoisted_357 = ["disabled"];
const _hoisted_358 = {
  key: 0,
  class: "mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
};
const _hoisted_359 = { class: "grid grid-cols-1 gap-2 md:grid-cols-3" };
const _hoisted_360 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_361 = ["disabled"];
const _hoisted_362 = ["value"];
const _hoisted_363 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_364 = ["value"];
const _hoisted_365 = { class: "text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_366 = ["value"];
const _hoisted_367 = { class: "mt-2" };
const _hoisted_368 = ["disabled"];
const _hoisted_369 = {
  key: 1,
  class: "mt-2 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_370 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_371 = { class: "mt-3 max-h-72 space-y-2 overflow-y-auto" };
const _hoisted_372 = { class: "font-semibold" };
const _hoisted_373 = { class: "mt-0.5" };
const _hoisted_374 = { class: "mt-0.5 opacity-70" };
const _hoisted_375 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_376 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_377 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_378 = { class: "text-xs" };
const _hoisted_379 = { class: "text-xs" };
const _hoisted_380 = ["value"];
const _hoisted_381 = { class: "text-xs" };
const _hoisted_382 = { class: "text-xs" };
const _hoisted_383 = { class: "text-xs" };
const _hoisted_384 = ["value"];
const _hoisted_385 = { class: "text-xs" };
const _hoisted_386 = { class: "text-xs md:col-span-2" };
const _hoisted_387 = { class: "text-xs md:col-span-2" };
const _hoisted_388 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_389 = ["disabled"];
const _hoisted_390 = ["disabled"];
const _hoisted_391 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_392 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_393 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_394 = { class: "text-xs" };
const _hoisted_395 = { class: "text-xs" };
const _hoisted_396 = ["value"];
const _hoisted_397 = { class: "text-xs" };
const _hoisted_398 = { class: "text-xs" };
const _hoisted_399 = { class: "text-xs" };
const _hoisted_400 = ["value"];
const _hoisted_401 = { class: "text-xs" };
const _hoisted_402 = ["value"];
const _hoisted_403 = { class: "text-xs" };
const _hoisted_404 = { class: "text-xs" };
const _hoisted_405 = { class: "text-xs md:col-span-2" };
const _hoisted_406 = { class: "text-xs md:col-span-2 flex flex-wrap items-center gap-4" };
const _hoisted_407 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_408 = ["disabled"];
const _hoisted_409 = ["disabled"];
const _hoisted_410 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_411 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_412 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_413 = { class: "text-xs" };
const _hoisted_414 = ["disabled"];
const _hoisted_415 = ["value"];
const _hoisted_416 = { class: "text-xs" };
const _hoisted_417 = ["disabled"];
const _hoisted_418 = ["value"];
const _hoisted_419 = { class: "text-xs" };
const _hoisted_420 = { class: "text-xs" };
const _hoisted_421 = { class: "text-xs" };
const _hoisted_422 = ["value"];
const _hoisted_423 = { class: "text-xs" };
const _hoisted_424 = { class: "text-xs" };
const _hoisted_425 = ["value"];
const _hoisted_426 = { class: "text-xs" };
const _hoisted_427 = ["value"];
const _hoisted_428 = { class: "text-xs md:col-span-2" };
const _hoisted_429 = { class: "text-xs md:col-span-2" };
const _hoisted_430 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_431 = ["disabled"];
const _hoisted_432 = ["disabled"];
const _hoisted_433 = { class: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_434 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_435 = { class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_436 = { class: "text-xs" };
const _hoisted_437 = ["disabled"];
const _hoisted_438 = ["value"];
const _hoisted_439 = { class: "text-xs" };
const _hoisted_440 = { class: "text-xs" };
const _hoisted_441 = ["value"];
const _hoisted_442 = { class: "text-xs" };
const _hoisted_443 = { class: "text-xs" };
const _hoisted_444 = { class: "text-xs" };
const _hoisted_445 = { class: "text-xs" };
const _hoisted_446 = { class: "text-xs" };
const _hoisted_447 = ["value"];
const _hoisted_448 = { class: "text-xs md:col-span-2" };
const _hoisted_449 = { class: "text-xs md:col-span-2 flex flex-wrap items-center gap-4" };
const _hoisted_450 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_451 = ["disabled"];
const _hoisted_452 = ["disabled"];
const _hoisted_453 = { class: "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_454 = { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_455 = { class: "mt-2 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_456 = { class: "mt-4 flex justify-end gap-2" };
const _hoisted_457 = ["disabled"];
const _hoisted_458 = ["disabled"];
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
    const appSecrets = ref([]);
    const releaseNotes = ref([]);
    const usdKrwFx = ref(null);
    const logs = ref([]);
    const { displayCurrency, settingsSaving, ensureInitialized, setDisplayCurrency } = useDisplayCurrency();
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
      memo: ""
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
      memo: ""
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
      memo: ""
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
      if (!value) return "-";
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return value;
      return dt.toLocaleString("ko-KR");
    }
    function formatDateTimeLocalInput(value) {
      if (!value) return "";
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return "";
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      const hour = String(dt.getHours()).padStart(2, "0");
      const minute = String(dt.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hour}:${minute}`;
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
      runAction("Manual Quote", "Manual Quote", "수동 시세를 반영할까요?", async () => {
        const payload = {
          asset_id: toPositiveInt(manualQuoteForm.asset_id),
          price: manualQuoteForm.price.trim(),
          currency: normalizeUpper(manualQuoteForm.currency),
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
        closePortfolioEditModal();
        runAction("Portfolio Update", "Apply Portfolio Update", `Portfolio #${portfolioId} 정보를 수정할까요?`, async () => {
          await updatePortfolio(portfolioId, {
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
          });
        });
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
        const avgPrice = parseRequiredDecimal(holdingEditForm.avg_price, "Avg price");
        closeHoldingEditModal();
        runAction("Holding Update", "Apply Holding Update", `Holding #${holdingId} 정보를 수정할까요?`, async () => {
          await updateHolding(holdingId, {
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
          });
        });
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
        closeLiabilityEditModal();
        runAction("Liability Update", "Apply Liability Update", `Liability #${liabilityId} 정보를 수정할까요?`, async () => {
          await updateLiability(liabilityId, {
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
          });
        });
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
    async function onChangeDisplayCurrency(value) {
      try {
        await setDisplayCurrency(value);
      } catch (error) {
        pushLog("Display Currency", "ERROR", getErrorMessage(error));
      }
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
                _cache[157] || (_cache[157] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300" }, "Agent", -1)),
                _cache[158] || (_cache[158] = _createElementVNode("h1", { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Asset Control Console", -1)),
                _createElementVNode("p", _hoisted_4, "Role: " + _toDisplayString(me.value?.role || "-") + " / " + _toDisplayString(me.value?.email || "-"), 1)
              ]),
              _createElementVNode("div", _hoisted_5, [
                _createVNode(_sfc_main$1, {
                  "model-value": _unref(displayCurrency),
                  disabled: isBusy.value || _unref(settingsSaving),
                  loading: _unref(settingsSaving),
                  "onUpdate:modelValue": onChangeDisplayCurrency
                }, null, 8, ["model-value", "disabled", "loading"]),
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
              _cache[159] || (_cache[159] = _createElementVNode("div", null, [
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
                  _cache[160] || (_cache[160] = _createTextVNode("Provider ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => secretForm.provider = $event),
                    placeholder: "e.g. DATA_GO_KR / UPBIT / KIWOOM / KORBANK",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, secretForm.provider]
                  ])
                ]),
                _createElementVNode("label", _hoisted_16, [
                  _cache[161] || (_cache[161] = _createTextVNode("Key Name ", -1)),
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
                  _cache[162] || (_cache[162] = _createTextVNode("Description ", -1)),
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
                  _cache[163] || (_cache[163] = _createElementVNode("span", { class: "ml-1" }, "Active", -1))
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
                  _cache[165] || (_cache[165] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
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
                    appSecrets.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_35, [..._cache[164] || (_cache[164] = [
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
              _cache[166] || (_cache[166] = _createElementVNode("div", null, [
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
                          _cache[167] || (_cache[167] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_50, _toDisplayString(sortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_51, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[10] || (_cache[10] = ($event) => toggleSort("name"))
                        }, [
                          _cache[168] || (_cache[168] = _createTextVNode("Name ", -1)),
                          _createElementVNode("span", _hoisted_52, _toDisplayString(sortIndicator("name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_53, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[11] || (_cache[11] = ($event) => toggleSort("symbol"))
                        }, [
                          _cache[169] || (_cache[169] = _createTextVNode("Symbol ", -1)),
                          _createElementVNode("span", _hoisted_54, _toDisplayString(sortIndicator("symbol")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_55, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[12] || (_cache[12] = ($event) => toggleSort("price"))
                        }, [
                          _cache[170] || (_cache[170] = _createTextVNode("Price ", -1)),
                          _createElementVNode("span", _hoisted_56, _toDisplayString(sortIndicator("price")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_57, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[13] || (_cache[13] = ($event) => toggleSort("currency"))
                        }, [
                          _cache[171] || (_cache[171] = _createTextVNode("Currency ", -1)),
                          _createElementVNode("span", _hoisted_58, _toDisplayString(sortIndicator("currency")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_59, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[14] || (_cache[14] = ($event) => toggleSort("asset_class"))
                        }, [
                          _cache[172] || (_cache[172] = _createTextVNode("Class ", -1)),
                          _createElementVNode("span", _hoisted_60, _toDisplayString(sortIndicator("asset_class")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_61, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[15] || (_cache[15] = ($event) => toggleSort("updated_at"))
                        }, [
                          _cache[173] || (_cache[173] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_62, _toDisplayString(sortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_63, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[16] || (_cache[16] = ($event) => toggleSort("quote_mode"))
                        }, [
                          _cache[174] || (_cache[174] = _createTextVNode("Quote ", -1)),
                          _createElementVNode("span", _hoisted_64, _toDisplayString(sortIndicator("quote_mode")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_65, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[17] || (_cache[17] = ($event) => toggleSort("quote_as_of"))
                        }, [
                          _cache[175] || (_cache[175] = _createTextVNode("Quote As Of ", -1)),
                          _createElementVNode("span", _hoisted_66, _toDisplayString(sortIndicator("quote_as_of")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_67, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[18] || (_cache[18] = ($event) => toggleSort("exchange_code"))
                        }, [
                          _cache[176] || (_cache[176] = _createTextVNode("Exchange ", -1)),
                          _createElementVNode("span", _hoisted_68, _toDisplayString(sortIndicator("exchange_code")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_69, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[19] || (_cache[19] = ($event) => toggleSort("source"))
                        }, [
                          _cache[177] || (_cache[177] = _createTextVNode("Source ", -1)),
                          _createElementVNode("span", _hoisted_70, _toDisplayString(sortIndicator("source")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_71, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[20] || (_cache[20] = ($event) => toggleSort("trade"))
                        }, [
                          _cache[178] || (_cache[178] = _createTextVNode("Trade ", -1)),
                          _createElementVNode("span", _hoisted_72, _toDisplayString(sortIndicator("trade")), 1)
                        ])
                      ]),
                      _cache[179] || (_cache[179] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
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
                            item.quote_mode === "AUTO" ? (_openBlock(), _createElementBlock("button", {
                              key: 0,
                              type: "button",
                              class: "rounded border border-sky-300 px-2 py-0.5 text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:focus:ring-sky-700",
                              disabled: !canManageQuotes.value || isBusy.value,
                              onClick: _withModifiers(($event) => askQuoteTestAsset(item), ["stop"])
                            }, [
                              _createElementVNode("span", _hoisted_90, [
                                quoteTestingAssetId.value === item.id && loading.action ? (_openBlock(), _createElementBlock("span", _hoisted_91)) : _createCommentVNode("", true),
                                _createElementVNode("span", null, _toDisplayString(quoteTestingAssetId.value === item.id && loading.action ? "Testing..." : "Quote"), 1)
                              ])
                            ], 8, _hoisted_89)) : _createCommentVNode("", true),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: _withModifiers(($event) => askDeleteAsset(item), ["stop"])
                            }, " Delete ", 8, _hoisted_92)
                          ])
                        ])
                      ], 10, _hoisted_73);
                    }), 128)),
                    assets.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_93, [..._cache[180] || (_cache[180] = [
                      _createElementVNode("td", {
                        colspan: "13",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No assets found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_94, [
                _createElementVNode("div", _hoisted_95, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(assetsQuery.total), 1),
                  _cache[183] || (_cache[183] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(assetsQuery.page) + " / " + _toDisplayString(totalPages.value), 1),
                  _cache[184] || (_cache[184] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[182] || (_cache[182] = _createTextVNode(" Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => assetsQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[22] || (_cache[22] = ($event) => {
                        assetsQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[181] || (_cache[181] = [
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
                  }, " Prev ", 8, _hoisted_96),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || assetsQuery.page >= totalPages.value,
                    onClick: _cache[24] || (_cache[24] = ($event) => movePage(1))
                  }, " Next ", 8, _hoisted_97)
                ]),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: !canManageAssets.value || isBusy.value,
                  onClick: openCreateAssetModal
                }, " Create Asset ", 8, _hoisted_98)
              ]),
              _cache[185] || (_cache[185] = _createElementVNode("p", { class: "mt-2 text-xs text-slate-500 dark:text-slate-400" }, "Create/Edit/Delete는 Admin/Maintainer 전용입니다.", -1)),
              !canManageAssets.value ? (_openBlock(), _createElementBlock("p", _hoisted_99, " USER/SUPERUSER는 Asset 생성/수정/삭제 권한이 없습니다. Admin/Maintainer에게 요청하세요. ")) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_100, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_101, [
            _createElementVNode("div", _hoisted_102, [
              _cache[186] || (_cache[186] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Release Notes (Admin)"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Home 하단 Release Notes 카드를 Agent에서 직접 관리합니다.")
              ], -1)),
              _createElementVNode("div", _hoisted_103, [
                canManageReleaseNotes.value && !releaseNotesSectionCollapsed.value ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                  disabled: isBusy.value,
                  onClick: resetReleaseNoteForm
                }, " Reset Form ", 8, _hoisted_104)) : _createCommentVNode("", true),
                canManageReleaseNotes.value ? (_openBlock(), _createElementBlock("button", {
                  key: 1,
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                  disabled: isBusy.value,
                  onClick: _cache[25] || (_cache[25] = ($event) => releaseNotesSectionCollapsed.value = !releaseNotesSectionCollapsed.value)
                }, _toDisplayString(releaseNotesSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_105)) : _createCommentVNode("", true)
              ])
            ]),
            !canManageReleaseNotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_106, " Only ADMIN can view/create/update/unpublish release notes. ")) : releaseNotesSectionCollapsed.value ? (_openBlock(), _createElementBlock("p", _hoisted_107, " 섹션이 접혀 있습니다. Expand 버튼으로 열어주세요. ")) : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _createElementVNode("div", _hoisted_108, [
                _createElementVNode("label", _hoisted_109, [
                  _cache[187] || (_cache[187] = _createTextVNode("Released At (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => releaseNoteForm.released_at = $event),
                    type: "datetime-local",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, releaseNoteForm.released_at]
                  ])
                ]),
                _createElementVNode("label", _hoisted_110, [
                  _cache[188] || (_cache[188] = _createTextVNode("Title ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => releaseNoteForm.title = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, releaseNoteForm.title]
                  ])
                ]),
                _createElementVNode("label", _hoisted_111, [
                  _cache[189] || (_cache[189] = _createTextVNode("Summary ", -1)),
                  _withDirectives(_createElementVNode("textarea", {
                    "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => releaseNoteForm.summary = $event),
                    rows: "3",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, releaseNoteForm.summary]
                  ])
                ]),
                _createElementVNode("label", _hoisted_112, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => releaseNoteForm.is_published = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, releaseNoteForm.is_published]
                  ]),
                  _cache[190] || (_cache[190] = _createElementVNode("span", { class: "ml-1" }, "Published", -1))
                ])
              ]),
              _createElementVNode("div", _hoisted_113, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500",
                  disabled: isBusy.value,
                  onClick: submitReleaseNoteForm
                }, _toDisplayString(releaseNoteForm.id ? "Update Release Note" : "Create Release Note"), 9, _hoisted_114),
                releaseNoteForm.id ? (_openBlock(), _createElementBlock("span", _hoisted_115, "Editing #" + _toDisplayString(releaseNoteForm.id), 1)) : _createCommentVNode("", true)
              ]),
              _createElementVNode("div", _hoisted_116, [
                _createElementVNode("table", _hoisted_117, [
                  _cache[192] || (_cache[192] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
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
                        _createElementVNode("td", _hoisted_118, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_119, _toDisplayString(formatDateTime(item.released_at)), 1),
                        _createElementVNode("td", _hoisted_120, _toDisplayString(item.title), 1),
                        _createElementVNode("td", _hoisted_121, _toDisplayString(item.summary), 1),
                        _createElementVNode("td", _hoisted_122, _toDisplayString(item.is_published ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_123, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_124, [
                          _createElementVNode("div", _hoisted_125, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => fillReleaseNoteForm(item)
                            }, " Edit ", 8, _hoisted_126),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700",
                              disabled: isBusy.value || !item.is_published,
                              onClick: ($event) => askUnpublishReleaseNote(item)
                            }, " Unpublish ", 8, _hoisted_127)
                          ])
                        ])
                      ]);
                    }), 128)),
                    releaseNotes.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_128, [..._cache[191] || (_cache[191] = [
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
          _createElementVNode("article", _hoisted_129, [
            _createElementVNode("div", _hoisted_130, [
              _cache[193] || (_cache[193] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Quote Actions (Admin/Maintainer)", -1)),
              canManageQuotes.value ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                type: "button",
                class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: isBusy.value,
                onClick: _cache[30] || (_cache[30] = ($event) => quoteActionsCollapsed.value = !quoteActionsCollapsed.value)
              }, _toDisplayString(quoteActionsCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_131)) : _createCommentVNode("", true)
            ]),
            selectedAssetForQuote.value ? (_openBlock(), _createElementBlock("p", _hoisted_132, " Selected: " + _toDisplayString(selectedAssetForQuote.value.name) + " (" + _toDisplayString(selectedAssetForQuote.value.exchange_code) + ") ", 1)) : _createCommentVNode("", true),
            !canManageQuotes.value ? (_openBlock(), _createElementBlock("p", _hoisted_133, "권한이 없어 조회만 가능합니다.")) : quoteActionsCollapsed.value ? (_openBlock(), _createElementBlock("p", _hoisted_134, "폼이 접혀 있습니다. Expand 버튼으로 열어주세요.")) : (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
              _createElementVNode("div", _hoisted_135, [
                _createElementVNode("label", _hoisted_136, [
                  _cache[195] || (_cache[195] = _createTextVNode("Asset ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => manualQuoteForm.asset_id = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[194] || (_cache[194] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (item) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: item.id,
                        value: String(item.id)
                      }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ")", 9, _hoisted_137);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, manualQuoteForm.asset_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_138, [
                  _cache[196] || (_cache[196] = _createTextVNode("Price ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => manualQuoteForm.price = $event),
                    placeholder: "예: 810000000",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.price]
                  ])
                ]),
                _createElementVNode("label", _hoisted_139, [
                  _cache[197] || (_cache[197] = _createTextVNode("Currency ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => manualQuoteForm.currency = $event),
                    maxlength: "3",
                    placeholder: "KRW",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.currency]
                  ])
                ]),
                _createElementVNode("label", _hoisted_140, [
                  _cache[198] || (_cache[198] = _createTextVNode("As Of ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => manualQuoteForm.as_of = $event),
                    type: "datetime-local",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, manualQuoteForm.as_of]
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_141, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500",
                  disabled: isBusy.value,
                  onClick: askApplyManualQuote
                }, " Apply Manual Quote ", 8, _hoisted_142)
              ])
            ], 64))
          ]),
          _createElementVNode("article", _hoisted_143, [
            _createElementVNode("div", _hoisted_144, [
              _cache[199] || (_cache[199] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Portfolios Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("div", _hoisted_145, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: !canManageAssets.value || isBusy.value,
                  onClick: _cache[35] || (_cache[35] = ($event) => quickCreatePortfolioOpen.value = !quickCreatePortfolioOpen.value)
                }, _toDisplayString(quickCreatePortfolioOpen.value ? "Close Create" : "Quick Create Portfolio"), 9, _hoisted_146),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[36] || (_cache[36] = ($event) => portfoliosSectionCollapsed.value = !portfoliosSectionCollapsed.value)
                }, _toDisplayString(portfoliosSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_147)
              ])
            ]),
            !portfoliosSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("div", _hoisted_148, [
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
                }, "Search", 8, _hoisted_149),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearPortfolioSearch
                }, "Clear", 8, _hoisted_150)
              ]),
              _createElementVNode("div", _hoisted_151, [
                _createElementVNode("table", _hoisted_152, [
                  _createElementVNode("thead", _hoisted_153, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_154, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[38] || (_cache[38] = ($event) => togglePortfolioSort("id"))
                        }, [
                          _cache[200] || (_cache[200] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_155, _toDisplayString(portfolioSortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_156, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[39] || (_cache[39] = ($event) => togglePortfolioSort("name"))
                        }, [
                          _cache[201] || (_cache[201] = _createTextVNode("Name ", -1)),
                          _createElementVNode("span", _hoisted_157, _toDisplayString(portfolioSortIndicator("name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_158, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[40] || (_cache[40] = ($event) => togglePortfolioSort("type"))
                        }, [
                          _cache[202] || (_cache[202] = _createTextVNode("Type ", -1)),
                          _createElementVNode("span", _hoisted_159, _toDisplayString(portfolioSortIndicator("type")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_160, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[41] || (_cache[41] = ($event) => togglePortfolioSort("category"))
                        }, [
                          _cache[203] || (_cache[203] = _createTextVNode("Category ", -1)),
                          _createElementVNode("span", _hoisted_161, _toDisplayString(portfolioSortIndicator("category")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_162, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[42] || (_cache[42] = ($event) => togglePortfolioSort("exchange_code"))
                        }, [
                          _cache[204] || (_cache[204] = _createTextVNode("Exchange ", -1)),
                          _createElementVNode("span", _hoisted_163, _toDisplayString(portfolioSortIndicator("exchange_code")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_164, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[43] || (_cache[43] = ($event) => togglePortfolioSort("base_currency"))
                        }, [
                          _cache[205] || (_cache[205] = _createTextVNode("Currency ", -1)),
                          _createElementVNode("span", _hoisted_165, _toDisplayString(portfolioSortIndicator("base_currency")), 1)
                        ])
                      ]),
                      _cache[219] || (_cache[219] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Included", -1)),
                      _cache[220] || (_cache[220] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                      _createElementVNode("th", _hoisted_166, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[44] || (_cache[44] = ($event) => togglePortfolioSort("cumulative_deposit_amount"))
                        }, [
                          _cache[206] || (_cache[206] = _createTextVNode("Deposit ", -1)),
                          _createElementVNode("span", _hoisted_167, _toDisplayString(portfolioSortIndicator("cumulative_deposit_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_168, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[45] || (_cache[45] = ($event) => togglePortfolioSort("cumulative_withdrawal_amount"))
                        }, [
                          _cache[207] || (_cache[207] = _createTextVNode("Withdrawal ", -1)),
                          _createElementVNode("span", _hoisted_169, _toDisplayString(portfolioSortIndicator("cumulative_withdrawal_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_170, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[46] || (_cache[46] = ($event) => togglePortfolioSort("gross_assets_total"))
                        }, [
                          _cache[208] || (_cache[208] = _createTextVNode("Gross ", -1)),
                          _createElementVNode("span", _hoisted_171, _toDisplayString(portfolioSortIndicator("gross_assets_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_172, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[47] || (_cache[47] = ($event) => togglePortfolioSort("liabilities_total"))
                        }, [
                          _cache[209] || (_cache[209] = _createTextVNode("Debt ", -1)),
                          _createElementVNode("span", _hoisted_173, _toDisplayString(portfolioSortIndicator("liabilities_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_174, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[48] || (_cache[48] = ($event) => togglePortfolioSort("net_assets_total"))
                        }, [
                          _cache[210] || (_cache[210] = _createTextVNode("Net ", -1)),
                          _createElementVNode("span", _hoisted_175, _toDisplayString(portfolioSortIndicator("net_assets_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_176, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[49] || (_cache[49] = ($event) => togglePortfolioSort("principal_minus_debt_total"))
                        }, [
                          _cache[211] || (_cache[211] = _createTextVNode("Base(Net) ", -1)),
                          _createElementVNode("span", _hoisted_177, _toDisplayString(portfolioSortIndicator("principal_minus_debt_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_178, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[50] || (_cache[50] = ($event) => togglePortfolioSort("net_assets_profit_total"))
                        }, [
                          _cache[212] || (_cache[212] = _createTextVNode("Net Profit ", -1)),
                          _createElementVNode("span", _hoisted_179, _toDisplayString(portfolioSortIndicator("net_assets_profit_total")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_180, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[51] || (_cache[51] = ($event) => togglePortfolioSort("net_assets_return_pct"))
                        }, [
                          _cache[213] || (_cache[213] = _createTextVNode("Net Return% ", -1)),
                          _createElementVNode("span", _hoisted_181, _toDisplayString(portfolioSortIndicator("net_assets_return_pct")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_182, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[52] || (_cache[52] = ($event) => togglePortfolioSort("total_pnl_amount"))
                        }, [
                          _cache[214] || (_cache[214] = _createTextVNode("PnL ", -1)),
                          _createElementVNode("span", _hoisted_183, _toDisplayString(portfolioSortIndicator("total_pnl_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_184, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[53] || (_cache[53] = ($event) => togglePortfolioSort("total_return_pct"))
                        }, [
                          _cache[215] || (_cache[215] = _createTextVNode("Return% ", -1)),
                          _createElementVNode("span", _hoisted_185, _toDisplayString(portfolioSortIndicator("total_return_pct")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_186, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[54] || (_cache[54] = ($event) => togglePortfolioSort("holding_count"))
                        }, [
                          _cache[216] || (_cache[216] = _createTextVNode("Holdings ", -1)),
                          _createElementVNode("span", _hoisted_187, _toDisplayString(portfolioSortIndicator("holding_count")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_188, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[55] || (_cache[55] = ($event) => togglePortfolioSort("liability_count"))
                        }, [
                          _cache[217] || (_cache[217] = _createTextVNode("Liabilities ", -1)),
                          _createElementVNode("span", _hoisted_189, _toDisplayString(portfolioSortIndicator("liability_count")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_190, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[56] || (_cache[56] = ($event) => togglePortfolioSort("updated_at"))
                        }, [
                          _cache[218] || (_cache[218] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_191, _toDisplayString(portfolioSortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _cache[221] || (_cache[221] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolioRows.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_192, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_193, _toDisplayString(item.name), 1),
                        _createElementVNode("td", _hoisted_194, _toDisplayString(item.type), 1),
                        _createElementVNode("td", _hoisted_195, _toDisplayString(item.category || "-"), 1),
                        _createElementVNode("td", _hoisted_196, _toDisplayString(item.exchange_code || "-"), 1),
                        _createElementVNode("td", _hoisted_197, _toDisplayString(item.base_currency), 1),
                        _createElementVNode("td", _hoisted_198, _toDisplayString(item.is_included ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_199, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_200, _toDisplayString(formatMoney(item.cumulative_deposit_amount, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_201, _toDisplayString(formatMoney(item.cumulative_withdrawal_amount, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_202, _toDisplayString(formatMoney(item.gross_assets_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_203, _toDisplayString(formatMoney(item.liabilities_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_204, _toDisplayString(formatMoney(item.net_assets_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_205, _toDisplayString(formatMoney(item.principal_minus_debt_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_206, _toDisplayString(formatMoney(item.net_assets_profit_total, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_207, _toDisplayString(formatPct(item.net_assets_return_pct)), 1),
                        _createElementVNode("td", _hoisted_208, _toDisplayString(formatMoney(item.total_pnl_amount, item.base_currency)), 1),
                        _createElementVNode("td", _hoisted_209, _toDisplayString(formatPct(item.total_return_pct)), 1),
                        _createElementVNode("td", _hoisted_210, _toDisplayString(item.holding_count), 1),
                        _createElementVNode("td", _hoisted_211, _toDisplayString(item.liability_count), 1),
                        _createElementVNode("td", _hoisted_212, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_213, [
                          _createElementVNode("div", _hoisted_214, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => openEditPortfolioModal(item)
                            }, " Edit ", 8, _hoisted_215),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => togglePortfolioIncluded(item)
                            }, _toDisplayString(item.is_included ? "Exclude" : "Include"), 9, _hoisted_216),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => togglePortfolioHidden(item)
                            }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_217),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                              disabled: !canManageAssets.value || isBusy.value,
                              onClick: ($event) => askDeletePortfolio(item)
                            }, "Delete", 8, _hoisted_218)
                          ])
                        ])
                      ]);
                    }), 128)),
                    portfolioRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_219, [..._cache[222] || (_cache[222] = [
                      _createElementVNode("td", {
                        colspan: "22",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No portfolios found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_220, [
                _createElementVNode("div", _hoisted_221, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(portfolioQuery.total), 1),
                  _cache[225] || (_cache[225] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(portfolioQuery.page) + " / " + _toDisplayString(portfolioTotalPages.value), 1),
                  _cache[226] || (_cache[226] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[224] || (_cache[224] = _createTextVNode("Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[57] || (_cache[57] = ($event) => portfolioQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[58] || (_cache[58] = ($event) => {
                        portfolioQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[223] || (_cache[223] = [
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
                    onClick: _cache[59] || (_cache[59] = ($event) => movePortfolioPage(-1))
                  }, "Prev", 8, _hoisted_222),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || portfolioQuery.page >= portfolioTotalPages.value,
                    onClick: _cache[60] || (_cache[60] = ($event) => movePortfolioPage(1))
                  }, "Next", 8, _hoisted_223)
                ])
              ]),
              quickCreatePortfolioOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_224, [
                _createElementVNode("div", _hoisted_225, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[61] || (_cache[61] = ($event) => portfolioForm.name = $event),
                    placeholder: "Portfolio name",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, portfolioForm.name]
                  ]),
                  _createElementVNode("label", _hoisted_226, [
                    _cache[227] || (_cache[227] = _createTextVNode(" Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[62] || (_cache[62] = ($event) => portfolioForm.type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_227);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, portfolioForm.type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[63] || (_cache[63] = ($event) => portfolioForm.base_currency = $event),
                    placeholder: "Base currency",
                    maxlength: "3",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, portfolioForm.base_currency]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[64] || (_cache[64] = ($event) => portfolioForm.exchange_code = $event),
                    placeholder: "Exchange code",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, portfolioForm.exchange_code]
                  ]),
                  _createElementVNode("label", _hoisted_228, [
                    _cache[228] || (_cache[228] = _createTextVNode(" Category ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[65] || (_cache[65] = ($event) => portfolioForm.category = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCategoryOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_229);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, portfolioForm.category]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_230, [
                    _cache[229] || (_cache[229] = _createTextVNode(" Cashflow Source ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[66] || (_cache[66] = ($event) => portfolioForm.cashflow_source_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCashflowSourceTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_231);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, portfolioForm.cashflow_source_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[67] || (_cache[67] = ($event) => portfolioForm.memo = $event),
                    placeholder: "Memo",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                  }, null, 512), [
                    [_vModelText, portfolioForm.memo]
                  ])
                ]),
                _createElementVNode("div", _hoisted_232, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                    disabled: !canManageAssets.value || isBusy.value,
                    onClick: submitPortfolioCreate
                  }, "Create Portfolio", 8, _hoisted_233)
                ])
              ])) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_234, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_235, [
            _createElementVNode("div", _hoisted_236, [
              _cache[230] || (_cache[230] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Holdings Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("div", _hoisted_237, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: isBusy.value,
                  onClick: toggleQuickCreateHolding
                }, _toDisplayString(quickCreateHoldingOpen.value ? "Close Create" : "Quick Create Holding"), 9, _hoisted_238),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[68] || (_cache[68] = ($event) => holdingsSectionCollapsed.value = !holdingsSectionCollapsed.value)
                }, _toDisplayString(holdingsSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_239)
              ])
            ]),
            !holdingsSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("div", _hoisted_240, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[69] || (_cache[69] = ($event) => holdingQuery.q = $event),
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
                }, "Search", 8, _hoisted_241),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearHoldingSearch
                }, "Clear", 8, _hoisted_242)
              ]),
              _createElementVNode("div", _hoisted_243, [
                _createElementVNode("table", _hoisted_244, [
                  _createElementVNode("thead", _hoisted_245, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_246, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[70] || (_cache[70] = ($event) => toggleHoldingSort("id"))
                        }, [
                          _cache[231] || (_cache[231] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_247, _toDisplayString(holdingSortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_248, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[71] || (_cache[71] = ($event) => toggleHoldingSort("portfolio_name"))
                        }, [
                          _cache[232] || (_cache[232] = _createTextVNode("Portfolio ", -1)),
                          _createElementVNode("span", _hoisted_249, _toDisplayString(holdingSortIndicator("portfolio_name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_250, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[72] || (_cache[72] = ($event) => toggleHoldingSort("asset_name"))
                        }, [
                          _cache[233] || (_cache[233] = _createTextVNode("Asset ", -1)),
                          _createElementVNode("span", _hoisted_251, _toDisplayString(holdingSortIndicator("asset_name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_252, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[73] || (_cache[73] = ($event) => toggleHoldingSort("asset_symbol"))
                        }, [
                          _cache[234] || (_cache[234] = _createTextVNode("Symbol ", -1)),
                          _createElementVNode("span", _hoisted_253, _toDisplayString(holdingSortIndicator("asset_symbol")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_254, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[74] || (_cache[74] = ($event) => toggleHoldingSort("quantity"))
                        }, [
                          _cache[235] || (_cache[235] = _createTextVNode("Qty ", -1)),
                          _createElementVNode("span", _hoisted_255, _toDisplayString(holdingSortIndicator("quantity")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_256, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[75] || (_cache[75] = ($event) => toggleHoldingSort("avg_price"))
                        }, [
                          _cache[236] || (_cache[236] = _createTextVNode("Avg ", -1)),
                          _createElementVNode("span", _hoisted_257, _toDisplayString(holdingSortIndicator("avg_price")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_258, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[76] || (_cache[76] = ($event) => toggleHoldingSort("invested_amount"))
                        }, [
                          _cache[237] || (_cache[237] = _createTextVNode("Invested ", -1)),
                          _createElementVNode("span", _hoisted_259, _toDisplayString(holdingSortIndicator("invested_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_260, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[77] || (_cache[77] = ($event) => toggleHoldingSort("current_price"))
                        }, [
                          _cache[238] || (_cache[238] = _createTextVNode("Price ", -1)),
                          _createElementVNode("span", _hoisted_261, _toDisplayString(holdingSortIndicator("current_price")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_262, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[78] || (_cache[78] = ($event) => toggleHoldingSort("evaluated_amount"))
                        }, [
                          _cache[239] || (_cache[239] = _createTextVNode("Evaluated ", -1)),
                          _createElementVNode("span", _hoisted_263, _toDisplayString(holdingSortIndicator("evaluated_amount")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_264, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[79] || (_cache[79] = ($event) => toggleHoldingSort("pnl_pct"))
                        }, [
                          _cache[240] || (_cache[240] = _createTextVNode("PnL% ", -1)),
                          _createElementVNode("span", _hoisted_265, _toDisplayString(holdingSortIndicator("pnl_pct")), 1)
                        ])
                      ]),
                      _cache[242] || (_cache[242] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                      _createElementVNode("th", _hoisted_266, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[80] || (_cache[80] = ($event) => toggleHoldingSort("updated_at"))
                        }, [
                          _cache[241] || (_cache[241] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_267, _toDisplayString(holdingSortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _cache[243] || (_cache[243] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(holdingRows.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_268, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_269, _toDisplayString(item.portfolio_name || "-"), 1),
                        _createElementVNode("td", _hoisted_270, _toDisplayString(item.asset_name), 1),
                        _createElementVNode("td", _hoisted_271, _toDisplayString(item.asset_symbol || "-"), 1),
                        _createElementVNode("td", _hoisted_272, _toDisplayString(formatQuantity(item.quantity)), 1),
                        _createElementVNode("td", _hoisted_273, _toDisplayString(formatMoney(item.avg_price, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_274, _toDisplayString(item.invested_amount === null ? "-" : formatMoney(item.invested_amount, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_275, _toDisplayString(item.current_price === null ? "-" : formatMoney(item.current_price, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_276, _toDisplayString(formatMoney(item.evaluated_amount, holdingCurrencyCode(item))), 1),
                        _createElementVNode("td", _hoisted_277, _toDisplayString(item.pnl_pct === null ? "-" : `${Number(item.pnl_pct).toFixed(2)}%`), 1),
                        _createElementVNode("td", _hoisted_278, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_279, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_280, [
                          _createElementVNode("div", _hoisted_281, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEditHoldingModal(item)
                            }, " Edit ", 8, _hoisted_282),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: isBusy.value,
                              onClick: ($event) => toggleHoldingHidden(item)
                            }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_283),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                              disabled: isBusy.value,
                              onClick: ($event) => askDeleteHolding(item)
                            }, "Delete", 8, _hoisted_284)
                          ])
                        ])
                      ]);
                    }), 128)),
                    holdingRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_285, [..._cache[244] || (_cache[244] = [
                      _createElementVNode("td", {
                        colspan: "13",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No holdings found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_286, [
                _createElementVNode("div", _hoisted_287, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(holdingQuery.total), 1),
                  _cache[247] || (_cache[247] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(holdingQuery.page) + " / " + _toDisplayString(holdingTotalPages.value), 1),
                  _cache[248] || (_cache[248] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[246] || (_cache[246] = _createTextVNode("Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[81] || (_cache[81] = ($event) => holdingQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[82] || (_cache[82] = ($event) => {
                        holdingQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[245] || (_cache[245] = [
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
                    onClick: _cache[83] || (_cache[83] = ($event) => moveHoldingPage(-1))
                  }, "Prev", 8, _hoisted_288),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || holdingQuery.page >= holdingTotalPages.value,
                    onClick: _cache[84] || (_cache[84] = ($event) => moveHoldingPage(1))
                  }, "Next", 8, _hoisted_289)
                ])
              ]),
              quickCreateHoldingOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_290, [
                _createElementVNode("div", _hoisted_291, [
                  _createElementVNode("label", _hoisted_292, [
                    _cache[250] || (_cache[250] = _createTextVNode(" Portfolio (optional) ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[85] || (_cache[85] = ($event) => holdingForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value
                    }, [
                      _cache[249] || (_cache[249] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: item.id,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_294);
                      }), 128))
                    ], 8, _hoisted_293), [
                      [_vModelSelect, holdingForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_295, [
                    _cache[252] || (_cache[252] = _createTextVNode(" Asset ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[86] || (_cache[86] = ($event) => holdingForm.asset_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value
                    }, [
                      _cache[251] || (_cache[251] = _createElementVNode("option", { value: "" }, "Select Asset", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingAssetOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: item.id,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ") ", 9, _hoisted_297);
                      }), 128))
                    ], 8, _hoisted_296), [
                      [_vModelSelect, holdingForm.asset_id]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[87] || (_cache[87] = ($event) => holdingForm.quantity = $event),
                    placeholder: "Quantity",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, holdingForm.quantity]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[88] || (_cache[88] = ($event) => holdingForm.avg_price = $event),
                    placeholder: "Avg Price",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, holdingForm.avg_price]
                  ]),
                  _createElementVNode("label", _hoisted_298, [
                    _cache[253] || (_cache[253] = _createTextVNode(" Avg Price Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[89] || (_cache[89] = ($event) => holdingForm.avg_price_currency = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: isBusy.value
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: `holding-create-avg-${opt}`,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_300);
                      }), 64))
                    ], 8, _hoisted_299), [
                      [_vModelSelect, holdingForm.avg_price_currency]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[90] || (_cache[90] = ($event) => holdingForm.invested_amount = $event),
                    placeholder: "Invested (optional)",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, holdingForm.invested_amount]
                  ]),
                  _createElementVNode("label", _hoisted_301, [
                    _cache[254] || (_cache[254] = _createTextVNode(" Invested Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[91] || (_cache[91] = ($event) => holdingForm.invested_amount_currency = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: isBusy.value
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: `holding-create-invested-${opt}`,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_303);
                      }), 64))
                    ], 8, _hoisted_302), [
                      [_vModelSelect, holdingForm.invested_amount_currency]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_304, [
                    _cache[255] || (_cache[255] = _createTextVNode(" Source Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[92] || (_cache[92] = ($event) => holdingForm.source_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingSourceTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_305);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, holdingForm.source_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[93] || (_cache[93] = ($event) => holdingForm.memo = $event),
                    placeholder: "Memo",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                  }, null, 512), [
                    [_vModelText, holdingForm.memo]
                  ])
                ]),
                _createElementVNode("div", _hoisted_306, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                    disabled: isBusy.value,
                    onClick: submitHoldingCreate
                  }, "Create Holding", 8, _hoisted_307)
                ])
              ])) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_308, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_309, [
            _createElementVNode("div", _hoisted_310, [
              _cache[256] || (_cache[256] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Liabilities Status"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Server-side sort/pagination/search 적용")
              ], -1)),
              _createElementVNode("div", _hoisted_311, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  disabled: isBusy.value,
                  onClick: toggleQuickCreateLiability
                }, _toDisplayString(quickCreateLiabilityOpen.value ? "Close Create" : "Quick Create Liability"), 9, _hoisted_312),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: _cache[94] || (_cache[94] = ($event) => liabilitiesSectionCollapsed.value = !liabilitiesSectionCollapsed.value)
                }, _toDisplayString(liabilitiesSectionCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_313)
              ])
            ]),
            !liabilitiesSectionCollapsed.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createElementVNode("div", _hoisted_314, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[95] || (_cache[95] = ($event) => liabilityQuery.q = $event),
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
                }, "Search", 8, _hoisted_315),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                  disabled: isBusy.value,
                  onClick: clearLiabilitySearch
                }, "Clear", 8, _hoisted_316)
              ]),
              _createElementVNode("div", _hoisted_317, [
                _createElementVNode("table", _hoisted_318, [
                  _createElementVNode("thead", _hoisted_319, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", _hoisted_320, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[96] || (_cache[96] = ($event) => toggleLiabilitySort("id"))
                        }, [
                          _cache[257] || (_cache[257] = _createTextVNode("ID ", -1)),
                          _createElementVNode("span", _hoisted_321, _toDisplayString(liabilitySortIndicator("id")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_322, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[97] || (_cache[97] = ($event) => toggleLiabilitySort("portfolio_name"))
                        }, [
                          _cache[258] || (_cache[258] = _createTextVNode("Portfolio ", -1)),
                          _createElementVNode("span", _hoisted_323, _toDisplayString(liabilitySortIndicator("portfolio_name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_324, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[98] || (_cache[98] = ($event) => toggleLiabilitySort("name"))
                        }, [
                          _cache[259] || (_cache[259] = _createTextVNode("Name ", -1)),
                          _createElementVNode("span", _hoisted_325, _toDisplayString(liabilitySortIndicator("name")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_326, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[99] || (_cache[99] = ($event) => toggleLiabilitySort("liability_type"))
                        }, [
                          _cache[260] || (_cache[260] = _createTextVNode("Type ", -1)),
                          _createElementVNode("span", _hoisted_327, _toDisplayString(liabilitySortIndicator("liability_type")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_328, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[100] || (_cache[100] = ($event) => toggleLiabilitySort("outstanding_balance"))
                        }, [
                          _cache[261] || (_cache[261] = _createTextVNode("Balance ", -1)),
                          _createElementVNode("span", _hoisted_329, _toDisplayString(liabilitySortIndicator("outstanding_balance")), 1)
                        ])
                      ]),
                      _cache[265] || (_cache[265] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Currency", -1)),
                      _createElementVNode("th", _hoisted_330, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[101] || (_cache[101] = ($event) => toggleLiabilitySort("interest_rate"))
                        }, [
                          _cache[262] || (_cache[262] = _createTextVNode("Rate ", -1)),
                          _createElementVNode("span", _hoisted_331, _toDisplayString(liabilitySortIndicator("interest_rate")), 1)
                        ])
                      ]),
                      _createElementVNode("th", _hoisted_332, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[102] || (_cache[102] = ($event) => toggleLiabilitySort("monthly_payment"))
                        }, [
                          _cache[263] || (_cache[263] = _createTextVNode("Monthly ", -1)),
                          _createElementVNode("span", _hoisted_333, _toDisplayString(liabilitySortIndicator("monthly_payment")), 1)
                        ])
                      ]),
                      _cache[266] || (_cache[266] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Included", -1)),
                      _cache[267] || (_cache[267] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Hidden", -1)),
                      _createElementVNode("th", _hoisted_334, [
                        _createElementVNode("button", {
                          type: "button",
                          class: "inline-flex items-center gap-1 hover:underline",
                          onClick: _cache[103] || (_cache[103] = ($event) => toggleLiabilitySort("updated_at"))
                        }, [
                          _cache[264] || (_cache[264] = _createTextVNode("Updated ", -1)),
                          _createElementVNode("span", _hoisted_335, _toDisplayString(liabilitySortIndicator("updated_at")), 1)
                        ])
                      ]),
                      _cache[268] || (_cache[268] = _createElementVNode("th", { class: "px-2 py-1.5 whitespace-nowrap" }, "Action", -1))
                    ])
                  ]),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(liabilityRows.value, (item) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: item.id,
                        class: "border-t border-slate-200 dark:border-slate-700"
                      }, [
                        _createElementVNode("td", _hoisted_336, _toDisplayString(item.id), 1),
                        _createElementVNode("td", _hoisted_337, _toDisplayString(item.portfolio_name || "-"), 1),
                        _createElementVNode("td", _hoisted_338, _toDisplayString(item.name), 1),
                        _createElementVNode("td", _hoisted_339, _toDisplayString(item.liability_type), 1),
                        _createElementVNode("td", _hoisted_340, _toDisplayString(formatMoney(item.outstanding_balance, item.currency)), 1),
                        _createElementVNode("td", _hoisted_341, _toDisplayString(item.currency), 1),
                        _createElementVNode("td", _hoisted_342, _toDisplayString(item.interest_rate ?? "-"), 1),
                        _createElementVNode("td", _hoisted_343, _toDisplayString(item.monthly_payment === null ? "-" : formatMoney(item.monthly_payment, item.currency)), 1),
                        _createElementVNode("td", _hoisted_344, _toDisplayString(item.is_included ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_345, _toDisplayString(item.is_hidden ? "Y" : "N"), 1),
                        _createElementVNode("td", _hoisted_346, _toDisplayString(formatDateTime(item.updated_at)), 1),
                        _createElementVNode("td", _hoisted_347, [
                          _createElementVNode("div", _hoisted_348, [
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                              disabled: isBusy.value,
                              onClick: ($event) => openEditLiabilityModal(item)
                            }, " Edit ", 8, _hoisted_349),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: isBusy.value,
                              onClick: ($event) => toggleLiabilityIncluded(item)
                            }, _toDisplayString(item.is_included ? "Exclude" : "Include"), 9, _hoisted_350),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                              disabled: isBusy.value,
                              onClick: ($event) => toggleLiabilityHidden(item)
                            }, _toDisplayString(item.is_hidden ? "Unhide" : "Hide"), 9, _hoisted_351),
                            _createElementVNode("button", {
                              type: "button",
                              class: "rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20",
                              disabled: isBusy.value,
                              onClick: ($event) => askDeleteLiability(item)
                            }, "Delete", 8, _hoisted_352)
                          ])
                        ])
                      ]);
                    }), 128)),
                    liabilityRows.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_353, [..._cache[269] || (_cache[269] = [
                      _createElementVNode("td", {
                        colspan: "12",
                        class: "px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                      }, "No liabilities found", -1)
                    ])])) : _createCommentVNode("", true)
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_354, [
                _createElementVNode("div", _hoisted_355, [
                  _createElementVNode("span", null, "Total: " + _toDisplayString(liabilityQuery.total), 1),
                  _cache[272] || (_cache[272] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("span", null, "Page " + _toDisplayString(liabilityQuery.page) + " / " + _toDisplayString(liabilityTotalPages.value), 1),
                  _cache[273] || (_cache[273] = _createElementVNode("span", null, "|", -1)),
                  _createElementVNode("label", null, [
                    _cache[271] || (_cache[271] = _createTextVNode("Size ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[104] || (_cache[104] = ($event) => liabilityQuery.pageSize = $event),
                      class: "ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950",
                      onChange: _cache[105] || (_cache[105] = ($event) => {
                        liabilityQuery.page = 1;
                        refreshData();
                      })
                    }, [..._cache[270] || (_cache[270] = [
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
                    onClick: _cache[106] || (_cache[106] = ($event) => moveLiabilityPage(-1))
                  }, "Prev", 8, _hoisted_356),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                    disabled: isBusy.value || liabilityQuery.page >= liabilityTotalPages.value,
                    onClick: _cache[107] || (_cache[107] = ($event) => moveLiabilityPage(1))
                  }, "Next", 8, _hoisted_357)
                ])
              ]),
              quickCreateLiabilityOpen.value ? (_openBlock(), _createElementBlock("div", _hoisted_358, [
                _createElementVNode("div", _hoisted_359, [
                  _createElementVNode("label", _hoisted_360, [
                    _cache[275] || (_cache[275] = _createTextVNode(" Portfolio (optional) ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[108] || (_cache[108] = ($event) => liabilityForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950",
                      disabled: lookupLoading.value || isBusy.value
                    }, [
                      _cache[274] || (_cache[274] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: item.id,
                          value: String(item.id)
                        }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_362);
                      }), 128))
                    ], 8, _hoisted_361), [
                      [_vModelSelect, liabilityForm.portfolio_id]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[109] || (_cache[109] = ($event) => liabilityForm.name = $event),
                    placeholder: "Liability name",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.name]
                  ]),
                  _createElementVNode("label", _hoisted_363, [
                    _cache[276] || (_cache[276] = _createTextVNode(" Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[110] || (_cache[110] = ($event) => liabilityForm.liability_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilityTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_364);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, liabilityForm.liability_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[111] || (_cache[111] = ($event) => liabilityForm.outstanding_balance = $event),
                    placeholder: "Outstanding balance",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.outstanding_balance]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[112] || (_cache[112] = ($event) => liabilityForm.currency = $event),
                    placeholder: "Currency",
                    maxlength: "3",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.currency]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[113] || (_cache[113] = ($event) => liabilityForm.interest_rate = $event),
                    placeholder: "Interest rate (optional)",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.interest_rate]
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[114] || (_cache[114] = ($event) => liabilityForm.monthly_payment = $event),
                    placeholder: "Monthly payment (optional)",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, liabilityForm.monthly_payment]
                  ]),
                  _createElementVNode("label", _hoisted_365, [
                    _cache[277] || (_cache[277] = _createTextVNode(" Source Type ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[115] || (_cache[115] = ($event) => liabilityForm.source_type = $event),
                      class: "mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilitySourceTypeOptions, (opt) => {
                        return _createElementVNode("option", {
                          key: opt,
                          value: opt
                        }, _toDisplayString(opt), 9, _hoisted_366);
                      }), 64))
                    ], 512), [
                      [_vModelSelect, liabilityForm.source_type]
                    ])
                  ]),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[116] || (_cache[116] = ($event) => liabilityForm.memo = $event),
                    placeholder: "Memo",
                    class: "rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3"
                  }, null, 512), [
                    [_vModelText, liabilityForm.memo]
                  ])
                ]),
                _createElementVNode("div", _hoisted_367, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
                    disabled: isBusy.value,
                    onClick: submitLiabilityCreate
                  }, "Create Liability", 8, _hoisted_368)
                ])
              ])) : _createCommentVNode("", true)
            ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_369, "섹션이 접혀 있습니다. Expand 버튼으로 열어주세요."))
          ]),
          _createElementVNode("article", _hoisted_370, [
            _cache[278] || (_cache[278] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Execution Log", -1)),
            _createElementVNode("ul", _hoisted_371, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(logs.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.id,
                  class: _normalizeClass([
                    "rounded-lg border px-3 py-2 text-xs",
                    item.status === "SUCCESS" ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30" : item.status === "ERROR" ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/30" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40"
                  ])
                }, [
                  _createElementVNode("p", _hoisted_372, _toDisplayString(item.action) + " · " + _toDisplayString(item.status), 1),
                  _createElementVNode("p", _hoisted_373, _toDisplayString(item.message), 1),
                  _createElementVNode("p", _hoisted_374, _toDisplayString(formatDateTime(item.at)), 1)
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
          _createElementVNode("section", _hoisted_375, [
            _createElementVNode("h3", _hoisted_376, _toDisplayString(assetModal.mode === "CREATE" ? "Create Asset" : `Edit Asset #${assetForm.id}`), 1),
            _cache[289] || (_cache[289] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "필수 입력: Name, Class, Currency, Quote Mode, Exchange", -1)),
            _createElementVNode("div", _hoisted_377, [
              _createElementVNode("label", _hoisted_378, [
                _cache[279] || (_cache[279] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[117] || (_cache[117] = ($event) => assetForm.name = $event),
                  placeholder: "예: 삼성전자",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_379, [
                _cache[281] || (_cache[281] = _createTextVNode("Class ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[118] || (_cache[118] = ($event) => assetForm.asset_class = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[280] || (_cache[280] = _createElementVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Select class", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(assetClassOptions, (item) => {
                    return _createElementVNode("option", {
                      key: item,
                      value: item
                    }, _toDisplayString(item), 9, _hoisted_380);
                  }), 64))
                ], 512), [
                  [_vModelSelect, assetForm.asset_class]
                ])
              ]),
              _createElementVNode("label", _hoisted_381, [
                _cache[282] || (_cache[282] = _createTextVNode("Symbol ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[119] || (_cache[119] = ($event) => assetForm.symbol = $event),
                  placeholder: "예: 005930 또는 BTC",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.symbol]
                ])
              ]),
              _createElementVNode("label", _hoisted_382, [
                _cache[283] || (_cache[283] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[120] || (_cache[120] = ($event) => assetForm.currency = $event),
                  maxlength: "3",
                  placeholder: "예: KRW",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_383, [
                _cache[285] || (_cache[285] = _createTextVNode("Quote Mode ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[121] || (_cache[121] = ($event) => assetForm.quote_mode = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[284] || (_cache[284] = _createElementVNode("option", {
                    value: "",
                    disabled: ""
                  }, "Select quote mode", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(quoteModeOptions, (item) => {
                    return _createElementVNode("option", {
                      key: item,
                      value: item
                    }, _toDisplayString(item), 9, _hoisted_384);
                  }), 64))
                ], 512), [
                  [_vModelSelect, assetForm.quote_mode]
                ])
              ]),
              _createElementVNode("label", _hoisted_385, [
                _cache[286] || (_cache[286] = _createTextVNode("Exchange ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[122] || (_cache[122] = ($event) => assetForm.exchange_code = $event),
                  placeholder: "예: KRX / UPBIT / KORBIT",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.exchange_code]
                ])
              ]),
              _createElementVNode("label", _hoisted_386, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[123] || (_cache[123] = ($event) => assetForm.is_trade_supported = $event),
                  type: "checkbox"
                }, null, 512), [
                  [_vModelCheckbox, assetForm.is_trade_supported]
                ]),
                _cache[287] || (_cache[287] = _createElementVNode("span", { class: "ml-1" }, "Trade Supported", -1))
              ]),
              _createElementVNode("label", _hoisted_387, [
                _cache[288] || (_cache[288] = _createTextVNode("Meta JSON ", -1)),
                _withDirectives(_createElementVNode("textarea", {
                  "onUpdate:modelValue": _cache[124] || (_cache[124] = ($event) => assetForm.meta_json_text = $event),
                  rows: "4",
                  placeholder: assetMetaJsonPlaceholder,
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, assetForm.meta_json_text]
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_388, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeAssetModal
              }, " Cancel ", 8, _hoisted_389),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitAssetForm
              }, _toDisplayString(assetModal.mode === "CREATE" ? "Create" : "Apply"), 9, _hoisted_390)
            ])
          ])
        ])) : _createCommentVNode("", true),
        portfolioEditModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 1,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closePortfolioEditModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_391, [
            _createElementVNode("h3", _hoisted_392, "Edit Portfolio #" + _toDisplayString(portfolioEditForm.id), 1),
            _cache[304] || (_cache[304] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "핵심 운영값(집계 포함/숨김/입출금 누적/메모)을 수정할 수 있습니다.", -1)),
            _createElementVNode("div", _hoisted_393, [
              _createElementVNode("label", _hoisted_394, [
                _cache[290] || (_cache[290] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[125] || (_cache[125] = ($event) => portfolioEditForm.name = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_395, [
                _cache[291] || (_cache[291] = _createTextVNode("Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[126] || (_cache[126] = ($event) => portfolioEditForm.type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_396);
                  }), 64))
                ], 512), [
                  [_vModelSelect, portfolioEditForm.type]
                ])
              ]),
              _createElementVNode("label", _hoisted_397, [
                _cache[292] || (_cache[292] = _createTextVNode("Base Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[127] || (_cache[127] = ($event) => portfolioEditForm.base_currency = $event),
                  maxlength: "3",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.base_currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_398, [
                _cache[293] || (_cache[293] = _createTextVNode("Exchange Code ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[128] || (_cache[128] = ($event) => portfolioEditForm.exchange_code = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.exchange_code]
                ])
              ]),
              _createElementVNode("label", _hoisted_399, [
                _cache[295] || (_cache[295] = _createTextVNode("Category ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[129] || (_cache[129] = ($event) => portfolioEditForm.category = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[294] || (_cache[294] = _createElementVNode("option", { value: "" }, "(none)", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCategoryOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_400);
                  }), 64))
                ], 512), [
                  [_vModelSelect, portfolioEditForm.category]
                ])
              ]),
              _createElementVNode("label", _hoisted_401, [
                _cache[296] || (_cache[296] = _createTextVNode("Cashflow Source ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[130] || (_cache[130] = ($event) => portfolioEditForm.cashflow_source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(portfolioCashflowSourceTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_402);
                  }), 64))
                ], 512), [
                  [_vModelSelect, portfolioEditForm.cashflow_source_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_403, [
                _cache[297] || (_cache[297] = _createTextVNode("Cumulative Deposit ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[131] || (_cache[131] = ($event) => portfolioEditForm.cumulative_deposit_amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.cumulative_deposit_amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_404, [
                _cache[298] || (_cache[298] = _createTextVNode("Cumulative Withdrawal ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[132] || (_cache[132] = ($event) => portfolioEditForm.cumulative_withdrawal_amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.cumulative_withdrawal_amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_405, [
                _cache[299] || (_cache[299] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[133] || (_cache[133] = ($event) => portfolioEditForm.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, portfolioEditForm.memo]
                ])
              ]),
              _createElementVNode("label", _hoisted_406, [
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[134] || (_cache[134] = ($event) => portfolioEditForm.is_included = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, portfolioEditForm.is_included]
                  ]),
                  _cache[300] || (_cache[300] = _createTextVNode()),
                  _cache[301] || (_cache[301] = _createElementVNode("span", { class: "ml-1" }, "Included", -1))
                ]),
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[135] || (_cache[135] = ($event) => portfolioEditForm.is_hidden = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, portfolioEditForm.is_hidden]
                  ]),
                  _cache[302] || (_cache[302] = _createTextVNode()),
                  _cache[303] || (_cache[303] = _createElementVNode("span", { class: "ml-1" }, "Hidden", -1))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_407, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closePortfolioEditModal
              }, " Cancel ", 8, _hoisted_408),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitPortfolioEdit
              }, " Apply ", 8, _hoisted_409)
            ])
          ])
        ])) : _createCommentVNode("", true),
        holdingEditModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 2,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeHoldingEditModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_410, [
            _createElementVNode("h3", _hoisted_411, "Edit Holding #" + _toDisplayString(holdingEditForm.id), 1),
            _cache[317] || (_cache[317] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Asset/포트폴리오/수량/평단/투입금/숨김/메모를 수정합니다.", -1)),
            _createElementVNode("div", _hoisted_412, [
              _createElementVNode("label", _hoisted_413, [
                _cache[306] || (_cache[306] = _createTextVNode("Asset ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[136] || (_cache[136] = ($event) => holdingEditForm.asset_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: lookupLoading.value || loading.action || loading.confirm
                }, [
                  _cache[305] || (_cache[305] = _createElementVNode("option", { value: "" }, "Select Asset", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingAssetOptions.value, (item) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: item.id,
                      value: String(item.id)
                    }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name) + " (" + _toDisplayString(item.exchange_code) + ") ", 9, _hoisted_415);
                  }), 128))
                ], 8, _hoisted_414), [
                  [_vModelSelect, holdingEditForm.asset_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_416, [
                _cache[308] || (_cache[308] = _createTextVNode("Portfolio (optional) ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[137] || (_cache[137] = ($event) => holdingEditForm.portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: lookupLoading.value || loading.action || loading.confirm
                }, [
                  _cache[307] || (_cache[307] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: item.id,
                      value: String(item.id)
                    }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_418);
                  }), 128))
                ], 8, _hoisted_417), [
                  [_vModelSelect, holdingEditForm.portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_419, [
                _cache[309] || (_cache[309] = _createTextVNode("Quantity ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[138] || (_cache[138] = ($event) => holdingEditForm.quantity = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.quantity]
                ])
              ]),
              _createElementVNode("label", _hoisted_420, [
                _cache[310] || (_cache[310] = _createTextVNode("Avg Price ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[139] || (_cache[139] = ($event) => holdingEditForm.avg_price = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.avg_price]
                ])
              ]),
              _createElementVNode("label", _hoisted_421, [
                _cache[311] || (_cache[311] = _createTextVNode("Avg Price Currency ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[140] || (_cache[140] = ($event) => holdingEditForm.avg_price_currency = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: `holding-edit-avg-${opt}`,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_422);
                  }), 64))
                ], 512), [
                  [_vModelSelect, holdingEditForm.avg_price_currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_423, [
                _cache[312] || (_cache[312] = _createTextVNode("Invested Amount (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[141] || (_cache[141] = ($event) => holdingEditForm.invested_amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.invested_amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_424, [
                _cache[313] || (_cache[313] = _createTextVNode("Invested Currency ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[142] || (_cache[142] = ($event) => holdingEditForm.invested_amount_currency = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingCurrencyOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: `holding-edit-invested-${opt}`,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_425);
                  }), 64))
                ], 512), [
                  [_vModelSelect, holdingEditForm.invested_amount_currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_426, [
                _cache[314] || (_cache[314] = _createTextVNode("Source Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[143] || (_cache[143] = ($event) => holdingEditForm.source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(holdingSourceTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_427);
                  }), 64))
                ], 512), [
                  [_vModelSelect, holdingEditForm.source_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_428, [
                _cache[315] || (_cache[315] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[144] || (_cache[144] = ($event) => holdingEditForm.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, holdingEditForm.memo]
                ])
              ]),
              _createElementVNode("label", _hoisted_429, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[145] || (_cache[145] = ($event) => holdingEditForm.is_hidden = $event),
                  type: "checkbox"
                }, null, 512), [
                  [_vModelCheckbox, holdingEditForm.is_hidden]
                ]),
                _cache[316] || (_cache[316] = _createElementVNode("span", { class: "ml-1" }, "Hidden", -1))
              ])
            ]),
            _createElementVNode("div", _hoisted_430, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeHoldingEditModal
              }, " Cancel ", 8, _hoisted_431),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitHoldingEdit
              }, " Apply ", 8, _hoisted_432)
            ])
          ])
        ])) : _createCommentVNode("", true),
        liabilityEditModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 3,
          class: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeLiabilityEditModal, ["self"])
        }, [
          _createElementVNode("section", _hoisted_433, [
            _createElementVNode("h3", _hoisted_434, "Edit Liability #" + _toDisplayString(liabilityEditForm.id), 1),
            _cache[332] || (_cache[332] = _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "부채 메타/잔액/금리/월납입/포함/숨김 상태를 수정합니다.", -1)),
            _createElementVNode("div", _hoisted_435, [
              _createElementVNode("label", _hoisted_436, [
                _cache[319] || (_cache[319] = _createTextVNode("Portfolio (optional) ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[146] || (_cache[146] = ($event) => liabilityEditForm.portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950",
                  disabled: lookupLoading.value || loading.action || loading.confirm
                }, [
                  _cache[318] || (_cache[318] = _createElementVNode("option", { value: "" }, "Unassigned", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedHoldingPortfolioOptions.value, (item) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: item.id,
                      value: String(item.id)
                    }, _toDisplayString(item.id) + " - " + _toDisplayString(item.name), 9, _hoisted_438);
                  }), 128))
                ], 8, _hoisted_437), [
                  [_vModelSelect, liabilityEditForm.portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_439, [
                _cache[320] || (_cache[320] = _createTextVNode("Name ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[147] || (_cache[147] = ($event) => liabilityEditForm.name = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.name]
                ])
              ]),
              _createElementVNode("label", _hoisted_440, [
                _cache[321] || (_cache[321] = _createTextVNode("Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[148] || (_cache[148] = ($event) => liabilityEditForm.liability_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilityTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_441);
                  }), 64))
                ], 512), [
                  [_vModelSelect, liabilityEditForm.liability_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_442, [
                _cache[322] || (_cache[322] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[149] || (_cache[149] = ($event) => liabilityEditForm.currency = $event),
                  maxlength: "3",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_443, [
                _cache[323] || (_cache[323] = _createTextVNode("Outstanding Balance ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[150] || (_cache[150] = ($event) => liabilityEditForm.outstanding_balance = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.outstanding_balance]
                ])
              ]),
              _createElementVNode("label", _hoisted_444, [
                _cache[324] || (_cache[324] = _createTextVNode("Interest Rate (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[151] || (_cache[151] = ($event) => liabilityEditForm.interest_rate = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.interest_rate]
                ])
              ]),
              _createElementVNode("label", _hoisted_445, [
                _cache[325] || (_cache[325] = _createTextVNode("Monthly Payment (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[152] || (_cache[152] = ($event) => liabilityEditForm.monthly_payment = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.monthly_payment]
                ])
              ]),
              _createElementVNode("label", _hoisted_446, [
                _cache[326] || (_cache[326] = _createTextVNode("Source Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[153] || (_cache[153] = ($event) => liabilityEditForm.source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(liabilitySourceTypeOptions, (opt) => {
                    return _createElementVNode("option", {
                      key: opt,
                      value: opt
                    }, _toDisplayString(opt), 9, _hoisted_447);
                  }), 64))
                ], 512), [
                  [_vModelSelect, liabilityEditForm.source_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_448, [
                _cache[327] || (_cache[327] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[154] || (_cache[154] = ($event) => liabilityEditForm.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, liabilityEditForm.memo]
                ])
              ]),
              _createElementVNode("label", _hoisted_449, [
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[155] || (_cache[155] = ($event) => liabilityEditForm.is_included = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, liabilityEditForm.is_included]
                  ]),
                  _cache[328] || (_cache[328] = _createTextVNode()),
                  _cache[329] || (_cache[329] = _createElementVNode("span", { class: "ml-1" }, "Included", -1))
                ]),
                _createElementVNode("span", null, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[156] || (_cache[156] = ($event) => liabilityEditForm.is_hidden = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [_vModelCheckbox, liabilityEditForm.is_hidden]
                  ]),
                  _cache[330] || (_cache[330] = _createTextVNode()),
                  _cache[331] || (_cache[331] = _createElementVNode("span", { class: "ml-1" }, "Hidden", -1))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_450, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.action || loading.confirm,
                onClick: closeLiabilityEditModal
              }, " Cancel ", 8, _hoisted_451),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.action || loading.confirm,
                onClick: submitLiabilityEdit
              }, " Apply ", 8, _hoisted_452)
            ])
          ])
        ])) : _createCommentVNode("", true),
        confirmModal.open ? (_openBlock(), _createElementBlock("div", {
          key: 4,
          class: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _withModifiers(closeConfirm, ["self"])
        }, [
          _createElementVNode("section", _hoisted_453, [
            _createElementVNode("h3", _hoisted_454, _toDisplayString(confirmModal.title), 1),
            _createElementVNode("p", _hoisted_455, _toDisplayString(confirmModal.message), 1),
            _createElementVNode("div", _hoisted_456, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600",
                disabled: loading.confirm,
                onClick: closeConfirm
              }, " Cancel ", 8, _hoisted_457),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
                disabled: loading.confirm,
                onClick: executeConfirm
              }, _toDisplayString(loading.confirm ? "Running..." : "Confirm"), 9, _hoisted_458)
            ])
          ])
        ])) : _createCommentVNode("", true)
      ], 64);
    };
  }
});

export { _sfc_main as default };
