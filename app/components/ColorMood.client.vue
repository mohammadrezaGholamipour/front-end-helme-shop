<script setup>
const html = ref(document.getElementsByTagName("html")[0]);
const colorMoodValue = ref(null);

onMounted(() => {
  const colorMode = localStorage.getItem("colorMode");
  if (colorMode === "dark") {
    html.value.classList.add("dark");
    colorMoodValue.value = true;
  } else if (colorMode === "light") {
    html.value.classList.remove("dark");
    colorMoodValue.value = false;
  } else {
    html.value.classList.add("dark");
    colorMoodValue.value = true;
  }
});
const handleColorMood = () => {
  if (html.value.classList.contains("dark")) {
    html.value.classList.remove("dark");
    localStorage.setItem("colorMode", "light");
    colorMoodValue.value = false;
  } else {
    html.value.classList.add("dark");
    localStorage.setItem("colorMode", "dark");
    colorMoodValue.value = true;
  }
  const storageEvent = new Event("storage");
  window.dispatchEvent(storageEvent);
};
</script>

<template>
  <input
    @click="handleColorMood"
    v-model="colorMoodValue"
    class="l cursor-pointer"
    type="checkbox"
    dir="ltr"
  />
</template>
