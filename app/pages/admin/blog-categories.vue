<script setup lang="ts">
import { buildBlogCategoryFormData } from "~/utils/blog";
import { VueDraggable } from "vue-draggable-plus";
import type { BlogCategoryOut } from "~/types";

definePageMeta({
  layout: "admin",
});

const { mutate: createCategory, isPending: isCreating } =
  useCreateBlogCategory();
const { mutate: updateCategory, isPending: isUpdating } =
  useUpdateBlogCategory();
const { mutate: deleteCategory, isPending: isDeleting } =
  useDeleteBlogCategory();
const { mutateAsync: updateDisplayOrder } = useUpdateBlogCategoryDisplayOrder();
const toast = useAppToast();
const isReordering = ref(false);

const { data: categories, isLoading, error } = useAllBlogCategories();

const sortedCategories = computed(() => {
  if (!categories.value) return [];
  return [...categories.value].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
});

const state = reactive({
  modal: false,
  mode: "create" as "create" | "edit",
  selectedId: null as number | null,
  pendingId: null as number | null,
  deleteItem: null as BlogCategoryOut | null,

  errors: {
    name: "",
    slug: "",
  },

  form: {
    name: "",
    slug: "",
  },
});

const generateSlugFromName = () => {
  state.form.slug = slugify(state.form.name);
};

const resetForm = () => {
  Object.assign(state.form, { name: "", slug: "" });
  state.selectedId = null;
  state.errors.name = "";
  state.errors.slug = "";
};

const openCreateModal = () => {
  resetForm();
  state.mode = "create";
  state.modal = true;
};

const openEditModal = (category: BlogCategoryOut) => {
  resetForm();
  state.mode = "edit";
  state.selectedId = category.id;
  state.form.name = category.name;
  state.form.slug = category.slug ?? "";
  state.modal = true;
};

const submitCategory = () => {
  const name = state.form.name.trim();
  const slug = state.form.slug.trim();

  state.errors.name = "";
  state.errors.slug = "";

  let hasError = false;

  if (!name) {
    state.errors.name = "نام دسته‌بندی الزامی است.";
    hasError = true;
  }

  if (!slug) {
    state.errors.slug = "نام لینک الزامی است.";
    hasError = true;
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    state.errors.slug =
      "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.";
    hasError = true;
  }

  if (hasError) return;

  const payload = buildBlogCategoryFormData({
    name,
    slug,
    display_order:
      state.mode === "create" ? (categories.value?.length ?? 0) : undefined,
  });

  const onSuccess = () => {
    state.modal = false;
    toast.success(
      state.mode === "create" ? "دسته‌بندی ایجاد شد." : "دسته‌بندی ویرایش شد.",
    );
  };

  const onError = (err: unknown) => {
    toast.apiError(err, "خطا در ذخیره‌ی دسته‌بندی. دوباره تلاش کنید.");
  };

  if (state.mode === "create") {
    createCategory(payload, { onSuccess, onError });
    return;
  }

  if (!state.selectedId) return;
  updateCategory({ id: state.selectedId, payload }, { onSuccess, onError });
};

const askDelete = (category: BlogCategoryOut) => {
  state.deleteItem = category;
};

const cancelDelete = () => {
  if (isDeleting.value) return;
  state.deleteItem = null;
};

const confirmDelete = () => {
  if (!state.deleteItem) return;

  state.pendingId = state.deleteItem.id;

  deleteCategory(state.deleteItem.id, {
    onSuccess: () => {
      state.deleteItem = null;
      toast.success("دسته‌بندی حذف شد.");
    },
    onError: (err: unknown) => {
      toast.apiError(err, "حذف دسته‌بندی با خطا مواجه شد.");
    },
    onSettled: () => {
      state.pendingId = null;
    },
  });
};

const isSaving = computed(() => isCreating.value || isUpdating.value);

const isDeleteModalOpen = computed({
  get: () => !!state.deleteItem,
  set: (value) => {
    if (!value) cancelDelete();
  },
});

/* ---------------- ترتیب‌دهی دسته‌بندی‌های بلاگ ---------------- */

const isReorderModalOpen = ref(false);
const reorderList = ref<BlogCategoryOut[]>([]);

const openReorderModal = () => {
  reorderList.value = sortedCategories.value.map((item) => ({ ...item }));
  isReorderModalOpen.value = true;
};

const saveReorder = async () => {
  const payload = reorderList.value.reduce<
    { id: number; name: string; slug: string; display_order: number }[]
  >((result, item, index) => {
    if (item.display_order !== index) {
      result.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        display_order: index,
      });
    }
    return result;
  }, []);

  if (!payload.length) {
    isReorderModalOpen.value = false;
    return;
  }

  isReordering.value = true;

  try {
    await updateDisplayOrder(payload);
    toast.success("ترتیب دسته‌بندی‌ها بروزرسانی شد.");
    isReorderModalOpen.value = false;
  } catch (err) {
    toast.apiError(err, "خطا در بروزرسانی ترتیب دسته‌بندی‌ها.");
  } finally {
    isReordering.value = false;
  }
};
</script>

<template>
  <div class="admin-blog-categories">
    <section class="admin-blog-categories__topbar">
      <div>
        <h1 class="admin-blog-categories__title">دسته‌بندی‌های بلاگ</h1>
        <p class="admin-blog-categories__subtitle">
          دسته‌بندی‌های مربوط به مقالات بلاگ را مدیریت کنید
        </p>
      </div>

      <div class="admin-blog-categories__topbar-actions">
        <AdminButton
          label="تغییر ترتیب"
          variant="secondary"
          icon="tabler:arrows-sort"
          :disabled="!categories?.length"
          @click="openReorderModal"
        />
        <AdminButton
          label="دسته‌بندی جدید"
          variant="primary"
          icon="tabler:plus"
          @click="openCreateModal"
        />
      </div>
    </section>

    <section v-if="isLoading" class="admin-blog-categories__grid">
      <div
        v-for="n in 6"
        :key="n"
        class="cat-card-skeleton"
        aria-hidden="true"
      />
    </section>

    <section
      v-else-if="error"
      class="admin-blog-categories__state admin-blog-categories__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت دسته‌بندی‌ها. لطفا دوباره تلاش کنید.</span>
    </section>

    <section
      v-else-if="!categories?.length"
      class="admin-blog-categories__state admin-blog-categories__state--empty"
    >
      <Icon name="tabler:category-2" class="h-8 w-8" />
      <p>هنوز دسته‌بندی‌ای ثبت نشده است.</p>
      <AdminButton
        label="ساخت اولین دسته‌بندی"
        variant="secondary"
        icon="tabler:plus"
        @click="openCreateModal"
      />
    </section>

    <section v-else class="admin-blog-categories__grid">
      <article
        v-for="(category, index) in sortedCategories"
        :key="category.id"
        class="cat-card"
      >
        <div class="cat-card__quick-actions">
          <button
            type="button"
            class="cat-card__icon-btn"
            title="ویرایش"
            @click="openEditModal(category)"
          >
            <Icon name="tabler:pencil" class="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            class="cat-card__icon-btn cat-card__icon-btn--danger"
            title="حذف"
            :disabled="state.pendingId === category.id"
            @click="askDelete(category)"
          >
            <Icon name="tabler:trash" class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="cat-card__icon" :style="{ '--hue': (index * 47) % 360 }">
          <Icon name="tabler:tag" class="h-5 w-5" />
        </div>

        <h3 class="cat-card__name">{{ category.name }}</h3>
      </article>
    </section>

    <!-- مودال ایجاد / ویرایش -->
    <AdminModal
      v-model="state.modal"
      :title="
        state.mode === 'create' ? 'ایجاد دسته‌بندی جدید' : 'ویرایش دسته‌بندی'
      "
      :action-label="state.mode === 'create' ? 'ایجاد' : 'ذخیره'"
      :loading="isSaving"
      @submit="submitCategory"
    >
      <div class="admin-blog-categories__form">
        <AdminInput
          v-model="state.form.name"
          label="نام دسته‌بندی"
          placeholder="مثال: اخبار سوهان"
          :error="state.errors.name"
        />

        <div class="admin-blog-categories__slug-field">
          <AdminInput
            v-model="state.form.slug"
            label="اسلاگ (URL)"
            placeholder="مثال: sohan-news"
            dir="ltr"
            :error="state.errors.slug"
          />
          <button
            type="button"
            class="admin-blog-categories__slug-generate"
            :disabled="!state.form.name.trim()"
            @click="generateSlugFromName"
          >
            <Icon name="tabler:wand" class="h-3.5 w-3.5" />
            ساخت خودکار از نام
          </button>
        </div>
      </div>
    </AdminModal>

    <!-- مودال حذف -->
    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف دسته‌بندی"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="isDeleting"
      @submit="confirmDelete"
    >
      <p class="admin-blog-categories__confirm-text">
        آیا از حذف دسته‌بندی
        <strong>{{ state.deleteItem?.name }}</strong>
        مطمئن هستید؟ این عملیات قابل بازگشت نیست.
      </p>
    </AdminModal>

    <!-- مودال تغییر ترتیب -->
    <AdminModal
      v-model="isReorderModalOpen"
      title="تغییر ترتیب دسته‌بندی‌ها"
      action-label="ذخیره ترتیب"
      cancel-label="انصراف"
      :loading="isReordering"
      @submit="saveReorder"
    >
      <p class="admin-blog-categories__reorder-hint">
        دسته‌بندی‌ها را با گرفتن دستگیره و جابجایی عمودی مرتب کنید.
      </p>

      <VueDraggable
        v-model="reorderList"
        direction="vertical"
        handle=".reorder-item__handle"
        ghost-class="reorder-item__ghost"
        chosen-class="reorder-item__chosen"
        drag-class="reorder-item__dragging"
        :force-fallback="true"
        :fallback-tolerance="3"
        :delay-on-touch-only="true"
        :touch-start-threshold="5"
        :delay="120"
        :animation="150"
        class="reorder-list"
      >
        <div
          v-for="category in reorderList"
          :key="category.id"
          class="reorder-item"
        >
          <span class="reorder-item__handle" title="جابجایی ترتیب">
            <Icon name="tabler:grip-vertical" class="h-4 w-4" />
          </span>
          <span class="reorder-item__name">{{ category.name }}</span>
        </div>
      </VueDraggable>
    </AdminModal>
  </div>
</template>

<style scoped>
.admin-blog-categories {
  @apply flex flex-col gap-6 p-4;
}

.admin-blog-categories__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-blog-categories__topbar-actions {
  @apply flex flex-wrap gap-2;
}

.admin-blog-categories__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-blog-categories__subtitle {
  @apply mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400 leading-7 text-wrap;
}

.admin-blog-categories__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-blog-categories__state--error {
  @apply text-red-600 dark:text-red-400;
}

.admin-blog-categories__state--empty {
  @apply text-slate-500 dark:text-slate-500;
}

.admin-blog-categories__list {
  @apply flex flex-col gap-3;
}

.admin-blog-categories__grid {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.cat-card-skeleton {
  @apply aspect-square animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60;
}

.cat-card__quick-actions {
  @apply absolute  top-2 flex gap-1 opacity-0 transition-opacity duration-200;
}

.cat-card:hover .cat-card__quick-actions {
  @apply opacity-100;
}

@media (max-width: 640px) {
  .cat-card__quick-actions {
    @apply opacity-100;
  }
}

.cat-card__icon-btn {
  @apply flex h-10 w-10 items-center justify-center rounded-full border
    border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-40
    dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400;
}

.cat-card__icon-btn--danger {
  @apply hover:border-red-300 hover:bg-red-50 hover:text-red-600
    dark:hover:border-red-900/40 dark:hover:bg-red-950/40 dark:hover:text-red-400;
}

.cat-card {
  @apply relative flex flex-col items-center gap-2 rounded-2xl border-2
    border-slate-200 bg-white px-4 py-6 text-center shadow-sm
    transition-all duration-300
    hover:-translate-y-1 hover:border-[--gold-one] hover:shadow-lg
    dark:border-slate-800 dark:bg-black;
}

.cat-card__icon {
  @apply flex h-12 w-12 items-center justify-center rounded-full text-white
    shadow-md transition-transform duration-300 group-hover:scale-110;
  background: linear-gradient(
    135deg,
    hsl(var(--hue) 70% 55%),
    hsl(calc(var(--hue) + 35) 70% 45%)
  );
}

.cat-card__name {
  @apply mt-1 line-clamp-1 max-w-full text-sm font-bold text-slate-900 dark:text-white;
}

.cat-card__actions {
  @apply mt-2 flex items-center gap-1.5 opacity-0 transition-opacity duration-200
    group-hover:opacity-100
    max-sm:opacity-100;
}

.cat-card__btn {
  @apply flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200
    bg-slate-50 text-slate-500 transition
    hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-40
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400;
}

.cat-card__btn--danger {
  @apply hover:border-red-300 hover:bg-red-50 hover:text-red-600
    dark:hover:border-red-900/40 dark:hover:bg-red-950/40 dark:hover:text-red-400;
}

.admin-blog-categories__skeleton {
  @apply h-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60;
}

.admin-blog-categories__row {
  @apply flex flex-col items-start justify-between gap-3 rounded-2xl border-2
    border-[--gold-one] bg-white p-4 shadow-sm transition hover:shadow-md
    sm:flex-row sm:items-center
    dark:bg-black dark:text-white;
}

.admin-blog-categories__row-info {
  @apply flex flex-col gap-0.5;
}

.admin-blog-categories__row-name {
  @apply text-base font-bold text-slate-900 dark:text-white;
}

.admin-blog-categories__row-slug {
  @apply text-xs text-slate-500 dark:text-slate-400;
}

.admin-blog-categories__row-actions {
  @apply flex w-full gap-2 sm:w-auto;
}

.admin-blog-categories__action-button {
  @apply inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border
    border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
    dark:hover:border-[--gold-one] dark:hover:text-[--gold-one] sm:flex-none;
}

.admin-blog-categories__action-button--danger {
  @apply border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-700
    dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400
    dark:hover:border-red-800 dark:hover:bg-red-950/60 dark:hover:text-red-400;
}

.admin-blog-categories__form {
  @apply grid gap-7;
}

.admin-blog-categories__slug-field {
  @apply flex flex-col gap-1.5;
}

.admin-blog-categories__slug-generate {
  @apply inline-flex w-fit items-center gap-1 text-xs font-semibold text-slate-500
    transition hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-40
    dark:text-slate-400;
}

.admin-blog-categories__confirm-text {
  @apply text-sm leading-7 text-slate-600 dark:text-slate-300 text-wrap;
}

.admin-blog-categories__reorder-hint {
  @apply mb-3 text-xs text-slate-500 dark:text-slate-400;
}

.reorder-list {
  @apply flex max-h-[60vh] flex-col gap-2 overflow-y-auto;
}

.reorder-item {
  @apply flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5
    dark:border-slate-800 dark:bg-slate-900;
}

.reorder-item__handle {
  @apply flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
    bg-slate-100 text-slate-400
    dark:bg-slate-800 dark:text-slate-500;
  cursor: grab;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.reorder-item__handle:active {
  cursor: grabbing;
}

.reorder-item__name {
  @apply flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100;
}

.reorder-item__ghost {
  @apply opacity-30;
}

.reorder-item__chosen {
  @apply ring-2 ring-[--gold-one];
}

.reorder-item__dragging {
  @apply shadow-xl;
  z-index: 999;
}
</style>
