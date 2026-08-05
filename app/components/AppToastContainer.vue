<script setup lang="ts">
const { toasts, remove } = useAppToast();

const iconFor = (type: string) => {
  switch (type) {
    case "success":
      return "tabler:circle-check";
    case "error":
      return "tabler:alert-circle";
    case "warning":
      return "tabler:alert-triangle";
    default:
      return "tabler:info-circle";
  }
};
</script>

<template>
  <Teleport to="body">
    <div class="app-toast-container">
      <TransitionGroup name="app-toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="app-toast"
          :class="`app-toast--${toast.type}`"
          role="alert"
        >
          <Icon :name="iconFor(toast.type)" class="app-toast__icon" />
          <p class="app-toast__message">{{ toast.message }}</p>
          <button
            type="button"
            class="app-toast__close"
            aria-label="بستن"
            @click="remove(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.app-toast-container {
  @apply pointer-events-none fixed inset-0 m-auto top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6;
}

.app-toast {
  @apply pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-2xl border bg-white p-3.5 shadow-lg;
}

.app-toast--success {
  @apply border-emerald-200 bg-emerald-50 text-emerald-800;
}

.app-toast--error {
  @apply border-red-200 bg-red-50 text-red-800;
}

.app-toast--warning {
  @apply border-amber-200 bg-amber-50 text-amber-800;
}

.app-toast--info {
  @apply border-slate-200 bg-slate-50 text-slate-800;
}

.app-toast__icon {
  @apply mt-0.5 h-5 w-5 shrink-0;
}

.app-toast__message {
  @apply flex-1 text-sm font-medium leading-6;
}

.app-toast__close {
  @apply shrink-0 text-lg font-bold leading-none opacity-60 transition hover:opacity-100;
}

.app-toast-enter-active,
.app-toast-leave-active {
  transition: all 0.25s ease;
}

.app-toast-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.app-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.app-toast-leave-active {
  position: absolute;
}
</style>