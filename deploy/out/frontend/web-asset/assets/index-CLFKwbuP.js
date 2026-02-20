import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { _ as _export_sfc } from './_plugin-vue_export-helper-pcqpp-6-.js';

true              &&(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
}());

const _sfc_main = {  };
const {createElementVNode:_createElementVNode,createStaticVNode:_createStaticVNode} = await importShared('vue');


function _sfc_render(_ctx, _cache) {
  return _cache[0] || (_cache[0] = _createStaticVNode("<main class=\"mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4\"><section class=\"w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900\"><p class=\"text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300\">web-asset</p><h1 class=\"mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100\">Remote App Running</h1><p class=\"mt-2 text-sm text-slate-600 dark:text-slate-300\"> Host에서 이 앱의 Home/Dashboard/Agent/Report/Lab 페이지를 Module Federation으로 로드합니다. </p></section></main><div class=\"hidden\"><div>HomePage / DashboardPage / AgentPage / ReportPage / LabPage</div></div>", 2))
}
const App = /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render]]);

const {createApp} = await importShared('vue');

const {createPinia} = await importShared('pinia');
const app = createApp(App);
app.use(createPinia());
app.mount("#app");
