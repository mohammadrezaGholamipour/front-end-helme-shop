<script setup lang="ts">
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge.vue";
import SohanSeal from "@/components/dashboard/SohanSeal.vue";

const { data: orders, isPending, isError, refetch } = useOrders();
const deleteOrder = useDeleteOrder();
const toast = useAppToast();
const expandedId = ref<number | null>(null);

function toggle(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

/* ---------------- حذف سفارش ---------------- */

const deleteTargetId = ref<number | null>(null);

const isDeleteModalOpen = computed({
  get: () => deleteTargetId.value !== null,
  set: (value: boolean) => {
    if (!value && !deleteOrder.isPending.value) {
      deleteTargetId.value = null;
    }
  },
});

function askDelete(id: number) {
  deleteTargetId.value = id;
}

async function confirmDelete() {
  if (deleteTargetId.value === null) return;

  const orderId = deleteTargetId.value;

  try {
    await deleteOrder.mutateAsync(orderId);

    if (expandedId.value === orderId) {
      expandedId.value = null;
    }

    toast.success("سفارش حذف شد");
    deleteTargetId.value = null;
  } catch (error) {
    toast.apiError(error, "حذف سفارش با خطا مواجه شد");
  }
}
</script>

<template>
  <section class="orders-list">
    <div v-if="isPending" class="orders-list__loading">
      <div v-for="i in 3" :key="i" class="orders-list__skeleton" />
    </div>

    <div v-else-if="isError" class="orders-list__error">
      <Icon name="tabler:alert-triangle" class="h-6 w-6" />
      <p>دریافت سفارش‌ها ممکن نشد.</p>
      <button type="button" class="orders-list__retry" @click="() => refetch()">
        تلاش دوباره
      </button>
    </div>

    <div v-else-if="!orders?.length" class="orders-list__empty">
      <SohanSeal :size="56">
        <Icon name="tabler:package" class="h-6 w-6" />
      </SohanSeal>
      <p class="orders-list__empty-title">هنوز سفارشی ثبت نکرده‌اید</p>
      <p class="orders-list__empty-text">
        سفارش‌های شما همین‌جا و به‌ترتیب نمایش داده می‌شوند.
      </p>
    </div>

    <ul v-else class="orders-list__items">
      <li
        v-for="order in orders"
        v-animate="{
          type: 'slideLeft',
          delay: 300,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        :key="order.id"
        class="order-item"
        :class="{
          'order-item--open': expandedId === order.id,
          'order-item--pending': order.status === 'PENDING',
        }"
      >
        <button
          type="button"
          class="order-item__summary"
          @click="toggle(order.id)"
        >
          <span class="order-item__icon-wrap">
            <Icon name="tabler:receipt-2" class="h-5 w-5" />
            <span v-if="order.status === 'PENDING'" class="order-item__pulse" />
          </span>

          <span class="order-item__id-block">
            <span class="order-item__count">
              {{ order.items?.length ?? 0 }} قلم کالا
            </span>
          </span>

          <OrderStatusBadge :status="order.status" class="order-item__status" />

          <span class="order-item__payable">
            {{ formatAmount(order.payable_amount) }}
          </span>

          <Icon
            name="tabler:chevron-down"
            class="order-item__chevron h-4 w-4"
          />
        </button>

        <Transition name="order-expand">
          <div
            v-animate="{
              type: 'slideLeft',
              delay: 300,
              duration: 1000,
              once: true,
              threshold: 0,
            }"
            v-if="expandedId === order.id"
            class="order-item__details"
          >
            <div class="order-item__products">
              <div
                v-for="(item, idx) in order.items"
                :key="item.id ?? idx"
                class="order-item__product"
              >
                <div class="order-item__product-thumb">
                  <img
                    :src="`https://sohangaz.com${item.product?.image}`"
                    :alt="item.product?.name ?? item.title ?? 'کالا'"
                    class="order-item__product-img"
                    loading="lazy"
                  />
                </div>

                <div class="order-item__product-info">
                  <div class="flex items-center gap-2">
                    <span class="order-item__product-qty">
                      {{ item.quantity }}
                      {{ item.product?.is_packaged ? "بسته" : "کیلو" }}
                    </span>
                    <span class="order-item__product-name">
                      {{ item.title ?? item.product_name ?? "کالا" }}
                    </span>
                  </div>

                  <span class="order-item__product-meta">
                    <span
                      v-if="item.unit_price"
                      class="order-item__product-unit"
                    >
                      هر {{ item.product?.is_packaged ? "بسته" : "کیلو" }} به
                      قیمت
                      {{ formatAmount(item.unit_price) }}
                    </span>
                  </span>
                  <span
                    v-if="item.total_price"
                    class="order-item__product-price"
                  >
                    مجموع
                    {{ formatAmount(item.total_price) }}
                  </span>
                </div>
              </div>

              <p v-if="!order.items?.length" class="order-item__no-products">
                جزئیات اقلام این سفارش موجود نیست.
              </p>
            </div>

            <div class="order-item__receipt">
              <div class="order-item__receipt-row">
                <span>جمع سبد</span>
                <span>{{ formatAmount(order.total_amount) }}</span>
              </div>
              
              <div class="order-item__receipt-row">
                <span>هزینه ارسال</span>
                <span>{{ formatAmount(order.shipping_amount) }}</span>
              </div>

              <div class="order-item__receipt-divider" />

              <div
                class="order-item__receipt-row order-item__receipt-row--total"
              >
                <span>مبلغ قابل پرداخت</span>
                <span>{{ formatAmount(order.payable_amount) }}</span>
              </div>
            </div>

            <div v-if="order.status === 'PENDING'" class="order-item__actions">
              <button
                type="button"
                class="order-item__delete"
                @click.stop="askDelete(order.id)"
              >
                <Icon name="tabler:trash" class="h-4 w-4" />
                حذف سفارش
              </button>
            </div>
          </div>
        </Transition>
      </li>
    </ul>

    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف سفارش"
      action-label="حذف سفارش"
      cancel-label="انصراف"
      :loading="deleteOrder.isPending.value"
      @submit="confirmDelete"
    >
      <p class="orders-list__confirm-text">آیا از حذف سفارش مطمئن هستید؟</p>
    </AdminModal>
  </section>
</template>

<style scoped>
.orders-list__loading {
  @apply flex flex-col gap-3;
}

.orders-list__skeleton {
  @apply h-20 animate-pulse rounded-2xl;
  background: color-mix(in srgb, var(--dash-primary) 10%, transparent);
}

.orders-list__error,
.orders-list__empty {
  @apply flex flex-col items-center gap-3 rounded-3xl border py-12 text-center;
  border-color: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  background: var(--dash-surface);
  color: var(--dash-ink);
}

.orders-list__retry {
  @apply rounded-xl px-4 py-2 text-sm font-bold text-white;
  background: var(--dash-primary);
}

.orders-list__empty-title {
  @apply text-base font-bold;
}

.orders-list__empty-text {
  @apply max-w-xs text-sm opacity-60 text-wrap;
}

.orders-list__confirm-text {
  @apply text-sm leading-7 dark:text-white text-wrap;
  color: var(--dash-ink);
}

.orders-list__items {
  @apply flex flex-col gap-3.5;
}

/* ===== کارت سفارش ===== */

.order-item {
  @apply relative overflow-hidden rounded-2xl border shadow-sm transition;
  border-color: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  background: var(--dash-surface);
}

.order-item::before {
  content: "";
  @apply absolute inset-y-0 right-0 w-1 rounded-l-full transition-opacity;
  background: var(--dash-primary);
  opacity: 0;
}

.order-item--pending::before {
  opacity: 1;
}

.order-item--open {
  border-color: color-mix(in srgb, var(--dash-primary) 45%, transparent);
  box-shadow: 0 8px 24px
    color-mix(in srgb, var(--dash-primary) 10%, transparent);
}

.order-item__summary {
  @apply flex w-full items-center gap-3 px-4 py-4 text-right sm:px-5;
}

.order-item__icon-wrap {
  @apply relative hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl;
  background: color-mix(in srgb, var(--dash-primary) 12%, transparent);
  color: var(--dash-primary-deep);
}

.order-item__pulse {
  @apply absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-full;
  background: var(--dash-primary);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--dash-primary) 60%, transparent);
  animation: order-pulse 1.8s infinite;
}

@keyframes order-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--dash-primary) 45%, transparent);
  }
  70% {
    box-shadow: 0 0 0 7px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.order-item__id-block {
  @apply flex-col hidden sm:inline-flex items-start gap-0.5;
}

.order-item__id {
  @apply text-sm font-bold;
  color: var(--dash-ink);
}

.order-item__count {
  @apply text-xs opacity-55;
  color: var(--dash-ink);
}

.order-item__payable {
  @apply mr-auto text-sm font-bold tabular-nums;
  color: var(--dash-primary-deep);
}

.order-item__chevron {
  @apply shrink-0 transition-transform duration-200;
  color: var(--dash-primary);
}

.order-item--open .order-item__chevron {
  transform: rotate(180deg);
}

/* ===== جزئیات ===== */

.order-item__details {
  @apply flex flex-col gap-4 border-t px-4 pb-5 pt-4 sm:px-5;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
}

.order-item__products {
  @apply flex flex-col gap-2;
}

.order-item__product {
  @apply flex items-center justify-center  gap-3 rounded-xl p-4 pl-3;
  background: color-mix(in srgb, var(--dash-primary) 6%, transparent);
}

.order-item__product-thumb {
  @apply h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--dash-primary) 15%, transparent);
}

.order-item__product-img {
  @apply h-full w-full object-cover;
}

.order-item__product-info {
  @apply flex min-w-0  flex-col gap-2;
}

.order-item__product-name {
  @apply truncate  font-bold;
  color: var(--dash-ink);
}

.order-item__product-qty {
  @apply w-fit rounded-lg  px-2 py-0.5 text-xs font-bold;
  background: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  color: var(--dash-primary-deep);
}

.order-item__product-price {
  @apply shrink-0  font-bold tabular-nums opacity-70;
  color: var(--dash-ink);
}

.order-item__no-products {
  @apply text-xs opacity-50;
  color: var(--dash-ink);
}

.order-item__product-qty {
  @apply shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold;
  background: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  color: var(--dash-primary-deep);
}

.order-item__product-name {
  @apply truncate opacity-85;
}

.order-item__no-products {
  @apply text-xs opacity-50;
}

/* ===== رسید قیمت ===== */

.order-item__receipt {
  @apply flex flex-col gap-1.5 rounded-xl px-3 py-3 text-sm;
  background: color-mix(in srgb, var(--dash-primary) 5%, transparent);
  color: var(--dash-ink);
}

.order-item__receipt-row {
  @apply flex items-center justify-between opacity-70;
}

.order-item__receipt-row--discount {
  color: #c0392b;
  opacity: 0.85;
}

.order-item__receipt-divider {
  @apply my-1 border-t border-dashed;
  border-color: color-mix(in srgb, var(--dash-primary) 25%, transparent);
}

.order-item__receipt-row--total {
  @apply text-base font-bold opacity-100;
  color: var(--dash-primary-deep);
}

/* ===== اکشن‌ها ===== */

.order-item__actions {
  @apply flex justify-end;
}

.order-item__delete {
  @apply flex items-center flex-1 border border-dashed border-red-600 justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-bold text-red-600 transition;
}

.order-item__delete:hover {
  @apply bg-red-50;
}

.order-expand-enter-active,
.order-expand-leave-active {
  transition: grid-template-rows 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .order-item__chevron,
  .order-item__pulse {
    transition: none;
    animation: none;
  }
}

.order-item__product-meta {
  @apply flex flex-wrap items-center gap-1.5;
}

.order-item__product-qty {
  @apply shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold;
  background: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  color: var(--dash-primary-deep);
}

.order-item__product-unit {
  @apply text-xs opacity-55 tabular-nums;
  color: var(--dash-ink);
}
</style>
