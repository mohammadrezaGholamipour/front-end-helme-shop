<script setup lang="ts">
definePageMeta({ layout: "admin" });
const cards = [
  { label: "محصولات", to: "/admin/products", icon: "tabler:box" },
  { label: "دسته‌بندی‌ها", to: "/admin/categories", icon: "tabler:category" },
  { label: "سفارش‌ها", to: "/admin/orders", icon: "tabler:shopping-cart" },
  { label: "وبلاگ", to: "/admin/blog", icon: "tabler:article" },
  { label: "کاربران", to: "/admin/users", icon: "tabler:users" },
];
</script>

<template>
  <div class="admin-dashboard">
    <section
      v-animate="{
        type: 'scaleIn',
        delay: 300,
        duration: 1000,
        once: true,
        threshold: 0,
      }"
      class="admin-dashboard__hero"
    >
      <h1 class="admin-dashboard__title">خوش آمدید به پنل مدیریت</h1>
      <p class="admin-dashboard__subtitle">
        این بخش برای مدیریت محتوا و داده‌های فروشگاه طراحی شده است.
      </p>
    </section>

    <section class="admin-dashboard__cards">
      <NuxtLink
        v-animate="{
          type: 'slideRight',
          delay: 300,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        v-for="(card, index) in cards"
        :key="card.to"
        :to="card.to"
        class="admin-dashboard__card"
      >
        <span class="admin-dashboard__card-icon">
          <Icon :name="card.icon" class="h-6 w-6" />
        </span>
        <span class="admin-dashboard__card-label">{{ card.label }}</span>
        <Icon name="tabler:arrow-left" class="admin-dashboard__card-arrow" />
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.admin-dashboard {
  @apply flex flex-col gap-6 p-4;
}

.admin-dashboard__hero {
  @apply rounded-3xl border border-slate-200 bg-white p-6 shadow-sm
    dark:border-slate-800 dark:bg-slate-950;
}

.admin-dashboard__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-dashboard__subtitle {
  @apply mt-1 text-wrap text-slate-500 dark:text-slate-400;
}

.admin-dashboard__cards {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.admin-dashboard__card {
  @apply flex items-center gap-4 rounded-3xl bg-white p-5 text-slate-700 shadow-sm
    transition
    hover:-translate-y-0.5 hover:shadow-md
    dark:bg-slate-950 dark:text-slate-300 dark:shadow-black/30
    dark:hover:shadow-black/50;
}

.admin-dashboard__card-icon {
  @apply flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
    bg-[--gold-one] text-white;
}

.admin-dashboard__card-label {
  @apply flex-1 text-base font-semibold text-slate-900 dark:text-white;
}

.admin-dashboard__card-arrow {
  @apply h-4 w-4 text-slate-300 transition dark:text-slate-600;
}

.admin-dashboard__card:hover .admin-dashboard__card-arrow {
  @apply text-[--gold-one];
}
</style>
