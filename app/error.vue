<!-- error.vue -->
<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
});

const isNotFound = computed(() => props.error?.statusCode === 404);

const title = computed(() =>
  isNotFound.value ? "صفحه پیدا نشد" : "مشکلی پیش آمد",
);

const description = computed(() =>
  isNotFound.value
    ? "صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده است."
    : "متأسفانه در پردازش درخواست شما خطایی رخ داد. لطفاً دوباره تلاش کنید.",
);

function goHome() {
  clearError({ redirect: "/" });
}

function tryAgain() {
  clearError();
}
</script>

<template>
  <div
    v-animate="{
      type: 'blurIn',
      delay: 300,
      duration: 1000,
      once: true,
      threshold: 0,
    }"
    class="error-page"
    dir="rtl"
  >
    <div class="error-page__bg" />

    <div class="error-page__card">
      <div class="error-page__code">
        <img src="/images/helma-logo.webp" alt="سوهان و گز حلما" />
      </div>

      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__description">{{ description }}</p>

      <div class="error-page__actions">
        <button type="button" class="error-page__button" @click="goHome">
          <Icon name="tabler:home" class="h-4 w-4" />
          بازگشت به صفحه اصلی
        </button>

        <button
          v-if="!isNotFound"
          type="button"
          class="error-page__button error-page__button--ghost"
          @click="tryAgain"
        >
          <Icon name="tabler:refresh" class="h-4 w-4" />
          تلاش دوباره
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden
    bg-slate-50 p-4
    dark:bg-black;
}

.error-page__bg {
  @apply pointer-events-none absolute inset-0 -z-10;
  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(214, 180, 108, 0.18),
      transparent 45%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(231, 188, 76, 0.14),
      transparent 45%
    );
}

.error-page__card {
  @apply flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border
    border-slate-200 bg-white p-8 text-center shadow-xl
    dark:border-slate-800 dark:bg-slate-950
    sm:p-10;
}

.error-page__code {
  @apply flex items-center justify-center rounded-full
    bg-clip-text text-6xl font-black text-transparent
    sm:text-7xl;
  background-image: var(--gold-gradiant);
}

.error-page__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.error-page__description {
  @apply max-w-sm text-wrap text-sm leading-7 text-slate-500 dark:text-slate-400;
}

.error-page__actions {
  @apply mt-4 flex w-full flex-col gap-3 sm:flex-row sm:justify-center;
}

.error-page__button {
  @apply flex items-center justify-center gap-2 rounded-2xl bg-[--gold-one]
    px-5 py-3 text-sm font-bold text-white transition
    hover:bg-[--gold-two];
}

.error-page__button--ghost {
  @apply border border-slate-300 bg-transparent text-slate-700
    hover:bg-slate-50
    dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900;
}
</style>
