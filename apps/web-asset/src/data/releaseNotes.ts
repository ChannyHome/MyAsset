export type ReleaseNoteItem = {
  id: string;
  releasedAt: string;
  title: string;
  summary: string;
};

export const releaseNotes: ReleaseNoteItem[] = [
  // 최신 항목을 배열 맨 위에 추가하세요.
  // releasedAt은 ISO 형식 문자열을 권장합니다. (예: 2026-02-18T14:20:00+09:00)
  {
    id: "2026-02-18-home-release-notes-card",
    releasedAt: "2026-02-18T14:20:00+09:00",
    title: "Home Release Notes Card Added",
    summary: "Added a card at the bottom of Home to quickly review date, time, title, and summary for each step.",
  },
];
