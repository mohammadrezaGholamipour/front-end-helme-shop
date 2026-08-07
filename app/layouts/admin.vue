<script setup lang="ts">
const { logout } = useAdminAuth();
const isSidebarOpen = ref(false);
const route = useRoute();

function closeSidebar() {
  isSidebarOpen.value = false;
}

watch(
  () => route.path,
  () => closeSidebar(),
);


useSeoMeta({
  robots: "noindex, nofollow, noarchive",
});
</script>

<template>
  <div class="admin-layout" dir="rtl">
    <div
      v-if="isSidebarOpen"
      class="admin-layout__overlay"
      @click="closeSidebar"
    />

    <aside
      class="admin-layout__sidebar"
      :class="{ 'admin-layout__sidebar--open': isSidebarOpen }"
    >
      <div class="admin-layout__brand">
        <NuxtLink to="/admin" class="admin-layout__brand-link">
          <img src="/images/helma-logo.webp" />
        </NuxtLink>
        <button
          type="button"
          class="admin-layout__sidebar-close"
          aria-label="بستن منو"
          @click="closeSidebar"
        >
          <Icon name="tabler:x" class="h-5 w-5" />
        </button>
      </div>
      <nav class="admin-layout__nav" aria-label="منوی مدیریت">
        <AdminSidebarItem
          to="/admin"
          label="داشبورد"
          icon="tabler:layout-dashboard"
          @navigate="closeSidebar"
        />
        <AdminSidebarItem
          to="/admin/products"
          label="محصولات"
          icon="tabler:box"
          @navigate="closeSidebar"
        />
        <AdminSidebarItem
          to="/admin/categories"
          label="دسته‌بندی‌ها"
          icon="tabler:category"
          @navigate="closeSidebar"
        />
        <AdminSidebarItem
          to="/admin/orders"
          label="سفارش‌ها"
          icon="tabler:shopping-cart"
          @navigate="closeSidebar"
        />
        <AdminSidebarGroup
          label="وبلاگ"
          icon="tabler:article"
          :children="[
            { to: '/admin/blog', label: 'مقالات' },
            { to: '/admin/blog-categories', label: 'دسته‌بندی‌ها' },
          ]"
          @navigate="closeSidebar"
        />
        <AdminSidebarItem
          to="/admin/users"
          label="کاربران"
          icon="tabler:users"
          @navigate="closeSidebar"
        />
        <AdminSidebarItem
          to="/admin/settings"
          label="تنظیمات"
          icon="tabler:settings"
          @navigate="closeSidebar"
        />
      </nav>

      <button type="button" class="admin-layout__logout" @click="logout">
        <Icon name="tabler:logout" class="h-5 w-5" />
        <span>خروج از حساب</span>
      </button>
    </aside>

    <div class="admin-layout__main">
      <header class="admin-layout__header">
        <div class="admin-layout__header-right">
          <button
            type="button"
            class="admin-layout__menu-button"
            aria-label="باز کردن منو"
            @click="isSidebarOpen = true"
          >
            <Icon name="tabler:menu-2" class="h-5 w-5" />
          </button>
          <NuxtLink to="/" class="admin-layout__view-site">
            <Icon name="tabler:external-link" class="h-4 w-4" />
            <span>نمایش سایت</span>
          </NuxtLink>
        </div>
        <div class="admin-layout__header-actions">
          <ColorMood />
          <AdminFullscreenButton />
          <button
            type="button"
            class="admin-layout__logout-icon"
            aria-label="خروج از حساب"
            @click="logout"
          >
            <Icon name="tabler:logout" class="h-5 w-5" />
          </button>
        </div>
      </header>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  @apply flex min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100;
}

.admin-layout__overlay {
  @apply fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-sm lg:hidden;
}

.admin-layout__sidebar {
  @apply fixed  top-0 z-50 flex h-screen w-72 min-w-72
    translate-x-full flex-col overflow-hidden 
    border-slate-200 bg-white p-4 transition-transform  ease-in-out
    dark:border-slate-800 dark:bg-slate-950
    lg:sticky lg:top-0 lg:translate-x-0;
}

.admin-layout__sidebar--open {
  @apply translate-x-0;
}

.admin-layout__brand {
  @apply mb-8 flex items-center gap-2;
}

.admin-layout__brand-link {
  @apply flex-1 rounded-2xl px-4 py-3 text-center text-sm font-bold text-white;
}

.admin-layout__sidebar-close {
  @apply flex h-10 w-10 items-center justify-center rounded-xl
    bg-slate-100 text-slate-500
    dark:bg-slate-900 dark:text-slate-400
    lg:hidden;
}

.admin-layout__nav {
  @apply flex flex-1 flex-col gap-2 overflow-y-auto;
}

.admin-layout__logout {
  @apply mt-4 flex items-center justify-center gap-2 rounded-2xl border
    border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600
    transition
    hover:bg-red-100
    dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400
    dark:hover:bg-red-950/50;
}

.admin-layout__main {
  @apply flex min-w-0 flex-1 flex-col;
}

.admin-layout__header {
  @apply sticky top-0 z-30 flex items-center justify-between gap-4
    border-b border-slate-200 bg-white px-5 py-4
    dark:border-slate-800 dark:bg-slate-950
    sm:px-6 sm:py-6;
}

.admin-layout__header-right {
  @apply flex gap-2;
}

.admin-layout__view-site {
  @apply flex items-center gap-1.5 truncate whitespace-nowrap rounded-xl
    px-3 py-2 text-sm font-semibold text-slate-700 transition
    hover:bg-slate-100
    dark:text-slate-300 dark:hover:bg-slate-900;
}

.admin-layout__menu-button {
  @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
    bg-slate-100 text-slate-700
    dark:bg-slate-900 dark:text-slate-300
    lg:hidden;
}

.admin-layout__header-title {
  @apply truncate whitespace-nowrap text-base font-bold text-slate-900
    dark:text-slate-100
    sm:text-lg;
}

.admin-layout__header-actions {
  @apply flex shrink-0 items-center gap-2;
}

.admin-layout__header-badge {
  @apply inline-flex whitespace-nowrap rounded-full bg-slate-900 px-3 py-1
    text-xs font-semibold text-white
    dark:bg-slate-100 dark:text-slate-900;
}

.admin-layout__logout-icon {
  @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
    bg-slate-100 text-slate-700 transition
    hover:bg-red-50 hover:text-red-600
    dark:bg-slate-900 dark:text-slate-300
    dark:hover:bg-red-950/40 dark:hover:text-red-400;
}

.admin-layout__content {
  @apply flex-1 overflow-auto p-4 sm:p-6;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.35s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
