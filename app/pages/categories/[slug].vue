<script setup lang="ts">
import type { CategorySlugOut, TitleItem } from "~/types";
import { useRoute } from "vue-router";

const route = useRoute();

const name = route.params.slug as string;
const { data, isLoading, error } = useCategorySlug(name) as unknown as {
  data: CategorySlugOut;
  isLoading: boolean;
  error: unknown;
};

const title: Record<string, TitleItem> = {
  "sohan-nabati": {
    textOne: "سوهان نباتی از انتخاب‌های پرطرفدار",
    textTwo: "در میان علاقه‌مندان به شیرینی‌های سنتی ایرانی است",
    textThree:
      "سوهان نباتی حلما وفایی با حفظ طعم اصیل، بافت ترد و کیفیت مناسب تهیه می‌شود تا تجربه‌ای خوشایند از خرید سوهان برای شما فراهم کند.",
  },
};

const srOnly =
  "خرید سوهان نباتی حلما وفایی در این دسته‌بندی می‌توانید انواع سوهان نباتی از جمله سوهان نباتی لقمه‌ای،سوهان نباتی گل،سوهان نباتی سکه‌ای و سوهان نباتی باقلوایی را مشاهده و انتخاب کنید";
</script>

<template>
  <div class="parent-page">
    <TitlePage
      :text-one="title[name]?.['textOne']"
      :text-two="title[name]?.['textTwo']"
      :text-three="title[name]?.['textThree']"
      :seo="srOnly"
    />
    <div v-if="isLoading">Loading...</div>
    <div
      class="flex flex-col gap-4 py-7 items-center"
      v-else-if="data?.products?.length === 0"
    >
      <img
        alt="فروشگاه سوهان و گز حلما"
        src="/images/helma-logo.webp"
        width="300"
      />
      <p class="dark:text-white text-xl">لیست محصولات خالی میباشد</p>
      <p class="dark:text-white text-sm animate-bounce">به زودی پر میشه !</p>
    </div>

    <div class="parent-cards" v-else>
      <CardProduct
        v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
        v-for="item in data?.products"
        :product="item"
        :key="item.id"
      />
    </div>
  </div>
</template>
