<script setup lang="ts">
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
  <header class="dash-header relative">
    <div class="dash-header__bar">
      <div class="dash-header__hero-text">
        <p class="dash-header__hero-eyebrow">خوش آمدید</p>
        <h1 class="dash-header__hero-title">
          سلام{{ greetingName ? "، " + greetingName : "" }}
        </h1>
      </div>

      <div class="dash-header__actions">
        <button
          type="button"
          class="dash-header__theme-btn"
          :title="
            theme === 'saffron' ? 'رفتن به تم پسته‌ای' : 'رفتن به تم زعفرانی'
          "
          @click="emit('toggle-theme')"
        >
          <Icon name="tabler:sparkles" class="h-4 w-4" />
          {{ theme === "saffron" ? "زعفرانی" : "پسته‌ای" }}
        </button>

        <button
          type="button"
          class="dash-header__logout-btn"
          @click="emit('logout')"
        >
          <Icon name="tabler:logout" class="h-4 w-4" />
          خروج
        </button>
      </div>
    </div>

    <div class="dash-header__hero">
      <div class="dash-header__brand">
        <img
          src="/images/helma-logo.webp"
          alt="هلما"
          class="dash-header__logo"
        />
      </div>
      <nuxt-link to="/">
        <button type="button" class="dash-header__logout-btn">
          <Icon name="tabler:home" class="h-4 w-4" />
          بازگشت به فروشگاه
        </button>
      </nuxt-link>
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
  @apply h-20 w-auto animate-pulse;
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
  @apply relative flex items-center flex-col justify-center gap-4 overflow-hidden px-5 py-6 sm:px-6;
  background: linear-gradient(
    135deg,
    var(--dash-surface-2),
    color-mix(in srgb, var(--dash-primary) 14%, var(--dash-surface-2))
  );
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
