/**
 * مبلغ‌ها از سمت بک‌اند به‌صورت رشته‌ی decimal با دقت دلخواه میان (Decimal سریالایز شده).
 * تبدیل به Number ممکنه دقت رو از دست بده یا notation علمی بده، برای همین
 * جداکننده‌ی هزارگان رو با کار روی خودِ رشته اضافه می‌کنیم.
 */
export function formatAmount(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";

  const str = String(value).trim();
  const isNegative = str.startsWith("-");
  const unsigned = str.replace(/^[+-]/, "");
  const [intRaw, fracRaw] = unsigned.split(".");

  const intPart = intRaw?.replace(/^0+(?=\d)/, "") || "0";
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // اعشار مبالغ ریالی/تومانی معمولاً معنی‌دار نیست، برای نمایش تمیزتر حذفش می‌کنیم.
  void fracRaw;

  return `${isNegative ? "-" : ""}${withCommas} تومان`;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل داده‌شده",
  CANCELLED: "لغو‌شده",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}