<template>
  <div class="blog-skeleton">
    <div class="blog-skeleton__image" />
    <div class="blog-skeleton__body">
      <div class="blog-skeleton__line blog-skeleton__line--title" />
      <div class="blog-skeleton__line blog-skeleton__line--text" />
      <div class="blog-skeleton__line blog-skeleton__line--text-short" />
    </div>
  </div>
</template>

<style scoped>
.blog-skeleton {
  @apply flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100;
}

.blog-skeleton__image {
  @apply aspect-[16/10] w-full animate-pulse bg-gray-200;
}

.blog-skeleton__body {
  @apply flex flex-col gap-3 p-4 sm:p-5;
}

.blog-skeleton__line {
  @apply animate-pulse rounded-full bg-gray-200;
}

.blog-skeleton__line--title {
  @apply h-4 w-4/5;
}

.blog-skeleton__line--text {
  @apply h-3 w-full;
}

.blog-skeleton__line--text-short {
  @apply h-3 w-2/3;
}
</style>