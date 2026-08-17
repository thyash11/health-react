import { DailyLogEntry } from "../types";

const timeInMinutes = (value: string) => {
  const normalized = value.trim();
  const twelveHour = /^(1[0-2]|[1-9]):([0-5]\d)\s*(AM|PM)$/i.exec(normalized);
  if (twelveHour) {
    let hour = Number(twelveHour[1]) % 12;
    if (twelveHour[3].toUpperCase() === "PM") hour += 12;
    return hour * 60 + Number(twelveHour[2]);
  }

  const twentyFourHour = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(normalized);
  if (twentyFourHour) return Number(twentyFourHour[1]) * 60 + Number(twentyFourHour[2]);

  return Number.MAX_SAFE_INTEGER;
};

export const sortDailyLogs = (logs: DailyLogEntry[]) =>
  [...logs].sort((left, right) => {
    const dateComparison = left.date.localeCompare(right.date);
    if (dateComparison !== 0) return dateComparison;
    return timeInMinutes(left.time || "") - timeInMinutes(right.time || "");
  });
