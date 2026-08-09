<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
  }>(),
  { size: 64 }
);
</script>

<template>
  <div
    class="sohan-seal"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg viewBox="0 0 100 100" class="sohan-seal__rings" aria-hidden="true">
      <circle
        v-for="i in 28"
        :key="i"
        cx="50"
        cy="50"
        r="46"
        class="sohan-seal__ridge"
        :style="{ transform: `rotate(${i * (360 / 28)}deg)` }"
      />
      <circle cx="50" cy="50" r="34" class="sohan-seal__core" />
    </svg>

    <div class="sohan-seal__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sohan-seal {
  @apply relative flex shrink-0 items-center justify-center;
}

.sohan-seal__rings {
  @apply absolute inset-0 h-full w-full;
}

.sohan-seal__ridge {
  fill: none;
  stroke: var(--dash-primary);
  stroke-width: 1.1;
  stroke-dasharray: 6 66;
  opacity: 0.55;
  transform-origin: 50px 50px;
}

.sohan-seal__core {
  fill: var(--dash-surface-2);
  stroke: var(--dash-primary);
  stroke-width: 1.4;
}

.sohan-seal__content {
  @apply relative z-10 flex items-center justify-center text-sm font-bold;
  color: var(--dash-ink);
}
</style>