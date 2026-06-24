<script setup lang="ts">
import type { CategoryOut } from "~/types";
const props = defineProps<{ category: CategoryOut }>();
const router = useRouter();
</script>
<template>
  <div class="category-card">
    <NuxtImg
      :src="`http://130.185.73.247${props.category.image}`"
      alt="category"
    />
    <p>{{ props.category.name }}</p>
    <button
      @click="router.push({ path: `/categories/${props.category.name}` })"
    >
      <p>مشاهده بیشتر</p>
      <Icon name="tabler:dots-filled" class="w-6 h-6" />
    </button>
  </div>
</template>
