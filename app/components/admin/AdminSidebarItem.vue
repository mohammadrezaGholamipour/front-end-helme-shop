<script setup lang="ts">
import { useRoute } from "vue-router";
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  to: {
    type: String as PropType<string>,
    required: true,
  },
  label: {
    type: String as PropType<string>,
    required: true,
  },
  icon: {
    type: String as PropType<string>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "navigate"): void;
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.to);
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="admin-sidebar-item"
    :class="{ 'admin-sidebar-item--active': isActive }"
    @click="emit('navigate')"
  >
    <Icon :name="props.icon" class="admin-sidebar-item__icon" />
    <span class="admin-sidebar-item__label">{{ props.label }}</span>
    <Icon
      v-if="isActive"
      name="tabler:point-filled"
      class="admin-sidebar-item__dot"
    />
  </NuxtLink>
</template>

<style scoped>
.admin-sidebar-item {
  @apply relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm  transition hover:bg-slate-100 hover:text-slate-900;
}

.admin-sidebar-item--active {
  @apply bg-[--gold-one] text-white shadow-sm hover:bg-[--gold-one] hover:text-white;
}

.admin-sidebar-item__icon {
  @apply h-5 w-5 shrink-0;
}

.admin-sidebar-item__label {
  @apply font-medium;
}

.admin-sidebar-item__dot {
  @apply mr-auto h-2 w-2 text-white/80;
}
</style>