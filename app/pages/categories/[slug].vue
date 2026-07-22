<script setup lang="ts">
import type { CategorySlugOut, TitleItem } from "~/types";
import { useRoute } from "vue-router";

const route = useRoute();
const name = route.params.slug as string;
const { data, isLoading, error } = useCategorySlug(name) as unknown as {
  data: Ref<CategorySlugOut | undefined>;
  isLoading: boolean;
  error: unknown;
};

const category = computed(() => data.value?.category);
useCategorySeo(category);

const title: Record<string, TitleItem> = {
  "sohan-nabati": {
    textOne: "سوهان نباتی از انتخاب‌های پرطرفدار",
    textTwo: "در میان علاقه‌مندان به شیرینی‌های سنتی ایرانی است",
    srOnly:
      "خرید سوهان نباتی حلما وفایی در این دسته‌بندی می‌توانید انواع سوهان نباتی از جمله سوهان نباتی لقمه‌ای،سوهان نباتی گل،سوهان نباتی سکه‌ای و سوهان نباتی باقلوایی را مشاهده و انتخاب کنید",
  },
  "sohan-kareh-giyahi": {
    textOne: "سوهان کره گیاهی با کیفیتی ممتاز و طعمی ماندگار",
    textTwo: "تجربه‌ای متفاوت از شیرینی اصیل ایرانی را ارائه می‌دهد.",
    srOnly:
      "خرید سوهان کره گیاهی حلما وفایی در این دسته‌بندی می‌توانید انواع سوهان کره گیاهی از جمله سوهان کره گیاهی لقمه‌ای،سوهان کره گیاهی گل،سوهان کره گیاهی سکه‌ای و سوهان کره گیاهی باقلوایی را مشاهده و انتخاب کنید",
  },
  "sohan-roghan-heyvani": {
    textOne: "یکی از پرطرفدارترین گزینه‌ها برای خرید",
    textTwo: "سوهان روغن حیوانی با عطر دلپذیر، بافتی ترد و طعمی اصیل",
    srOnly:
      "خرید سوهان روغن حیوانی حلما وفایی در این دسته‌بندی می‌توانید انواع سوهان روغن حیوانی از جمله سوهان روغن حیوانی لقمه‌ای،سوهان روغن حیوانی گل،سوهان روغن حیوانی سکه‌ای و سوهان روغن حیوانی باقلوایی را مشاهده و انتخاب کنید",
  },
  "gaz-faleh": {
    textOne: "یکی از بهترین گزینه‌ها برای خرید گز سنتی به‌صورت کیلویی",
    textTwo: "با کیفیت، تازگی و تنوع در درصد مغز",
    srOnly:
      "خرید گز فله‌ای حلما وفایی؛ در این دسته‌بندی می‌توانید انواع گز فله‌ای از جمله گز فله ۱۸ درصد پسته، گز فله ۲۸ درصد پسته، گز فله ۴۰ درصد پسته، گز زعفرانی ۴۰ درصد پسته، گز پسته و بادام ۲۸ درصد و گز ۲۸ درصد بادام را مشاهده و انتخاب کنید.",
  },
};
</script>

<template>
  <div class="parent-page">
    <TitlePage
      :text-one="title[name]?.['textOne']"
      :text-two="title[name]?.['textTwo']"
      :seo="title[name]?.['srOnly']"
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
