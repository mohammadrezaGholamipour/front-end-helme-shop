<script setup lang="ts">
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge.vue";
import SohanSeal from "@/components/dashboard/SohanSeal.vue";

const { data: orders, isPending, isError, refetch } = useOrders();
const expandedId = ref<number | null>(null);

function toggle(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
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
        :key="order.id"
        class="order-item"
        :class="{ 'order-item--open': expandedId === order.id }"
      >
        <button
          type="button"
          class="order-item__summary"
          @click="toggle(order.id)"
        >
          <span class="order-item__id">
            <Icon name="tabler:receipt" class="h-4 w-4" />
            سفارش #{{ order.id }}
          </span>

          <OrderStatusBadge :status="order.status" />

          <span class="order-item__payable">{{ formatAmount(order.payable_amount) }}</span>

          <Icon
            name="tabler:chevron-down"
            class="order-item__chevron h-4 w-4"
          />
        </button>

        <Transition name="order-expand">
          <div v-if="expandedId === order.id" class="order-item__details">
            <div class="order-item__amounts">
              <div class="order-item__amount-row">
                <span>جمع سبد</span>
                <span>{{ formatAmount(order.total_amount) }}</span>
              </div>
              <div class="order-item__amount-row">
                <span>تخفیف</span>
                <span>{{ formatAmount(order.discount_amount) }}</span>
              </div>
              <div class="order-item__amount-row">
                <span>هزینه ارسال</span>
                <span>{{ formatAmount(order.shipping_amount) }}</span>
              </div>
              <div class="order-item__amount-row order-item__amount-row--total">
                <span>مبلغ قابل پرداخت</span>
                <span>{{ formatAmount(order.payable_amount) }}</span>
              </div>
            </div>

            <div v-if="order.items?.length" class="order-item__products">
              <div
                v-for="(item, idx) in order.items"
                :key="item.id ?? idx"
                class="order-item__product"
              >
                <span>{{ item.title ?? item.product_name ?? "کالا" }}</span>
                <span v-if="item.quantity" class="order-item__product-qty">
                  × {{ item.quantity }}
                </span>
              </div>
            </div>
            <p v-else class="order-item__no-products">
              جزئیات اقلام این سفارش موجود نیست.
            </p>
          </div>
        </Transition>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.orders-list__loading {
  @apply flex flex-col gap-3;
}

.orders-list__skeleton {
  @apply h-16 animate-pulse rounded-2xl;
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

.orders-list__items {
  @apply flex flex-col gap-3;
}

.order-item {
  @apply overflow-hidden rounded-2xl border transition;
  border-color: color-mix(in srgb, var(--dash-primary) 16%, transparent);
  background: var(--dash-surface);
}

.order-item--open {
  border-color: color-mix(in srgb, var(--dash-primary) 45%, transparent);
}

.order-item__summary {
  @apply flex w-full items-center gap-3 px-4 py-4 text-right sm:px-5;
}

.order-item__id {
  @apply flex items-center gap-1.5 text-sm font-bold;
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

.order-item__details {
  @apply flex flex-col gap-4 border-t px-4 pb-5 pt-4 sm:px-5;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
}

.order-item__amounts {
  @apply flex flex-col gap-2 text-sm;
  color: var(--dash-ink);
}

.order-item__amount-row {
  @apply flex items-center justify-between opacity-70;
}

.order-item__amount-row--total {
  @apply border-t pt-2 text-sm font-bold opacity-100;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
  color: var(--dash-primary-deep);
}

.order-item__products {
  @apply flex flex-col gap-1.5 border-t pt-3 text-sm;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
  color: var(--dash-ink);
}

.order-item__product {
  @apply flex items-center justify-between opacity-80;
}

.order-item__product-qty {
  @apply opacity-60;
}

.order-item__no-products {
  @apply border-t pt-3 text-xs opacity-50;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
  color: var(--dash-ink);
}

.order-expand-enter-active,
.order-expand-leave-active {
  transition: grid-template-rows 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .order-item__chevron {
    transition: none;
  }
}
</style>