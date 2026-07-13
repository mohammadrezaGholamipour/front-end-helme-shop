<template>
  <div v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }" class="header-two">
    <button >
      <p>مشاهده فیلتر ها</p>
      <Icon name="tabler:adjustments-horizontal-filled" class="w-6 h-6" />
    </button>
    <ColorMood />
  </div>
</template>
