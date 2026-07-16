<script setup lang="ts">
import type { StoreUI } from "~/types";
const { data } = useAllStore() as unknown as { data: StoreUI };
const globalStore = useGlobalStore();
globalStore.setStores(data);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
