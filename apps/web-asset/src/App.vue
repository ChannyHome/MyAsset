<template>
  <main class="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
    <section
      class="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">web-asset</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Remote App Running</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Host에서 이 앱의 Home/Dashboard/Report 페이지를 Module Federation으로 로드합니다.
      </p>
    </section>
  </main>
  <div class="hidden">
    <!-- Keep exposed pages in the bundle when this app runs standalone -->
    <div>HomePage / DashboardPage / ReportPage</div>
  </div>
</template>
