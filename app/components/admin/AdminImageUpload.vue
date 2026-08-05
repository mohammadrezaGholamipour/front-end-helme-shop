<script setup lang="ts">
import type { PropType } from "vue";
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  label: {
    type: String as PropType<string>,
    default: "تصویر",
  },
  modelValue: {
    type: [File, null] as PropType<File | null>,
    default: null,
  },
  // URL of the image already saved on the server (edit mode), shown until a new file is picked
  existingUrl: {
    type: String as PropType<string>,
    default: "",
  },
  hint: {
    type: String as PropType<string>,
    default: "PNG، JPG یا WebP — حداکثر ۲ مگابایت",
  },
  maxSizeMb: {
    type: Number as PropType<number>,
    default: 2,
  },
  error: {
    type: String as PropType<string>,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
  (e: "clear-existing"): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const localError = ref("");
const objectUrl = ref("");

const previewUrl = computed(() => objectUrl.value || props.existingUrl || "");
const displayError = computed(() => props.error || localError.value);

function revokeObjectUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = "";
  }
}

function acceptFile(file: File | undefined | null) {
  localError.value = "";

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    localError.value = "فقط فایل تصویری مجاز است.";
    return;
  }

  if (file.size > props.maxSizeMb * 1024 * 1024) {
    localError.value = `حجم تصویر نباید بیشتر از ${props.maxSizeMb} مگابایت باشد.`;
    return;
  }

  revokeObjectUrl();
  objectUrl.value = URL.createObjectURL(file);
  emit("update:modelValue", file);
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  acceptFile(target.files?.[0]);
}

function onDrop(event: DragEvent) {
  isDragging.value = false;
  acceptFile(event.dataTransfer?.files?.[0]);
}

function openPicker() {
  inputRef.value?.click();
}

function removeImage() {
  revokeObjectUrl();
  localError.value = "";
  emit("update:modelValue", null);
  emit("clear-existing");
  if (inputRef.value) inputRef.value.value = "";
}

watch(
  () => props.modelValue,
  (value) => {
    if (!value) revokeObjectUrl();
  },
);

onBeforeUnmount(() => revokeObjectUrl());
</script>

<template>
  <div class="admin-image-upload">
    <span v-if="props.label" class="admin-image-upload__label">{{
      props.label
    }}</span>

    <div
      class="admin-image-upload__dropzone"
      :class="{
        'admin-image-upload__dropzone--dragging': isDragging,
        'admin-image-upload__dropzone--filled': previewUrl,
        'admin-image-upload__dropzone--error': displayError,
      }"
      role="button"
      tabindex="0"
      @click="openPicker"
      @keydown.enter="openPicker"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="inputRef"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="admin-image-upload__input"
        @change="onInputChange"
        @click.stop
      />

      <template v-if="previewUrl">
        <img
          :src="previewUrl"
          alt="پیش‌نمایش تصویر"
          class="admin-image-upload__preview"
        />
        <div class="admin-image-upload__overlay">
          <span>تغییر تصویر</span>
        </div>
        <button
          type="button"
          class="admin-image-upload__remove"
          aria-label="حذف تصویر"
          @click.stop="removeImage"
        >
          ×
        </button>
      </template>

      <div v-else class="admin-image-upload__placeholder">
        <Icon name="tabler:cloud-upload" class="admin-image-upload__icon" />
        <span class="admin-image-upload__cta"
          >برای انتخاب تصویر کلیک کنید یا فایل را رها کنید</span
        >
      </div>
    </div>

    <span v-if="displayError" class="admin-image-upload__error">{{
      displayError
    }}</span>
    <span v-else-if="props.hint" class="admin-image-upload__hint">{{
      props.hint
    }}</span>
  </div>
</template>

<style scoped>
.admin-image-upload {
  @apply flex flex-col gap-2;
}

.admin-image-upload__label {
  @apply text-sm font-medium text-slate-700 dark:text-slate-300;
}

.admin-image-upload__dropzone {
  @apply relative flex aspect-video w-full cursor-pointer items-center justify-center
    overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50
    transition
    dark:border-slate-700 dark:bg-slate-900;
}


.admin-image-upload__dropzone--dragging {
  @apply border-[--gold-one] bg-amber-50 ring-2 ring-[--gold-two]
    dark:bg-[--gold-one];
}

.admin-image-upload__dropzone--filled {
  @apply border-solid border-slate-200 bg-white
    dark:border-slate-800 dark:bg-slate-950;
}

.admin-image-upload__dropzone--error {
  @apply border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20;
}

.admin-image-upload__input {
  @apply hidden;
}

.admin-image-upload__preview {
  @apply object-fill rounded-md shadow-md transition duration-200 hover:scale-125;
  aspect-ratio: 4/4;
  width: 220px;
}

.admin-image-upload__overlay {
  @apply pointer-events-none absolute inset-0 flex items-center justify-center
    bg-black/0 text-sm font-medium text-white opacity-0 transition;
}

.admin-image-upload__dropzone:hover .admin-image-upload__overlay {
  @apply bg-black/40 opacity-100;
}

.admin-image-upload__remove {
  @apply absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full
    bg-white/90 text-base font-bold text-red-600 shadow transition
    hover:bg-white
    dark:bg-slate-900/90 dark:text-red-400 dark:hover:bg-slate-900;
}

.admin-image-upload__placeholder {
  @apply flex flex-col items-center gap-2 px-4 text-center text-slate-500
    dark:text-slate-400;
}

.admin-image-upload__icon {
  @apply h-8 w-8 text-slate-400 dark:text-slate-600;
}

.admin-image-upload__cta {
  @apply text-xs font-medium;
}

.admin-image-upload__hint {
  @apply text-xs text-slate-400 dark:text-slate-500;
}

.admin-image-upload__error {
  @apply text-xs font-medium text-red-600 dark:text-red-400;
}
</style>
