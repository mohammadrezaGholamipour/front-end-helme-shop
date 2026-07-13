<script setup lang="ts">
import type { CategorySlugOut } from "~/types";
import { useRoute } from "vue-router";

const route = useRoute();

const name = route.params.slug as string;
const { data, isLoading, error } = useCategorySlug(name) as unknown as {
  data: CategorySlugOut;
  isLoading: boolean;
  error: unknown;
};
</script>

<template>
  <div class="parent-page index">
    <TitleIndex />
    <div v-if="isLoading">Loading...</div>
    <div
      class="flex flex-col gap-4 py-7 items-center"
      v-else-if="data?.products?.length === 0"
    >
      <img
        alt="فروشگاه سوهان و گز حلما"
        src="/images/helma-logo.webp"
        width="300"
      />
      <p class="dark:text-white text-xl">لیست محصولات خالی میباشد</p>
      <p class="dark:text-white text-sm animate-bounce">به زودی پر میشه !</p>
    </div>

    <div class="parent-cards" v-else>
      <CardProduct
        v-animate="{ type: 'slideUp', delay: 300, threshold: 0.1 }"
        v-for="item in data?.products"
        :product="item"
        :key="item.id"
      />
    </div>
  </div>
</template>
