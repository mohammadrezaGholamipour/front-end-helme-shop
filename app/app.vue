<script setup lang="ts">
// const { request } = useApi();
// const categories = await request("/category/me?application_id=1");
import product from "~/assets/images/product.png";
</script>
<template>
  <div>
    <div class="product-card">
      <img :src="product" width="200" alt="product" />
      <p>سوهان باقلوایی</p>
      <div>
        <Icon name="tabler:businessplan" class="w-6 h-6" />
        <p>550 گرم</p>
      </div>
      <div>
        <Icon name="tabler:receipt-2" class="w-6 h-6" />
        <p>756 تومان</p>
      </div>
      <button>
        <p>مشاهده محصول</p>
        <Icon name="tabler:shopping-cart" class="w-6 h-6" />
      </button>
    </div>
    <NuxtRouteAnnouncer />
  </div>
</template>
