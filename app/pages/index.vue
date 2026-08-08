<script setup lang="ts">
import type { CategoryOut, BlogListItem } from "~/types";
import { BlogStatus } from "~/types";

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
});
useHead({
  link: [{ rel: "canonical", href: "https://sohangaz.com/" }],
});
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
]);

const { data, isLoading, error } = useAllCategory() as unknown as {
  data: CategoryOut[] | undefined;
  isLoading: boolean;
  error: unknown;
};

const {
  data: blogsResponse,
  isLoading: blogsLoading,
  error: blogsError,
} = useAllBlogs({
  per_page: 4,
});

const blogs = computed<BlogListItem[]>(
  () => (blogsResponse.value as any)?.blogs ?? [],
);

const sliderKey = ref(0);

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    sliderKey.value++;
  }, 700);
});
</script>

<template>
  <main class="parent-page index">
    <SliderIndex :key="sliderKey" />
    <TitlePage
      text-one="فروشگاه"
      text-two="سوهان و گز حلما وفایی"
      text-three="طعم اصیل سوهان و گز"
      text-four="سوغات دست نخورده ایران"
      seo="فروشگاه سوهان و گز حلما وفایی طعم اصیل سوهان و گز سوغات دست‌ نخورده‌ی ایران"
    />
    <section
      v-if="isLoading"
      v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
      class="flex flex-col items-center gap-5 font-bold text-2xl p-10 w-full"
    >
      <div class="loader"></div>
      <p>در حال دریافت محصولات ...</p>
    </section>

    <section
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
    </section>
    <section v-else-if="data?.length === 0">
      <p>هیچ دسته بندی ای وجود ندارد</p>
    </section>
    <section class="parent-cards" v-else>
      <CardCategory
        v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
        :category="item"
        v-for="item in data"
        :key="item.id"
      />
    </section>

    <section
      v-if="!blogsError"
      class="w-full flex flex-col gap-8 py-14 pt-5 px-4 md:px-10"
    >
      <div
        v-animate="{ type: 'blurIn', delay: 300, duration: 800, once: true }"
        class="flex flex-col items-center gap-3 text-center"
      >
        <span class="text-[--gold-one] font-semibold text-sm">
          وبلاگ سوهان و گز حلما
        </span>
        <h2
          class="text-2xl md:text-3xl font-black text-neutral-800 dark:text-neutral-100"
        >
          آخرین مطالب وبلاگ
        </h2>
        <p
          class="text-neutral-500 dark:text-neutral-400 max-w-xl text-wrap text-center"
        >
          نکات، دستور پخت و داستان سوغات اصیل ایرانی را در وبلاگ ما بخوانید
        </p>
      </div>

      <div class="flex flex-wrap gap-6 w-full justify-center items-center">
        <template v-if="blogsLoading">
          <div
            v-animate="{
              type: 'blurIn',
              delay: 700,
              duration: 1000,
              once: true,
            }"
            class="flex flex-col items-center gap-5 font-bold text-2xl p-10 w-full"
          >
            <div class="loader"></div>
            <p class="text-lg">در حال دریافت وبلاگ ...</p>
          </div>
        </template>

        <template v-else-if="blogs.length > 0">
          <BlogCard
            v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
            class="max-w-[300px]"
            v-for="item in blogs"
            :key="item.id"
            :blog="item"
          />
        </template>

        <p v-else class="col-span-full text-center text-neutral-400">
          هنوز مطلبی منتشر نشده است
        </p>
      </div>
    </section>
  </main>
</template>
