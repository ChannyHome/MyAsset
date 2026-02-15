<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Home</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">기본 대시보드</h1>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        사용자가 커스텀하기 전 기본 대시보드입니다. KPI, 자산 구성, 리포트, 릴리즈 노트를 한 화면에서 보여줍니다.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">총 자산</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">₩152,883,714</p>
        <p class="mt-2 text-sm font-semibold text-emerald-600">+₩1,081,369 (+0.71%)</p>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">순자산</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">₩112,583,714</p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">부채 반영 기준</p>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">연간 예상 배당/이자</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">₩2,321,722</p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">세금 15% 옵션 포함</p>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">자산 구성 (도넛)</h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">Top N + 기타</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="h-24 rounded-xl bg-emerald-200 dark:bg-emerald-900/50" />
          <div class="h-24 rounded-xl bg-sky-200 dark:bg-sky-900/50" />
          <div class="h-24 rounded-xl bg-indigo-200 dark:bg-indigo-900/50" />
          <div class="h-24 rounded-xl bg-amber-200 dark:bg-amber-900/50" />
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Report 요약</h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">전일 대비</span>
        </div>
        <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">미국 ETF 비중 +1.4%</li>
          <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">부채 총액 -₩500,000</li>
          <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">상승률 상위: NVDA, SCHD</li>
        </ul>
      </article>
    </div>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Release Note</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        v0.1: Host/Remote 구조 도입, 로그인/LNB/테마/기본 대시보드 스캐폴딩 추가
      </p>
    </article>
  </section>
</template>

