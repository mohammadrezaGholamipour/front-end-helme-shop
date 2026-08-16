<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();


const supportPhone = "09036266494";

const status = computed(() => (route.query.status as string) || "unknown");

const statusConfig = computed(() => {
  switch (status.value) {
    case "success":
      return {
        icon: "tabler:check",
        eyebrow: "پرداخت تایید شد",
        title: "سفارش شما ثبت شد",
        text: "سفارش شما ثبت شد و در حال آماده‌سازی می‌باشد",
        tone: "success" as const,
        stamp: "پرداخت شد",
        vanta: 0x10b981,
      };
    case "cancelled":
      return {
        icon: "tabler:x",
        eyebrow: "پرداخت انجام نشد",
        title: "از پرداخت انصراف دادید",
        text: "خبری نیست، هیچ مبلغی کم نشده. هر وقت آماده بودید دوباره اقدام کنید.",
        tone: "warning" as const,
        stamp: "لغو شد",
        vanta: 0xc9962e,
      };
    case "failed":
      return {
        icon: "tabler:exclamation-mark",
        eyebrow: "پرداخت ناموفق",
        title: "تراکنش کامل نشد",
        text: "مشکلی توی مسیر پرداخت پیش اومد. اگه مبلغی کسر شده، تا ۷۲ ساعت آینده به حسابتون برمی‌گرده.",
        tone: "danger" as const,
        stamp: "ناموفق",
        vanta: 0xef4444,
      };
    case "not_found":
      return {
        icon: "tabler:question-mark",
        eyebrow: "یافت نشد",
        title: "این تراکنش رو پیدا نکردیم",
        text: "لطفاً با پشتیبانی تماس بگیرید تا وضعیت پرداختتون رو بررسی کنیم.",
        tone: "danger" as const,
        stamp: "نامشخص",
        vanta: 0xef4444,
      };
    default:
      return {
        icon: "tabler:question-mark",
        eyebrow: "وضعیت نامشخص",
        title: "وضعیت پرداخت مشخص نیست",
        text: "برای اطمینان، وضعیت سفارشتون رو از صفحه‌ی سفارش‌ها چک کنید.",
        tone: "warning" as const,
        stamp: "بررسی لازم",
        vanta: 0xc9962e,
      };
  }
});

useHead({
  script: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
      defer: false,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.waves.min.js",
      defer: false,
    },
  ],
});

const vantaRef = ref<HTMLElement | null>(null);
let vantaEffect: any = null;

// منتظر می‌مونیم تا اسکریپت‌های سراسری (window.THREE و window.VANTA) لود بشن
function waitForVanta(retries = 50): Promise<void> {
  return new Promise((resolve, reject) => {
    const check = () => {
      const w = window as any;
      if (w.THREE && w.VANTA?.WAVES) {
        resolve();
      } else if (retries <= 0) {
        reject(new Error("Vanta/Three did not load"));
      } else {
        retries--;
        setTimeout(check, 100);
      }
    };
    check();
  });
}

onMounted(async () => {
  try {
    await waitForVanta();
    const w = window as any;

    vantaEffect = w.VANTA.WAVES({
      el: vantaRef.value,
      THREE: w.THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: statusConfig.value.vanta, // رنگ متناسب با وضعیت پرداخت
      shininess: 45.0,
      waveHeight: 18.0,
      waveSpeed: 2,
      zoom: 0.85,
      backgroundColor: statusConfig.value.vanta,
    });
  } catch (e) {
    // اگر به هر دلیلی Vanta لود نشد، صفحه بدون افکت (فقط رنگ ساده) نمایش داده می‌شه
    console.error("Vanta failed to initialize:", e);
  }
});

onBeforeUnmount(() => {
  vantaEffect?.destroy();
});

const goToHome = () => {
  navigateTo("/");
};
</script>

<template>
  <div class="page-payresult">
    <!-- پس‌زمینه متحرک -->
    <div ref="vantaRef" class="page-payresult__bg"></div>

    <button type="button" class="page-payresult__home" @click="goToHome">
      بازگشت به صفحه اصلی
    </button>

    <Transition appear name="rise">
      <div
        class="page-payresult__card"
        :class="`page-payresult__card--${statusConfig.tone}`"
      >
        <!-- مهر تاییدیه -->
        <div class="receipt__seal">
          <Icon :name="statusConfig.icon" class="receipt__seal-icon" />
          <span class="receipt__seal-stamp">{{ statusConfig.stamp }}</span>
        </div>

        <!-- کانفتی، فقط برای موفقیت -->
        <template v-if="statusConfig.tone === 'success'">
          <span
            v-for="i in 8"
            :key="i"
            class="receipt__confetti"
            :style="{ '--i': i }"
          />
        </template>

        <span class="receipt__eyebrow">{{ statusConfig.eyebrow }}</span>
        <h1 class="receipt__title">{{ statusConfig.title }}</h1>
        <p class="receipt__text">{{ statusConfig.text }}</p>

        <div class="receipt__perf" />

        <!-- پشتیبانی -->
        <a :href="`tel:${supportPhone}`" class="receipt__support">
          <span class="receipt__support-icon">
            <Icon name="tabler:headset" class="h-5 w-5" />
          </span>
          <span class="receipt__support-text">
            <span class="receipt__support-label">سوالی دارید؟ با پشتیبانی تماس بگیرید</span>
            <span class="receipt__support-phone" dir="ltr">{{ supportPhone }}</span>
          </span>
        </a>

        <!-- اکشن -->
        <NuxtLink to="/" class="receipt__btn">
          <Icon name="tabler:shopping-bag" class="h-4 w-4" />
          ادامه‌ی خرید
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page-payresult {
  @apply relative flex w-screen h-screen items-center justify-center overflow-hidden
    bg-slate-50 p-4
    dark:bg-black;
}

.page-payresult__bg {
  @apply absolute inset-0 z-0;
}

.page-payresult__home {
  @apply absolute top-4 m-auto z-20 flex items-center gap-2 rounded-full
    bg-white px-4 py-2.5 text-sm font-bold text-[--gold-one]
    shadow-lg transition
    hover:bg-[--gold-one] hover:text-white hover:shadow-xl
    dark:bg-slate-950 dark:text-[--gold-one]
    dark:hover:bg-[--gold-one] dark:hover:text-white;
}

.page-payresult__card {
  @apply relative z-10 flex w-full max-w-sm flex-col items-center gap-2
    rounded-3xl border border-slate-200 bg-white/90 px-7 pb-8 pt-14 text-center
    shadow-xl backdrop-blur-sm
    dark:border-slate-800 dark:bg-slate-950/90;
  /* لبه‌ی دندانه‌دار پایین کارت، مثل ته رسیدهای چاپی */
  mask-image:
    radial-gradient(
      circle 7px at 14px calc(100% - 6px),
      transparent 7px,
      #000 7.5px
    ),
    radial-gradient(
      circle 7px at calc(100% - 14px) calc(100% - 6px),
      transparent 7px,
      #000 7.5px
    );
  mask-composite: intersect;
  mask-repeat: repeat-x;
  mask-size:
    28px 100%,
    28px 100%;
}

/* ===== مهر تاییدیه ===== */

.receipt__seal {
  @apply relative flex h-20 w-20 items-center justify-center rounded-full
    bg-[--gold-one] shadow-lg ring-8 ring-white dark:ring-slate-950;
  animation: seal-drop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.page-payresult__card--success .receipt__seal {
  @apply bg-emerald-500;
}

.page-payresult__card--danger .receipt__seal {
  @apply bg-red-500;
}

.page-payresult__card--warning .receipt__seal {
  @apply bg-[--gold-one];
}

.receipt__seal-icon {
  @apply h-9 w-9 text-white;
  stroke-width: 3;
}

.receipt__seal-stamp {
  @apply absolute -bottom-2 left-1/2 z-[999] -translate-x-1/2 -rotate-6 whitespace-nowrap
    rounded-full border border-[--gold-one] bg-white px-3 py-0.5 text-[10px]
    font-black tracking-wide text-[--gold-two]
    dark:bg-slate-950;
  animation: stamp-in 0.4s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.page-payresult__card--success .receipt__seal-stamp {
  @apply border-emerald-500 text-emerald-600 dark:text-emerald-400;
}

.page-payresult__card--danger .receipt__seal-stamp {
  @apply border-red-500 text-red-600 dark:text-red-400;
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
  @apply absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400;
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
  @apply mt-2  font-bold tracking-wide text-[--gold-two];
}

.receipt__title {
  @apply text-2xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.receipt__text {
  @apply mt-0.5 max-w-xs text-wrap text-sm leading-7 text-slate-500 dark:text-slate-400;
}

/* ===== خط چین ته رسید ===== */

.receipt__perf {
  @apply w-full border-t border-dashed border-slate-200 pt-2 dark:border-slate-800;
}

/* ===== پشتیبانی ===== */

.receipt__support {
  @apply mt-2 flex w-full items-center gap-3 rounded-2xl border border-dashed
    border-slate-200 bg-slate-50 px-4 py-3 text-right transition-colors
    hover:bg-slate-100
    dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800;
}

.receipt__support-icon {
  @apply flex h-9 w-9 shrink-0 items-center justify-center rounded-full
    bg-white text-[--gold-two] shadow-sm dark:bg-slate-950;
}

.receipt__support-text {
  @apply flex flex-col items-start gap-0.5;
}

.receipt__support-label {
  @apply text-[11px] text-slate-400 dark:text-slate-500;
}

.receipt__support-phone {
  @apply  text-2xl  text-slate-900 dark:text-white;
}

/* ===== اکشن ===== */

.receipt__btn {
  @apply mt-3 flex w-full items-center justify-center gap-2 rounded-2xl
    bg-[--gold-one] px-4 py-3 text-sm font-bold text-white transition
    hover:bg-[--gold-two];
}

.receipt__btn:focus-visible {
  @apply outline outline-2 outline-offset-2 outline-[--gold-one];
}

/* ===== ورود صفحه ===== */

.rise-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
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