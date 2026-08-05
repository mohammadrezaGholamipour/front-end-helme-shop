<script setup lang="ts">
definePageMeta({ layout: "admin" });
</script>

<template>
  <div class="admin-placeholder">
    <h1 class="admin-placeholder__title">سفارش‌ها</h1>
    <p class="admin-placeholder__description">
      این صفحه در آینده برای مدیریت سفارش‌ها تکمیل خواهد شد.
    </p>
  </div>
</template>

<style scoped>
.admin-placeholder {
  @apply rounded-3xl border border-slate-200 bg-white p-6 shadow-sm;
}

.admin-placeholder__title {
  @apply text-xl font-bold;
}

.admin-placeholder__description {
  @apply text-slate-500 text-wrap;
}
</style>
