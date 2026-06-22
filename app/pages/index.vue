<script setup lang="ts">
import type { CategoryOut } from "~/types";

const { data, isLoading, error } = useAllCategory() as unknown as {
  data: CategoryOut[] | undefined;
  isLoading: boolean;
  error: unknown;
};


</script>
<template>
  <div class="parent-page">
    <div v-if="isLoading">Loading...</div>

    <div v-else-if="data?.length === 0">
      <p>هیچ دسته بندی ای وجود ندارد</p>
    </div>

    <template v-else>
      <CardCategory :category="item" v-for="item in data" :key="item.id" />
    </template>
  </div>
</template>
