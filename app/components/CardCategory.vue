<script setup lang="ts">
import type { CategoryOut } from "~/types";
const props = defineProps<{ category: CategoryOut }>();
const router = useRouter();
</script>
<template>
  <div class="category-card">
    <img
      :src="`https://sohangaz.com${props.category.image}`"
      :alt="`${props.category.name} محصولات`"
      width="220"
      height="260"
      fetchpriority="high"
    />
    <p>{{ props.category.name }}</p>
    <button
      @click="router.push({ path: `/categories/${props.category.slug}` })"
    >
      <p>مشاهده بیشتر</p>
      <Icon name="tabler:dots-filled" class="w-6 h-6" />
    </button>
  </div>
</template>
