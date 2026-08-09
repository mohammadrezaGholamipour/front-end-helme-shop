<script setup lang="ts">
const { toasts, remove } = useAppToast();

const toastConfig = {
  success: {
    icon: "tabler:circle-check-filled",
    label: "موفق",
  },
  error: {
    icon: "tabler:circle-x-filled",
    label: "خطا",
  },
  warning: {
    icon: "tabler:alert-triangle-filled",
    label: "هشدار",
  },
  info: {
    icon: "tabler:info-circle-filled",
    label: "اطلاع",
  },
} as const;

const getConfig = (type: string) => {
  return (
    toastConfig[type as keyof typeof toastConfig] ?? toastConfig.info
  );
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
          <!-- Glow -->
          <div class="app-toast__glow" />

          <!-- Icon -->
          <div class="app-toast__icon-wrapper">
            <Icon
              :name="getConfig(toast.type).icon"
              class="app-toast__icon"
            />
          </div>

          <!-- Content -->
          <div class="app-toast__content">
            <span class="app-toast__label">
              {{ getConfig(toast.type).label }}
            </span>

            <p class="app-toast__message">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close -->
          <button
            type="button"
            class="app-toast__close"
            aria-label="بستن"
            @click="remove(toast.id)"
          >
            <Icon name="tabler:x" />
          </button>

          <!-- Progress -->
          <div class="app-toast__progress" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* =========================================================
   CONTAINER
========================================================= */

.app-toast-container {
  @apply pointer-events-none fixed left-0 right-0 top-5 z-[10000]
    flex flex-col items-center gap-3 px-4
    sm:left-auto sm:right-5 sm:items-end sm:px-0;
}

/* =========================================================
   TOAST
========================================================= */

.app-toast {
  position: relative;

  @apply pointer-events-auto flex w-full max-w-[390px]
    items-center gap-3 overflow-hidden
    rounded-[20px] border p-3.5
    shadow-2xl backdrop-blur-xl;

  isolation: isolate;

  animation: toast-shimmer 4s ease-in-out infinite;
}

/* Glass layer */

.app-toast::before {
  content: "";
  position: absolute;
  inset: 0;

  @apply pointer-events-none rounded-[20px];

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.35)
  );

  z-index: -2;
}

/* =========================================================
   GLOW
========================================================= */

.app-toast__glow {
  position: absolute;

  width: 100px;
  height: 100px;

  left: -35px;
  top: -45px;

  border-radius: 999px;

  filter: blur(35px);

  opacity: 0.3;

  pointer-events: none;

  z-index: -1;
}

/* =========================================================
   SUCCESS
========================================================= */

.app-toast--success {
  @apply border-emerald-200/80 bg-emerald-50/90 text-emerald-950;
}

.app-toast--success .app-toast__glow {
  @apply bg-emerald-400;
}

.app-toast--success .app-toast__icon-wrapper {
  @apply bg-emerald-500 text-white shadow-lg shadow-emerald-500/30;
}

.app-toast--success .app-toast__progress {
  @apply bg-emerald-500;
}

/* =========================================================
   ERROR
========================================================= */

.app-toast--error {
  @apply border-red-200/80 bg-red-50/90 text-red-950;
}

.app-toast--error .app-toast__glow {
  @apply bg-red-400;
}

.app-toast--error .app-toast__icon-wrapper {
  @apply bg-red-500 text-white shadow-lg shadow-red-500/30;
}

.app-toast--error .app-toast__progress {
  @apply bg-red-500;
}

/* =========================================================
   WARNING
========================================================= */

.app-toast--warning {
  @apply border-amber-200/80 bg-amber-50/90 text-amber-950;
}

.app-toast--warning .app-toast__glow {
  @apply bg-amber-400;
}

.app-toast--warning .app-toast__icon-wrapper {
  @apply bg-amber-500 text-white shadow-lg shadow-amber-500/30;
}

.app-toast--warning .app-toast__progress {
  @apply bg-amber-500;
}

/* =========================================================
   INFO
========================================================= */

.app-toast--info {
  @apply border-blue-200/80 bg-blue-50/90 text-blue-950;
}

.app-toast--info .app-toast__glow {
  @apply bg-blue-400;
}

.app-toast--info .app-toast__icon-wrapper {
  @apply bg-blue-500 text-white shadow-lg shadow-blue-500/30;
}

.app-toast--info .app-toast__progress {
  @apply bg-blue-500;
}

/* =========================================================
   ICON
========================================================= */

.app-toast__icon-wrapper {
  @apply flex h-11 w-11 shrink-0 items-center justify-center
    rounded-2xl;
}

.app-toast__icon {
  @apply h-6 w-6;
}

/* =========================================================
   CONTENT
========================================================= */

.app-toast__content {
  @apply min-w-0 flex-1 py-0.5;
}

.app-toast__label {
  @apply mb-0.5 block text-xs font-bold opacity-60;
}

.app-toast__message {
  @apply m-0 text-sm font-semibold leading-6 text-wrap;
  overflow-wrap: anywhere;
}

/* =========================================================
   CLOSE
========================================================= */

.app-toast__close {
  @apply flex h-8 w-8 shrink-0 items-center justify-center
    rounded-xl text-current opacity-40
    transition-all duration-200;
}

.app-toast__close:hover {
  @apply bg-black/5 opacity-100;
}

.app-toast__close:active {
  transform: scale(0.9);
}

.app-toast__close :deep(svg) {
  @apply h-4 w-4;
}

/* =========================================================
   PROGRESS BAR
========================================================= */

.app-toast__progress {
  position: absolute;

  bottom: 0;
  right: 0;

  height: 3px;
  width: 100%;

  transform-origin: right;

  animation: toast-progress 4s linear forwards;

  opacity: 0.7;
}

/* =========================================================
   ANIMATION
========================================================= */

/* =========================================================
   TOAST TRANSITIONS
========================================================= */

.app-toast-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.4s ease;
}

.app-toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
  position: absolute;
}

.app-toast-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ورود */

.app-toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.96);
  filter: blur(4px);
}

/* حالت عادی */

.app-toast-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1) ;
  filter: blur(0);
}

/* خروج */

.app-toast-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.96);
  filter: blur(3px);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

@keyframes toast-shimmer {
  0%,
  100% {
    transform: translateZ(0);
  }

  50% {
    transform: translateZ(0) translateY(-1px);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 640px) {
  .app-toast-container {
    @apply top-3 px-3;
  }

  .app-toast {
    @apply max-w-none rounded-[18px] p-3;
  }

  .app-toast__icon-wrapper {
    @apply h-10 w-10 rounded-xl;
  }

  .app-toast__icon {
    @apply h-5 w-5;
  }

  .app-toast__message {
    @apply text-[13px] text-wrap leading-7;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .app-toast,
  .app-toast__progress {
    animation: none;
  }

  .app-toast-enter-active,
  .app-toast-leave-active {
    transition: opacity 0.2s ease;
  }
}
</style>