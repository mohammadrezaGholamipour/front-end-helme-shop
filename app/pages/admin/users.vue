<script setup lang="ts">
import type { UserListOut, OrderItemOut } from "~/types";

definePageMeta({
  layout: "admin",
});

const {
  data: users,
  isLoading,
  error,
} = useAllUsers() as {
  data: Ref<UserListOut[] | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<unknown>;
};

/* ---------------- کمکی‌ها ---------------- */

const roleLabel = (role: string) => (role === "ADMIN" ? "مدیر" : "مشتری");

const fullName = (user: UserListOut) => {
  const p = user.customer_profile;
  if (!p || (!p.first_name && !p.last_name)) return null;
  return `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
};

const initials = (user: UserListOut) => {
  const name = fullName(user);
  if (name) {
    const parts = name.split(" ").filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("");
  }
  return user.mobile.slice(-2);
};

const statusMeta: Record<
  string,
  { label: string; tone: "pending" | "success" | "danger" | "info" }
> = {
  PENDING: { label: "در انتظار پرداخت", tone: "pending" },
  PAID: { label: "پرداخت‌شده", tone: "info" },
  PROCESSING: { label: "در حال پردازش", tone: "info" },
  SHIPPED: { label: "ارسال‌شده", tone: "info" },
  DELIVERED: { label: "تحویل‌شده", tone: "success" },
  CANCELLED: { label: "لغوشده", tone: "danger" },
};

const statusInfo = (status: string) =>
  statusMeta[status] ?? { label: status, tone: "info" as const };

const formatPrice = (value: string | number) =>
  Number(value).toLocaleString("fa-IR") + " تومان";

const orderItemLabel = (item: OrderItemOut) => item.product_name;

/* ---------------- جست‌وجو ---------------- */

const search = ref("");

const filteredUsers = computed(() => {
  if (!users.value) return [];
  const q = search.value.trim();
  if (!q) return users.value;
  return users.value.filter((u) => {
    const name = fullName(u) ?? "";
    return u.mobile.includes(q) || name.includes(q);
  });
});

/* ---------------- باز/بسته کردن کارت ---------------- */

const expandedUserId = ref<number | null>(null);

const toggleExpand = (userId: number) => {
  expandedUserId.value = expandedUserId.value === userId ? null : userId;
};

/* ---------------- تب‌های داخل هر کارت (اطلاعات / سفارشات) ---------------- */

const activeTab = ref<"info" | "orders">("orders");

const openUser = (userId: number, tab: "info" | "orders" = "orders") => {
  expandedUserId.value = userId;
  activeTab.value = tab;
};
</script>

<template>
  <div class="admin-users">
    <section class="admin-users__topbar">
      <div>
        <h1 class="admin-users__title">مدیریت کاربران</h1>
        <p class="admin-users__subtitle">
          اطلاعات کامل کاربران فروشگاه و سفارشات ثبت‌شده توسط هر کدام.
        </p>
      </div>

      <div class="admin-users__search">
        <Icon name="tabler:search" class="h-4 w-4 admin-users__search-icon" />
        <input
          v-model="search"
          type="text"
          placeholder="جست‌وجو با شماره موبایل یا نام..."
          class="admin-users__search-input"
        />
      </div>
    </section>

    <!-- آمار خلاصه -->
    <section v-if="users?.length" class="admin-users__stats">
      <div class="stat-card">
        <span class="stat-card__label">کل کاربران</span>
        <span class="stat-card__value">{{
          users.filter((item) => item.role !== "ADMIN").length
        }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">کل سفارشات</span>

        <span class="stat-card__value">
          {{ users.reduce((sum, u) => sum + u.orders?.length, 0) }}
        </span>
      </div>
    </section>

    <!-- لودینگ -->
    <section v-if="isLoading" class="admin-users__grid">
      <div
        v-for="n in 6"
        :key="n"
        class="admin-users__skeleton"
        aria-hidden="true"
      />
    </section>

    <!-- خطا -->
    <section
      v-else-if="error"
      class="admin-users__state admin-users__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت کاربران. لطفا دوباره تلاش کنید.</span>
    </section>

    <!-- خالی -->
    <section
      v-else-if="!users?.length"
      class="admin-users__state admin-users__state--empty"
    >
      <Icon name="tabler:users" class="h-8 w-8" />
      <p>هنوز کاربری ثبت نشده است.</p>
    </section>

    <!-- بدون نتیجه جست‌وجو -->
    <section
      v-else-if="!filteredUsers.length"
      class="admin-users__state admin-users__state--empty"
    >
      <Icon name="tabler:search-off" class="h-8 w-8" />
      <p>کاربری با این مشخصات پیدا نشد.</p>
    </section>

    <!-- لیست کارت‌ها -->
    <section v-else class="admin-users__list">
      <article
        v-for="(user, index) in filteredUsers?.filter(
          (item) => item?.role !== 'ADMIN',
        )"
        :key="user.id"
        class="user-card"
        :class="{ 'user-card--open': expandedUserId === user.id }"
      >
        <!-- هدر کارت -->
        <button
          type="button"
          class="user-card__header"
          @click="toggleExpand(user.id)"
        >
          <div class="user-card__identity">
            <div
              class="user-card__avatar"
              :class="{ 'user-card__avatar--admin': user.role === 'ADMIN' }"
            >
              {{ index + 1 }}
            </div>

            <div class="user-card__identity-text">
              <div class="user-card__name-row">
                <span class="user-card__name">
                  {{ fullName(user) ?? "بدون نام" }}
                </span>
                <span
                  class="user-card__role-badge"
                  :class="{
                    'user-card__role-badge--admin': user.role === 'ADMIN',
                  }"
                >
                  {{ roleLabel(user.role) }}
                </span>
              </div>
              <span class="user-card__mobile" dir="ltr">{{ user.mobile }}</span>
            </div>
          </div>

          <div class="user-card__summary">
            <div class="user-card__summary-item">
              <Icon name="tabler:package" class="h-4 w-4" />
              <span>{{ user.orders?.length }} سفارش</span>
            </div>
            <Icon
              name="tabler:chevron-down"
              class="h-4 w-4 user-card__chevron"
            />
          </div>
        </button>

        <!-- بدنه کارت -->
        <div v-if="expandedUserId === user.id" class="user-card__body">
          <div class="user-card__tabs">
            <button
              type="button"
              class="user-card__tab"
              :class="{ 'user-card__tab--active': activeTab === 'info' }"
              @click="activeTab = 'info'"
            >
              <Icon name="tabler:id" class="h-4 w-4" />
              اطلاعات کاربر
            </button>
            <button
              type="button"
              class="user-card__tab"
              :class="{ 'user-card__tab--active': activeTab === 'orders' }"
              @click="activeTab = 'orders'"
            >
              <Icon name="tabler:shopping-bag" class="h-4 w-4" />
              سفارشات
              <span class="user-card__tab-count">{{
                user.orders?.length
              }}</span>
            </button>
          </div>

          <!-- تب اطلاعات -->
          <div v-if="activeTab === 'info'" class="user-info">
            <div class="user-info__grid">
              <div class="user-info__item">
                <Icon name="tabler:user" class="h-4 w-4" />
                <div>
                  <span class="user-info__label">نام</span>
                  <span class="user-info__value">
                    {{ user.customer_profile?.first_name ?? "—" }}
                  </span>
                </div>
              </div>

              <div class="user-info__item">
                <Icon name="tabler:user" class="h-4 w-4" />
                <div>
                  <span class="user-info__label">نام‌خانوادگی</span>
                  <span class="user-info__value">
                    {{ user.customer_profile?.last_name ?? "—" }}
                  </span>
                </div>
              </div>

              <div class="user-info__item">
                <Icon name="tabler:phone" class="h-4 w-4" />
                <div>
                  <span class="user-info__label">شماره موبایل</span>
                  <span class="user-info__value" dir="ltr">{{
                    user.mobile
                  }}</span>
                </div>
              </div>

              <div class="user-info__item user-info__item--full">
                <Icon name="tabler:map-pin" class="h-4 w-4" />
                <div>
                  <span class="user-info__label">آدرس</span>
                  <span class="user-info__value">
                    {{ user.customer_profile?.address ?? "—" }}
                  </span>
                </div>
              </div>

              <div class="user-info__item">
                <Icon name="tabler:mailbox" class="h-4 w-4" />
                <div>
                  <span class="user-info__label">کد پستی</span>
                  <span class="user-info__value" dir="ltr">
                    {{ user.customer_profile?.postal_code ?? "—" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- تب سفارشات -->
          <div v-else class="user-orders">
            <p v-if="!user.orders.length" class="user-orders__empty">
              این کاربر تاکنون سفارشی ثبت نکرده است.
            </p>

            <div v-else class="user-orders__list">
              <article
                v-for="order in user.orders"
                :key="order.id"
                class="order-card"
              >
                <header class="order-card__header">
                  <div class="order-card__header-main">
                    <span class="order-card__id">وضعیت سفارش : </span>
                    <span
                      class="order-card__status"
                      :class="`order-card__status--${statusInfo(order.status).tone}`"
                    >
                      {{ statusInfo(order.status).label }}
                    </span>
                  </div>
                  <span class="order-card__payable">
                    {{ formatPrice(order.payable_amount) }}
                  </span>
                </header>

                <div class="order-card__items">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="order-item"
                  >
                    <img
                      v-if="item.product?.image"
                      :src="`https://sohangaz.com${item.product.image}`"
                      :alt="orderItemLabel(item)"
                      class="order-item__img"
                      loading="lazy"
                    />
                    <div v-else class="order-item__img order-item__img--ph">
                      <Icon name="tabler:photo" class="h-4 w-4" />
                    </div>

                    <div class="order-item__info">
                      <span class="order-item__name">{{
                        orderItemLabel(item)
                      }}</span>
                      <span class="order-item__meta">
                        {{ item.quantity }}
                        {{ item.product?.is_packaged ? "بسته" : "کیلو" }}
                        {{ formatPrice(item.unit_price) }}
                      </span>
                    </div>

                    <span class="order-item__total">
                      {{ formatPrice(item.total_price) }}
                    </span>
                  </div>
                </div>

                <footer class="order-card__totals">
                  <div class="order-card__totals-row">
                    <span>جمع کل</span>
                    <span>{{ formatPrice(order.total_amount) }}</span>
                  </div>
                  <div
                    v-if="Number(order.discount_amount) > 0"
                    class="order-card__totals-row order-card__totals-row--discount"
                  >
                    <span>تخفیف</span>
                    <span>- {{ formatPrice(order.discount_amount) }}</span>
                  </div>
                  <div class="order-card__totals-row">
                    <span>هزینه ارسال</span>
                    <span>{{ formatPrice(order.shipping_amount) }}</span>
                  </div>
                  <div
                    class="order-card__totals-row order-card__totals-row--final"
                  >
                    <span>قابل پرداخت</span>
                    <span>{{ formatPrice(order.payable_amount) }}</span>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.admin-users {
  @apply flex flex-col gap-6 p-4;
}

/* ---- بالای صفحه ---- */

.admin-users__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-users__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-users__subtitle {
  @apply mt-1 text-sm text-wrap text-slate-500 dark:text-slate-400 leading-7;
}

.admin-users__search {
  @apply relative w-full sm:w-72;
}

.admin-users__search-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-slate-400;
}

.admin-users__search-input {
  @apply w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-9 pl-3 text-sm
    text-slate-900 outline-none transition focus:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

/* ---- آمار ---- */

.admin-users__stats {
  @apply grid grid-cols-2 gap-3;
}

.stat-card {
  @apply flex flex-col gap-1 flex-1 rounded-2xl border border-slate-200 bg-white p-4
    dark:border-slate-800 dark:bg-slate-950;
}

.stat-card__label {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.stat-card__value {
  @apply text-xl font-bold text-slate-900 dark:text-white;
}

/* ---- وضعیت‌ها ---- */

.admin-users__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-users__state--error {
  @apply text-red-600 dark:text-red-400;
}

.admin-users__grid {
  @apply grid gap-3;
}

.admin-users__skeleton {
  @apply h-20 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60;
}

/* ---- لیست کارت‌ها ---- */

.admin-users__list {
  @apply flex flex-col gap-3;
}

.user-card {
  @apply overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm
    transition dark:border-slate-800 dark:bg-slate-950;
}

.user-card--open {
  @apply border-[--gold-one] shadow-md;
}

.user-card__header {
  @apply flex w-full items-center justify-between gap-4 px-4 py-4 text-right
    transition hover:bg-slate-50 dark:hover:bg-slate-900/50;
}

.user-card__identity {
  @apply flex items-center gap-3;
}

.user-card__avatar {
  @apply flex h-11 w-11 shrink-0 items-center justify-center rounded-full
    bg-slate-100 text-sm font-bold text-slate-500
    dark:bg-slate-800 dark:text-slate-400;
}

.user-card__avatar--admin {
  @apply bg-[--gold-one] text-[--gold-one];
}

.user-card__identity-text {
  @apply flex flex-col gap-0.5;
}

.user-card__name-row {
  @apply flex items-center gap-2;
}

.user-card__name {
  @apply text-sm font-bold text-slate-900 dark:text-white;
}

.user-card__role-badge {
  @apply inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600
    dark:bg-slate-800 dark:text-slate-300;
}

.user-card__role-badge--admin {
  @apply bg-[--gold-one] text-[--gold-one];
}

.user-card__mobile {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.user-card__summary {
  @apply items-center gap-4 hidden sm:flex;
}

.user-card__summary-item {
  @apply flex items-center gap-1.5 text-xs font-medium text-slate-500
    dark:text-slate-400;
}

.user-card__chevron {
  @apply text-slate-400 transition-transform duration-200;
}

.user-card--open .user-card__chevron {
  @apply rotate-180 text-[--gold-one];
}

/* ---- بدنه کارت ---- */

.user-card__body {
  @apply border-t border-slate-100 dark:border-slate-900;
}

.user-card__tabs {
  @apply flex gap-1 border-b border-slate-100 px-4 pt-3 dark:border-slate-900;
}

.user-card__tab {
  @apply flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-semibold
    text-slate-500 transition hover:text-slate-700
    dark:text-slate-400 dark:hover:text-slate-200;
}

.user-card__tab--active {
  @apply border-b-2 border-[--gold-one] text-[--gold-one]
    hover:text-[--gold-one];
}

.user-card__tab-count {
  @apply inline-flex min-w-[18px] items-center justify-center rounded-full
    bg-slate-100 px-1 text-[10px] text-slate-500
    dark:bg-slate-800 dark:text-slate-400;
}

/* ---- تب اطلاعات ---- */

.user-info {
  @apply p-4;
}

.user-info__grid {
  @apply grid gap-4 sm:grid-cols-2;
}

.user-info__item {
  @apply flex items-start gap-2.5 rounded-xl bg-slate-50 p-3
    dark:bg-slate-900/60;
}

.user-info__item > svg,
.user-info__item > i {
  @apply mt-0.5 shrink-0 text-slate-400;
}

.user-info__item--full {
  @apply sm:col-span-2;
}

.user-info__label {
  @apply block text-xs text-slate-500 dark:text-slate-400 mb-2;
}

.user-info__value {
  @apply block text-sm font-medium text-slate-800 dark:text-slate-100;
}

/* ---- تب سفارشات ---- */

.user-orders {
  @apply p-4;
}

.user-orders__empty {
  @apply py-6 text-center text-sm text-slate-500 dark:text-slate-400;
}

.user-orders__list {
  @apply flex flex-col gap-4;
}

/* ---- کارت سفارش ---- */

.order-card {
  @apply flex flex-col gap-3 rounded-xl border border-slate-200 p-4
    dark:border-slate-800;
}

.order-card__header {
  @apply flex items-center justify-between gap-3;
}

.order-card__header-main {
  @apply flex items-center gap-2;
}

.order-card__id {
  @apply text-sm font-bold text-slate-800 dark:text-slate-100 hidden sm:flex;
}

.order-card__status {
  @apply rounded-full px-2.5 py-2 font-semibold;
}

.order-card__status--pending {
  @apply bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400;
}

.order-card__status--info {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400;
}

.order-card__status--success {
  @apply bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400;
}

.order-card__status--danger {
  @apply bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400;
}

.order-card__payable {
  @apply  font-bold text-slate-900 dark:text-white;
}

.order-card__receiver {
  @apply flex flex-col gap-1 rounded-lg bg-slate-50 p-2.5 text-xs
    text-slate-500 dark:bg-slate-900/60 dark:text-slate-400;
}

.order-card__receiver-row {
  @apply flex items-center gap-1.5;
}

.order-card__items {
  @apply flex flex-col gap-2;
}

.order-item {
  @apply flex items-center flex-col sm:flex-row gap-3 rounded-lg bg-slate-50 p-3
    dark:bg-slate-900/60;
}

.order-item__img {
  @apply h-28 w-28 shrink-0 rounded-md object-cover;
}

.order-item__img--ph {
  @apply flex items-center justify-center bg-slate-100 text-slate-300
    dark:bg-slate-800 dark:text-slate-600;
}

.order-item__info {
  @apply flex flex-1 flex-col gap-0.5;
}

.order-item__name {
  @apply  font-bold text-slate-800 text-center sm:text-right mb-2 dark:text-slate-100;
}

.order-item__meta {
  @apply text-slate-500 dark:text-slate-400;
}

.order-item__total {
  @apply text-xs font-bold text-slate-700 dark:text-slate-200;
}

.order-card__totals {
  @apply flex flex-col gap-3 border-t border-slate-100 pt-3
    dark:border-slate-900;
}

.order-card__totals-row {
  @apply flex items-center justify-between  text-slate-500
    dark:text-slate-400;
}

.order-card__totals-row--discount {
  @apply text-green-600 dark:text-green-400;
}

.order-card__totals-row--final {
  @apply mt-1 border-t border-slate-100 pt-4 text-sm font-bold
    text-slate-900 dark:border-slate-900 dark:text-white;
}
</style>
