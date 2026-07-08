<script setup >
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
  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (html.value.classList.contains("dark")) {
    html.value.classList.remove("dark");
    localStorage.setItem("colorMode", "light");
    colorMoodValue.value = false;

    themeColor?.setAttribute("content", "#fbf3e4");
  } else {
    html.value.classList.add("dark");
    localStorage.setItem("colorMode", "dark");
    colorMoodValue.value = true;

    themeColor?.setAttribute("content", "#000000");
  }

  const storageEvent = new Event("storage");
  window.dispatchEvent(storageEvent);
};
</script>

<template>
  <label class="switch">
    <input
      @click="handleColorMood"
      v-model="colorMoodValue"
      class="switch__input"
      type="checkbox"
      role="switch"
    />
    <span class="switch__icon">
      <span class="switch__icon-part switch__icon-part--1"></span>
      <span class="switch__icon-part switch__icon-part--2"></span>
      <span class="switch__icon-part switch__icon-part--3"></span>
      <span class="switch__icon-part switch__icon-part--4"></span>
      <span class="switch__icon-part switch__icon-part--5"></span>
      <span class="switch__icon-part switch__icon-part--6"></span>
      <span class="switch__icon-part switch__icon-part--7"></span>
      <span class="switch__icon-part switch__icon-part--8"></span>
      <span class="switch__icon-part switch__icon-part--9"></span>
      <span class="switch__icon-part switch__icon-part--10"></span>
      <span class="switch__icon-part switch__icon-part--11"></span>
    </span>
    <span class="switch__sr">Dark Mode</span>
  </label>
</template>
