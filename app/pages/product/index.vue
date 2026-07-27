<script setup lang="ts">
import type { LocationQueryValue } from "vue-router";
const route = useRoute();

const { data: products, isLoading, error } = useProduct();
useSearchSeo(
  () => route.query.q as string | undefined,
  () => products.value?.length,
);


function getLabel(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
  labels: Record<string, string>,
) {
  const key = Array.isArray(value) ? value[0] : value;

  if (typeof key !== "string") {
    return undefined;
  }

  return labels[key] ?? key;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  SOHAN: "سوهان",
  GAZ: "گز",
};

const PRODUCT_MODEL_LABELS: Record<string, string> = {
  HOBEH: "حبه‌ای",
  BAGHLAVAEI: "باقلوایی",
  GOL: "گل",
  SEKKEI: "سکه‌ای",
  LOGHMEH: "لقمه‌ای",
  MEDADI: "مدادی",
  COMBINATION: "ترکیبی از چند مدل",
};

const OIL_TYPE_LABELS: Record<string, string> = {
  ANIMAL_OIL: "روغن حیوانی",
  VEGETABLE_BUTTER: "کره گیاهی",
  NABATI_OIL: "روغن نباتی",
};

const handleFirstLineTitle = computed(() => {
  const productType = getLabel(route.query.product_type, PRODUCT_TYPE_LABELS);
  const productModel = getLabel(route.query.product_model, PRODUCT_MODEL_LABELS);
  const oilType = getLabel(route.query.oil_type, OIL_TYPE_LABELS);

  const parts = [productType, productModel];

  if (oilType) {
    parts.push(`با ${oilType}`);
  }

  return parts.length
    ? `لیستی از محصولات ${parts.join(" ")}`
    : "لیستی از تمامی محصولات";
});
</script>

<template>
  <div class="parent-page">
    <TitlePage
      v-if="!!products?.length"
      :text-one="handleFirstLineTitle"
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
