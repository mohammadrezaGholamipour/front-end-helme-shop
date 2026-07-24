<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const search = ref((route.query.q as string) ?? "");
const activeCategory = ref<string>((route.query.category as string) ?? "");
const page = computed(() => Number(route.query.page ?? 1));

const params = computed(() => ({
  page: page.value,
  per_page: 9,
  search: search.value || undefined,
  category: activeCategory.value || undefined,
}));

const { data, isPending, isError, refetch } = useAllBlogs(params);
const { data: categories } = useAllBlogCategories();

let debounceTimer: ReturnType<typeof setTimeout>;
watch(search, (value) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    router.push({
      query: { ...route.query, q: value || undefined, page: undefined },
    });
  }, 400);
});

function selectCategory(slug?: string) {
  activeCategory.value = activeCategory.value === slug ? "" : (slug ?? "");

  router.push({
    query: {
      ...route.query,
      category: activeCategory.value || undefined,
      page: undefined,
    },
  });
}

useBlogListSeo();
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
    class="blog-page"
  >
    <section class="blog-page__hero">
      <div class="blog-page__hero-inner">
        <h1 class="blog-page__title">وبلاگ</h1>
        <p class="blog-page__subtitle">
          آخرین مقالات، اخبار و راهنمای خرید را اینجا دنبال کنید
        </p>

        <div class="blog-page__search">
          <Icon name="mdi:magnify" class="blog-page__search-icon" />
          <input
            v-model="search"
            type="text"
            placeholder="جستجو در مقالات..."
            class="blog-page__search-input"
          />
        </div>
      </div>
    </section>

    <div class="blog-page__container">
      <div v-if="categories?.length" class="blog-page__filters">
        <button
          type="button"
          class="blog-page__filter"
          :class="{ 'blog-page__filter--active': !activeCategory }"
          @click="selectCategory()"
        >
          همه
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="blog-page__filter"
          :class="{
            'blog-page__filter--active': activeCategory === category.slug,
          }"
          @click="selectCategory(category.slug)"
        >
          {{ category.name }}
        </button>
      </div>

      <div
        v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
        v-if="isPending"
        class="flex flex-col items-center gap-5 text-2xl p-10 w-full"
      >
        <div class="loader"></div>
        <p>در حال دریافت مقالات ...</p>
      </div>

      <div
        v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
        v-else-if="isError"
        class="blog-page__state"
      >
        <Icon name="mdi:alert-circle-outline" class="blog-page__state-icon" />
        <p class="blog-page__state-text">مشکلی در دریافت مقالات پیش آمد.</p>
        <button
          type="button"
          class="blog-page__state-retry"
          @click="() => refetch()"
        >
          تلاش مجدد
        </button>
      </div>

      <div
        v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
        v-else-if="!data?.blogs?.length"
        class="blog-page__state"
      >
        <Icon name="mdi:file-search-outline" class="blog-page__state-icon" />
        <p class="blog-page__state-text">مقاله‌ای با این مشخصات پیدا نشد.</p>
      </div>

      <template v-else>
        <div
          v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
          class="blog-page__grid"
        >
          <BlogCard
            v-for="(blog, index) in data.blogs"
            :key="blog.id"
            :blog="blog"
            :priority="index < 3"
          />
        </div>

        <BlogPagination :current-page="data.page" :last-page="data.last_page" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  @apply pb-16 w-full;
}

.blog-page__hero {
  @apply bg-gradient-to-b  rounded-md to-white px-4 pb-3  pt-5;
}

.blog-page__hero-inner {
  @apply mx-auto flex max-w-2xl flex-col items-center gap-4 text-center;
}

.blog-page__title {
  @apply text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl;
}

.blog-page__subtitle {
  @apply text-sm text-gray-500 sm:text-base;
}

.blog-page__search {
  @apply relative mt-2 w-full max-w-md;
}

.blog-page__search-icon {
  @apply pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400;
}

.blog-page__search-input {
  @apply w-full rounded-full border border-gray-200 bg-white py-3 pr-11 pl-4 text-sm shadow-sm outline-none transition-colors;
}

.blog-page__container {
  @apply mx-auto max-w-6xl px-4 pt-8 sm:px-6;
}

.blog-page__filters {
  @apply flex flex-wrap gap-2 overflow-x-auto md:justify-center  pb-1;
}

.blog-page__filter {
  @apply whitespace-nowrap rounded-full  px-4 py-2 text-sm font-medium text-gray-600 border border-dashed dark:text-white transition-all ;
}

.blog-page__filter--active {
  @apply border-[--gold-one] bg-[--gold-one] text-white hover:text-white;
}

.blog-page__grid {
  @apply grid grid-cols-1 mt-10 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3;
}

.blog-page__state {
  @apply flex flex-col items-center gap-3 py-20 text-center;
}

.blog-page__state-icon {
  @apply h-10 w-10 text-gray-300;
}

.blog-page__state-text {
  @apply text-xl text-gray-500 dark:text-white;
}

.blog-page__state-retry {
  @apply mt-1 rounded-full bg-[--gold-one] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[--gold-one];
}
</style>
