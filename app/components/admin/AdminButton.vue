<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String as PropType<string>,
    required: true,
  },
  variant: {
    type: String as PropType<"primary" | "secondary" | "ghost" | "danger">,
    default: "primary",
  },
  size: {
    type: String as PropType<"sm" | "md">,
    default: "md",
  },
  type: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button",
  },
  icon: {
    type: String as PropType<string>,
    default: "",
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const isDisabled = computed(() => props.disabled || props.loading);

const classes = computed(() => [
  "admin-button",
  `admin-button--${props.variant}`,
  `admin-button--${props.size}`,
  isDisabled.value ? "admin-button--disabled" : "",
]);
</script>

<template>
  <button :type="props.type" :class="classes" :disabled="isDisabled">
    <Icon v-if="props.loading" name="tabler:loader-2" class="admin-button__icon admin-button__icon--spin" />
    <Icon v-else-if="props.icon" :name="props.icon" class="admin-button__icon" />
    <span>{{ props.label }}</span>
  </button>
</template>

<style scoped>
.admin-button {
  @apply inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-[0.98];
}

.admin-button--sm {
  @apply px-3 py-1.5 text-xs;
}

.admin-button--primary {
  @apply bg-[--gold-one] text-white hover:bg-[--gold-two] hover:shadow-md;
}

.admin-button--secondary {
  @apply border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50;
}

.admin-button--ghost {
  @apply bg-transparent text-slate-700 shadow-none hover:bg-slate-100;
}

.admin-button--danger {
  @apply border border-red-200 bg-red-50 text-red-700 hover:bg-red-100;
}

.admin-button--disabled {
  @apply pointer-events-none cursor-not-allowed opacity-50 active:scale-100;
}

.admin-button__icon {
  @apply h-4 w-4 shrink-0;
}

.admin-button__icon--spin {
  animation: admin-button-spin 0.8s linear infinite;
}

@keyframes admin-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>