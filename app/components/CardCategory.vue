<script setup lang="ts">
import type { CategoryOut } from "~/types";
const props = defineProps<{ category: CategoryOut }>();
const router = useRouter();
</script>
<template>
  <main class="category-card">
    <img
      :src="`https://sohangaz.com${props.category.image}`"
      :alt="`خرید انواع ${props.category.name}`"
      width="220"
      height="260"
      fetchpriority="high"
    />
    <h2>{{ props.category.name }}</h2>
    <NuxtLink
      :to="`/categories/${props.category.slug}`"
      class="category-card__buttom"
    >
      <span>مشاهده محصول</span>
    </NuxtLink>
  </main>
</template>
