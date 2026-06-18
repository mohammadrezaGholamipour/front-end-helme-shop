<script setup lang="ts">
const { data, isLoading, error } = useAllCategory();
console.log(data.value);
</script>
<template>
{{ data }}
  <div class="parent-catgories">
    <CardCategory v-for="item in 10" />
  </div>
</template>
