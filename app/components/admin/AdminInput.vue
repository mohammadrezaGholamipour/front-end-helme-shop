<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  label: {
    type: String as PropType<string>,
    required: false,
  },
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: "",
  },
  placeholder: {
    type: String as PropType<string>,
    default: "",
  },
  type: {
    type: String as PropType<string>,
    default: "text",
  },
  error: {
    type: String as PropType<string>,
    default: "",
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <label class="admin-input">
    <span v-if="props.label" class="admin-input__label">{{ props.label }}</span>
    <input
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      class="admin-input__field"
      :class="{ 'admin-input__field--error': props.error }"
      @input="updateValue"
    />
    <span v-if="props.error" class="admin-input__error">{{ props.error }}</span>
  </label>
</template>

<style scoped>
.admin-input {
  @apply flex flex-col gap-2 text-slate-700;
}

.admin-input__label {
  @apply text-sm font-medium;
}

.admin-input__field {
  @apply w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[--gold-one] focus:ring-2 focus:ring-[--gold-two];
}

.admin-input__field:disabled {
  @apply cursor-not-allowed bg-slate-100 text-slate-400;
}

.admin-input__field--error {
  @apply border-red-300 focus:border-red-400 focus:ring-red-200;
}

.admin-input__error {
  @apply text-xs font-medium text-red-600;
}
</style>