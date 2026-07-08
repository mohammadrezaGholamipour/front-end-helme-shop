<script setup lang="ts">
import type { ProductOut } from "~/types";

const props = defineProps<{ product: ProductOut }>();
</script>

<template>
  <div class="product-card">
    <img
      :src="`https://sohangaz.com${props.product.image}`"
      :alt="props.product.name"
      height="220"
      width="220"
    />
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
