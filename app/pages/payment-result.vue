<script setup lang="ts">

const route = useRoute();
const status = computed(() => (route.query.status as string) || "unknown");
const orderId = computed(() => {
  const raw = route.query.order_id;
  return raw ? Number(raw) : null;
});

const { data: order } = useOrder(computed(() => orderId.value ?? 0));

const statusConfig = computed(() => {
  switch (status.value) {
    case "success":
      return {
        icon: "tabler:check",
        eyebrow: "پرداخت تایید شد",
        title: "سفارش شما ثبت شد",
        text: "رسید زیر مهر تاییدیه‌ی پرداخت شماست؛ سفارش در حال آماده‌سازیه.",
        tone: "success" as const,
        stamp: "پرداخت شد",
      };
    case "cancelled":
      return {
        icon: "tabler:x",
        eyebrow: "پرداخت انجام نشد",
        title: "از پرداخت انصراف دادید",
        text: "خبری نیست، هیچ مبلغی کم نشده. هر وقت آماده بودید دوباره اقدام کنید.",
        tone: "warning" as const,
        stamp: "لغو شد",
      };
    case "failed":
      return {
        icon: "tabler:exclamation-mark",
        eyebrow: "پرداخت ناموفق",
        title: "تراکنش کامل نشد",
        text: "مشکلی توی مسیر پرداخت پیش اومد. اگه مبلغی کسر شده، تا ۷۲ ساعت آینده به حسابتون برمی‌گرده.",
        tone: "danger" as const,
        stamp: "ناموفق",
      };
    case "not_found":
      return {
        icon: "tabler:question-mark",
        eyebrow: "یافت نشد",
        title: "این تراکنش رو پیدا نکردیم",
        text: "لطفاً با پشتیبانی تماس بگیرید تا وضعیت پرداختتون رو بررسی کنیم.",
        tone: "danger" as const,
        stamp: "نامشخص",
      };
    default:
      return {
        icon: "tabler:question-mark",
        eyebrow: "وضعیت نامشخص",
        title: "وضعیت پرداخت مشخص نیست",
        text: "برای اطمینان، وضعیت سفارشتون رو از صفحه‌ی سفارش‌ها چک کنید.",
        tone: "warning" as const,
        stamp: "بررسی لازم",
      };
  }
});

const canRetry = computed(
  () => status.value === "cancelled" || status.value === "failed",
);

</script>

<template>
  <section class="payresult">
  
    <Transition appear name="rise">
      <div class="receipt" :class="`receipt--${statusConfig.tone}`">
        <!-- مهر تاییدیه -->

        <h1 class="receipt__title">{{ statusConfig.title }}</h1>
        <p class="receipt__text">{{ statusConfig.text }}</p>

        <div v-if="order" class="receipt__body">
          <div class="receipt__perf" aria-hidden="true" />

          <div class="receipt__row">
            <span>مبلغ</span>
            <span class="tabular-nums receipt__amount">
              {{ formatAmount(order.payable_amount) }}
            </span>
          </div>
        </div>

      </div>
    </Transition>
  </section>
</template>

<style scoped>
.payresult {
  @apply relative flex  items-center justify-center overflow-hidden px-4 py-14;
}



/* ===== کارت رسید ===== */

.receipt {
  @apply relative z-10 flex w-full max-w-sm flex-col items-center gap-2 px-7 pb-8 pt-14 text-center;
  background: var(--dash-surface);
  border: 1px solid color-mix(in srgb, var(--dash-primary) 14%, transparent);
  border-radius: 26px;
  box-shadow:
    0 24px 48px -20px color-mix(in srgb, var(--dash-ink) 25%, transparent),
    0 2px 0 color-mix(in srgb, var(--dash-primary) 10%, transparent);
  /* لبه‌ی دندانه‌دار پایین کارت، مثل ته رسیدهای چاپی */
  mask-image: radial-gradient(
      circle 7px at 14px calc(100% - 6px),
      transparent 7px,
      #000 7.5px
    ),
    radial-gradient(circle 7px at calc(100% - 14px) calc(100% - 6px), transparent 7px, #000 7.5px);
  mask-composite: intersect;
  mask-repeat: repeat-x;
  mask-size: 28px 100%, 28px 100%;
}

/* ===== مهر تاییدیه ===== */


.receipt__seal {
  @apply relative flex h-20 w-20 items-center justify-center rounded-full;
  background: var(--dash-primary);
  box-shadow:
    0 0 0 6px var(--dash-surface),
    0 0 0 8px color-mix(in srgb, var(--dash-primary) 30%, transparent),
    0 14px 26px -10px color-mix(in srgb, var(--dash-primary) 55%, transparent);
  animation: seal-drop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.receipt--danger .receipt__seal {
  background: #dc2626;
  box-shadow:
    0 0 0 6px var(--dash-surface),
    0 0 0 8px color-mix(in srgb, #dc2626 30%, transparent),
    0 14px 26px -10px color-mix(in srgb, #dc2626 55%, transparent);
}

.receipt--warning .receipt__seal {
  background: #d97706;
  box-shadow:
    0 0 0 6px var(--dash-surface),
    0 0 0 8px color-mix(in srgb, #d97706 30%, transparent),
    0 14px 26px -10px color-mix(in srgb, #d97706 55%, transparent);
}

.receipt__seal-icon {
  @apply h-9 w-9 text-white;
  stroke-width: 3;
}

.receipt__seal-stamp {
  @apply absolute z-[999] -bottom-2 left-1/2 -translate-x-1/2 rotate-[-6deg] whitespace-nowrap rounded-full px-3 py-0.5 text-[10px] font-black tracking-wide;
  background: var(--dash-surface);
  border: 1.5px solid var(--dash-primary);
  color: var(--dash-primary-deep);
  animation: stamp-in 0.4s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.receipt--danger .receipt__seal-stamp {
  border-color: #dc2626;
  color: #dc2626;
}

.receipt--warning .receipt__seal-stamp {
  border-color: #d97706;
  color: #d97706;
}

@keyframes seal-drop {
  from {
    opacity: 0;
    transform: translateY(-18px) scale(0.6);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes stamp-in {
  from {
    opacity: 0;
    transform: translateX(-50%) rotate(-6deg) scale(0.7);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) rotate(-6deg) scale(1);
  }
}

/* کانفتی سبک، فقط برای موفقیت */

.receipt__confetti {
  --angle: calc(var(--i) * 36deg);
  @apply absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full;
  background: color-mix(in srgb, var(--dash-primary) 70%, #fbbf24);
  transform: rotate(var(--angle)) translateY(0);
  opacity: 0;
  animation: confetti-burst 0.7s 0.5s ease-out both;
}

@keyframes confetti-burst {
  0% {
    opacity: 1;
    transform: rotate(var(--angle)) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateY(-46px) scale(0.4);
  }
}

/* ===== متن ===== */

.receipt__eyebrow {
  @apply mt-2 text-[11px] font-bold tracking-wide opacity-60;
  color: var(--dash-primary-deep);
}

.receipt__title {
  @apply text-xl font-black;
  color: var(--dash-ink);
}

.receipt__text {
  @apply mt-0.5 max-w-xs text-wrap text-sm leading-7 opacity-65;
  color: var(--dash-ink);
}

/* ===== بدنه‌ی رسید ===== */

.receipt__body {
  @apply mt-4 flex w-full flex-col gap-2 pt-4 text-sm;
}

.receipt__perf {
  @apply absolute right-0 left-0 -mt-4 border-t border-dashed;
  border-color: color-mix(in srgb, var(--dash-primary) 25%, transparent);
}

.receipt__row {
  @apply flex items-center justify-between opacity-75;
  color: var(--dash-ink);
}

.receipt__amount {
  @apply font-bold;
  color: var(--dash-primary-deep);
}

.receipt__code {
  @apply rounded-md px-2 py-0.5 text-xs;
  background: color-mix(in srgb, var(--dash-primary) 8%, transparent);
  letter-spacing: 0.04em;
}

/* ===== اکشن‌ها ===== */

.receipt__actions {
  @apply mt-6 flex w-full gap-2;
}

.receipt__btn {
  @apply flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold transition;
  border: 1px solid color-mix(in srgb, var(--dash-primary) 30%, transparent);
  color: var(--dash-primary-deep);
}

.receipt__btn:hover {
  background: color-mix(in srgb, var(--dash-primary) 8%, transparent);
}

.receipt__btn:focus-visible {
  outline: 2px solid var(--dash-primary);
  outline-offset: 2px;
}

.receipt__btn--primary {
  color: #fff;
  background: var(--dash-primary);
  border-color: transparent;
}

.receipt__btn--primary:hover {
  background: var(--dash-primary-deep);
}

/* ===== ورود صفحه ===== */

.rise-enter-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.rise-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .receipt__seal,
  .receipt__seal-stamp,
  .receipt__confetti,
  .rise-enter-active {
    animation: none !important;
    transition: none !important;
  }

  .rise-enter-from {
    opacity: 1;
    transform: none;
  }
}
</style>