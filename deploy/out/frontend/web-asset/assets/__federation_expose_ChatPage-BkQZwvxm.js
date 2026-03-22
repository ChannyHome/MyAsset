import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul } from './datetime-D3NoeBy6.js';
import { u as useDisplayCurrency } from './useDisplayCurrency-HdS6Uz1W.js';

async function getChatStatus() {
  const { data } = await http.get("/chat/status");
  return data;
}
async function getChatSessions() {
  const { data } = await http.get("/chat/sessions");
  return data;
}
async function createChatSession(title) {
  const { data } = await http.post("/chat/sessions", { title });
  return data;
}
async function getChatMessages(sessionId) {
  const { data } = await http.get(`/chat/sessions/${sessionId}/messages`);
  return data;
}
async function createChatMessage(sessionId, payload) {
  const { data } = await http.post(`/chat/sessions/${sessionId}/messages`, payload);
  return data;
}

async function getHouseholds() {
  const { data } = await http.get("/households");
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,unref:_unref,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,normalizeClass:_normalizeClass,vModelSelect:_vModelSelect,withDirectives:_withDirectives,createTextVNode:_createTextVNode,vModelText:_vModelText} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4 text-slate-100" };
const _hoisted_2 = { class: "rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)]" };
const _hoisted_3 = { class: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" };
const _hoisted_4 = { class: "mt-3 text-xs text-slate-400" };
const _hoisted_5 = { class: "rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm" };
const _hoisted_6 = { class: "font-semibold text-white" };
const _hoisted_7 = { class: "mt-1 text-xs text-slate-400" };
const _hoisted_8 = {
  key: 0,
  class: "rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
};
const _hoisted_9 = { class: "grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]" };
const _hoisted_10 = { class: "rounded-[24px] border border-slate-800 bg-slate-900/80 p-4" };
const _hoisted_11 = { class: "flex items-center justify-between gap-3" };
const _hoisted_12 = { class: "mt-4 space-y-2" };
const _hoisted_13 = ["onClick"];
const _hoisted_14 = { class: "truncate text-sm font-semibold text-white" };
const _hoisted_15 = { class: "mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500" };
const _hoisted_16 = { class: "mt-2 text-xs text-slate-400" };
const _hoisted_17 = {
  key: 0,
  class: "rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-400"
};
const _hoisted_18 = { class: "rounded-[24px] border border-slate-800 bg-slate-900/80 p-4" };
const _hoisted_19 = { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" };
const _hoisted_20 = { class: "text-lg font-semibold text-white" };
const _hoisted_21 = { class: "text-xs text-slate-400" };
const _hoisted_22 = { class: "mt-4 min-h-[420px] rounded-[24px] border border-slate-800 bg-slate-950/60 p-4" };
const _hoisted_23 = { class: "mb-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-[auto_minmax(0,1fr)]" };
const _hoisted_24 = { class: "mt-2 inline-flex rounded-xl border border-slate-700 bg-slate-950/60 p-1" };
const _hoisted_25 = ["disabled"];
const _hoisted_26 = { key: 0 };
const _hoisted_27 = ["value"];
const _hoisted_28 = {
  key: 0,
  class: "flex min-h-[360px] items-center justify-center text-sm text-slate-400"
};
const _hoisted_29 = {
  key: 1,
  class: "space-y-6"
};
const _hoisted_30 = { class: "grid gap-3 md:grid-cols-2" };
const _hoisted_31 = ["onClick"];
const _hoisted_32 = {
  key: 2,
  class: "space-y-4"
};
const _hoisted_33 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_34 = { class: "text-xs font-semibold tracking-[0.18em] text-slate-400" };
const _hoisted_35 = { class: "mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100" };
const _hoisted_36 = {
  key: 0,
  class: "animate-pulse text-cyan-300"
};
const _hoisted_37 = ["onClick"];
const _hoisted_38 = { class: "mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500" };
const _hoisted_39 = { key: 0 };
const _hoisted_40 = { key: 1 };
const _hoisted_41 = {
  key: 0,
  class: "max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4"
};
const _hoisted_42 = { class: "mt-4 rounded-[24px] border border-slate-800 bg-slate-950/60 p-4" };
const _hoisted_43 = ["disabled"];
const _hoisted_44 = { class: "mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" };
const _hoisted_45 = ["disabled"];
const _hoisted_46 = { class: "flex items-center justify-between gap-3" };
const _hoisted_47 = { class: "mt-4 space-y-3" };
const _hoisted_48 = { class: "flex items-start justify-between gap-3" };
const _hoisted_49 = { class: "text-sm font-semibold text-white" };
const _hoisted_50 = { class: "mt-1 text-[11px] text-slate-500" };
const _hoisted_51 = ["onClick"];
const _hoisted_52 = {
  key: 0,
  class: "mt-3 text-sm text-slate-200"
};
const _hoisted_53 = {
  key: 1,
  class: "mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-[11px] leading-6 text-slate-300"
};
const _hoisted_54 = {
  key: 0,
  class: "rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
};
const _hoisted_55 = { class: "mt-3 space-y-2" };
const _hoisted_56 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_57 = { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-300" };
const _hoisted_58 = {
  key: 0,
  class: "mt-2 text-xs text-slate-300"
};
const _hoisted_59 = {
  key: 1,
  class: "mt-2 text-xs text-rose-200"
};
const _hoisted_60 = {
  key: 1,
  class: "rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-400"
};
const {computed,onBeforeUnmount,onMounted,ref,watch} = await importShared('vue');

const {useRouter} = await importShared('vue-router');
const STORAGE_KEY = "myasset:chat:v1:selected-session";
const SCOPE_STORAGE_KEY = "myasset:chat:v1:scope";
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "ChatPage",
  setup(__props) {
    const STARTER_PROMPTS = [
      "오늘 Net이 왜 변했어?",
      "지난 7일 가장 큰 하락 원인은?",
      "업비트 포트폴리오 요약해줘",
      "최근 snapshot과 현재 상태를 비교해줘"
    ];
    const { displayCurrency, ensureInitialized } = useDisplayCurrency();
    const router = useRouter();
    const loading = ref(false);
    const sending = ref(false);
    const statusLoading = ref(false);
    const errorMessage = ref("");
    const promptText = ref("");
    const sessions = ref([]);
    const messages = ref([]);
    const selectedSessionId = ref(null);
    const selectedSourceMessageId = ref(null);
    const chatStatus = ref(null);
    const mobileSourcesOpen = ref(false);
    const households = ref([]);
    const selectedScopeType = ref("USER");
    const selectedHouseholdId = ref(null);
    const streamingMessageId = ref(null);
    const streamingRenderedText = ref("");
    let streamingTimer = null;
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function setError(message) {
      errorMessage.value = message;
    }
    function clearError() {
      errorMessage.value = "";
    }
    function readStoredSessionId() {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    function readStoredScope() {
      if (typeof window === "undefined") {
        return { scopeType: "USER", householdId: null };
      }
      const raw = window.localStorage.getItem(SCOPE_STORAGE_KEY);
      if (!raw) {
        return { scopeType: "USER", householdId: null };
      }
      try {
        const parsed = JSON.parse(raw);
        return {
          scopeType: parsed.scopeType === "HOUSEHOLD" ? "HOUSEHOLD" : "USER",
          householdId: typeof parsed.householdId === "number" && parsed.householdId > 0 ? parsed.householdId : null
        };
      } catch {
        return { scopeType: "USER", householdId: null };
      }
    }
    function storeSelectedSessionId(value) {
      if (typeof window === "undefined") return;
      if (value == null) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }
      window.localStorage.setItem(STORAGE_KEY, String(value));
    }
    function storeScopeSelection() {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(
        SCOPE_STORAGE_KEY,
        JSON.stringify({
          scopeType: selectedScopeType.value,
          householdId: selectedHouseholdId.value
        })
      );
    }
    function clearStreaming() {
      if (streamingTimer) {
        clearInterval(streamingTimer);
        streamingTimer = null;
      }
      streamingMessageId.value = null;
      streamingRenderedText.value = "";
    }
    function startStreaming(message) {
      clearStreaming();
      if (!message || !message.content_text) return;
      streamingMessageId.value = message.id;
      streamingRenderedText.value = "";
      let cursor = 0;
      const full = message.content_text;
      streamingTimer = setInterval(() => {
        cursor = Math.min(full.length, cursor + 14);
        streamingRenderedText.value = full.slice(0, cursor);
        if (cursor >= full.length) {
          clearStreaming();
        }
      }, 18);
    }
    function messageContent(message) {
      if (message.id === streamingMessageId.value) {
        return streamingRenderedText.value;
      }
      return message.content_text;
    }
    function cursorVisible(message) {
      return message.id === streamingMessageId.value;
    }
    function sourceRoute(card) {
      const snapshotId = Number(card.data?.snapshot_id);
      if (card.title.startsWith("Snapshot #") || card.title === "Recent snapshots" || Number.isFinite(snapshotId)) {
        return { label: "Open Snapshot", to: "/snapshot" };
      }
      if (card.title === "Summary" || card.title.startsWith("Quick Insight") || card.title === "Networth trend") {
        return { label: "Open Home", to: "/home" };
      }
      if (card.title.startsWith("Portfolio:") || card.title === "Holding matches" || card.title === "Liability overview") {
        return { label: "Open Agent", to: "/agent" };
      }
      return null;
    }
    function goToSource(card) {
      const routeTarget = sourceRoute(card);
      if (!routeTarget) return;
      void router.push(routeTarget.to);
    }
    function latestAssistantMessage(items) {
      for (let index = items.length - 1; index >= 0; index -= 1) {
        const item = items[index];
        if (!item) continue;
        if (item.role === "ASSISTANT") {
          return item;
        }
      }
      return null;
    }
    const selectedSession = computed(
      () => sessions.value.find((session) => session.id === selectedSessionId.value) ?? null
    );
    const selectedSourceMessage = computed(() => {
      if (selectedSourceMessageId.value != null) {
        const direct = messages.value.find((message) => message.id === selectedSourceMessageId.value);
        if (direct?.role === "ASSISTANT") {
          return direct;
        }
      }
      return latestAssistantMessage(messages.value);
    });
    const selectedSourceCards = computed(() => selectedSourceMessage.value?.source_cards_json ?? []);
    const canSend = computed(() => {
      return Boolean(chatStatus.value?.available) && !sending.value && promptText.value.trim().length > 0;
    });
    const isEmptyThread = computed(() => messages.value.length === 0 && !loading.value && !sending.value);
    async function loadChatStatus() {
      statusLoading.value = true;
      try {
        chatStatus.value = await getChatStatus();
      } catch (error) {
        chatStatus.value = null;
        setError(error instanceof Error ? error.message : "Failed to load chat status");
      } finally {
        statusLoading.value = false;
      }
    }
    async function loadHouseholds() {
      try {
        const out = await getHouseholds();
        households.value = out;
        if (!households.value.length) {
          selectedScopeType.value = "USER";
          selectedHouseholdId.value = null;
          storeScopeSelection();
          return;
        }
        const stored = readStoredScope();
        selectedScopeType.value = stored.scopeType;
        selectedHouseholdId.value = households.value.find((item) => item.id === stored.householdId)?.id ?? households.value[0]?.id ?? null;
        if (selectedScopeType.value === "HOUSEHOLD" && selectedHouseholdId.value == null) {
          selectedScopeType.value = "USER";
        }
        storeScopeSelection();
      } catch {
        households.value = [];
        selectedScopeType.value = "USER";
        selectedHouseholdId.value = null;
      }
    }
    async function loadMessages(sessionId) {
      loading.value = true;
      clearError();
      try {
        const out = await getChatMessages(sessionId);
        messages.value = out;
        selectedSourceMessageId.value = latestAssistantMessage(out)?.id ?? null;
      } catch (error) {
        messages.value = [];
        setError(error instanceof Error ? error.message : "Failed to load messages");
      } finally {
        loading.value = false;
      }
    }
    async function loadSessions(preferredSessionId, reloadMessages = true) {
      loading.value = true;
      clearError();
      try {
        const out = await getChatSessions();
        sessions.value = out;
        const stored = preferredSessionId ?? selectedSessionId.value ?? readStoredSessionId();
        const next = out.find((session) => session.id === stored)?.id ?? out[0]?.id ?? null;
        selectedSessionId.value = next;
        storeSelectedSessionId(next);
        if (next != null && reloadMessages) {
          await loadMessages(next);
        } else if (next == null) {
          messages.value = [];
          selectedSourceMessageId.value = null;
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load chat sessions");
      } finally {
        loading.value = false;
      }
    }
    async function createSession(title) {
      try {
        const session = await createChatSession(title);
        sessions.value = [session, ...sessions.value.filter((item) => item.id !== session.id)];
        selectedSessionId.value = session.id;
        storeSelectedSessionId(session.id);
        messages.value = [];
        selectedSourceMessageId.value = null;
        return session.id;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to create session");
        return null;
      }
    }
    async function handleNewChat() {
      clearError();
      await createSession();
    }
    async function selectSession(sessionId) {
      if (selectedSessionId.value === sessionId) return;
      selectedSessionId.value = sessionId;
      storeSelectedSessionId(sessionId);
      await loadMessages(sessionId);
    }
    async function submitPrompt(textOverride) {
      const content = (textOverride ?? promptText.value).trim();
      if (!content || !chatStatus.value?.available || sending.value) return;
      clearError();
      sending.value = true;
      mobileSourcesOpen.value = false;
      try {
        let sessionId = selectedSessionId.value;
        if (sessionId == null) {
          sessionId = await createSession(content);
          if (sessionId == null) {
            return;
          }
        }
        const out = await createChatMessage(sessionId, {
          content_text: content,
          display_currency: displayCurrency.value,
          scope_type: selectedScopeType.value,
          scope_id: selectedScopeType.value === "HOUSEHOLD" ? selectedHouseholdId.value ?? void 0 : void 0
        });
        promptText.value = "";
        messages.value = out;
        const latestAssistant = latestAssistantMessage(out);
        selectedSourceMessageId.value = latestAssistant?.id ?? null;
        startStreaming(latestAssistant);
        await loadSessions(sessionId, false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to send message");
      } finally {
        sending.value = false;
      }
    }
    function usePrompt(text) {
      promptText.value = text;
      void submitPrompt(text);
    }
    function toggleSourceDrawer() {
      mobileSourcesOpen.value = !mobileSourcesOpen.value;
    }
    watch(selectedSessionId, (value) => {
      storeSelectedSessionId(value);
    });
    watch([selectedScopeType, selectedHouseholdId], () => {
      storeScopeSelection();
    });
    onMounted(async () => {
      await ensureInitialized();
      await loadChatStatus();
      await loadHouseholds();
      await loadSessions(readStoredSessionId());
    });
    onBeforeUnmount(() => {
      clearStreaming();
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _createElementVNode("div", null, [
              _cache[8] || (_cache[8] = _createElementVNode("p", { class: "text-xs font-semibold tracking-[0.28em] text-cyan-300" }, "CHAT", -1)),
              _cache[9] || (_cache[9] = _createElementVNode("h1", { class: "mt-3 text-4xl font-semibold tracking-tight text-white" }, "Assistant", -1)),
              _cache[10] || (_cache[10] = _createElementVNode("p", { class: "mt-3 max-w-3xl text-sm text-slate-300" }, " Analytics, snapshot, portfolio, holdings, liabilities 데이터를 바탕으로 자연어 설명을 제공합니다. Chat v1은 조회/설명 전용입니다. ", -1)),
              _createElementVNode("p", _hoisted_4, " model: " + _toDisplayString(chatStatus.value?.default_model ?? "-") + " · currency: " + _toDisplayString(_unref(displayCurrency)), 1)
            ]),
            _createElementVNode("div", _hoisted_5, [
              _createElementVNode("p", _hoisted_6, _toDisplayString(chatStatus.value?.available ? "Chat Ready" : "Chat Unavailable"), 1),
              _createElementVNode("p", _hoisted_7, _toDisplayString(chatStatus.value?.message ?? (statusLoading.value ? "Loading chat status..." : "Status unavailable")), 1)
            ])
          ])
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("section", _hoisted_8, _toDisplayString(errorMessage.value), 1)) : _createCommentVNode("", true),
        _createElementVNode("section", _hoisted_9, [
          _createElementVNode("aside", _hoisted_10, [
            _createElementVNode("div", _hoisted_11, [
              _cache[11] || (_cache[11] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-lg font-semibold text-white" }, "Sessions"),
                _createElementVNode("p", { class: "text-xs text-slate-400" }, "최근 대화와 새 대화를 관리합니다.")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20",
                onClick: _cache[0] || (_cache[0] = ($event) => handleNewChat())
              }, " New Chat ")
            ]),
            _createElementVNode("div", _hoisted_12, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sessions.value, (session) => {
                return _openBlock(), _createElementBlock("button", {
                  key: session.id,
                  type: "button",
                  class: _normalizeClass([
                    "w-full rounded-2xl border px-3 py-3 text-left transition",
                    selectedSessionId.value === session.id ? "border-cyan-400/40 bg-cyan-400/10" : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  ]),
                  onClick: ($event) => selectSession(session.id)
                }, [
                  _createElementVNode("p", _hoisted_14, _toDisplayString(session.title), 1),
                  _createElementVNode("p", _hoisted_15, _toDisplayString(session.status), 1),
                  _createElementVNode("p", _hoisted_16, _toDisplayString(formatDateTime(session.last_message_at || session.updated_at)), 1)
                ], 10, _hoisted_13);
              }), 128)),
              !sessions.value.length && !loading.value ? (_openBlock(), _createElementBlock("div", _hoisted_17, " 아직 대화가 없습니다. ")) : _createCommentVNode("", true)
            ])
          ]),
          _createElementVNode("section", _hoisted_18, [
            _createElementVNode("div", _hoisted_19, [
              _createElementVNode("div", null, [
                _createElementVNode("h2", _hoisted_20, _toDisplayString(selectedSession.value?.title ?? "New chat"), 1),
                _createElementVNode("p", _hoisted_21, _toDisplayString(selectedSession.value ? `last message ${formatDateTime(selectedSession.value.last_message_at || selectedSession.value.updated_at)}` : "질문을 시작하면 새 세션이 만들어집니다."), 1)
              ]),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 xl:hidden",
                onClick: _cache[1] || (_cache[1] = ($event) => toggleSourceDrawer())
              }, _toDisplayString(mobileSourcesOpen.value ? "Hide Sources" : "Show Sources"), 1)
            ]),
            _createElementVNode("div", _hoisted_22, [
              _createElementVNode("div", _hoisted_23, [
                _createElementVNode("div", null, [
                  _cache[12] || (_cache[12] = _createElementVNode("p", { class: "text-xs font-semibold tracking-[0.18em] text-slate-400" }, "SCOPE", -1)),
                  _createElementVNode("div", _hoisted_24, [
                    _createElementVNode("button", {
                      type: "button",
                      class: _normalizeClass(["rounded-lg px-3 py-2 text-xs font-semibold transition", selectedScopeType.value === "USER" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:bg-slate-800"]),
                      onClick: _cache[2] || (_cache[2] = ($event) => selectedScopeType.value = "USER")
                    }, " User ", 2),
                    _createElementVNode("button", {
                      type: "button",
                      class: _normalizeClass(["rounded-lg px-3 py-2 text-xs font-semibold transition", selectedScopeType.value === "HOUSEHOLD" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:bg-slate-800"]),
                      disabled: !households.value.length,
                      onClick: _cache[3] || (_cache[3] = ($event) => selectedScopeType.value = "HOUSEHOLD")
                    }, " Household ", 10, _hoisted_25)
                  ])
                ]),
                selectedScopeType.value === "HOUSEHOLD" ? (_openBlock(), _createElementBlock("div", _hoisted_26, [
                  _cache[13] || (_cache[13] = _createElementVNode("label", { class: "text-xs font-semibold tracking-[0.18em] text-slate-400" }, "HOUSEHOLD", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => selectedHouseholdId.value = $event),
                    class: "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
                  }, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(households.value, (household) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: household.id,
                        value: household.id
                      }, _toDisplayString(household.name), 9, _hoisted_27);
                    }), 128))
                  ], 512), [
                    [
                      _vModelSelect,
                      selectedHouseholdId.value,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])) : _createCommentVNode("", true)
              ]),
              loading.value ? (_openBlock(), _createElementBlock("div", _hoisted_28, " Loading chat... ")) : isEmptyThread.value ? (_openBlock(), _createElementBlock("div", _hoisted_29, [
                _cache[14] || (_cache[14] = _createElementVNode("div", { class: "rounded-2xl border border-slate-800 bg-slate-900/70 p-4" }, [
                  _createElementVNode("p", { class: "text-sm text-slate-300" }, " 시작 질문을 눌러도 되고, 아래 입력창에 직접 질문해도 됩니다. 답변은 현재 앱 데이터만 근거로 작성됩니다. ")
                ], -1)),
                _createElementVNode("div", _hoisted_30, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(STARTER_PROMPTS, (prompt) => {
                    return _createElementVNode("button", {
                      key: prompt,
                      type: "button",
                      class: "rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10",
                      onClick: ($event) => usePrompt(prompt)
                    }, _toDisplayString(prompt), 9, _hoisted_31);
                  }), 64))
                ])
              ])) : (_openBlock(), _createElementBlock("div", _hoisted_32, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(messages.value, (message) => {
                  return _openBlock(), _createElementBlock("article", {
                    key: message.id,
                    class: _normalizeClass([
                      "rounded-2xl border px-4 py-4",
                      message.role === "USER" ? "ml-auto max-w-3xl border-cyan-400/25 bg-cyan-400/10" : message.role === "ASSISTANT" ? "max-w-4xl border-slate-800 bg-slate-900/90" : "max-w-4xl border-fuchsia-400/20 bg-fuchsia-400/10"
                    ])
                  }, [
                    _createElementVNode("div", _hoisted_33, [
                      _createElementVNode("div", null, [
                        _createElementVNode("p", _hoisted_34, _toDisplayString(message.role === "USER" ? "YOU" : message.role === "ASSISTANT" ? "ASSISTANT" : "SYSTEM"), 1),
                        _createElementVNode("p", _hoisted_35, [
                          _createTextVNode(_toDisplayString(messageContent(message)), 1),
                          cursorVisible(message) ? (_openBlock(), _createElementBlock("span", _hoisted_36, "▋")) : _createCommentVNode("", true)
                        ])
                      ]),
                      message.role === "ASSISTANT" && message.source_cards_json.length ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: _normalizeClass(["shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800", { "border-cyan-400/40 bg-cyan-400/10 text-cyan-100": selectedSourceMessageId.value === message.id }]),
                        onClick: ($event) => selectedSourceMessageId.value = message.id
                      }, " Sources " + _toDisplayString(message.source_cards_json.length), 11, _hoisted_37)) : _createCommentVNode("", true)
                    ]),
                    _createElementVNode("div", _hoisted_38, [
                      _createElementVNode("span", null, _toDisplayString(formatDateTime(message.created_at)), 1),
                      message.latency_ms != null ? (_openBlock(), _createElementBlock("span", _hoisted_39, _toDisplayString(message.latency_ms) + "ms", 1)) : _createCommentVNode("", true),
                      message.usage_json?.total_tokens ? (_openBlock(), _createElementBlock("span", _hoisted_40, "tokens " + _toDisplayString(message.usage_json.total_tokens), 1)) : _createCommentVNode("", true)
                    ])
                  ], 2);
                }), 128)),
                sending.value ? (_openBlock(), _createElementBlock("article", _hoisted_41, [..._cache[15] || (_cache[15] = [
                  _createElementVNode("p", { class: "text-xs font-semibold tracking-[0.18em] text-slate-400" }, "ASSISTANT", -1),
                  _createElementVNode("p", { class: "mt-3 text-sm text-slate-300" }, "답변을 준비하는 중입니다...", -1)
                ])])) : _createCommentVNode("", true)
              ]))
            ]),
            _createElementVNode("div", _hoisted_42, [
              _withDirectives(_createElementVNode("textarea", {
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => promptText.value = $event),
                rows: "4",
                class: "w-full resize-y rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40",
                placeholder: "예: 오늘 Net이 왜 변했는지, 지난 7일 가장 큰 하락 원인이 무엇인지 물어보세요.",
                disabled: !chatStatus.value?.available || sending.value
              }, null, 8, _hoisted_43), [
                [_vModelText, promptText.value]
              ]),
              _createElementVNode("div", _hoisted_44, [
                _cache[16] || (_cache[16] = _createElementVNode("p", { class: "text-xs text-slate-400" }, " Chat v1은 조회/설명 전용입니다. 거래 생성, 리밸런싱 실행, secret 수정은 지원하지 않습니다. ", -1)),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50",
                  disabled: !canSend.value,
                  onClick: _cache[6] || (_cache[6] = ($event) => submitPrompt())
                }, _toDisplayString(sending.value ? "Sending..." : "Send"), 9, _hoisted_45)
              ])
            ])
          ]),
          _createElementVNode("aside", {
            class: _normalizeClass(["rounded-[24px] border border-slate-800 bg-slate-900/80 p-4", [
              mobileSourcesOpen.value ? "fixed inset-x-3 bottom-3 z-40 max-h-[65vh] overflow-y-auto xl:static xl:max-h-none xl:overflow-visible" : "hidden xl:block"
            ]])
          }, [
            _createElementVNode("div", _hoisted_46, [
              _cache[17] || (_cache[17] = _createElementVNode("div", null, [
                _createElementVNode("h2", { class: "text-lg font-semibold text-white" }, "Sources"),
                _createElementVNode("p", { class: "text-xs text-slate-400" }, "답변의 근거 카드와 tool trace를 확인합니다.")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 xl:hidden",
                onClick: _cache[7] || (_cache[7] = ($event) => mobileSourcesOpen.value = false)
              }, " Close ")
            ]),
            _createElementVNode("div", _hoisted_47, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectedSourceCards.value, (card) => {
                return _openBlock(), _createElementBlock("article", {
                  key: `${card.title}-${card.as_of}-${card.scope}`,
                  class: "rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                }, [
                  _createElementVNode("div", _hoisted_48, [
                    _createElementVNode("div", null, [
                      _createElementVNode("p", _hoisted_49, _toDisplayString(card.title), 1),
                      _createElementVNode("p", _hoisted_50, " as_of " + _toDisplayString(formatDateTime(card.as_of)) + " · " + _toDisplayString(card.scope || "-"), 1)
                    ]),
                    sourceRoute(card) ? (_openBlock(), _createElementBlock("button", {
                      key: 0,
                      type: "button",
                      class: "shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-800",
                      onClick: ($event) => goToSource(card)
                    }, _toDisplayString(sourceRoute(card)?.label), 9, _hoisted_51)) : _createCommentVNode("", true)
                  ]),
                  card.summary ? (_openBlock(), _createElementBlock("p", _hoisted_52, _toDisplayString(card.summary), 1)) : _createCommentVNode("", true),
                  card.data ? (_openBlock(), _createElementBlock("pre", _hoisted_53, _toDisplayString(JSON.stringify(card.data, null, 2)), 1)) : _createCommentVNode("", true)
                ]);
              }), 128)),
              selectedSourceMessage.value?.tool_calls_json?.length ? (_openBlock(), _createElementBlock("article", _hoisted_54, [
                _cache[18] || (_cache[18] = _createElementVNode("p", { class: "text-sm font-semibold text-white" }, "Tool Trace", -1)),
                _createElementVNode("div", _hoisted_55, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectedSourceMessage.value.tool_calls_json, (trace) => {
                    return _openBlock(), _createElementBlock("div", {
                      key: `${selectedSourceMessage.value.id}-${trace.tool_name}`,
                      class: "rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3"
                    }, [
                      _createElementVNode("div", _hoisted_56, [
                        _createElementVNode("span", _hoisted_57, _toDisplayString(trace.tool_name), 1),
                        _createElementVNode("span", {
                          class: _normalizeClass([
                            "rounded-full px-2 py-1 text-[10px] font-semibold uppercase",
                            trace.status === "ok" ? "bg-emerald-500/15 text-emerald-200" : trace.status === "partial" ? "bg-amber-500/15 text-amber-200" : "bg-rose-500/15 text-rose-200"
                          ])
                        }, _toDisplayString(trace.status), 3)
                      ]),
                      trace.summary ? (_openBlock(), _createElementBlock("p", _hoisted_58, _toDisplayString(trace.summary), 1)) : _createCommentVNode("", true),
                      trace.error ? (_openBlock(), _createElementBlock("p", _hoisted_59, _toDisplayString(trace.error), 1)) : _createCommentVNode("", true)
                    ]);
                  }), 128))
                ])
              ])) : _createCommentVNode("", true),
              !selectedSourceCards.value.length && !selectedSourceMessage.value?.tool_calls_json?.length ? (_openBlock(), _createElementBlock("div", _hoisted_60, " 선택된 답변의 source card가 아직 없습니다. ")) : _createCommentVNode("", true)
            ])
          ], 2)
        ])
      ]);
    };
  }
});

export { _sfc_main as default };
