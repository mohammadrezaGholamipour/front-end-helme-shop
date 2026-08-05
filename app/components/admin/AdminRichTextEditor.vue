<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const props = defineProps<{
  modelValue: string;
  label?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
  ],
  editorProps: {
    attributes: {
      class: "admin-rte__content",
      dir: "rtl",
    },
  },
  onUpdate: ({ editor: e }) => {
    emit("update:modelValue", e.getHTML());
  },
});

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return;
    if (value === editor.value.getHTML()) return;
    editor.value.commands.setContent(value, false);
  },
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const setLink = () => {
  if (!editor.value) return;
  const previousUrl = editor.value.getAttributes("link").href as
    | string
    | undefined;
  const url = window.prompt("آدرس لینک را وارد کنید", previousUrl ?? "https://");

  if (url === null) return;

  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};
</script>

<template>
  <div class="admin-rte">
    <label v-if="label" class="admin-rte__label">{{ label }}</label>

    <div class="admin-rte__toolbar" v-if="editor">
      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Icon name="tabler:bold" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Icon name="tabler:italic" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <Icon name="tabler:strikethrough" class="h-4 w-4" />
      </button>

      <span class="admin-rte__divider" />

      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>

      <span class="admin-rte__divider" />

      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <Icon name="tabler:list" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <Icon name="tabler:list-numbers" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <Icon name="tabler:blockquote" class="h-4 w-4" />
      </button>

      <span class="admin-rte__divider" />

      <button
        type="button"
        class="admin-rte__btn"
        :class="{ 'admin-rte__btn--active': editor.isActive('link') }"
        @click="setLink"
      >
        <Icon name="tabler:link" class="h-4 w-4" />
      </button>

      <span class="admin-rte__divider" />

      <button
        type="button"
        class="admin-rte__btn"
        @click="editor.chain().focus().undo().run()"
      >
        <Icon name="tabler:arrow-back-up" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="admin-rte__btn"
        @click="editor.chain().focus().redo().run()"
      >
        <Icon name="tabler:arrow-forward-up" class="h-4 w-4" />
      </button>
    </div>

    <EditorContent :editor="editor" class="admin-rte__editor" />

    <p v-if="error" class="admin-rte__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.admin-rte {
  @apply flex flex-col gap-1.5 text-wrap;
}

.admin-rte__label {
  @apply text-sm font-medium text-wrap text-slate-700 dark:text-slate-300;
}

.admin-rte__toolbar {
  @apply flex flex-wrap text-wrap items-center gap-1 rounded-t-xl border border-b-0 border-slate-300
    bg-slate-50 p-1.5
    dark:border-slate-700 dark:bg-slate-900;
}

.admin-rte__btn {
  @apply flex h-8 min-w-8 text-wrap items-center justify-center rounded-lg px-2 text-xs font-semibold
    text-slate-600 transition hover:bg-slate-200
    dark:text-slate-300 dark:hover:bg-slate-800;
}

.admin-rte__btn--active {
  @apply bg-[--gold-one] text-wrap text-white hover:bg-[--gold-one];
}

.admin-rte__divider {
  @apply mx-1 h-5 w-px text-wrap bg-slate-300 dark:bg-slate-700;
}

.admin-rte__editor {
  @apply rounded-b-xl text-wrap border border-slate-300 bg-white
    dark:border-slate-700 dark:bg-slate-900;
}

.admin-rte :deep(.admin-rte__content) {
  @apply min-h-[260px] max-w-none text-wrap px-3 py-2.5 text-sm leading-8 text-slate-900
    outline-none dark:text-white;
}

.admin-rte :deep(.admin-rte__content p) {
  @apply mb-3 text-wrap;
}

.admin-rte :deep(.admin-rte__content h2) {
  @apply mb-2 mt-4 text-lg font-bold text-wrap;
}

.admin-rte :deep(.admin-rte__content h3) {
  @apply mb-2 mt-3 text-base font-bold text-wrap;
}

.admin-rte :deep(.admin-rte__content ul) {
  @apply mb-3 list-disc pr-5 text-wrap;
}

.admin-rte :deep(.admin-rte__content ol) {
  @apply mb-3 list-decimal pr-5 text-wrap;
}

.admin-rte :deep(.admin-rte__content blockquote) {
  @apply my-3 border-r-4 border-[--gold-one] pr-3 text-wrap text-slate-500 dark:text-slate-400;
}

.admin-rte :deep(.admin-rte__content a) {
  @apply text-[--gold-one] underline text-wrap;
}

.admin-rte__error {
  @apply text-xs font-medium text-red-600 text-wrap dark:text-red-400;
}
</style>