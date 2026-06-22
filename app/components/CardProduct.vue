<script setup lang="ts">
import type { ProductOut } from "~/types";
import productFallback from "~/assets/images/product.png";

const props = defineProps<{ product: ProductOut }>();

const imgSrc = () => {
  return props.product.image
    ? `http://130.185.73.247${props.product.image}`
    : productFallback;
};
</script>

<template>
  <div class="product-card">
    <img :src="imgSrc()" alt="product" />
    <p>{{ props.product.name }}</p>
    <div>
      <Icon name="tabler:scale-filled" class="w-6 h-6" />
      <p>{{ props.product.volume }} گرم</p>
    </div>
    <div>
      <Icon name="tabler:shopping-cart-filled" class="w-6 h-6" />
      <p>{{ props.product.price.toLocaleString() }} تومان</p>
    </div>
    <button>
      <p>مشاهده محصول</p>
      <Icon name="tabler:basket-filled" class="w-6 h-6" />
    </button>
  </div>
</template>
