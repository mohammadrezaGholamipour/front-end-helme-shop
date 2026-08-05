<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

interface SidebarChild {
  to: string;
  label: string;
}

const props = defineProps<{
  label: string;
  icon: string;
  children: SidebarChild[];
}>();

const emit = defineEmits<{
  (e: "navigate"): void;
}>();

const route = useRoute();

const isChildActive = (to: string) => route.path === to;

const isGroupActive = computed(() =>
  props.children.some((child) => isChildActive(child.to)),
);

const isOpen = ref(isGroupActive.value);

// اگر با ناوبری مستقیم وارد یکی از زیرمنوها شدیم، خودکار باز شود
watch(isGroupActive, (active) => {
  if (active) isOpen.value = true;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="sidebar-group">
    <button
      type="button"
      class="sidebar-group__trigger"
      :class="{ 'sidebar-group__trigger--active': isGroupActive }"
      @click="toggle"
    >
      <Icon :name="icon" class="sidebar-group__icon" />
      <span class="sidebar-group__label">{{ label }}</span>
      <Icon
        name="tabler:chevron-down"
        class="sidebar-group__chevron"
        :class="{ 'sidebar-group__chevron--open': isOpen }"
      />
    </button>

    <Transition name="sidebar-group__collapse">
      <div v-if="isOpen" class="sidebar-group__children">
        <NuxtLink
          v-for="child in children"
          :key="child.to"
          :to="child.to"
          class="sidebar-group__child"
          :class="{ 'sidebar-group__child--active': isChildActive(child.to) }"
          @click="emit('navigate')"
        >
          <span class="sidebar-group__child-dot" />
          <span>{{ child.label }}</span>
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sidebar-group {
  @apply flex flex-col;
}

.sidebar-group__trigger {
  @apply flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm
    text-slate-600 transition
    hover:bg-slate-100 hover:text-slate-900
    dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white;
}

.sidebar-group__trigger--active {
  @apply bg-[--gold-one] text-white dark:!text-white
    dark:bg-[--gold-one];
}

.sidebar-group__icon {
  @apply h-5 w-5 shrink-0;
}

.sidebar-group__label {
  @apply flex-1 text-right font-medium;
}

.sidebar-group__chevron {
  @apply h-4 w-4 shrink-0 transition-transform duration-200;
}

.sidebar-group__chevron--open {
  @apply rotate-180;
}

.sidebar-group__children {
  @apply mr-4 mt-1 flex flex-col gap-1 overflow-hidden border-r-2
    border-slate-200 pr-4
    dark:border-slate-800;
}

.sidebar-group__child {
  @apply flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm
    text-slate-500 transition
    hover:bg-slate-100 hover:text-slate-900
    dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white;
}

.sidebar-group__child--active {
  @apply bg-[--gold-one] font-semibold !text-white
    hover:bg-[--gold-one] hover:text-white;
}

.sidebar-group__child-dot {
  @apply h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50;
}

/* انیمیشن باز/بسته شدن زیرمنو */
.sidebar-group__collapse-enter-active,
.sidebar-group__collapse-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.sidebar-group__collapse-enter-from,
.sidebar-group__collapse-leave-to {
  @apply max-h-0 opacity-0;
}

.sidebar-group__collapse-enter-to,
.sidebar-group__collapse-leave-from {
  max-height: 200px;
  @apply opacity-100;
}
</style>