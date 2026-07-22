<!-- pages/product/index.vue -->
<script setup lang="ts">
const { data: products, isLoading, error } = useProduct();
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
    class="parent-page"
  >
    <div
      v-if="isLoading"
      v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
      class="flex flex-col items-center gap-5 font-bold text-2xl p-10 w-full"
    >
      <div class="loader"></div>
      <p>در حال دریافت محصولات ...</p>
    </div>

    <div
      class="flex flex-col justify-center items-center gap-3"
      v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
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

    <div
      class="parent-cards !mb-0"
      v-else
    >
      <template v-if="products?.length">
        <CardProduct
          v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
          v-for="item in products"
          :product="item"
          :key="item.id"
        />
      </template>
      <div v-else class="flex flex-col justify-center items-center gap-3">
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
<style scoped>
.loader {
  --c: no-repeat linear-gradient(#d6b46c 0 0);
  background:
    var(--c), var(--c), var(--c), var(--c), var(--c), var(--c), var(--c),
    var(--c), var(--c);
  background-size: 16px 16px;
  animation:
    l32-1 1s infinite,
    l32-2 1s infinite;
}
@keyframes l32-1 {
  0%,
  100% {
    width: 45px;
    height: 45px;
  }
  35%,
  65% {
    width: 65px;
    height: 65px;
  }
}
@keyframes l32-2 {
  0%,
  40% {
    background-position:
      0 0,
      0 50%,
      0 100%,
      50% 100%,
      100% 100%,
      100% 50%,
      100% 0,
      50% 0,
      50% 50%;
  }
  60%,
  100% {
    background-position:
      0 50%,
      0 100%,
      50% 100%,
      100% 100%,
      100% 50%,
      100% 0,
      50% 0,
      0 0,
      50% 50%;
  }
}
</style>
