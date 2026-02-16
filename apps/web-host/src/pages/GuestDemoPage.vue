<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

type DemoSection = {
  title: string;
  subtitle: string;
  highlights: string[];
};
type SectionKey = "home" | "dashboard" | "agent" | "report" | "chat" | "budget" | "lab" | "settings";

const route = useRoute();

const sections: Record<SectionKey, DemoSection> = {
  home: {
    title: "Home Demo",
    subtitle: "실데이터 대신 체험용 요약과 카드 구성을 보여줍니다.",
    highlights: [
      "총자산/순자산 KPI 구성",
      "자산 비중 차트 + Top Holdings 카드",
      "소액 숨김/거래미지원 숨김 토글 위치",
    ],
  },
  dashboard: {
    title: "Dashboard Demo",
    subtitle: "도구상자 기반 위젯 편집 흐름을 체험할 수 있습니다.",
    highlights: [
      "위젯 팔레트 + 캔버스 + 속성 패널",
      "드래그/더블클릭으로 위젯 추가",
      "대표 대시보드 지정 시나리오",
    ],
  },
  agent: {
    title: "Agent Demo",
    subtitle: "자산/포지션/부채 액션카드의 실행 UX를 미리 확인합니다.",
    highlights: [
      "액션 실행 전 확인 카드",
      "실행 결과 로그/오류 표시 구조",
      "승인 후 API 수행 모델",
    ],
  },
  report: {
    title: "Report Demo",
    subtitle: "수익 기여, 변동, 권장 액션 리포트 예시를 보여줍니다.",
    highlights: [
      "기간별 자산 변화",
      "상승/하락 자산 분류",
      "부채/현금흐름 관점의 인사이트",
    ],
  },
  chat: {
    title: "Chat Demo",
    subtitle: "LLM 기반 자산 질의 및 액션 제안 흐름을 준비 중입니다.",
    highlights: [
      "자연어 질의 응답",
      "파일/이미지 입력 지원 예정",
      "실행 전 승인/롤백 시나리오",
    ],
  },
  budget: {
    title: "Budget Demo",
    subtitle: "가계부/지출 카테고리와 투자 연계 뷰를 준비 중입니다.",
    highlights: [
      "월별 지출 요약",
      "예산 대비 사용률",
      "투자 가능 현금 추정",
    ],
  },
  lab: {
    title: "Lab Demo",
    subtitle: "개발 중 API 실험 화면을 체험할 수 있습니다.",
    highlights: [
      "엔드포인트 호출 샌드박스",
      "요청/응답 샘플 확인",
      "시나리오 테스트 템플릿",
    ],
  },
  settings: {
    title: "Settings Demo",
    subtitle: "권한별 설정 기능 화면 구성을 미리 보여줍니다.",
    highlights: [
      "Admin: 시스템 설정 변경",
      "Maintainer: household 관리",
      "개인 표시/숨김 옵션",
    ],
  },
};

const sectionKey = computed<SectionKey>(() => {
  const path = route.path;
  if (path.startsWith("/dashboard")) return "dashboard";
  if (path.startsWith("/agent")) return "agent";
  if (path.startsWith("/report")) return "report";
  if (path.startsWith("/chat")) return "chat";
  if (path.startsWith("/budget")) return "budget";
  if (path.startsWith("/lab")) return "lab";
  if (path.startsWith("/settings")) return "settings";
  return "home";
});

const section = computed<DemoSection>(() => sections[sectionKey.value]);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-700/50 dark:bg-amber-900/20">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Guest Demo</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ section.title }}</h1>
      <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">
        {{ section.subtitle }}
      </p>
      <p class="mt-2 text-xs text-slate-600 dark:text-slate-300">
        Guest 계정은 체험 모드입니다. 실제 데이터 조회/수정은 USER 이상 권한에서 가능합니다.
      </p>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">체험 포인트</h2>
      <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        <li
          v-for="item in section.highlights"
          :key="item"
          class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"
        >
          {{ item }}
        </li>
      </ul>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">권한 업그레이드 안내</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Maintainer 또는 Admin이 계정을 USER/SUPERUSER로 승급하면 실데이터 화면과 API 기능을 사용할 수 있습니다.
      </p>
    </article>
  </section>
</template>
