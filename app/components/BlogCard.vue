<script setup lang="ts">
import { computed } from "vue";
import type { BlogListItem } from "~/types";

const props = defineProps<{
  blog: BlogListItem;
  priority?: boolean;
}>();

const image = computed(() => props.blog.image || "/images/blog-placeholder.webp");

function formatDate(date?: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
</script>

<template>
  <NuxtLink :to="`/blog/${blog.slug}`" class="blog-card">
    <div class="blog-card__image-wrapper">
      <img
        :src="`https://sohangaz.com${image}`"
        :alt="blog.title"
        class="blog-card__image"
        :loading="priority ? 'eager' : 'lazy'"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <span
        v-if="blog.category"
        class="blog-card__badge"
      >
        {{ blog.category.name }}
      </span>

      <span
        v-if="blog.is_featured"
        class="blog-card__featured"
      >
        ویژه
      </span>
    </div>

    <div class="blog-card__body">
      <h3 class="blog-card__title">
        {{ blog.title }}
      </h3>

      <p
        v-if="blog.summary"
        class="blog-card__summary"
      >
        {{ blog.summary }}
      </p>

      <div class="blog-card__meta">
        <span
          v-if="blog.published_at"
          class="blog-card__meta-item"
        >
          {{ formatDate(blog.published_at) }}
        </span>

        <span
          v-if="blog.published_at && blog.reading_time"
          class="blog-card__meta-dot"
        />

        <span
          v-if="blog.reading_time"
          class="blog-card__meta-item"
        >
          {{ blog.reading_time }} دقیقه مطالعه
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.blog-card {
  @apply flex flex-col overflow-hidden rounded-2xl  shadow-2xl   transition-all duration-300 hover:-translate-y-1 hover:shadow-lg;
}

.blog-card__image-wrapper {
  @apply relative aspect-[16/10] w-full overflow-hidden bg-gray-100;
}

.blog-card__image {
  @apply h-full w-full object-cover transition-transform duration-500 group-hover:scale-105;
}

.blog-card__badge {
  @apply absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur;
}

.blog-card__featured {
  @apply absolute left-3 top-3 rounded-full bg-[--gold-two] px-3 py-1 text-xs font-medium text-white shadow;
}

.blog-card__body {
  @apply flex flex-1 flex-col dark:bg-black gap-2 p-4 sm:p-5;
}

.blog-card__title {
  @apply line-clamp-2 text-wrap text-right text-base font-bold text-gray-900 dark:text-white transition-colors group-hover:text-[--gold-one] sm:text-lg;
}

.blog-card__summary {
  @apply line-clamp-2 text-sm leading-6 text-gray-500 dark:text-white text-wrap text-justify;
}

.blog-card__meta {
  @apply mt-auto flex items-center gap-2 pt-3 text-xs text-gray-400;
}

.blog-card__meta-item {
  @apply whitespace-nowrap;
}

.blog-card__meta-dot {
  @apply h-1 w-1 rounded-full bg-gray-300;
}
</style>