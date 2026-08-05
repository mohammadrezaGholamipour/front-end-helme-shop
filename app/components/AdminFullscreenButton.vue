<!-- components/admin/AdminFullscreenButton.vue -->
<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <button
    type="button"
    class="admin-fullscreen-button"
    :aria-label="isFullscreen ? 'خروج از حالت تمام‌صفحه' : 'حالت تمام‌صفحه'"
    :title="isFullscreen ? 'خروج از حالت تمام‌صفحه' : 'حالت تمام‌صفحه'"
    @click="toggle"
  >
    <Icon
      :name="isFullscreen ? 'tabler:minimize' : 'tabler:maximize'"
      class="h-5 w-5"
    />
  </button>
</template>

<style scoped>
.admin-fullscreen-button {
  @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
    bg-slate-100 text-slate-700 transition
    hover:bg-slate-200
    dark:bg-slate-900 dark:text-slate-300
    dark:hover:bg-slate-800;
}
</style>