<script setup>
const status = ref(false);

onMounted(() => {
  setTimeout(() => {
    status.value = !status.value;
  }, 1000);
});
</script>

<template>
  <div v-show="status" class="parent-project">
    <NuxtRouteAnnouncer />
    <HeaderOne />
    <HeaderTwo />
      <slot  />
    <Footer />
  </div>
</template>
