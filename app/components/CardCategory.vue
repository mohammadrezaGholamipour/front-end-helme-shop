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
      class="relative "
      width="220"
      height="260"
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
