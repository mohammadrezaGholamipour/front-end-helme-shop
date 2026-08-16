import { PaymentApi } from "~/services/payment";

/* ---------------- ایجاد درخواست پرداخت و رفتن به درگاه ---------------- */

export const useCreatePaymentRequest = () => {
  const { $api } = useNuxtApp();
  const toast = useAppToast();

  const mutation = useMutation({
    mutationFn: (orderId: number) => PaymentApi.request($api, orderId),
  });

  // یک تابع کمکی که هم mutation رو صدا می‌زنه هم خودش ریدایرکت می‌کنه،
  // تا توی کامپوننت فقط کافی باشه payNow(order.id) صدا زده بشه.
  async function payNow(orderId: number) {
    try {
      const result = await mutation.mutateAsync(orderId);
      // ریدایرکت کامل (نه navigateTo داخلی) چون مقصد دامنه‌ی زرین‌پاله
      window.location.href = result.payment_url;
    } catch (error) {
      toast.apiError(error, "ایجاد درخواست پرداخت با خطا مواجه شد");
    }
  }

  return {
    ...mutation,
    payNow,
  };
};