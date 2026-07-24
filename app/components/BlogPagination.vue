<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  lastPage: number;
}>();

const route = useRoute();

function pageLink(page: number) {
  return { query: { ...route.query, page: page > 1 ? page : undefined } };
}

const pages = computed(() => {
  const total = props.lastPage;
  const current = props.currentPage;
  const delta = 1;
  const range: (number | "...")[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return range;
});
</script>

<template>
  <nav v-if="lastPage > 1" class="blog-pagination" aria-label="صفحه‌بندی">
    <NuxtLink
      :to="pageLink(currentPage - 1)"
      class="blog-pagination__nav"
      :class="{ 'blog-pagination__nav--disabled': currentPage <= 1 }"
    >
      قبلی
    </NuxtLink>

    <ul class="blog-pagination__list">
      <li v-for="(page, index) in pages" :key="index">
        <span v-if="page === '...'" class="blog-pagination__ellipsis">…</span>
        <NuxtLink
          v-else
          :to="pageLink(page)"
          class="blog-pagination__item"
          :class="{ 'blog-pagination__item--active': page === currentPage }"
        >
          {{ page }}
        </NuxtLink>
      </li>
    </ul>

    <NuxtLink
      :to="pageLink(currentPage + 1)"
      class="blog-pagination__nav"
      :class="{ 'blog-pagination__nav--disabled': currentPage >= lastPage }"
    >
      بعدی
    </NuxtLink>
  </nav>
</template>

<style scoped>
.blog-pagination {
  @apply mt-10 flex items-center justify-center gap-2 sm:gap-3;
}

.blog-pagination__list {
  @apply flex items-center gap-1 sm:gap-2;
}

.blog-pagination__item {
  @apply flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100;
}

.blog-pagination__item--active {
  @apply bg-[--gold-two] text-white hover:bg-[--gold-two];
}

.blog-pagination__ellipsis {
  @apply flex h-9 w-9 items-center justify-center text-gray-400;
}

.blog-pagination__nav {
  @apply rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 sm:px-4;
}

.blog-pagination__nav--disabled {
  @apply pointer-events-none opacity-40;
}
</style>