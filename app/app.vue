<script setup lang="ts">
import { onMounted, ref } from "vue";

const isDark = ref(false);

onMounted(() => {
  // بررسی وضعیت قبلی از localStorage در زمان لود شدن صفحه
  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    isDark.value = true;
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
</script>

<template>
  <NuxtRouteAnnouncer />
  <CardProduct />
  <CardCategory />
  <button
    @click="toggleTheme"
    class="fixed top-4 left-4 rounded-lg bg-[var(--gold-two)] px-4 py-2 font-bold text-white shadow-lg z-50"
  >
    {{ isDark ? "حالت روز" : "حالت شب" }}
  </button>
</template>
