<script setup lang="ts">
import type { ProductOut } from "~/types";

const props = defineProps<{ product: ProductOut }>();
</script>

<template>
  <div class="product-card">
    <div class="product-card__bg"></div>
    <img
      :src="`https://sohangaz.com${props.product.image}`"
      :alt="props.product.name"
      height="220"
      width="220"
    />
    <h2>{{ props.product.name }}</h2>
    <p>{{ props.product.description }}</p>
    <nuxt-link
      class="product-card__button"
      :to="`/product/${props.product.slug}`"
    >
      <p>مشاهده محصول</p>
      <Icon name="tabler:basket-filled" class="w-6 h-6" />
    </nuxt-link>
  </div>
</template>

<style scoped>
.product-card {
  @apply rounded-2xl relative bg-white  dark:bg-black dark:text-white text-xl p-5 border-2 shadow-md border-[var(--gold-two)] flex flex-col justify-between items-center gap-5  !flex-1 max-w-[300px];
}

.product-card__bg {
  @apply absolute w-full h-full z-[-1] bottom-0 rounded-lg;
  background: linear-gradient(
    135deg,
    #cecece 0%,
    #cecece 5%,
    transparent 5%,
    transparent 10%,
    #cecece 10%,
    #cecece 15%,
    transparent 15%,
    transparent 20%,
    #cecece 20%,
    #cecece 25%,
    transparent 25%,
    transparent 30%,
    #cecece 30%,
    #cecece 35%,
    transparent 35%,
    transparent 40%,
    #cecece 40%,
    #cecece 45%,
    transparent 45%,
    transparent 50%,
    #cecece 50%,
    #cecece 55%,
    transparent 55%,
    transparent 60%,
    #cecece 60%,
    #cecece 65%,
    transparent 65%,
    transparent 70%,
    #cecece 70%,
    #cecece 75%,
    transparent 70%,
    transparent 80%,
    #cecece 80%,
    #cecece 85%,
    transparent 85%,
    transparent 90%,
    #cecece 90%,
    #cecece 95%,
    transparent 95%
  );
  background-size: 1.5em 1.5em;
  background-color: #eff6ff;
  opacity: 0.15;
}

.product-card > img {
  @apply rounded-xl  shadow-md;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.product-card > h2 {
  @apply font-bold text-2xl;
}

.product-card > P:last-of-type {
  @apply font-normal text-sm w-full text-wrap text-center leading-10 line-clamp-3;
}

.product-card__button {
  @apply flex p-3 w-full justify-center rounded-xl items-center gap-2  font-bold text-white shadow-md;
  background-image: var(--gold-gradiant);
}
</style>
