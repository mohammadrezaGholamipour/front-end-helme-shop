<script setup lang="ts">
import type { CategoryOut } from "~/types";

useSeoMeta({
  title: "فروشگاه سوهان و گز حلما وفایی | طعم اصیل سوغات",
  ogTitle: "فروشگاه سوهان و گز حلما وفایی | طعم اصیل سوغات",
  description:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت | ارسال تازه و سریع به سراسر ایران",
  ogDescription:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت | ارسال تازه و سریع",
  ogSiteName: "فروشگاه سوهان و گز حلما وفایی",
  ogImage: "https://sohangaz.com/images/helma-logo-og.jpg",
  ogUrl: "https://sohangaz.com/",
  twitterCard: "summary_large_image",
  twitterTitle: "فروشگاه سوهان و گز حلما وفایی | طعم اصیل سوغات",
  twitterDescription:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت | ارسال تازه و سریع به سراسر ایران",
  twitterImage: "https://sohangaz.com/images/helma-logo-og.jpg",
})
useHead({
  link: [
    { rel: "canonical", href: "https://sohangaz.com/" },
  ],
})
useSchemaOrg([
  defineWebSite({
    name: "فروشگاه سوهان و گز حلما وفایی",
    description: "فروشگاه سوغات سنتی ایران",
    url: "https://sohangaz.com",
  }),
  defineOrganization({
    name: "فروشگاه سوهان و گز حلما وفایی",
    logo: "https://sohangaz.com/images/helma-logo-og.jpg",
    url: "https://sohangaz.com",
    sameAs: [],
  }),
])


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
    <TitlePage
      text-one="فروشگاه"
      text-two="سوهان و گز حلما وفایی"
      text-three="طعم اصیل سوهان و گز"
      text-four="سوغات دست نخورده ایران"
      seo="فروشگاه سوهان و گز حلما وفایی طعم اصیل سوهان و گز سوغات دست‌ نخورده‌ی ایران"
    />
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
