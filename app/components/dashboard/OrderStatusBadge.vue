<script setup lang="ts">

const props = defineProps<{
  status: string;
}>();

const tone = computed(() => {
  switch (props.status) {
    case "DELIVERED":
    case "PAID":
      return "positive";
    case "CANCELLED":
      return "negative";
    case "SHIPPED":
    case "PROCESSING":
      return "info";
    default:
      return "pending";
  }
});
</script>

<template>
  <span class="status-badge" :data-tone="tone">
    <span class="status-badge__dot" />
    {{ orderStatusLabel(status) }}
  </span>
</template>

<style scoped>
.status-badge {
  @apply inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold;
}

.status-badge__dot {
  @apply h-1.5 w-1.5 rounded-full;
}

.status-badge[data-tone="pending"] {
  background: color-mix(in srgb, var(--dash-primary) 15%, transparent);
  color: var(--dash-primary-deep);
}
.status-badge[data-tone="pending"] .status-badge__dot {
  background: var(--dash-primary);
}

.status-badge[data-tone="positive"] {
  @apply bg-emerald-100 text-emerald-700;
}
.status-badge[data-tone="positive"] .status-badge__dot {
  @apply bg-emerald-500;
}

.status-badge[data-tone="negative"] {
  @apply bg-red-100 text-red-700 ;
}
.status-badge[data-tone="negative"] .status-badge__dot {
  @apply bg-red-500;
}

.status-badge[data-tone="info"] {
  @apply bg-sky-100 text-sky-700;
}
.status-badge[data-tone="info"] .status-badge__dot {
  @apply bg-sky-500;
}
</style>