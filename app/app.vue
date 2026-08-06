<script setup lang="ts">
import "@/utils/convert-persian-number";
import type { StoreUI } from "~/types";
const { data } = useAllStore() as unknown as { data: StoreUI };
const globalStore = useGlobalStore();
globalStore.setStores(data);
</script>

<template>
  <NuxtLayout>
    <AppToastContainer />
    <NuxtPage
      :transition="{
        name: 'app-page',
        mode: 'out-in',
      }"
    />
  </NuxtLayout>
</template>

<style>
.app-page-enter-active,
.app-page-leave-active {
  transition: all 0.35s ease;
}

.app-page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.app-page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
