<!-- pages/product/index.vue -->
<script setup lang="ts">
const { data: products, isLoading, error } = useProduct();
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
    class="parent-page"
  >
    <div v-if="isLoading">در اطلاعات...</div>

    <div
      class="flex flex-col justify-center items-center gap-3"
      v-else-if="error"
    >
      <img
        class="block dark:hidden rounded-lg w-full max-w-[500px]"
        src="/images/error-light.png"
        alt="خطا در دریافت اطلاعات"
      />

      <img
        class="hidden dark:block rounded-lg w-full max-w-[500px]"
        src="/images/error-dark.png"
        alt="خطا در دریافت اطلاعات"
      />
      <p
        class="text-2xl font-bold text-white w-full text-center bg-[--gold-one] p-4 rounded-md"
      >
        خطا در دریافت اطلاعات
      </p>
    </div>

    <div class="parent-cards !mb-0" v-else>
      <template v-if="products?.length">
        <CardProduct
          v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
          v-for="item in products"
          :product="item"
          :key="item.id"
        />
      </template>

      <div class="flex flex-col justify-center items-center gap-3" v-else>
        <img
          class="block dark:hidden rounded-lg w-full max-w-[500px]"
          src="/images/not-found-light.png"
          alt="خطا در دریافت اطلاعات"
        />

        <img
          class="hidden dark:block rounded-lg w-full max-w-[500px]"
          src="/images/not-found-dark.png"
          alt="خطا در دریافت اطلاعات"
        />
        <p
          class="text-2xl font-bold text-white w-full text-center bg-[--gold-one] p-4 rounded-md"
        >
          محصولی یافت نشد
        </p>
      </div>
    </div>
  </div>
</template>
