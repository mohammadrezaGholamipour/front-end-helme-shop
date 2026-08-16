<script setup lang="ts">
// این صفحه مقصد FRONTEND_PAYMENT_RESULT_URL هست که بک‌اند بعد از
// verify کردن تراکنش، کاربر رو با query params بهش ریدایرکت می‌کنه:
// ?status=success|failed|cancelled|not_found&order_id=..&ref_id=..

const route = useRoute();

const status = computed(() => (route.query.status as string) || "unknown");
const orderId = computed(() => {
  const raw = route.query.order_id;
  return raw ? Number(raw) : null;
});
const refId = computed(() => (route.query.ref_id as string) || null);

const { data: order } = useOrder(computed(() => orderId.value ?? 0));

const statusConfig = computed(() => {
  switch (status.value) {
    case "success":
      return {
        icon: "tabler:circle-check-filled",
        title: "پرداخت با موفقیت انجام شد",
        text: "سفارش شما ثبت شد و در حال آماده‌سازی است.",
        tone: "success" as const,
      };
    case "cancelled":
      return {
        icon: "tabler:circle-x-filled",
        title: "پرداخت لغو شد",
        text: "شما از پرداخت انصراف دادید. می‌توانید دوباره از صفحه‌ی سفارش‌ها اقدام کنید.",
        tone: "warning" as const,
      };
    case "failed":
      return {
        icon: "tabler:alert-triangle-filled",
        title: "پرداخت ناموفق بود",
        text: "مشکلی در انجام تراکنش پیش آمد. اگر مبلغی از حساب شما کسر شده، طی حداکثر ۷۲ ساعت به حساب شما بازمی‌گردد.",
        tone: "danger" as const,
      };
    case "not_found":
      return {
        icon: "tabler:help-circle-filled",
        title: "تراکنش یافت نشد",
        text: "اطلاعات این پرداخت پیدا نشد. لطفاً با پشتیبانی تماس بگیرید.",
        tone: "danger" as const,
      };
    default:
      return {
        icon: "tabler:help-circle-filled",
        title: "وضعیت پرداخت نامشخص است",
        text: "برای اطمینان، وضعیت سفارش خودتون رو از صفحه‌ی سفارش‌ها چک کنید.",
        tone: "warning" as const,
      };
  }
});

const canRetry = computed(
  () => status.value === "cancelled" || status.value === "failed",
);
</script>

<template>
  <section class="payment-result">
    <div
      class="payment-result__card"
      :class="`payment-result__card--${statusConfig.tone}`"
    >
      <Icon :name="statusConfig.icon" class="payment-result__icon" />

      <h1 class="payment-result__title">{{ statusConfig.title }}</h1>
      <p class="payment-result__text">{{ statusConfig.text }}</p>

      <div v-if="order" class="payment-result__order">
        <div class="payment-result__row">
          <span>شماره سفارش</span>
          <span class="tabular-nums">#{{ order.id }}</span>
        </div>

        <div class="payment-result__row">
          <span>مبلغ</span>
          <span class="tabular-nums">
            {{ formatAmount(order.payable_amount) }}
          </span>
        </div>

        <div v-if="refId" class="payment-result__row">
          <span>کد پیگیری</span>
          <span class="tabular-nums">{{ refId }}</span>
        </div>
      </div>

      <div class="payment-result__actions">
        <NuxtLink to="/dashboard/orders" class="payment-result__btn payment-result__btn--primary">
          مشاهده سفارش‌ها
        </NuxtLink>

        <NuxtLink
          v-if="canRetry"
          to="/dashboard/orders"
          class="payment-result__btn"
        >
          تلاش دوباره
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.payment-result {
  @apply flex min-h-[70vh] items-center justify-center px-4 py-10;
}

.payment-result__card {
  @apply flex w-full max-w-md flex-col items-center gap-3 rounded-3xl border px-6 py-10 text-center;
  border-color: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  background: var(--dash-surface);
}

.payment-result__icon {
  @apply mb-1 h-16 w-16;
}

.payment-result__card--success .payment-result__icon {
  color: #16a34a;
}

.payment-result__card--warning .payment-result__icon {
  color: #d97706;
}

.payment-result__card--danger .payment-result__icon {
  color: #dc2626;
}

.payment-result__title {
  @apply text-lg font-bold;
  color: var(--dash-ink);
}

.payment-result__text {
  @apply max-w-sm text-sm leading-7 opacity-70;
  color: var(--dash-ink);
}

.payment-result__order {
  @apply mt-3 flex w-full flex-col gap-1.5 rounded-xl px-4 py-3 text-sm;
  background: color-mix(in srgb, var(--dash-primary) 5%, transparent);
  color: var(--dash-ink);
}

.payment-result__row {
  @apply flex items-center justify-between opacity-80;
}

.payment-result__actions {
  @apply mt-4 flex w-full gap-2;
}

.payment-result__btn {
  @apply flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition;
  border: 1px solid color-mix(in srgb, var(--dash-primary) 30%, transparent);
  color: var(--dash-primary-deep);
}

.payment-result__btn--primary {
  color: #fff;
  background: var(--dash-primary);
  border-color: transparent;
}

.payment-result__btn--primary:hover {
  background: var(--dash-primary-deep);
}
</style>