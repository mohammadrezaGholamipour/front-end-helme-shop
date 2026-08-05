<script setup lang="ts">
import { buildBlogFormData } from "~/utils/blog";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const toast = useAppToast();

const slug = computed(() => String(route.params.slug ?? ""));

// اندپوینت واقعی: GET /blog/website/{slug}
const { data: blog, isLoading, error } = useBlog(slug);
const { mutate: updateBlog, isPending } = useUpdateBlog();

const formRef = ref<InstanceType<typeof AdminBlogForm> | null>(null);

const handleSubmit = (payload: Parameters<typeof buildBlogFormData>[0]) => {
  if (!blog.value) return;

  const formData = buildBlogFormData(payload);

  updateBlog(
    { id: blog.value.id, payload: formData },
    {
      onSuccess: () => {
        toast.success("بلاگ ویرایش شد.");
      },
      onError: (err: unknown) => {
        toast.apiError(err, "خطا در ذخیره‌ی بلاگ. دوباره تلاش کنید.");
      },
    },
  );
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
        <h1 class="admin-blog-edit__title">ویرایش بلاگ</h1>
      </div>

      <AdminButton
        label="ذخیره تغییرات"
        variant="primary"
        icon="tabler:check"
        :disabled="isPending || isLoading"
        @click="triggerSubmit"
      />
    </section>

    <div v-if="isLoading" class="admin-blog-edit__state">
      در حال بارگذاری بلاگ...
    </div>

    <div
      v-else-if="error || !blog"
      class="admin-blog-edit__state admin-blog-edit__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت اطلاعات بلاگ.</span>
    </div>

    <AdminBlogForm
      v-else
      ref="formRef"
      mode="edit"
      :initial-data="blog"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.admin-blog-edit {
  @apply flex flex-col gap-6  px-5 text-wrap;
}

.admin-blog-edit__topbar {
  @apply sticky top-0 z-10 text-wrap -mx-4 flex flex-col gap-3 border-b border-slate-200 bg-white/95
    px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between
    dark:border-slate-800 dark:bg-black/95;
}

.admin-blog-edit__topbar-right {
  @apply flex flex-col gap-5 text-wrap;
}

.admin-blog-edit__back {
  @apply inline-flex w-fit text-wrap items-center gap-1.5 text-xs font-semibold text-slate-500
    transition hover:text-[--gold-one]
    dark:text-slate-400;
}

.admin-blog-edit__title {
  @apply text-lg font-bold text-wrap text-slate-900 dark:text-white sm:text-xl;
}

.admin-blog-edit__state {
  @apply flex flex-col items-center text-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-blog-edit__state--error {
  @apply text-red-600 text-wrap dark:text-red-400;
}
</style>