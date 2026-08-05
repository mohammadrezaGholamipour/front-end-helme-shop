<script setup lang="ts">
import AdminSidebarItem from "~/components/admin/AdminSidebarItem.vue";
import { ref, watch } from "vue";

const isSidebarOpen = ref(false);
const route = useRoute();

function closeSidebar() {
  isSidebarOpen.value = false;
}

watch(
  () => route.path,
  () => closeSidebar(),
);
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
         <img src="/images/helma-logo.webp"/>
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
        <AdminSidebarItem
          to="/admin/blog"
          label="وبلاگ"
          icon="tabler:article"
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
          <div class="admin-layout__header-title">مدیریت سایت</div>
        </div>
        <div class="admin-layout__header-actions">
          <span class="admin-layout__header-badge">حالت آزمایشی</span>
        </div>
      </header>
      <main class="admin-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
}

.admin-layout__overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
}

@media (min-width: 1024px) {
  .admin-layout__overlay {
    display: none;
  }
}

.admin-layout__sidebar {
  position: fixed;
  inset-inline-start: 0;
  top: 0;
  z-index: 50;
  display: flex;
  height: 100vh;
  width: 18rem;
  min-width: 18rem;
  transform: translateX(100%);
  flex-direction: column;
  border-inline-end: 1px solid #e2e8f0;
  background-color: #ffffff;
  padding: 1rem;
  transition: transform 0.25s ease;
}

.admin-layout__sidebar--open {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .admin-layout__sidebar {
    position: sticky;
    top: 0;
    transform: none;
  }
}

.admin-layout__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.admin-layout__brand-link {
  flex: 1;
  display: block;
  border-radius: 1rem;
  color: #ffffff;
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
}

.admin-layout__sidebar-close {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.75rem;
  color: #64748b;
  background-color: #f1f5f9;
}

@media (min-width: 1024px) {
  .admin-layout__sidebar-close {
    display: none;
  }
}

.admin-layout__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.admin-layout__main {
  flex: 1;
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.admin-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
  padding: 1rem 1.25rem;
  position: sticky;
  top: 0;
  z-index: 30;
}

@media (min-width: 640px) {
  .admin-layout__header {
    padding: 1.5rem;
  }
}

.admin-layout__header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.admin-layout__menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.75rem;
  background-color: #f1f5f9;
  color: #334155;
}

@media (min-width: 1024px) {
  .admin-layout__menu-button {
    display: none;
  }
}

.admin-layout__header-title {
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 640px) {
  .admin-layout__header-title {
    font-size: 1.125rem;
  }
}

.admin-layout__header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.admin-layout__header-badge {
  display: inline-flex;
  border-radius: 9999px;
  background-color: #0f172a;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

.admin-layout__content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .admin-layout__content {
    padding: 1.5rem;
  }
}
</style>