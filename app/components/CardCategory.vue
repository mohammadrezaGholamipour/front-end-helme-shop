<script setup lang="ts">
import product from "~/assets/images/product.png";
</script>
<template>
  <div class="category-card">
    <img :src="product" alt="category" />
    <p>سوهان</p>
    
    <button>
      <p>مشاهده بیشتر</p>
      <Icon name="tabler:basket-filled" class="w-6 h-6" />
    </button>
  </div>
</template>
