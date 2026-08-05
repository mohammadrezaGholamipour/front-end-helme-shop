<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number as PropType<number>,
    required: true,
  },
  lastPage: {
    type: Number as PropType<number>,
    required: true,
  },
});

const route = useRoute();

function pageLink(page: number) {
  return { query: { ...route.query, page: page > 1 ? page : undefined } };
}

const pages = computed(() => {
  const total = props.lastPage;
  const current = props.currentPage;
  const delta = 1;
  const range: (number | "...")[] = [];

  for (let i = 1; i <= total; i += 1) {
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
  <nav
    v-if="props.lastPage > 1"
    class="admin-pagination"
    aria-label="صفحه‌بندی مدیریت"
  >
    <NuxtLink
      :to="pageLink(props.currentPage - 1)"
      class="admin-pagination__nav"
      :class="{ 'admin-pagination__nav--disabled': props.currentPage <= 1 }"
    >
      <Icon name="tabler:chevron-right" class="admin-pagination__nav-icon" />
      <span class="admin-pagination__nav-label">قبلی</span>
    </NuxtLink>

    <ul class="admin-pagination__list">
      <li v-for="(page, index) in pages" :key="index">
        <span v-if="page === '...'" class="admin-pagination__ellipsis">…</span>
        <NuxtLink
          v-else
          :to="pageLink(page)"
          class="admin-pagination__item"
          :class="{
            'admin-pagination__item--active': page === props.currentPage,
          }"
        >
          {{ page }}
        </NuxtLink>
      </li>
    </ul>

    <span class="admin-pagination__counter">
      {{ props.currentPage }} از {{ props.lastPage }}
    </span>

    <NuxtLink
      :to="pageLink(props.currentPage + 1)"
      class="admin-pagination__nav"
      :class="{
        'admin-pagination__nav--disabled': props.currentPage >= props.lastPage,
      }"
    >
      <span class="admin-pagination__nav-label">بعدی</span>
      <Icon name="tabler:chevron-left" class="admin-pagination__nav-icon" />
    </NuxtLink>
  </nav>
</template>

<style scoped>
.admin-pagination {
  @apply mt-6 flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white px-4 py-4 shadow-sm sm:justify-between;
}

.admin-pagination__list {
  @apply hidden items-center gap-2 sm:flex;
}

.admin-pagination__counter {
  @apply text-sm font-medium text-slate-500 sm:hidden;
}

.admin-pagination__item,
.admin-pagination__nav {
  @apply flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition;
}

.admin-pagination__item {
  @apply bg-slate-100 text-slate-700 hover:bg-slate-200;
}

.admin-pagination__item--active {
  @apply bg-[--gold-one] text-white;
}

.admin-pagination__nav {
  @apply border border-slate-200 bg-white text-slate-700 hover:bg-slate-50;
}

.admin-pagination__nav-icon {
  @apply h-4 w-4;
}

.admin-pagination__nav-label {
  @apply hidden sm:inline;
}

.admin-pagination__nav--disabled {
  @apply pointer-events-none opacity-40;
}

.admin-pagination__ellipsis {
  @apply px-3 text-sm text-slate-400;
}
</style>