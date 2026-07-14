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
