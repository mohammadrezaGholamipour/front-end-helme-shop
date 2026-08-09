<script setup lang="ts">
import SohanSeal from "@/components/dashboard/SohanSeal.vue";
defineProps<{
  greetingName: string;
  theme: "saffron" | "pistachio";
}>();

const emit = defineEmits<{
  (e: "toggle-theme"): void;
  (e: "logout"): void;
}>();
</script>

<template>
  <header class="dash-header">
    <div class="dash-header__bar">
      <div class="dash-header__brand">
        <img src="/images/helma-logo.webp" alt="هلما" class="dash-header__logo" />
      </div>

      <div class="dash-header__actions">
        <button
          type="button"
          class="dash-header__theme-btn"
          :title="theme === 'saffron' ? 'رفتن به تم پسته‌ای' : 'رفتن به تم زعفرانی'"
          @click="emit('toggle-theme')"
        >
          <Icon name="tabler:sparkles" class="h-4 w-4" />
          {{ theme === "saffron" ? "زعفرانی" : "پسته‌ای" }}
        </button>

        <button type="button" class="dash-header__logout-btn" @click="emit('logout')">
          <Icon name="tabler:logout" class="h-4 w-4" />
          خروج
        </button>
      </div>
    </div>

    <div class="dash-header__hero">
      <svg class="dash-header__hero-rays" viewBox="0 0 400 160" aria-hidden="true">
        <line
          v-for="i in 36"
          :key="i"
          x1="60"
          y1="80"
          x2="0"
          y2="80"
          class="dash-header__ray"
          :style="{ transform: `rotate(${i * 10}deg)` }"
        />
      </svg>

      <SohanSeal :size="56" class="dash-header__hero-seal">
        <Icon name="tabler:user-filled" class="h-5 w-5" />
      </SohanSeal>

      <div class="dash-header__hero-text">
        <p class="dash-header__hero-eyebrow">خوش آمدید</p>
        <h1 class="dash-header__hero-title">سلام{{ greetingName ? "، " + greetingName : "" }}</h1>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dash-header {
  @apply overflow-hidden rounded-3xl border;
  background: var(--dash-surface);
  border-color: color-mix(in srgb, var(--dash-primary) 16%, transparent);
}

.dash-header__bar {
  @apply flex items-center justify-between gap-3 px-5 py-4 sm:px-6;
}

.dash-header__brand {
  @apply flex items-center gap-2.5;
}

.dash-header__logo {
  @apply h-8 w-auto;
}

.dash-header__brand-name {
  @apply text-sm font-bold opacity-80;
  color: var(--dash-ink);
}

.dash-header__actions {
  @apply flex items-center gap-2;
}

.dash-header__theme-btn,
.dash-header__logout-btn {
  @apply flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition sm:text-sm;
  border-color: color-mix(in srgb, var(--dash-primary) 30%, transparent);
  color: var(--dash-primary-deep);
}

.dash-header__theme-btn:hover,
.dash-header__logout-btn:hover {
  background: color-mix(in srgb, var(--dash-primary) 10%, transparent);
}

.dash-header__hero {
  @apply relative flex items-center gap-4 overflow-hidden px-5 py-6 sm:px-6;
  background: linear-gradient(
    135deg,
    var(--dash-surface-2),
    color-mix(in srgb, var(--dash-primary) 14%, var(--dash-surface-2))
  );
}

.dash-header__hero-rays {
  @apply pointer-events-none absolute left-0 top-1/2 h-[220px] w-[220px] -translate-y-1/2 translate-x-5 opacity-40;
}

.dash-header__ray {
  stroke: var(--dash-primary);
  stroke-width: 1;
  transform-origin: 60px 80px;
}

.dash-header__hero-seal {
  @apply relative z-10 shrink-0;
}

.dash-header__hero-text {
  @apply relative z-10;
}

.dash-header__hero-eyebrow {
  @apply text-xs font-bold opacity-60;
  color: var(--dash-ink);
}

.dash-header__hero-title {
  @apply text-xl font-bold sm:text-2xl;
  color: var(--dash-ink);
}
</style>