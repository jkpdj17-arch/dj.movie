/**
 * Date utility functions for KOBIS Box Office
 */

export function getToday(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

export function getYesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(12, 0, 0, 0);
  return d;
}

export function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function formatDateToInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseInputDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  // Using noon (12:00) avoids timezone/DST shifts
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function formatKoreanDate(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayName = days[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}

export function formatNumber(value: string | number): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return String(value);
  return num.toLocaleString('ko-KR');
}

export function formatCurrency(value: string | number): string {
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return '0원';
  if (num >= 100_000_000) {
    const eok = (num / 100_000_000).toFixed(1);
    return `${eok}억원`;
  }
  if (num >= 10_000) {
    const man = (num / 10_000).toFixed(0);
    return `${formatNumber(man)}만원`;
  }
  return `${formatNumber(num)}원`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(12, 0, 0, 0);
  return result;
}

export function isSameDate(d1: Date, d2: Date): boolean {
  return formatDateToInput(d1) === formatDateToInput(d2);
}
