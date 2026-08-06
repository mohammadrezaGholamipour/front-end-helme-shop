<script setup lang="ts">
import type { BlogListItem, BlogListParams } from "~/types";
import { BlogStatus } from "~/types";
import type { AdminSelectOption } from "~/components/Admin/AdminSelect.vue";

definePageMeta({
  layout: "admin",
});

const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();
const toast = useAppToast();

const filters = reactive({
  page: 1,
  per_page: 12,
  search: "",
  category: undefined as string | undefined,
  status: undefined as BlogStatus | undefined,
});

const params = computed<BlogListParams>(() => ({
  page: filters.page,
  per_page: filters.per_page,
  search: filters.search || undefined,
  category: filters.category,
  status: filters.status,
}));

const { data: response, isLoading, error } = useAllBlogs(params);
const { data: categories } = useAllBlogCategories();

const blogs = computed<BlogListItem[]>(() => response.value?.blogs ?? []);

const categoryOptions = computed<AdminSelectOption[]>(() => [
  { label: "همه دسته‌بندی‌ها", value: undefined },
  ...(categories.value ?? []).map((cat) => ({
    label: cat.name,
    value: cat.slug,
  })),
]);

const statusOptions: AdminSelectOption[] = [
  { label: "پیش‌نویس", value: BlogStatus.DRAFT },
  { label: "منتشر شده", value: BlogStatus.PUBLISHED },
];

watch(
  () => [filters.search, filters.category, filters.status],
  () => {
    filters.page = 1;
  },
);

const statusLabel = (status: BlogStatus) =>
  status === BlogStatus.PUBLISHED ? "منتشر شده" : "پیش‌نویس";

const deleteItem = ref<BlogListItem | null>(null);
const pendingId = ref<number | null>(null);

const askDelete = (blog: BlogListItem) => {
  deleteItem.value = blog;
};

const cancelDelete = () => {
  if (isDeleting.value) return;
  deleteItem.value = null;
};

const confirmDelete = () => {
  if (!deleteItem.value) return;

  pendingId.value = deleteItem.value.id;

  deleteBlog(deleteItem.value.id, {
    onSuccess: () => {
      deleteItem.value = null;
      toast.success("بلاگ حذف شد.");
    },
    onError: (err: unknown) => {
      toast.apiError(err, "حذف بلاگ با خطا مواجه شد.");
    },
    onSettled: () => {
      pendingId.value = null;
    },
  });
};

const isDeleteModalOpen = computed({
  get: () => !!deleteItem.value,
  set: (value) => {
    if (!value) cancelDelete();
  },
});
</script>

<template>
  <div class="admin-blogs">
    <section class="admin-blogs__topbar">
      <div>
        <h1 class="admin-blogs__title">مدیریت بلاگ</h1>
        <p class="admin-blogs__subtitle">
          مقالات بلاگ فروشگاه را اضافه، ویرایش یا حذف کنید.
        </p>
      </div>

      <div class="admin-blogs__topbar-actions">
        <AdminButton
          label="دسته‌بندی‌های بلاگ"
          variant="secondary"
          icon="tabler:category-2"
          @click="navigateTo('/admin/blog-categories')"
        />
        <AdminButton
          label="بلاگ جدید"
          variant="primary"
          icon="tabler:plus"
          @click="navigateTo('/admin/blog/create')"
        />
      </div>
    </section>

    <section class="admin-blogs__filters">
      <div class="admin-blogs__search-wrap">
        <Icon name="tabler:search" class="admin-blogs__search-icon h-4 w-4" />
        <input
          v-model="filters.search"
          type="text"
          placeholder="جستجوی عنوان بلاگ..."
          class="admin-blogs__search"
        />
      </div>

      <AdminSelect
        v-model="filters.category"
        :options="categoryOptions"
        icon="tabler:category-2"
        placeholder="همه دسته‌بندی‌ها"
      />
    </section>

    <section v-if="isLoading" class="admin-blogs__grid">
      <div
        v-for="n in 8"
        :key="n"
        class="admin-blogs__skeleton"
        aria-hidden="true"
      />
    </section>

    <section
      v-else-if="error"
      class="admin-blogs__state admin-blogs__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت بلاگ‌ها. لطفا دوباره تلاش کنید.</span>
    </section>

    <section
      v-else-if="!blogs.length"
      class="admin-blogs__state admin-blogs__state--empty"
    >
      <Icon name="tabler:article" class="h-8 w-8" />
      <p>هنوز بلاگی ثبت نشده است.</p>
      <AdminButton
        label="ساخت بلاگ"
        variant="secondary"
        icon="tabler:plus"
        @click="navigateTo('/admin/blog/create')"
      />
    </section>

    <section v-else class="admin-blogs__grid">
      <article v-for="blog in blogs" :key="blog.id" class="admin-blogs__card">
        <div class="admin-blogs__thumb">
          <img
            v-if="blog.image"
            :src="`https://sohangaz.com${blog.image}`"
            :alt="blog.title"
            class="admin-blogs__thumb-img"
            loading="lazy"
          />
          <div v-else class="admin-blogs__thumb-placeholder">
            <Icon name="tabler:photo" class="h-8 w-8" />
          </div>

          <span
            class="admin-blogs__badge"
            :class="{
              'admin-blogs__badge--published':
                blog.status === BlogStatus.PUBLISHED,
            }"
          >
            {{ statusLabel(blog.status) }}
          </span>

          <span v-if="blog.is_featured" class="admin-blogs__featured">
            <Icon name="tabler:star-filled" class="h-3.5 w-3.5" />
            ویژه
          </span>
        </div>

        <div class="admin-blogs__card-body">
          <h3 class="admin-blogs__card-title">{{ blog.title }}</h3>
          <h5 class="text-wrap line-clamp-2 text-sm">{{ blog.summary }}</h5>

          <div class="admin-blogs__card-meta">
            <span
              ><Icon name="tabler:eye" class="h-3.5 w-3.5" />
              {{ blog.views }}</span
            >
            <span v-if="blog.reading_time">
              <Icon name="tabler:clock" class="h-3.5 w-3.5" />
              {{ blog.reading_time }} دقیقه
            </span>
            <span v-if="blog.category" >
              <Icon name="tabler:category-2" class="h-3.5 w-3.5" />
              {{ blog.category.name }}
            </span>
          </div>
        </div>

        <div class="admin-blogs__card-actions">
          <button
            type="button"
            class="admin-blogs__action-button"
            @click="navigateTo(`/admin/blog/${blog.slug}/edit`)"
          >
            <Icon name="tabler:pencil" class="h-4 w-4" />
            ویرایش
          </button>

          <button
            type="button"
            class="admin-blogs__action-button admin-blogs__action-button--danger"
            :disabled="pendingId === blog.id"
            @click="askDelete(blog)"
          >
            <Icon name="tabler:trash" class="h-4 w-4" />
            حذف
          </button>
        </div>
      </article>
    </section>

    <section
      v-if="response && response.last_page > 1"
      class="admin-blogs__pagination"
    >
      <button
        type="button"
        class="admin-blogs__page-btn"
        :disabled="filters.page <= 1"
        @click="filters.page--"
      >
        <Icon name="tabler:chevron-right" class="h-4 w-4" />
        قبلی
      </button>

      <span class="admin-blogs__page-info">
        صفحه {{ response.page }} از {{ response.last_page }}
      </span>

      <button
        type="button"
        class="admin-blogs__page-btn"
        :disabled="filters.page >= response.last_page"
        @click="filters.page++"
      >
        بعدی
        <Icon name="tabler:chevron-left" class="h-4 w-4" />
      </button>
    </section>

    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف بلاگ"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="isDeleting"
      @submit="confirmDelete"
    >
      <p class="admin-blogs__confirm-text">
        آیا از حذف بلاگ
        <strong>{{ deleteItem?.title }}</strong>
        مطمئن هستید؟ این عملیات قابل بازگشت نیست.
      </p>
    </AdminModal>
  </div>
</template>

<style scoped>
.admin-blogs {
  @apply flex flex-col gap-6 p-4;
}

.admin-blogs__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-blogs__topbar-actions {
  @apply flex flex-wrap gap-2;
}

.admin-blogs__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-blogs__subtitle {
  @apply mt-1 text-sm text-slate-500 dark:text-slate-400 leading-7 text-wrap;
}

.admin-blogs__filters {
  @apply flex flex-col gap-2 sm:flex-row;
}

.admin-blogs__search-wrap {
  @apply relative w-full flex-1;
}

.admin-blogs__search-icon {
  @apply pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400
    dark:text-slate-500;
}

.admin-blogs__search {
  @apply w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3.5 pr-10 text-sm
    text-slate-900 shadow-sm outline-none transition-all duration-200
    focus:border-[--gold-one] focus:ring-2 focus:ring-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

.admin-blogs__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-blogs__state--error {
  @apply text-red-600 dark:text-red-400;
}

.admin-blogs__state--empty {
  @apply text-slate-500 dark:text-slate-500;
}

.admin-blogs__grid {
  @apply grid justify-center gap-5;
  grid-template-columns: repeat(auto-fill, 280px);
}

.admin-blogs__skeleton {
  @apply aspect-[4/5] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60;
}

.admin-blogs__card {
  @apply relative flex flex-col overflow-hidden rounded-2xl border-2 border-[--gold-one]
    bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg
    dark:bg-black dark:text-white;
}

.admin-blogs__thumb {
  @apply relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900;
}

.admin-blogs__thumb-img {
  @apply h-full w-full object-cover;
}

.admin-blogs__thumb-placeholder {
  @apply flex h-full w-full items-center justify-center text-slate-300
    dark:text-slate-700;
}

.admin-blogs__badge {
  @apply absolute right-2 top-2 rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px]
    font-semibold text-white;
}

.admin-blogs__badge--published {
  @apply bg-emerald-600/90;
}

.admin-blogs__featured {
  @apply absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[--gold-one]
    px-2.5 py-1 text-[11px] font-semibold text-white;
}

.admin-blogs__card-body {
  @apply flex flex-1 flex-col gap-1 p-4;
}

.admin-blogs__card-title {
  @apply line-clamp-2 text-sm leading-6 text-wrap font-bold text-slate-900 dark:text-white;
}

.admin-blogs__card-category {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.admin-blogs__card-meta {
  @apply mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400;
}

.admin-blogs__card-meta span {
  @apply inline-flex items-center gap-1;
}

.admin-blogs__card-actions {
  @apply flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800;
}

.admin-blogs__action-button {
  @apply inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border
    border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
    dark:hover:border-[--gold-one] dark:hover:text-[--gold-one];
}

.admin-blogs__action-button--danger {
  @apply border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-700
    dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400
    dark:hover:border-red-800 dark:hover:bg-red-950/60 dark:hover:text-red-400;
}

.admin-blogs__pagination {
  @apply flex items-center justify-center gap-4;
}

.admin-blogs__page-btn {
  @apply inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2
    text-sm font-semibold text-slate-700 transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-40
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300;
}

.admin-blogs__page-info {
  @apply text-sm text-slate-500 dark:text-slate-400;
}

.admin-blogs__confirm-text {
  @apply text-sm leading-7 text-slate-600 dark:text-slate-300 text-wrap;
}
</style>
