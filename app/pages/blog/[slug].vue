<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: blog, isPending, isError, refetch } = useBlog(slug);

const { data: relatedData, isPending: relatedPending } = useAllBlogs(
  computed(() =>
    blog.value && blog.value.category
      ? { per_page: 6, category_id: blog.value.category.id }
      : undefined,
  ),
);

const relatedBlogs = computed(() =>
  (relatedData.value?.blogs ?? [])
    .filter((b) => b.slug !== blog.value?.slug)
    .slice(0, 4),
);

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

        <div v-if="blog.summary" class="blog-detail__summary-wrapper">
          <p class="blog-detail__summary">
            {{ blog.summary }}
          </p>
        </div>

        <article class="blog-detail__content" v-html="blog.content" />

        <section v-if="relatedBlogs.length || relatedPending" class="related">
          <h2 class="related__title">مطالب مرتبط</h2>

          <div v-if="relatedPending" class="related__loading">
            <div class="loader"></div>
            <span>در حال بارگذاری مطالب مرتبط ...</span>
          </div>

          <div v-else class="related__grid">
            <NuxtLink
              v-for="item in relatedBlogs"
              :key="item.slug"
              :to="`/blog/${item.slug}`"
              class="related__card"
            >
              <img
                v-if="item.image"
                :src="`https://sohangaz.com${item.image}`"
                :alt="item.title"
                class="related__card-image"
              />
              <div
                v-else
                class="related__card-image related__card-image--placeholder"
              >
                <Icon name="mdi:image-outline" />
              </div>

              <div class="related__card-body">
                <h3 class="related__card-title">{{ item.title }}</h3>
                <p v-if="item.summary" class="related__card-summary">
                  {{ item.summary }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style>
.blog-detail {
  @apply pb-7 w-full max-w-[1000px];
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
  @apply text-right text-wrap line-clamp-2 text-white sm:text-4xl;
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

.blog-detail {
  &__summary-wrapper {
    @apply mb-6 rounded-md border-r-4 border-[--gold-one] bg-gray-50 p-4 dark:bg-white/5;
  }

  &__summary {
    @apply line-clamp-2 text-base text-wrap leading-7 text-gray-600 dark:text-white;
  }
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

.related {
  @apply mx-auto max-w-4xl mt-12;
}

.related__title {
  @apply mb-4 text-right text-xl font-semibold;
}

.related__loading {
  @apply flex items-center gap-2 text-sm text-gray-500 dark:text-white;
}

.related__grid {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2;
}

.related__card {
  @apply flex items-start gap-3 rounded-md border border-gray-200 bg-white/80 p-3 transition-all hover:-translate-y-0.5 hover:border-[--gold-one] hover:shadow-md dark:border-white/10 dark:bg-white/5;
}

.related__card-image {
  @apply h-16 w-20 shrink-0 rounded-sm object-cover;
}

.related__card-image--placeholder {
  @apply flex items-center justify-center bg-gray-100 text-gray-300 dark:bg-white/10;
}

.related__card-body {
  @apply flex min-w-0 flex-1 flex-col gap-1;
}

.related__card-title {
  @apply line-clamp-2 text-wrap text-right text-sm font-medium text-gray-800 dark:text-white;
}

.related__card-summary {
  @apply line-clamp-2 text-wrap text-right text-xs leading-5 text-gray-500;
}

.blog-detail {
  &__content {
    @apply !text-black dark:!text-white w-full text-wrap  text-base;
    > * + * {
      @apply mt-6;
    }

    h2 {
      @apply text-3xl font-bold text-wrap mt-12 mb-5;
    }

    h3 {
      @apply text-2xl font-semibold text-wrap  mt-10 mb-4;
    }

    h4 {
      @apply text-xl font-semibold mt-8 mb-3;
    }

    p {
      @apply leading-8  !text-wrap;
    }

    strong {
      @apply font-bold;
    }

    em {
      @apply italic;
    }

    a {
      @apply text-[--gold-one] font-medium underline underline-offset-4 transition;

      &:hover {
        @apply text-[--gold-one];
      }
    }

    ul,
    ol {
      @apply my-6 space-y-3 ps-6;
    }

    ul {
      @apply list-disc;
    }

    ol {
      @apply list-decimal;
    }

    li {
      @apply leading-8;
    }

    blockquote {
      @apply border-s-4 border-[--gold-one] bg-gray-50 py-4 px-5 italic rounded-e-lg my-8;
    }

    img {
      @apply rounded-xl w-full h-auto my-8;
    }

    table {
      @apply w-full border border-gray-200 my-8 overflow-hidden rounded-lg;
    }

    th {
      @apply bg-gray-100 font-semibold text-right p-3 border;
    }

    td {
      @apply p-3 border;
    }

    hr {
      @apply my-10 border-gray-200;
    }
  }
}
</style>
