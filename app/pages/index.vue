<script setup lang="ts">
import type { CategoryOut } from "~/types";

useSeoMeta({
  title: "فروشگاه سوهان و گز حلما وفایی | طعم اصیل سوغات",
  ogTitle: "فروشگاه سوهان و گز حلما وفایی | طعم اصیل سوغات",
  ogSiteName: "حلما شاپ",
  description:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت | ارسال تازه و سریع به سراسر ایران",
  ogDescription:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت | ارسال تازه و سریع",
  keywords: "سوهان, گز , سوغات سنتی, خرید سوهان آنلاین, قیمت گز",
  ogImage: "https://sohangaz.com/images/helma-logo-og.jpg",
  twitterCard: "summary_large_image",
});
useSchemaOrg([
  defineWebSite({
    name: "سوهان و گز حلما",
    description: "فروشگاه سوغات سنتی ایران",
  }),
  defineOrganization({
    name: "سوهان و گز حلما وفایی",
    logo: "https://sohangaz.com/images/helma-logo-og.jpg",
    url: "https://sohangaz.com",
  }),
]);

const { data } = useAllCategory() as unknown as {
  data: CategoryOut[] | undefined;
  isLoading: boolean;
  error: unknown;
};

const sliderKey = ref(0);

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    sliderKey.value++;
  }, 700);
});
</script>
<template>
  <div class="parent-page index">
    <SliderIndex :key="sliderKey" />
    <TitleIndex />
    <div v-if="data?.length === 0">
      <p>هیچ دسته بندی ای وجود ندارد</p>
    </div>
    <div class="parent-cards" v-else>
      <CardCategory
        v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
        :category="item"
        v-for="item in data"
        :key="item.id"
      />
    </div>
  </div>
</template>
