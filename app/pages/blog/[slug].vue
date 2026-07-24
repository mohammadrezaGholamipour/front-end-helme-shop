<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: blog, isPending, isError, refetch } = useBlog(slug);

useBlogSeo(blog);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
    class="blog-detail"
  >
    <div
      v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
      v-if="isPending"
      class="flex flex-col items-center gap-5 text-2xl p-10 w-full"
    >
      <div class="loader"></div>
      <p>در حال دریافت مقاله ...</p>
    </div>

    <div
      v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
      v-else-if="isError"
      class="blog-detail__state"
    >
      <Icon name="mdi:alert-circle-outline" class="blog-detail__state-icon" />
      <p class="blog-detail__state-text">مشکلی در دریافت مقاله پیش آمد.</p>
      <button
        type="button"
        class="blog-detail__state-retry"
        @click="() => refetch()"
      >
        تلاش مجدد
      </button>
    </div>

    <div
      v-animate="{ type: 'blurIn', delay: 700, duration: 1000, once: true }"
      v-else-if="!blog"
      class="blog-detail__state"
    >
      <Icon name="mdi:file-search-outline" class="blog-detail__state-icon" />
      <p class="blog-detail__state-text">مقاله‌ی مورد نظر پیدا نشد.</p>
      <NuxtLink to="/blog" class="blog-detail__state-retry">
        بازگشت به صفحه وبلاگ ها
      </NuxtLink>
    </div>

    <template v-else>
      <section class="blog-detail__hero">
        <img
          v-if="blog.image"
          :src="`https://sohangaz.com${blog.image}`"
          :alt="blog.title"
          class="blog-detail__hero-image"
        />
        <div class="blog-detail__hero-overlay" />

        <div class="blog-detail__hero-content">
          <NuxtLink
            v-if="blog.category"
            :to="`/blog?category=${blog.category.slug}`"
            class="blog-detail__category"
          >
            {{ blog.category.name }}
          </NuxtLink>

          <h1 class="blog-detail__title">{{ blog.title }}</h1>

          <div class="blog-detail__meta">
            <span class="blog-detail__meta-item">
              <Icon name="mdi:calendar-outline" />
              {{ formatDate(blog.published_at ?? blog.created_at) }}
            </span>
            <span v-if="blog.reading_time" class="blog-detail__meta-item">
              <Icon name="mdi:clock-outline" />
              {{ blog.reading_time }} دقیقه مطالعه
            </span>
            <span class="blog-detail__meta-item">
              <Icon name="mdi:eye-outline" />
              {{ blog.views }} بازدید
            </span>
          </div>
        </div>
      </section>

      <div class="blog-detail__container">
        <NuxtLink to="/blog" class="blog-detail__back">
          <Icon name="mdi:arrow-right" />
          بازگشت به صفحه وبلاگ ها
        </NuxtLink>

        <p v-if="blog.summary" class="blog-detail__summary">
          {{ blog.summary }}
        </p>

        <article class="blog-detail__content" v-html="blog.content" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.blog-detail {
  @apply pb-16 w-full max-w-[1000px];
}

.blog-detail__hero {
  @apply relative flex min-h-[320px] w-full items-end overflow-hidden rounded-md sm:min-h-[420px];
}

.blog-detail__hero-image {
  @apply absolute inset-0 h-full w-full object-cover;
}

.blog-detail__hero-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent;
}

.blog-detail__hero-content {
  @apply relative z-10 mx-auto flex w-full max-w-4xl flex-col items-start gap-3 px-4 pb-8 sm:px-6;
}

.blog-detail__category {
  @apply rounded-full bg-[--gold-one] px-3 py-1 text-xs font-medium text-white;
}

.blog-detail__title {
  @apply  text-right text-wrap line-clamp-2 text-white sm:text-4xl ;
}

.blog-detail__meta {
  @apply flex flex-wrap items-center gap-4 text-sm text-gray-200;
}

.blog-detail__meta-item {
  @apply flex items-center gap-1;
}

.blog-detail__container {
  @apply mx-auto max-w-4xl px-4 pt-8 sm:px-6;
}

.blog-detail__back {
  @apply mb-6 mt-2 w-full inline-flex justify-center items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pr-4 pl-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-[--gold-one] hover:text-[--gold-one] dark:border-white/10 dark:bg-white/5 dark:text-white;
}

.blog-detail__back-icon {
  @apply flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors dark:bg-white/10 dark:text-white;
}

.blog-detail__back:hover .blog-detail__back-icon {
  @apply bg-[--gold-one] text-white;
}

.blog-detail__summary {
  @apply mb-6 rounded-md text-wrap leading-7 text-justify border-r-4 border-[--gold-one] bg-gray-50 p-4 text-base text-gray-600 dark:bg-white/5 dark:text-white;
}

.blog-detail__content {
  @apply max-w-none text-wrap text-justify leading-10;
}

.blog-detail__state {
  @apply flex flex-col items-center gap-3 py-20 text-center;
}

.blog-detail__state-icon {
  @apply h-10 w-10 text-gray-300;
}

.blog-detail__state-text {
  @apply text-xl text-gray-500 dark:text-white;
}

.blog-detail__state-retry {
  @apply mt-1 rounded-full bg-[--gold-one] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[--gold-one];
}
</style>
