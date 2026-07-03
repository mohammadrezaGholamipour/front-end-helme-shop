<script setup lang="ts">
import type { StoreUI } from "~/types";
const { data, isLoading } = useAllStore() as unknown as {
  data: StoreUI;
  isLoading: boolean
};
const globalStore = useGlobalStore();

const startTime = Date.now()

watchEffect(async () => {
  if (data) {
    globalStore.setStores(data)

    const elapsed = Date.now() - startTime
    const minDuration = 2000

    if (elapsed < minDuration) {
      await new Promise(resolve =>
        setTimeout(resolve, minDuration - elapsed)
      )
    }

    globalStore.setLoading(isLoading);
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage     v-animate="{
      type: 'blurIn',
      delay: 2000,
      duration: 1000,
      once: true,
      threshold: 0,
    }" />
  </NuxtLayout>
</template>
