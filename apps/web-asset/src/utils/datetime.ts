const SEOUL_TIME_ZONE = "Asia/Seoul";

function normalizeIsoInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const normalized = trimmed.includes(" ") ? trimmed.replace(" ", "T") : trimmed;
  const hasOffset = /([zZ]|[+\-]\d{2}:\d{2})$/.test(normalized);
  return hasOffset ? normalized : `${normalized}Z`;
}

export function parseApiUtcDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(normalizeIsoInput(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateTimeSeoul(value: string | Date | null | undefined): string {
  const parsed = parseApiUtcDate(value);
  if (!parsed) return value == null ? "-" : String(value);
  return parsed.toLocaleString("ko-KR", { timeZone: SEOUL_TIME_ZONE });
}

export function formatNowSeoul(): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function seoulDateToUtcNaiveIso(value: string, endOfDay = false): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;

  const hhmmss = endOfDay ? "23:59:59" : "00:00:00";
  const date = new Date(`${trimmed}T${hhmmss}+09:00`);
  if (Number.isNaN(date.getTime())) return undefined;

  const yyyy = date.getUTCFullYear();
  const mm = pad2(date.getUTCMonth() + 1);
  const dd = pad2(date.getUTCDate());
  const hh = pad2(date.getUTCHours());
  const mi = pad2(date.getUTCMinutes());
  const ss = pad2(date.getUTCSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

export function toDateTimeLocalSeoul(value: string | Date | null | undefined): string {
  const parsed = parseApiUtcDate(value);
  if (!parsed) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(parsed)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

  const year = parts.year ?? "";
  const month = parts.month ?? "";
  const day = parts.day ?? "";
  const hour = parts.hour ?? "";
  const minute = parts.minute ?? "";
  if (!year || !month || !day || !hour || !minute) return "";
  return `${year}-${month}-${day}T${hour}:${minute}`;
}
