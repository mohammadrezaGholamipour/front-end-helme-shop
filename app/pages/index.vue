<script setup lang="ts">
import type { CategoryOut } from "~/types";
const { data, isLoading, error } = useAllCategory() as unknown as {
  data: CategoryOut[] | undefined;
  isLoading: boolean;
  error: unknown;
};

useSeoMeta({
  title: "فروشگاه آنلاین سوهان و گز حلما | طعم اصیل سوغات",
  ogTitle: "فروشگاه آنلاین سوهان و گز حلما",
  description:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت. ارسال تازه و سریع از قم و اصفهان به سراسر ایران.",
  ogDescription:
    "خرید اینترنتی انواع سوهان و گز درجه یک با بهترین قیمت. ارسال تازه و سریع.",
  keywords: "سوهان قم, خرید گز اصفهان, سوغات سنتی, خرید سوهان آنلاین, قیمت گز",
  ogImage: "https://sohangaz.com/images/helma-logo.webp",
  twitterCard: "summary_large_image",
});
useSchemaOrg([
  defineWebSite({
    name: "سوهان و گز حلما",
    description: "فروشگاه سوغات سنتی ایران",
  }),
  defineOrganization({
    name: "سوهان و گز حلما",
    logo: "https://sohangaz.com/images/helma-logo.webp",
    url: "https://sohangaz.com",
  }),
]);
</script>
<template>
  <div class="parent-page">
    <header class="sr-only">
      <h1>مرکز فروش سوهان و گز حلما - ارسال مستقیم سوغات</h1>
    </header>
    <div v-if="isLoading">Loading...</div>

    <div v-else-if="data?.length === 0">
      <p>هیچ دسته بندی ای وجود ندارد</p>
    </div>

    <template v-else>
      <CardCategory
        v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
        :category="item"
        v-for="item in data"
        :key="item.id"
      />
    </template>
  </div>
</template>
