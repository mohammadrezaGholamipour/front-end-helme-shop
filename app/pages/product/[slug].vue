<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { TransitionPresets, useTransition } from "@vueuse/core";
import type { ProductOut } from "~/types";

type ProductVariant = ProductOut["variants"][number];

type CartItem = {
  product: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
  };
  variant: {
    id: number;
    volume: number;
    price: number;
    stock: number;
  };
  count: number;
  lineTotal: number;
};

const route = useRoute();
const slug = String(route.params.slug);

const productQuery = useProduct(slug) as {
  data: Ref<ProductOut | null | undefined>;
  isLoading?: Ref<boolean>;
  error?: Ref<unknown>;
};

const product = computed<ProductOut | null>(
  () => productQuery.data.value ?? null,
);

const selectedVariantId = ref<number | null>(null);
const count = ref<number>(1);
const cartItems = ref<CartItem[]>([]);

watch(
  () => product.value?.variants,
  (variants) => {
    if (variants?.length && selectedVariantId.value === null) {
      const firstVariant = variants[0];
      if (!firstVariant) return;

      selectedVariantId.value = firstVariant.id;

      count.value = 1;
    }
  },
  { immediate: true },
);

const selectedVariant = computed<ProductVariant | null>(() => {
  const variants = product.value?.variants;
  if (!variants?.length) return null;

  return variants.find((item) => item.id === selectedVariantId.value) ?? null;
});

const currentUnitPrice = computed<number>(() => {
  return selectedVariant.value?.price ?? 0;
});

const totalPrice = computed<number>(() => {
  return currentUnitPrice.value * count.value;
});

const animatedTotalPrice = useTransition(totalPrice, {
  duration: 400,
  transition: TransitionPresets.easeOutCubic,
});

const displayAnimatedTotalPrice = computed<string>(() => {
  return Math.round(animatedTotalPrice.value).toLocaleString("fa-IR");
});

const isVariantActive = (variantId: number): boolean => {
  const variants = product.value?.variants ?? [];
  const firstVariantId = variants[0]?.id ?? null;

  return (selectedVariantId.value ?? firstVariantId) === variantId;
};

const selectVariant = (variantId: number): void => {
  selectedVariantId.value = variantId;
  count.value = 1;
};

const increaseCount = (): void => {
  if (!selectedVariant.value) return;
  if (count.value < selectedVariant.value.stock) {
    count.value += 1;
  }
};

const decreaseCount = (): void => {
  if (count.value > 1) {
    count.value -= 1;
  }
};

const handleAddToCart = (): void => {
  if (!selectedVariant.value || !product.value) return;

  const currentVariant = selectedVariant.value;
  const currentProduct = product.value;

  const existingIndex = cartItems.value.findIndex(
    (item) => item.variant.id === currentVariant.id,
  );

  if (existingIndex > -1) {
    const existingItem = cartItems.value[existingIndex];
    if (!existingItem) return;
    const newCount = Math.min(
      existingItem.count + count.value,
      currentVariant.stock,
    );

    cartItems.value[existingIndex] = {
      ...existingItem,
      count: newCount,
      lineTotal: currentVariant.price * newCount,
    };
  } else {
    cartItems.value.push({
      product: {
        id: currentProduct.id,
        name: currentProduct.name,
        slug: currentProduct.slug,
        image: currentProduct.image ?? null,
        description: currentProduct.description ?? null,
      },
      variant: {
        id: currentVariant.id,
        volume: currentVariant.volume,
        price: currentVariant.price,
        stock: currentVariant.stock,
      },
      count: count.value,
      lineTotal: currentVariant.price * count.value,
    });
  }

  const firstVariantId = currentProduct.variants?.[0]?.id ?? null;
  selectedVariantId.value = firstVariantId;
  count.value = 1;
};
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }"
    class="product-page"
  >
    <section class="product-page__image">
      <img
        :src="product?.image ? `https://sohangaz.com${product.image}` : ''"
        :alt="product?.name || 'product'"
        width="500"
      />
    </section>

    <div class="product-page__content">
      <section class="product-page__text">
        <h1>{{ product?.name }}</h1>
        <p>{{ product?.description }}</p>
      </section>

      <section class="product-page__info">
        <div
          v-for="text in [
            'تهیه شده از بهترین مواد اولیه',
            'بدون مواد نگهدارنده',
            'طعم سنتی و اصیل',
            'تازه و باکیفیت',
          ]"
          :key="text"
        >
          <p>{{ text }}</p>
          <Icon
            name="tabler:rosette-discount-check-filled"
            class="w-8 h-8 text-[--gold-one] cursor-pointer"
          />
        </div>
      </section>
      <section class="product-page__volume-and-count">
        <section class="product-page__volume">
          <p>وزن دلخواه خود را انتخاب کنید :</p>

          <section>
            <div
              v-for="item in product?.variants || []"
              :key="item.id"
              @click="selectVariant(item.id)"
              :class="[
                {
                  'product-page__volume--active': isVariantActive(item.id),
                },
              ]"
            >
              <p>{{ item.volume.toLocaleString("fa-IR") }} گرمی</p>

              <p class="tabular-nums">
                {{ item.price.toLocaleString("fa-IR") }} تومان
              </p>

              <p class="text-xs text-gray-500 tabular-nums">
                موجودی: {{ item.stock.toLocaleString("fa-IR") }}
              </p>
            </div>
          </section>
        </section>

        <section class="product-page__count">
          <p>چند بسته نیاز دارید؟</p>

          <div>
            <Icon
              @click="decreaseCount"
              name="tabler:square-rounded-minus-filled"
              class="w-10 h-10 text-[--gold-one] cursor-pointer"
              :class="{ 'opacity-50 pointer-events-none': count <= 1 }"
            />

            <p class="tabular-nums">{{ count.toLocaleString("fa-IR") }} عدد</p>

            <Icon
              @click="increaseCount"
              name="tabler:square-rounded-plus-filled"
              class="w-10 h-10 text-[--gold-one] cursor-pointer"
              :class="{
                'opacity-50 pointer-events-none':
                  !!selectedVariant && count >= selectedVariant.stock,
              }"
            />
          </div>
        </section>
      </section>

      <section class="product-page__price">
        <p class="tabular-nums">{{ displayAnimatedTotalPrice }} تومان</p>

        <p v-if="selectedVariant && product" class="tabular-nums">
          {{ count.toLocaleString("fa-IR") }} عدد
          {{ product.name }}
          {{ selectedVariant.volume.toLocaleString("fa-IR") }} گرمی
        </p>
      </section>

      <button
        class="product-page__Shopping-cart"
        :disabled="!selectedVariant"
        @click="handleAddToCart"
      >
        <p>افزودن به سبد خرید</p>
        <Icon name="tabler:shopping-cart-up" class="w-10 h-10" />
      </button>
      <section class="product-page__delivery">
        <div>
          <Icon name="tabler:lock-check" class="w-10 h-10 cursor-pointer" />
          <p>پرداخت امن</p>
        </div>
        <div>
          <Icon name="tabler:package" class="w-10 h-10 cursor-pointer" />
          <p>بسته بندی مناسب</p>
        </div>
        <div>
          <Icon
            name="tabler:rosette-discount-check"
            class="w-10 h-10 cursor-pointer"
          />
          <p>تضمین کیفیت محصول</p>
        </div>
        <div>
          <Icon name="tabler:truck-delivery" class="w-10 h-10 cursor-pointer" />
          <p>ارسال سریع سراسر کشور</p>
        </div>
      </section>
    </div>
  </div>
</template>
