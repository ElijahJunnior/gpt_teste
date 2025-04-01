import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/pt-br";
import ms from "ms";

dayjs.extend(utc);
dayjs.locale("pt-br");

// interface IDateToISOStringProps {
//   date?: Date | string;
//   format?: "local" | "utc";
// }

// export function dateToISOString({
//   date,
//   format = "utc",
// }: IDateToISOStringProps = {}): string {
//   if (!date) {
//     date = dayjs().toDate();
//   } else if (typeof date === "string") {
//     date = dayjs(date).toDate();
//   }

//   dayjs().add("7s");

//   return format === "utc"
//     ? dayjs(date).utc().format()
//     : dayjs(date).utc().local().format();
// }

export function handleJWTExpirationDate(interval: string): Date {
  const milliseconds = ms(interval);

  return dayjs().add(milliseconds, "milliseconds").toDate();
}

export function convertDateToTimestamp(date: Date): number {
  return dayjs(date).unix();
}

// interface IDateToFormattedString {
//   date?: Date | string;
//   mask?: string;
// }

// export function dateToFormattedString({
//   date,
//   mask = "YYYY-MM-DD",
// }: IDateToFormattedString = {}): string {
//   if (!date) {
//     date = dayjs().toDate();
//   } else if (typeof date === "string") {
//     date = dayjs(date).toDate();
//   }

//   return dayjs(date).format(mask);
// }

// interface IDateHandledToPeriodProps {
//   date?: Date | string;
// }

// interface IDateHandledToPeriodResult {
//   date_begin: Date;
//   date_end: Date;
// }

// export function dateHandledToPeriod(
//   date: Date | string = undefined
// ): IDateHandledToPeriodResult {
//   if (!date) {
//     date = dayjs().toDate();
//   } else if (typeof date === "string") {
//     date = dayjs(date).toDate();
//   }

//   const date_begin = dayjs(date)
//     .local()
//     .set("hour", 0)
//     .set("minute", 0)
//     .set("second", 0)
//     .set("millisecond", 0)
//     .utc()
//     .toDate();
//   const date_end = dayjs(date)
//     .local()
//     .set("hour", 23)
//     .set("minute", 59)
//     .set("second", 59)
//     .set("millisecond", 999)
//     .utc()
//     .toDate();
//   return { date_begin, date_end };
// }

export function dateNow(): Date {
  return dayjs().toDate();
}

export function dateComparer(
  start_date: Date | string | undefined = undefined,
  end_date: Date | string | undefined = undefined
): number {
  if (start_date != null) {
    start_date = dayjs().toDate();
  } else if (typeof start_date === "string") {
    start_date = dayjs(start_date).toDate();
  }

  if (end_date != null) {
    end_date = dayjs().toDate();
  } else if (typeof end_date === "string") {
    end_date = dayjs(end_date).toDate();
  }

  const start_date_utc = dayjs(start_date).utc().format();
  const end_date_utc = dayjs(end_date).utc().format();

  return dayjs(end_date_utc).diff(start_date_utc, "milliseconds");
}
