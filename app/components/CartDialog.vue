<script setup lang="ts">
import { computed } from "vue";
import { useCartStore } from "~/stores/cart";

const modelValue = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

const cartStore = useCartStore();

const visible = computed({
  get: () => modelValue.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const imageSrc = (image: string | null) => {
  if (!image) return "/images/not-found-light.png";
  return image.startsWith("http") ? image : `https://sohangaz.com${image}`;
};

const handleClose = (): void => {
  visible.value = false;
};

const handleDecrease = (item: (typeof cartStore.cartItems)[number]) => {
  cartStore.decreaseQuantity(item.id, item.variantId);
};

const handleIncrease = (item: (typeof cartStore.cartItems)[number]) => {
  cartStore.increaseQuantity(item.id, item.variantId);
};

const handleRemove = (item: (typeof cartStore.cartItems)[number]) => {
  cartStore.removeFromCart(item.id, item.variantId);
};
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div v-if="visible" class="cart-backdrop" @click="handleClose" />
    </Transition>

    <Transition name="drawer-slide">
      <div v-if="visible" dir="rtl" class="cart-drawer" @click.stop>
        <header class="cart-header">
          <div class="cart-header__titles">
            <span class="cart-header__eyebrow">سبد خرید</span>
            <h2 class="cart-header__title">
              {{ cartStore.totalItems }} کالا در سبد شما
            </h2>
          </div>

          <button
            class="cart-close-btn"
            aria-label="بستن سبد خرید"
            @click="handleClose"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="cart-close-btn__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div class="cart-body">
          <template v-if="cartStore.cartItems.length">
            <div class="cart-items">
              <article
                v-for="item in cartStore.cartItems"
                :key="`${item.id}-${item.variantId ?? 'base'}`"
                class="cart-item"
              >
                <div class="cart-item__media">
                  <img
                    :src="imageSrc(item.image)"
                    :alt="item.name"
                    class="cart-item__image"
                  />
                </div>

                <div class="cart-item__body">
                  <div class="cart-item__top">
                    <h3 class="cart-item__name">{{ item.name }}</h3>

                    <button
                      class="cart-item__remove"
                      aria-label="حذف از سبد خرید"
                      @click="handleRemove(item)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="cart-item__remove-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.8"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7h12z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="cart-item__prices">
                    <span class="cart-item__total-price">
                      {{
                        (item.price * item.quantity).toLocaleString("fa-IR")
                      }}
                      تومان
                    </span>
                  </div>

                  <div class="cart-item__footer">
                    <div class="cart-stepper">
                      <button
                        class="cart-stepper__btn"
                        aria-label="کاهش تعداد"
                        @click="handleDecrease(item)"
                      >
                        −
                      </button>
                      <span class="cart-stepper__value">{{
                        item.quantity
                      }}</span>
                      <button
                        class="cart-stepper__btn"
                        aria-label="افزایش تعداد"
                        @click="handleIncrease(item)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </template>

          <template v-else>
            <div class="cart-empty">
              <div class="cart-empty__icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="cart-empty__icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 4a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z"
                  />
                </svg>
              </div>
              <p class="cart-empty__title">سبد خرید شما خالی است</p>
              <p class="cart-empty__subtitle">
                هر زمان آماده بودید، می‌توانید محصولات را به سبد اضافه کنید.
              </p>
              <nuxt-link to="/product">
                <button class="cart-empty__cta" @click="handleClose">
                  مشاهده محصولات
                </button>
              </nuxt-link>
            </div>
          </template>
        </div>

        <footer v-if="cartStore.cartItems.length" class="cart-footer">
          <div class="cart-footer__summary">
            <span class="cart-footer__label">مجموع سبد خرید</span>
            <span class="cart-footer__value">
              {{ cartStore.totalPrice.toLocaleString("fa-IR") }} تومان
            </span>
          </div>

          <button class="cart-footer__checkout" @click="handleClose">
            ادامه فرآیند خرید
          </button>
          <button class="cart-footer__continue" @click="handleClose">
            بازگشت و ادامه خرید
          </button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ===== Overlay ===== */
.cart-backdrop {
  @apply fixed inset-0 z-50 bg-black/55 backdrop-blur-sm dark:bg-black/70;
}

/* ===== Drawer shell ===== */
.cart-drawer {
  @apply fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-gray-900;
}

/* ===== Header ===== */
.cart-header {
  @apply flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800;
}

.cart-header__titles {
  @apply flex flex-col gap-1;
}

.cart-header__eyebrow {
  @apply text-xs font-semibold tracking-wide text-[var(--gold-one)];
}

.cart-header__title {
  @apply text-lg font-bold text-gray-900 dark:text-gray-50 tabular-nums;
}

.cart-close-btn {
  @apply flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-200 dark:text-gray-400;
  @apply hover:bg-gray-100 hover:text-gray-900 hover:rotate-90 dark:hover:bg-gray-800 dark:hover:text-gray-50;
}

.cart-close-btn__icon {
  @apply h-5 w-5;
}

/* ===== Body / list ===== */
.cart-body {
  @apply flex-1 overflow-y-auto px-6 py-5;
}

.cart-items {
  @apply flex flex-col gap-4;
}

.cart-item {
  @apply flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 dark:border-gray-800 dark:bg-gray-800/40;
  box-shadow: 0 1px 2px rgba(15, 15, 15, 0.04);
}

.cart-item:hover {
  box-shadow: 0 8px 24px rgba(15, 15, 15, 0.07);
}

:global(.dark) .cart-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.cart-item__media {
  @apply relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900;
}

.cart-item__image {
  @apply h-full w-full object-cover;
}

.cart-item__body {
  @apply flex flex-1 flex-col gap-2.5 min-w-0;
}

.cart-item__top {
  @apply flex items-start justify-between gap-3;
}

.cart-item__name {
  @apply text-base font-bold leading-6 text-gray-900 line-clamp-2 dark:text-gray-50;
}

.cart-item__remove {
  @apply flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition duration-200 dark:text-gray-500;
  @apply hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400;
}

.cart-item__remove-icon {
  @apply h-4 w-4;
}

.cart-item__prices {
  @apply flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400;
}

.cart-item__unit-price {
  @apply text-gray-400 line-through decoration-gray-300 dark:text-gray-500 dark:decoration-gray-600;
}

.cart-item__total-price {
  @apply text-sm font-bold text-gray-900 dark:text-gray-50 tabular-nums;
}

.cart-item__footer {
  @apply mt-1 flex items-center justify-between;
}

.cart-stepper {
  @apply flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900;
}

.cart-stepper__btn {
  @apply flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-[var(--gold-one)] shadow-sm transition duration-150 dark:bg-gray-800;
  @apply hover:bg-[var(--gold-one)] hover:text-white active:scale-95;
}

.cart-stepper__value {
  @apply min-w-[28px] text-center text-sm font-bold text-gray-900 dark:text-gray-50;
}

/* ===== Empty state ===== */
.cart-empty {
  @apply flex h-full min-h-[380px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center dark:border-gray-700 dark:bg-gray-800/30;
}

.cart-empty__icon-wrap {
  @apply mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800;
}

.cart-empty__icon {
  @apply h-8 w-8 text-[var(--gold-one)];
}

.cart-empty__title {
  @apply text-xl font-bold text-gray-900 dark:text-gray-50;
}

.cart-empty__subtitle {
  @apply max-w-xs text-sm leading-7 text-gray-500 dark:text-gray-400 text-wrap;
}

.cart-empty__cta {
  @apply mt-3 rounded-2xl border border-[var(--gold-one)] px-5 py-2.5 text-sm font-bold text-[var(--gold-one)] transition duration-200;
  @apply hover:bg-[var(--gold-one)] hover:text-white;
}

/* ===== Footer ===== */
.cart-footer {
  @apply flex flex-col gap-3 border-t border-gray-100 px-6 py-5 dark:border-gray-800;
}

.cart-footer__summary {
  @apply flex items-center justify-between;
}

.cart-footer__label {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.cart-footer__value {
  @apply text-lg font-bold text-gray-900 dark:text-gray-50 tabular-nums;
}

.cart-footer__checkout {
  @apply w-full rounded-2xl px-4 py-3.5 text-sm font-bold text-white shadow-md transition duration-200;
  background: linear-gradient(135deg, var(--gold-one) 0%, #b8873f 100%);
}

.cart-footer__checkout:hover {
  @apply shadow-lg;
  filter: brightness(1.05);
}

.cart-footer__continue {
  @apply w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition duration-200 dark:border-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50;
}

/* ===== Transitions ===== */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 200ms ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
