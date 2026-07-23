<script setup lang="ts">
const route = useRoute();
const searchQuery = computed(
  () => route.query.product_type as string | undefined,
);

const { data: products, isLoading, error } = useProduct();
useSearchSeo(
  searchQuery,
  computed(() => products.value?.length),
);
</script>

<template>
  <div class="parent-page">
    <TitlePage
      text-one="لیستی از تمامی محصولات"
      text-two="با کیفیت و تازه فروشگاه سوهان و گز حلما وفایی"
      text-three="همراه شیرینی لحظات شما"
      seo="لیستی از تمامی محصولات باکیفیت و تازه فروشگاه سوهان و گز حلما وفایی همراه شیرینی لحظمات شما"
    />
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

    <div class="parent-cards !mb-0" v-else>
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
