<script setup lang="ts">
import { buildBlogFormData } from "~/utils/blog";

definePageMeta({
  layout: "admin",
});

const { mutate: createBlog, isPending } = useCreateBlog();
const toast = useAppToast();

const formRef = ref<InstanceType<typeof AdminBlogForm> | null>(null);

const handleSubmit = (payload: Parameters<typeof buildBlogFormData>[0]) => {
  const formData = buildBlogFormData(payload);

  createBlog(formData, {
    onSuccess: (blog) => {
      toast.success("بلاگ ایجاد شد.");
      navigateTo(`/admin/blog/${blog.slug}/edit`);
    },
    onError: (err: unknown) => {
      toast.apiError(err, "خطا در ایجاد بلاگ. دوباره تلاش کنید.");
    },
  });
};

const triggerSubmit = () => {
  formRef.value?.handleSubmit();
};
</script>

<template>
  <div class="admin-blog-edit">
    <section class="admin-blog-edit__topbar">
      <div class="admin-blog-edit__topbar-right">
        <button
          type="button"
          class="admin-blog-edit__back"
          @click="navigateTo('/admin/blog')"
        >
          <Icon name="tabler:arrow-right" class="h-4 w-4" />
          بازگشت به لیست
        </button>
        <h1 class="admin-blog-edit__title">بلاگ جدید</h1>
      </div>

      <AdminButton
        label="ایجاد بلاگ"
        variant="primary"
        icon="tabler:check"
        :disabled="isPending"
        @click="triggerSubmit"
      />
    </section>

    <AdminBlogForm ref="formRef" mode="create" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.admin-blog-edit {
  @apply flex flex-col gap-6 p-4;
}

.admin-blog-edit__topbar {
  @apply sticky top-0 z-10 -mx-4 flex flex-col gap-3 border-b border-slate-200 bg-white/95
    px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between
    dark:border-slate-800 dark:bg-black/95;
}

.admin-blog-edit__topbar-right {
  @apply flex flex-col gap-5;
}

.admin-blog-edit__back {
  @apply inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-slate-500
    transition hover:text-[--gold-one]
    dark:text-slate-400;
}

.admin-blog-edit__title {
  @apply text-lg font-bold text-slate-900 dark:text-white sm:text-xl;
}
</style>
