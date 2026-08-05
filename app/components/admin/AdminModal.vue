<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  title: {
    type: String as PropType<string>,
    default: "",
  },
  actionLabel: {
    type: String as PropType<string>,
    default: "ذخیره",
  },
  cancelLabel: {
    type: String as PropType<string>,
    default: "انصراف",
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit"): void;
}>();

function close() {
  if (props.loading) return;
  emit("update:modelValue", false);
}

function submit() {
  if (props.loading) return;
  emit("submit");
}
</script>

<template>
  <Transition name="admin-modal-fade">
    <div v-if="props.modelValue" class="admin-modal">
      <div class="admin-modal__backdrop" @click="close" />
      <div class="admin-modal__dialog" role="dialog" aria-modal="true">
        <header class="admin-modal__header">
          <h2 class="admin-modal__title">{{ props.title }}</h2>
          <button
            type="button"
            class="admin-modal__close"
            aria-label="بستن"
            :disabled="props.loading"
            @click="close"
          >
            ×
          </button>
        </header>
        <div class="admin-modal__body">
          <slot />
        </div>
        <footer class="admin-modal__footer">
          <button
            type="button"
            class="admin-modal__cancel"
            :disabled="props.loading"
            @click="close"
          >
            {{ props.cancelLabel }}
          </button>
          <button
            type="button"
            class="admin-modal__submit"
            :disabled="props.loading"
            @click="submit"
          >
            <Icon
              v-if="props.loading"
              name="tabler:loader-2"
              class="admin-modal__submit-icon"
              aria-hidden="true"
            />
            {{ props.loading ? "در حال ذخیره..." : props.actionLabel }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.admin-modal {
  @apply fixed inset-0 z-50 flex items-end justify-center sm:items-center;
}

.admin-modal__backdrop {
  @apply absolute inset-0 bg-black/40 backdrop-blur-sm;
}

.admin-modal__dialog {
  @apply relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-3xl
    bg-white p-5 shadow-2xl
    dark:bg-slate-950 dark:shadow-black/50
    sm:max-h-[88vh] sm:rounded-3xl sm:p-6;
}

.admin-modal__header {
  @apply mb-4 flex shrink-0 items-center justify-between sm:mb-5;
}

.admin-modal__title {
  @apply text-base font-bold text-slate-900 dark:text-white sm:text-lg;
}

.admin-modal__close {
  @apply flex h-8 w-8 items-center justify-center rounded-full bg-slate-100
    text-lg font-bold text-slate-600 transition
    hover:bg-slate-200
    disabled:cursor-not-allowed disabled:opacity-50
    dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700;
}

.admin-modal__body {
  /* رفع باگ: بدون flex-1 و min-h-0، اسکرول داخلی کار نمی‌کند
     و محتوای بلند از max-height دیالوگ بیرون می‌زند */
  @apply mb-5 min-h-0 flex-1 overflow-y-auto;
}

.admin-modal__footer {
  @apply flex shrink-0 flex-wrap items-center justify-center gap-3 border-t
    border-slate-100 pt-4
    dark:border-slate-800;
}

.admin-modal__cancel {
  @apply rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm
    font-semibold text-slate-700 transition
    hover:bg-slate-50
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
    dark:hover:bg-slate-800;
}

.admin-modal__submit {
  @apply flex items-center gap-2 rounded-2xl flex-1 text-center bg-[--gold-one] justify-center px-5 py-3 text-sm
    font-semibold text-white transition
    hover:bg-[--gold-two]
    disabled:cursor-not-allowed disabled:opacity-60;
}

.admin-modal__submit-icon {
  @apply h-4 w-4 animate-spin;
}

.admin-modal-fade-enter-active,
.admin-modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.admin-modal-fade-enter-from,
.admin-modal-fade-leave-to {
  opacity: 0;
}

.admin-modal-fade-enter-active .admin-modal__dialog,
.admin-modal-fade-leave-active .admin-modal__dialog {
  transition: transform 0.2s ease;
}

.admin-modal-fade-enter-from .admin-modal__dialog,
.admin-modal-fade-leave-to .admin-modal__dialog {
  transform: translateY(16px);
}
</style>