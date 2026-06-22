<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import type { ProductOut } from "~/types";

const route = useRoute();
const router = useRouter();

const id = Number(route.params.slug);
const { data, isLoading, error } = useProduct(id) as unknown as {
  data: ProductOut | undefined;
  isLoading: boolean;
  error: unknown;
};

function goBack() {
  router.back();
}
</script>

<template>
  <div class="product-page container">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">خطا در بارگذاری محصول</div>
    <div v-else-if="data">
      <button @click="goBack">بازگشت</button>
      <div class="product-detail">
        <img
          :src="data.image ? `http://130.185.73.247${data.image}` : ''"
          alt="product"
        />
        <h1>{{ data.name }}</h1>
        <p>قیمت: {{ data.price }} تومان</p>
        <p>وزن: {{ data.volume }} گرم</p>
        <p v-if="data.description">{{ data.description }}</p>
      </div>
    </div>
    <div v-else>
      <p>محصولی یافت نشد</p>
    </div>
  </div>
</template>
