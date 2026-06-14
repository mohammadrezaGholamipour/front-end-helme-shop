<script setup lang="ts">
import product from "~/assets/images/product.png";
</script>
<template>
  <div class="product-card">
    <img :src="product" alt="product" />
    <p>سوهان باقلوایی</p>
    <div>
      <Icon name="tabler:scale-filled" class="w-6 h-6" />
      <p>550 گرم</p>
    </div>
    <div>
      <Icon name="tabler:shopping-cart-filled" class="w-6 h-6" />
      <p>756 تومان</p>
    </div>
    <button>
      <p>مشاهده محصول</p>
      <Icon name="tabler:basket-filled" class="w-6 h-6" />
    </button>
  </div>
</template>
