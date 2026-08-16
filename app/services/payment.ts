import type { PaymentRequestOut } from "~/types";

export const PaymentApi = {
  // ایجاد درخواست پرداخت برای یک سفارش -> POST /payment/request/{orderId}
  // پاسخ شامل payment_url هست که کاربر باید بهش ریدایرکت بشه.
  request: ($api: any, orderId: number) =>
    $api(`/payment/request/${orderId}`, {
      method: "POST",
    }) as Promise<PaymentRequestOut>,
};