<script setup lang="ts">
import type { StoreOut } from "~/types";
const { data, isLoading, error } = useAllStore() as unknown as {
  data: StoreOut;
  isLoading: boolean;
  error: unknown;
};
const globalStore = useGlobalStore();
globalStore.setStores(data);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
