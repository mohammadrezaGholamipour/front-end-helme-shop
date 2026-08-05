<script setup lang="ts">
export interface AdminSelectOption {
  label: string;
  value: string | number | undefined;
}

const props = defineProps<{
  modelValue: string | number | undefined;
  options: AdminSelectOption[];
  placeholder?: string;
  icon?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | undefined): void;
}>();

const isOpen = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === props.modelValue),
);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const select = (option: AdminSelectOption) => {
  emit("update:modelValue", option.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") isOpen.value = false;
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div ref="rootRef" class="admin-select">
    <button
      type="button"
      class="admin-select__trigger"
      :class="{ 'admin-select__trigger--open': isOpen }"
      @click="toggle"
    >
      <Icon v-if="icon" :name="icon" class="admin-select__leading-icon h-4 w-4" />

      <span
        class="admin-select__value"
        :class="{ 'admin-select__value--placeholder': !selectedOption }"
      >
        {{ selectedOption ? selectedOption.label : (placeholder ?? "انتخاب کنید") }}
      </span>

      <Icon
        name="tabler:chevron-down"
        class="admin-select__chevron h-4 w-4"
        :class="{ 'admin-select__chevron--open': isOpen }"
      />
    </button>

    <Transition name="admin-select-fade">
      <ul v-if="isOpen" class="admin-select__panel" role="listbox">
        <li
          v-for="option in options"
          :key="String(option.value)"
          class="admin-select__option"
          :class="{
            'admin-select__option--active': option.value === modelValue,
          }"
          role="option"
          @click="select(option)"
        >
          <span class="admin-select__option-label">{{ option.label }}</span>
          <Icon
            v-if="option.value === modelValue"
            name="tabler:check"
            class="h-4 w-4 shrink-0"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.admin-select {
  @apply relative  flex-1;
}

.admin-select__trigger {
  @apply flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-white
    px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none
    transition-all duration-200
    hover:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

.admin-select__trigger--open {
  @apply border-[--gold-one] ring-2 ring-[--gold-one];
}

.admin-select__leading-icon {
  @apply shrink-0 text-slate-400 dark:text-slate-500;
}

.admin-select__value {
  @apply flex-1 truncate text-right;
}

.admin-select__value--placeholder {
  @apply text-slate-400 dark:text-slate-500;
}

.admin-select__chevron {
  @apply shrink-0 text-slate-400 transition-transform duration-200
    dark:text-slate-500;
}

.admin-select__chevron--open {
  @apply rotate-180 text-[--gold-one];
}

.admin-select__panel {
  @apply absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border
    border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10
    dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40;
}

.admin-select__option {
  @apply flex cursor-pointer  items-center justify-between  rounded-xl px-3 py-2.5
    text-sm text-slate-700 transition-colors duration-150
    hover:bg-[--gold-one] hover:text-white
    dark:text-white;
}

.admin-select__option:not(:first-child) {
  margin-top: 5px;
}

.admin-select__option--active {
  @apply bg-[--gold-one] font-semibold text-white;
}

.admin-select__option-label {
  @apply truncate;
}

.admin-select-fade-enter-active,
.admin-select-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.admin-select-fade-enter-from,
.admin-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>