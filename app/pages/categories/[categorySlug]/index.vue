<script setup lang="ts">
import type { CategoryOut } from "~/types";
import { useRoute } from "vue-router";

const route = useRoute();

const name = route.params.slug as string;
const { data, isLoading, error } = useCategorySearch(name) as unknown as {
  data: CategoryOut[];
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
      <template v-for="category in data" :key="category.id">
        <CardProduct
          :product="item"
          v-for="item in category.products"
          :key="item.id"
        />
      </template>
    </template>
  </div>
</template>
