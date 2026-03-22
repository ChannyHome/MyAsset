<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import {
  createChatMessage,
  createChatSession,
  getChatMessages,
  getChatSessions,
  getChatStatus,
  type ChatMessageOut,
  type ChatSessionOut,
  type ChatSourceCard,
  type ChatStatusOut,
} from "../api/chat";
import { getHouseholds, type HouseholdOut } from "../api/households";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import { formatDateTimeSeoul } from "../utils/datetime";

const STARTER_PROMPTS = [
  "오늘 Net이 왜 변했어?",
  "지난 7일 가장 큰 하락 원인은?",
  "업비트 포트폴리오 요약해줘",
  "최근 snapshot과 현재 상태를 비교해줘",
];

const STORAGE_KEY = "myasset:chat:v1:selected-session";
const SCOPE_STORAGE_KEY = "myasset:chat:v1:scope";

const { displayCurrency, ensureInitialized } = useDisplayCurrency();
const router = useRouter();

const loading = ref(false);
const sending = ref(false);
const statusLoading = ref(false);
const errorMessage = ref("");
const promptText = ref("");
const sessions = ref<ChatSessionOut[]>([]);
const messages = ref<ChatMessageOut[]>([]);
const selectedSessionId = ref<number | null>(null);
const selectedSourceMessageId = ref<number | null>(null);
const chatStatus = ref<ChatStatusOut | null>(null);
const mobileSourcesOpen = ref(false);
const households = ref<HouseholdOut[]>([]);
const selectedScopeType = ref<"USER" | "HOUSEHOLD">("USER");
const selectedHouseholdId = ref<number | null>(null);
const streamingMessageId = ref<number | null>(null);
const streamingRenderedText = ref("");
let streamingTimer: ReturnType<typeof setInterval> | null = null;

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

function setError(message: string): void {
  errorMessage.value = message;
}

function clearError(): void {
  errorMessage.value = "";
}

function readStoredSessionId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function readStoredScope(): { scopeType: "USER" | "HOUSEHOLD"; householdId: number | null } {
  if (typeof window === "undefined") {
    return { scopeType: "USER", householdId: null };
  }
  const raw = window.localStorage.getItem(SCOPE_STORAGE_KEY);
  if (!raw) {
    return { scopeType: "USER", householdId: null };
  }
  try {
    const parsed = JSON.parse(raw) as { scopeType?: string; householdId?: number | null };
    return {
      scopeType: parsed.scopeType === "HOUSEHOLD" ? "HOUSEHOLD" : "USER",
      householdId: typeof parsed.householdId === "number" && parsed.householdId > 0 ? parsed.householdId : null,
    };
  } catch {
    return { scopeType: "USER", householdId: null };
  }
}

function storeSelectedSessionId(value: number | null): void {
  if (typeof window === "undefined") return;
  if (value == null) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, String(value));
}

function storeScopeSelection(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    SCOPE_STORAGE_KEY,
    JSON.stringify({
      scopeType: selectedScopeType.value,
      householdId: selectedHouseholdId.value,
    }),
  );
}

function clearStreaming(): void {
  if (streamingTimer) {
    clearInterval(streamingTimer);
    streamingTimer = null;
  }
  streamingMessageId.value = null;
  streamingRenderedText.value = "";
}

function startStreaming(message: ChatMessageOut | null): void {
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

function messageContent(message: ChatMessageOut): string {
  if (message.id === streamingMessageId.value) {
    return streamingRenderedText.value;
  }
  return message.content_text;
}

function cursorVisible(message: ChatMessageOut): boolean {
  return message.id === streamingMessageId.value;
}

function sourceRoute(card: ChatSourceCard): { label: string; to: string } | null {
  const snapshotId = Number((card.data as Record<string, unknown> | null)?.snapshot_id);
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

function goToSource(card: ChatSourceCard): void {
  const routeTarget = sourceRoute(card);
  if (!routeTarget) return;
  void router.push(routeTarget.to);
}

function latestAssistantMessage(items: ChatMessageOut[]): ChatMessageOut | null {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (!item) continue;
    if (item.role === "ASSISTANT") {
      return item;
    }
  }
  return null;
}

const selectedSession = computed(() =>
  sessions.value.find((session) => session.id === selectedSessionId.value) ?? null,
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

const selectedSourceCards = computed<ChatSourceCard[]>(() => selectedSourceMessage.value?.source_cards_json ?? []);

const canSend = computed(() => {
  return Boolean(chatStatus.value?.available) && !sending.value && promptText.value.trim().length > 0;
});

const isEmptyThread = computed(() => messages.value.length === 0 && !loading.value && !sending.value);

async function loadChatStatus(): Promise<void> {
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

async function loadHouseholds(): Promise<void> {
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
    selectedHouseholdId.value =
      households.value.find((item) => item.id === stored.householdId)?.id ??
      households.value[0]?.id ??
      null;
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

async function loadMessages(sessionId: number): Promise<void> {
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

async function loadSessions(preferredSessionId?: number | null, reloadMessages = true): Promise<void> {
  loading.value = true;
  clearError();
  try {
    const out = await getChatSessions();
    sessions.value = out;
    const stored = preferredSessionId ?? selectedSessionId.value ?? readStoredSessionId();
    const next =
      out.find((session) => session.id === stored)?.id ??
      out[0]?.id ??
      null;
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

async function createSession(title?: string): Promise<number | null> {
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

async function handleNewChat(): Promise<void> {
  clearError();
  await createSession();
}

async function selectSession(sessionId: number): Promise<void> {
  if (selectedSessionId.value === sessionId) return;
  selectedSessionId.value = sessionId;
  storeSelectedSessionId(sessionId);
  await loadMessages(sessionId);
}

async function submitPrompt(textOverride?: string): Promise<void> {
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
      scope_id: selectedScopeType.value === "HOUSEHOLD" ? (selectedHouseholdId.value ?? undefined) : undefined,
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

function usePrompt(text: string): void {
  promptText.value = text;
  void submitPrompt(text);
}

function toggleSourceDrawer(): void {
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
</script>

<template>
  <section class="space-y-4 text-slate-100">
    <header class="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-semibold tracking-[0.28em] text-cyan-300">CHAT</p>
          <h1 class="mt-3 text-4xl font-semibold tracking-tight text-white">Assistant</h1>
          <p class="mt-3 max-w-3xl text-sm text-slate-300">
            Analytics, snapshot, portfolio, holdings, liabilities 데이터를 바탕으로 자연어 설명을 제공합니다.
            Chat v1은 조회/설명 전용입니다.
          </p>
          <p class="mt-3 text-xs text-slate-400">
            model: {{ chatStatus?.default_model ?? "-" }} · currency: {{ displayCurrency }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm">
          <p class="font-semibold text-white">
            {{ chatStatus?.available ? "Chat Ready" : "Chat Unavailable" }}
          </p>
          <p class="mt-1 text-xs text-slate-400">
            {{ chatStatus?.message ?? (statusLoading ? "Loading chat status..." : "Status unavailable") }}
          </p>
        </div>
      </div>
    </header>

    <section v-if="errorMessage" class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
      {{ errorMessage }}
    </section>

    <section class="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      <aside class="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-white">Sessions</h2>
            <p class="text-xs text-slate-400">최근 대화와 새 대화를 관리합니다.</p>
          </div>
          <button
            type="button"
            class="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
            @click="handleNewChat()"
          >
            New Chat
          </button>
        </div>

        <div class="mt-4 space-y-2">
          <button
            v-for="session in sessions"
            :key="session.id"
            type="button"
            class="w-full rounded-2xl border px-3 py-3 text-left transition"
            :class="
              selectedSessionId === session.id
                ? 'border-cyan-400/40 bg-cyan-400/10'
                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
            "
            @click="selectSession(session.id)"
          >
            <p class="truncate text-sm font-semibold text-white">{{ session.title }}</p>
            <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{{ session.status }}</p>
            <p class="mt-2 text-xs text-slate-400">
              {{ formatDateTime(session.last_message_at || session.updated_at) }}
            </p>
          </button>
          <div
            v-if="!sessions.length && !loading"
            class="rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-400"
          >
            아직 대화가 없습니다.
          </div>
        </div>
      </aside>

      <section class="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">{{ selectedSession?.title ?? "New chat" }}</h2>
            <p class="text-xs text-slate-400">
              {{ selectedSession ? `last message ${formatDateTime(selectedSession.last_message_at || selectedSession.updated_at)}` : "질문을 시작하면 새 세션이 만들어집니다." }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 xl:hidden"
            @click="toggleSourceDrawer()"
          >
            {{ mobileSourcesOpen ? "Hide Sources" : "Show Sources" }}
          </button>
        </div>

        <div class="mt-4 min-h-[420px] rounded-[24px] border border-slate-800 bg-slate-950/60 p-4">
          <div class="mb-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-[auto_minmax(0,1fr)]">
            <div>
              <p class="text-xs font-semibold tracking-[0.18em] text-slate-400">SCOPE</p>
              <div class="mt-2 inline-flex rounded-xl border border-slate-700 bg-slate-950/60 p-1">
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                  :class="selectedScopeType === 'USER' ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-300 hover:bg-slate-800'"
                  @click="selectedScopeType = 'USER'"
                >
                  User
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                  :class="selectedScopeType === 'HOUSEHOLD' ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-300 hover:bg-slate-800'"
                  :disabled="!households.length"
                  @click="selectedScopeType = 'HOUSEHOLD'"
                >
                  Household
                </button>
              </div>
            </div>
            <div v-if="selectedScopeType === 'HOUSEHOLD'">
              <label class="text-xs font-semibold tracking-[0.18em] text-slate-400">HOUSEHOLD</label>
              <select
                v-model.number="selectedHouseholdId"
                class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
              >
                <option v-for="household in households" :key="household.id" :value="household.id">
                  {{ household.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="loading" class="flex min-h-[360px] items-center justify-center text-sm text-slate-400">
            Loading chat...
          </div>
          <div v-else-if="isEmptyThread" class="space-y-6">
            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p class="text-sm text-slate-300">
                시작 질문을 눌러도 되고, 아래 입력창에 직접 질문해도 됩니다. 답변은 현재 앱 데이터만 근거로 작성됩니다.
              </p>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <button
                v-for="prompt in STARTER_PROMPTS"
                :key="prompt"
                type="button"
                class="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                @click="usePrompt(prompt)"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
          <div v-else class="space-y-4">
            <article
              v-for="message in messages"
              :key="message.id"
              class="rounded-2xl border px-4 py-4"
              :class="
                message.role === 'USER'
                  ? 'ml-auto max-w-3xl border-cyan-400/25 bg-cyan-400/10'
                  : message.role === 'ASSISTANT'
                    ? 'max-w-4xl border-slate-800 bg-slate-900/90'
                    : 'max-w-4xl border-fuchsia-400/20 bg-fuchsia-400/10'
              "
            >
              <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="text-xs font-semibold tracking-[0.18em] text-slate-400">
                    {{ message.role === "USER" ? "YOU" : message.role === "ASSISTANT" ? "ASSISTANT" : "SYSTEM" }}
                  </p>
                  <p class="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100">
                    {{ messageContent(message) }}<span v-if="cursorVisible(message)" class="animate-pulse text-cyan-300">▋</span>
                  </p>
                </div>
                <button
                  v-if="message.role === 'ASSISTANT' && message.source_cards_json.length"
                  type="button"
                  class="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                  :class="{ 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100': selectedSourceMessageId === message.id }"
                  @click="selectedSourceMessageId = message.id"
                >
                  Sources {{ message.source_cards_json.length }}
                </button>
              </div>
              <div class="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span>{{ formatDateTime(message.created_at) }}</span>
                <span v-if="message.latency_ms != null">{{ message.latency_ms }}ms</span>
                <span v-if="message.usage_json?.total_tokens">tokens {{ message.usage_json.total_tokens }}</span>
              </div>
            </article>
            <article
              v-if="sending"
              class="max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4"
            >
              <p class="text-xs font-semibold tracking-[0.18em] text-slate-400">ASSISTANT</p>
              <p class="mt-3 text-sm text-slate-300">답변을 준비하는 중입니다...</p>
            </article>
          </div>
        </div>

        <div class="mt-4 rounded-[24px] border border-slate-800 bg-slate-950/60 p-4">
          <textarea
            v-model="promptText"
            rows="4"
            class="w-full resize-y rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
            placeholder="예: 오늘 Net이 왜 변했는지, 지난 7일 가장 큰 하락 원인이 무엇인지 물어보세요."
            :disabled="!chatStatus?.available || sending"
          />
          <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-slate-400">
              Chat v1은 조회/설명 전용입니다. 거래 생성, 리밸런싱 실행, secret 수정은 지원하지 않습니다.
            </p>
            <button
              type="button"
              class="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canSend"
              @click="submitPrompt()"
            >
              {{ sending ? "Sending..." : "Send" }}
            </button>
          </div>
        </div>
      </section>

      <aside
        class="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4"
        :class="[
          mobileSourcesOpen ? 'fixed inset-x-3 bottom-3 z-40 max-h-[65vh] overflow-y-auto xl:static xl:max-h-none xl:overflow-visible' : 'hidden xl:block',
        ]"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-white">Sources</h2>
            <p class="text-xs text-slate-400">답변의 근거 카드와 tool trace를 확인합니다.</p>
          </div>
          <button
            type="button"
            class="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 xl:hidden"
            @click="mobileSourcesOpen = false"
          >
            Close
          </button>
        </div>

        <div class="mt-4 space-y-3">
            <article
              v-for="card in selectedSourceCards"
              :key="`${card.title}-${card.as_of}-${card.scope}`"
              class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-white">{{ card.title }}</p>
                  <p class="mt-1 text-[11px] text-slate-500">
                    as_of {{ formatDateTime(card.as_of) }} · {{ card.scope || "-" }}
                  </p>
                </div>
                <button
                  v-if="sourceRoute(card)"
                  type="button"
                  class="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-800"
                  @click="goToSource(card)"
                >
                  {{ sourceRoute(card)?.label }}
                </button>
              </div>
              <p v-if="card.summary" class="mt-3 text-sm text-slate-200">{{ card.summary }}</p>
              <pre
                v-if="card.data"
                class="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-[11px] leading-6 text-slate-300"
              >{{ JSON.stringify(card.data, null, 2) }}</pre>
            </article>

          <article
            v-if="selectedSourceMessage?.tool_calls_json?.length"
            class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
          >
            <p class="text-sm font-semibold text-white">Tool Trace</p>
            <div class="mt-3 space-y-2">
              <div
                v-for="trace in selectedSourceMessage.tool_calls_json"
                :key="`${selectedSourceMessage.id}-${trace.tool_name}`"
                class="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{{ trace.tool_name }}</span>
                  <span
                    class="rounded-full px-2 py-1 text-[10px] font-semibold uppercase"
                    :class="
                      trace.status === 'ok'
                        ? 'bg-emerald-500/15 text-emerald-200'
                        : trace.status === 'partial'
                          ? 'bg-amber-500/15 text-amber-200'
                          : 'bg-rose-500/15 text-rose-200'
                    "
                  >
                    {{ trace.status }}
                  </span>
                </div>
                <p v-if="trace.summary" class="mt-2 text-xs text-slate-300">{{ trace.summary }}</p>
                <p v-if="trace.error" class="mt-2 text-xs text-rose-200">{{ trace.error }}</p>
              </div>
            </div>
          </article>

          <div
            v-if="!selectedSourceCards.length && !(selectedSourceMessage?.tool_calls_json?.length)"
            class="rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-400"
          >
            선택된 답변의 source card가 아직 없습니다.
          </div>
        </div>
      </aside>
    </section>
  </section>
</template>
