import { DateTime } from "luxon";

export function formatDate(date: string) {
  return DateTime
    .fromISO(date.replace(" ", "T"), {
      zone: "utc",
    })
    .toLocal()
    .toLocaleString(DateTime.DATETIME_MED);
}