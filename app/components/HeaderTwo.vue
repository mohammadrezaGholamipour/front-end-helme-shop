<template>
  <div
    v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }"
    class="header-two"
  >
    <button>
      <p>مشاهده فیلتر ها</p>
      <Icon name="tabler:adjustments-horizontal-filled" class="w-6 h-6" />
    </button>
    <ColorMood />
  </div>
</template>
<style scoped>
.header-two {
  @apply w-full rounded-lg shadow-md bg-[var(--gold-one)] flex justify-between text-white p-4 items-center;
}

.header-two > button {
  @apply flex rounded-xl bg-white text-[var(--gold-one)] p-3 gap-2 font-bold  shadow-md border-2 border-[var(--gold-two)];
}
</style>
