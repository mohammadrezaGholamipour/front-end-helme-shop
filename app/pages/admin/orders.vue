<script setup lang="ts">
import type { OrderOut, OrderStatus } from "~/types";

definePageMeta({
  layout: "admin",
});

/* ---------------- داده ---------------- */
const {
  data: orders,
  isLoading,
  error,
  refetch,
} = useAdminOrders();

const updateStatusMutation = useUpdateOrderStatus();

/* ---------------- وضعیت‌ها ---------------- */
const statusMeta: Record<
  OrderStatus,
  { label: string; tone: "pending" | "success" | "danger" | "info" }
> = {
  PENDING: { label: "در انتظار پرداخت", tone: "pending" },
  PAID: { label: "پرداخت‌شده", tone: "info" },
  PROCESSING: { label: "در حال پردازش", tone: "info" },
  SHIPPED: { label: "ارسال‌شده", tone: "info" },
  DELIVERED: { label: "تحویل‌شده", tone: "success" },
  CANCELLED: { label: "لغوشده", tone: "danger" },
};

const statusOrder: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const statusInfo = (status: string) =>
  statusMeta[status as OrderStatus] ?? { label: status, tone: "info" as const };

/* ---------------- فرمت ---------------- */
const formatPrice = (value: string | number) =>
  Number(value).toLocaleString("fa-IR") + " تومان";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

// TODO: مطمئن شید OrderOut برای ادمین فیلد user رو داره (توضیحات در
// service-and-types-additions.ts). تا وقتی اضافه نشده، fallback امن می‌ذاریم.
const customerName = (o: OrderOut) => {
  const first = o.user?.first_name;
  const last = o.user?.last_name;
  if (!first && !last) return "بدون نام";
  return `${first ?? ""} ${last ?? ""}`.trim();
};

const customerMobile = (o: OrderOut) => o.user?.mobile ?? "—";

/* ---------------- فیلتر / جست‌وجو ---------------- */
const search = ref("");
const statusFilter = ref<OrderStatus | "ALL">("ALL");

const statusTabs: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "همه" },
  ...statusOrder.map((s) => ({ value: s, label: statusMeta[s].label })),
];

const statusCount = (status: OrderStatus | "ALL") => {
  if (!orders.value) return 0;
  if (status === "ALL") return orders.value.length;
  return orders.value.filter((o) => o.status === status).length;
};

const filteredOrders = computed(() => {
  if (!orders.value) return [];
  let list = orders.value;

  if (statusFilter.value !== "ALL") {
    list = list.filter((o) => o.status === statusFilter.value);
  }

  const q = search.value.trim();
  if (q) {
    list = list.filter((o) => {
      const name = customerName(o);
      return (
        customerMobile(o).includes(q) ||
        name.includes(q) ||
        String(o.id).includes(q)
      );
    });
  }

  return list;
});

/* ---------------- آمار ---------------- */
const totalRevenue = computed(() =>
  (orders.value ?? [])
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.payable_amount), 0),
);

const pendingCount = computed(() => statusCount("PENDING"));

/* ---------------- باز/بسته کردن کارت ---------------- */
const expandedOrderId = ref<number | null>(null);
const toggleExpand = (id: number) => {
  expandedOrderId.value = expandedOrderId.value === id ? null : id;
};

/* ---------------- تغییر وضعیت سفارش ---------------- */
// state جداگانه برای هر سفارش تا انتخاب موقت (قبل از ثبت) رو نگه داره
const pendingStatus = reactive<Record<number, OrderStatus>>({});
const savedFlashId = ref<number | null>(null);
let flashTimeout: ReturnType<typeof setTimeout> | null = null;

const currentSelection = (order: OrderOut) =>
  pendingStatus[order.id] ?? order.status;

const hasChange = (order: OrderOut) =>
  pendingStatus[order.id] !== undefined &&
  pendingStatus[order.id] !== order.status;

// چون useMutation یه instance مشترکه، برای اینکه اسپینر فقط روی همون
// سفارشی که در حال ثبته نشون داده بشه، variables فعلی mutation رو چک می‌کنیم
const isSavingOrder = (order: OrderOut) =>
  updateStatusMutation.isPending.value &&
  updateStatusMutation.variables.value?.orderId === order.id;

const onStatusPick = (order: OrderOut, next: OrderStatus) => {
  if (next === order.status) {
    delete pendingStatus[order.id];
  } else {
    pendingStatus[order.id] = next;
  }
};

const resetSelection = (order: OrderOut) => {
  delete pendingStatus[order.id];
};

const confirmSave = (order: OrderOut) => {
  const next = pendingStatus[order.id];
  if (!next) return;

  // لغو سفارش یه اقدام حساسه، یه تاییدیه‌ی ساده بگیریم
  if (next === "CANCELLED") {
    const ok = window.confirm(
      `سفارش #${order.id} لغو بشه؟ این عملیات قابل بازگشت نیست.`,
    );
    if (!ok) return;
  }

  updateStatusMutation.mutate(
    { orderId: order.id, status: next },
    {
      onSuccess: () => {
        delete pendingStatus[order.id];
        savedFlashId.value = order.id;
        if (flashTimeout) clearTimeout(flashTimeout);
        flashTimeout = setTimeout(() => (savedFlashId.value = null), 2000);
      },
      onError: () => {
        window.alert("بروزرسانی وضعیت با خطا مواجه شد. دوباره تلاش کنید.");
      },
    },
  );
};
</script>

<template>
  <div class="admin-orders">
    <section class="admin-orders__topbar">
      <div>
        <h1 class="admin-orders__title">مدیریت سفارشات</h1>
        <p class="admin-orders__subtitle">
          مشاهده و بروزرسانی وضعیت سفارشات ثبت‌شده در فروشگاه.
        </p>
      </div>

      <div class="admin-orders__search">
        <Icon
          name="tabler:search"
          class="h-4 w-4 admin-orders__search-icon"
        />
        <input
          v-model="search"
          type="text"
          placeholder="جست‌وجو با شماره سفارش، موبایل یا نام..."
          class="admin-orders__search-input"
        />
      </div>
    </section>

    <!-- آمار خلاصه -->
    <section v-if="orders?.length" class="admin-orders__stats">
      <div class="stat-card">
        <span class="stat-card__label">کل سفارشات</span>
        <span class="stat-card__value">{{ orders.length }}</span>
      </div>
      <div class="stat-card stat-card--wide">
        <span class="stat-card__label">مجموع فروش (بدون لغوشده‌ها)</span>
        <span class="stat-card__value">{{ formatPrice(totalRevenue) }}</span>
      </div>
    </section>

    <!-- تب‌های فیلتر وضعیت -->
    <section v-if="orders?.length" class="admin-orders__filters">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        type="button"
        class="filter-chip"
        :class="{ 'filter-chip--active': statusFilter === tab.value }"
        @click="statusFilter = tab.value"
      >
        {{ tab.label }}
        <span class="filter-chip__count">{{ statusCount(tab.value) }}</span>
      </button>
    </section>

    <!-- لودینگ -->
    <section v-if="isLoading" class="admin-orders__grid">
      <div
        v-for="n in 4"
        :key="n"
        class="admin-orders__skeleton"
        aria-hidden="true"
      />
    </section>

    <!-- خطا -->
    <section
      v-else-if="error"
      class="admin-orders__state admin-orders__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت سفارشات. لطفا دوباره تلاش کنید.</span>
      <button type="button" class="retry-btn" @click="refetch()">
        تلاش مجدد
      </button>
    </section>

    <!-- خالی -->
    <section
      v-else-if="!orders?.length"
      class="admin-orders__state admin-orders__state--empty"
    >
      <Icon name="tabler:shopping-bag" class="h-8 w-8" />
      <p>هنوز سفارشی ثبت نشده است.</p>
    </section>

    <!-- بدون نتیجه جست‌وجو -->
    <section
      v-else-if="!filteredOrders.length"
      class="admin-orders__state admin-orders__state--empty"
    >
      <Icon name="tabler:search-off" class="h-8 w-8" />
      <p>سفارشی با این مشخصات پیدا نشد.</p>
    </section>

    <!-- لیست سفارشات -->
    <section v-else class="admin-orders__list">
      <article
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        :class="{ 'order-card--open': expandedOrderId === order.id }"
      >
        <!-- هدر کارت -->
        <button
          type="button"
          class="order-card__header"
          @click="toggleExpand(order.id)"
        >
          <div class="order-card__identity">
            <div class="order-card__id-badge">#{{ order.id }}</div>
            <div class="order-card__identity-text">
              <span class="order-card__customer">{{
                customerName(order)
              }}</span>
              <span class="order-card__mobile" dir="ltr">{{
                customerMobile(order)
              }}</span>
            </div>
          </div>

          <div class="order-card__summary">
            <span
              class="order-card__status-badge"
              :class="`order-card__status-badge--${statusInfo(order.status).tone}`"
            >
              {{ statusInfo(order.status).label }}
            </span>
            <span class="order-card__date">{{
              formatDate(order.created_at)
            }}</span>
            <span class="order-card__payable">{{
              formatPrice(order.payable_amount)
            }}</span>
            <Icon
              name="tabler:chevron-down"
              class="h-4 w-4 order-card__chevron"
            />
          </div>
        </button>

        <!-- بدنه کارت -->
        <div v-if="expandedOrderId === order.id" class="order-card__body">
          <!-- بخش تغییر وضعیت -->
          <div class="status-panel">
            <div class="status-panel__label">
              <Icon name="tabler:adjustments" class="h-4 w-4" />
              تغییر وضعیت سفارش
            </div>

            <div class="status-panel__controls">
              <select
                class="status-select"
                :value="currentSelection(order)"
                :disabled="isSavingOrder(order)"
                @change="
                  onStatusPick(
                    order,
                    ($event.target as HTMLSelectElement).value as any,
                  )
                "
              >
                <option
                  v-for="s in statusOrder"
                  :key="s"
                  :value="s"
                >
                  {{ statusMeta[s].label }}
                </option>
              </select>

              <div class="status-panel__actions">
                <button
                  v-if="hasChange(order)"
                  type="button"
                  class="status-btn status-btn--ghost"
                  :disabled="isSavingOrder(order)"
                  @click="resetSelection(order)"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  class="status-btn status-btn--primary"
                  :disabled="!hasChange(order) || isSavingOrder(order)"
                  @click="confirmSave(order)"
                >
                  <Icon
                    v-if="isSavingOrder(order)"
                    name="tabler:loader-2"
                    class="h-4 w-4 animate-spin"
                  />
                  {{ isSavingOrder(order) ? "در حال ثبت..." : "ثبت تغییر" }}
                </button>
              </div>
            </div>

            <transition name="fade">
              <div v-if="savedFlashId === order.id" class="status-panel__flash">
                <Icon name="tabler:circle-check" class="h-4 w-4" />
                وضعیت با موفقیت بروزرسانی شد
              </div>
            </transition>
          </div>

          <!-- زمان ثبت -->
          <div class="order-card__meta-row">
            <Icon name="tabler:calendar" class="h-4 w-4" />
            <span
              >ثبت‌شده در {{ formatDate(order.created_at) }} ساعت
              {{ formatTime(order.created_at) }}</span
            >
          </div>

          <!-- آیتم‌ها -->
          <div class="order-card__items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <img
                v-if="item.product?.image"
                :src="`https://sohangaz.com${item.product.image}`"
                :alt="item.product_name"
                class="order-item__img"
                loading="lazy"
              />
              <div v-else class="order-item__img order-item__img--ph">
                <Icon name="tabler:photo" class="h-4 w-4" />
              </div>

              <div class="order-item__info">
                <span class="order-item__name">{{ item.product_name }}</span>
                <span class="order-item__meta">
                  {{ item.quantity }}
                  {{ item.product?.is_packaged ? "بسته" : "کیلو" }} ·
                  {{ formatPrice(item.unit_price) }}
                </span>
              </div>

              <span class="order-item__total">{{
                formatPrice(item.total_price)
              }}</span>
            </div>
          </div>

          <!-- جمع‌بندی -->
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
            <div class="order-card__totals-row order-card__totals-row--final">
              <span>قابل پرداخت</span>
              <span>{{ formatPrice(order.payable_amount) }}</span>
            </div>
          </footer>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.admin-orders {
  @apply flex flex-col gap-6 p-4;
}

/* ---- بالای صفحه ---- */

.admin-orders__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-orders__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-orders__subtitle {
  @apply mt-1 text-sm text-wrap text-slate-500 dark:text-slate-400 leading-7;
}

.admin-orders__search {
  @apply relative w-full sm:w-72;
}

.admin-orders__search-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-slate-400;
}

.admin-orders__search-input {
  @apply w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-9 pl-3 text-sm
    text-slate-900 outline-none transition focus:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

/* ---- آمار ---- */

.admin-orders__stats {
  @apply flex flex-wrap gap-3;
}

.stat-card {
  @apply flex flex-col flex-1 gap-1 rounded-2xl border border-slate-200 bg-white p-4
    dark:border-slate-800 dark:bg-slate-950;
}

.stat-card--wide {
  @apply col-span-2 sm:col-span-1;
}

.stat-card__label {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.stat-card__value {
  @apply text-xl font-bold text-slate-900 dark:text-white;
}

/* ---- فیلتر وضعیت ---- */

.admin-orders__filters {
  @apply flex flex-wrap gap-2;
}

.filter-chip {
  @apply flex items-center justify-center gap-3 flex-1 rounded-full border border-slate-200 bg-white px-5 py-3
     font-semibold text-slate-600 transition hover:border-slate-300
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.filter-chip--active {
  @apply border-[--gold-one] !bg-[--gold-one] !text-white;
}

.filter-chip__count {
  @apply inline-flex min-w-[18px] items-center justify-center rounded-full
    !bg-slate-500 px-2  !text-white
    dark:bg-slate-800 dark:text-slate-400;
}

.filter-chip--active .filter-chip__count {
  @apply bg-[--gold-one] text-white;
}

/* ---- وضعیت‌های کلی صفحه ---- */

.admin-orders__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-orders__state--error {
  @apply text-red-600 dark:text-red-400;
}

.retry-btn {
  @apply mt-1 rounded-lg border border-current px-3 py-1.5 text-xs font-semibold transition hover:opacity-80;
}

.admin-orders__grid {
  @apply grid gap-3;
}

.admin-orders__skeleton {
  @apply h-20 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60;
}

/* ---- لیست سفارشات ---- */

.admin-orders__list {
  @apply flex flex-col gap-3;
}

.order-card {
  @apply overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm
    transition dark:border-slate-800 dark:bg-slate-950;
}

.order-card--open {
  @apply border-[--gold-one] shadow-md;
}

.order-card__header {
  @apply flex w-full flex-col items-start gap-3 px-4 py-4 text-right
    transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between
    dark:hover:bg-slate-900/50;
}

.order-card__identity {
  @apply flex items-center gap-3;
}

.order-card__id-badge {
  @apply flex h-11 w-11 shrink-0 items-center justify-center rounded-full
    bg-slate-100 text-xs font-bold text-slate-500
    dark:bg-slate-800 dark:text-slate-400;
}

.order-card__identity-text {
  @apply flex flex-col gap-0.5;
}

.order-card__customer {
  @apply text-sm font-bold text-slate-900 dark:text-white;
}

.order-card__mobile {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.order-card__summary {
  @apply flex flex-wrap items-center gap-3 text-xs;
}

.order-card__status-badge {
  @apply rounded-full px-2.5 py-1 font-semibold;
}

.order-card__status-badge--pending {
  @apply bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400;
}

.order-card__status-badge--info {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400;
}

.order-card__status-badge--success {
  @apply bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400;
}

.order-card__status-badge--danger {
  @apply bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400;
}

.order-card__date {
  @apply text-slate-400 dark:text-slate-500;
}

.order-card__payable {
  @apply font-bold text-slate-900 dark:text-white;
}

.order-card__chevron {
  @apply text-slate-400 transition-transform duration-200;
}

.order-card--open .order-card__chevron {
  @apply rotate-180 text-[--gold-one];
}

/* ---- بدنه کارت ---- */

.order-card__body {
  @apply flex flex-col gap-4 border-t border-slate-100 p-4 dark:border-slate-900;
}

.order-card__meta-row {
  @apply flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400;
}

/* ---- پنل تغییر وضعیت ---- */

.status-panel {
  @apply flex flex-col gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60;
}

.status-panel__label {
  @apply flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300;
}

.status-panel__controls {
  @apply flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between;
}

.status-select {
  @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
    text-slate-900 outline-none transition focus:border-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-60
    dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:w-56;
}

.status-panel__actions {
  @apply flex items-center gap-2;
}

.status-btn {
  @apply flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition
    disabled:cursor-not-allowed disabled:opacity-50;
}

.status-btn--ghost {
  @apply border border-slate-300 text-slate-600 hover:bg-slate-100
    dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800;
}

.status-btn--primary {
  @apply bg-[--gold-one] text-white hover:opacity-90;
}

.status-panel__flash {
  @apply flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- آیتم‌های سفارش ---- */

.order-card__items {
  @apply flex flex-col gap-2;
}

.order-item {
  @apply flex flex-col items-center gap-3 rounded-lg bg-slate-50 p-3
    dark:bg-slate-900/60 sm:flex-row;
}

.order-item__img {
  @apply h-20 w-20 shrink-0 rounded-md object-cover;
}

.order-item__img--ph {
  @apply flex items-center justify-center bg-slate-100 text-slate-300
    dark:bg-slate-800 dark:text-slate-600;
}

.order-item__info {
  @apply flex flex-1 flex-col gap-0.5 text-center sm:text-right;
}

.order-item__name {
  @apply font-bold text-slate-800 dark:text-slate-100;
}

.order-item__meta {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.order-item__total {
  @apply text-xs font-bold text-slate-700 dark:text-slate-200;
}

/* ---- جمع‌بندی ---- */

.order-card__totals {
  @apply flex flex-col gap-3 border-t border-slate-100 pt-3 text-xs
    dark:border-slate-900;
}

.order-card__totals-row {
  @apply flex items-center justify-between text-slate-500 dark:text-slate-400;
}

.order-card__totals-row--discount {
  @apply text-green-600 dark:text-green-400;
}

.order-card__totals-row--final {
  @apply mt-1 border-t border-slate-100 pt-3 text-sm font-bold
    text-slate-900 dark:border-slate-900 dark:text-white;
}
</style>