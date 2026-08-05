<script setup lang="ts">
const showFilter = ref(false);
const showCartDialog = ref(false);
const cartStore = useCartStore();

const openCartDialog = (): void => {
  showCartDialog.value = true;
};
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }"
    class="header-two"
  >
    <button @click="showFilter = true">
      <p>مشاهده فیلتر ها</p>
      <Icon name="tabler:adjustments-horizontal-filled" class="w-6 h-6" />
    </button>
    <section class="flex items-center gap-3">
      <button
        @click="openCartDialog"
        class="relative !hidden lg:!flex p-2 gap-2 items-center font-bold "
      >
      
        <span
          v-animate="{
            type: 'blurIn',
            delay: 300,
            duration: 1000,
            once: true,
            threshold: 0,
          }"
          v-if="cartStore.totalItems > 0"
          class="right-0 flex h-8 w-8  items-center justify-center rounded-full bg-red-700 font-bold text-white"
        >
          {{ cartStore.totalItems }} 
        </span>

        <p>برای مشاهده سبد خرید کلیک کنید</p>
        <Icon name="tabler:shopping-cart" class="w-6 h-6" />
      </button>
      <ColorMood />
      <AdminFullscreenButton />
    </section>
    <CartDialog v-model="showCartDialog" />
    <ProductFilterDialog v-model="showFilter" />
  </div>
</template>

<style scoped>
.header-two {
  @apply w-full rounded-lg shadow-md bg-[var(--gold-one)] flex justify-between text-white p-4 items-center;
}

.header-two > button {
  @apply flex rounded-full bg-white dark:bg-[#121827] border-dashed  text-[var(--gold-one)] p-3 gap-2 font-bold shadow-md border-2 border-[var(--gold-two)];
}
</style>
