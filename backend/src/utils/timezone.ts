import dayjs from "dayjs";

export function isValidTimezone(tz: string): boolean {
    
    try {
      dayjs.tz('2025-01-01T00:00:00', tz);
      return true;
    } catch {
      return false;
    }
  }