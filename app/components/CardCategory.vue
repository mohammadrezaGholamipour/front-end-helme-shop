<script setup lang="ts">
import type { CategoryOut } from "~/types";
const props = defineProps<{ category: CategoryOut }>();
</script>
<template>
  <main class="category-card">
    <div class="category-card__bg"></div>
    <img
      :src="`https://sohangaz.com${props.category.image}`"
      :alt="props.category.meta_title"
      class="relative"
      width="220"
      height="220"
      fetchpriority="high"
    />
    <h2>{{ props.category.name }}</h2>
    <NuxtLink
      :to="`/categories/${props.category.slug}`"
      class="category-card__buttom"
    >
      <span>مشاهده محصولات</span>
    </NuxtLink>
  </main>
</template>
<style scoped>
.category-card {
  @apply rounded-2xl relative flex-1 bg-white dark:bg-black dark:text-white text-xl p-5 pt-6 border-2 shadow-md shadow-inner border-[var(--gold-one)] flex flex-col justify-center items-center gap-7 max-w-[300px];
}

.category-card__bg {
  @apply absolute w-full h-full z-[-1] rounded-2xl;
  background: linear-gradient(
    135deg,
    #cecece 0%,
    #cecece 5%,
    transparent 5%,
    transparent 10%,
    #cecece 10%,
    #cecece 15%,
    transparent 15%,
    transparent 20%,
    #cecece 20%,
    #cecece 25%,
    transparent 25%,
    transparent 30%,
    #cecece 30%,
    #cecece 35%,
    transparent 35%,
    transparent 40%,
    #cecece 40%,
    #cecece 45%,
    transparent 45%,
    transparent 50%,
    #cecece 50%,
    #cecece 55%,
    transparent 55%,
    transparent 60%,
    #cecece 60%,
    #cecece 65%,
    transparent 65%,
    transparent 70%,
    #cecece 70%,
    #cecece 75%,
    transparent 70%,
    transparent 80%,
    #cecece 80%,
    #cecece 85%,
    transparent 85%,
    transparent 90%,
    #cecece 90%,
    #cecece 95%,
    transparent 95%
  );
  background-size: 1.5em 1.5em;
  background-color: #eff6ff;
  opacity: 0.15;
}

.category-card > img {
  @apply rounded-xl shadow-2xl;
  aspect-ratio: 4/4;
  object-fit: fill;
}

.category-card > h2 {
  @apply text-[1.75rem] font-bold text-center;
}

.category-card__buttom {
  @apply flex p-3 justify-center animate-pulse w-full rounded-xl items-center gap-2 font-bold text-white shadow-md;
  background-image: var(--gold-gradiant);
}
</style>
