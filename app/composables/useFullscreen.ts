// composables/useFullscreen.ts
export function useFullscreen() {
  const isFullscreen = ref(false);

  function updateState() {
    isFullscreen.value = !!document.fullscreenElement;
  }

  async function enter() {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // برخی مرورگرها (مثلاً iOS Safari) از Fullscreen API پشتیبانی نمی‌کنن
    }
  }

  async function exit() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }

  function toggle() {
    return isFullscreen.value ? exit() : enter();
  }

  onMounted(() => {
    document.addEventListener("fullscreenchange", updateState);
    updateState();
  });

  onBeforeUnmount(() => {
    document.removeEventListener("fullscreenchange", updateState);
  });

  return { isFullscreen, toggle, enter, exit };
}