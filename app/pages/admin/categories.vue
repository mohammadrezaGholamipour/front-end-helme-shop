<script setup lang="ts">
import type { CategoryOut } from "~/types";

definePageMeta({
  layout: "admin",
});

const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
const toast = useAppToast();

const {
  data: categories,
  isLoading,
  error,
} = useAllCategory() as {
  data: Ref<CategoryOut[] | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<unknown>;
};

const state = reactive({
  modal: false,
  mode: "create" as "create" | "edit",
  selectedId: null as number | null,
  pendingId: null as number | null,
  existingImage: "",
  deleteItem: null as CategoryOut | null,

  errors: {
    name: "",
    slug: "",
    image: "",
  },

  form: {
    name: "",
    slug: "",
    image: null as File | null,
  },
});

const generateSlugFromName = () => {
  state.form.slug = slugify(state.form.name);
};

const resetForm = () => {
  Object.assign(state.form, {
    name: "",
    slug: "",
    image: null,
  });

  state.selectedId = null;
  state.existingImage = "";
  state.errors.name = "";
  state.errors.slug = "";
  state.errors.image = "";
};

const openCreateModal = () => {
  resetForm();
  state.mode = "create";
  state.modal = true;
};

const openEditModal = (category: CategoryOut) => {
  resetForm();
  state.mode = "edit";
  state.selectedId = category.id;
  state.form.name = category.name;
  state.form.slug = category.slug ?? "";
  state.existingImage = category.image
    ? `https://sohangaz.com${category.image}`
    : "";
  state.modal = true;
};

const submitCategory = () => {
  const name = state.form.name.trim();
  const slug = state.form.slug.trim();

  state.errors.name = "";
  state.errors.slug = "";
  state.errors.image = "";

  let hasError = false;

  if (!name) {
    state.errors.name = "نام دسته‌بندی الزامی است.";
    hasError = true;
  }

  if (!slug) {
    state.errors.slug = "اسلاگ الزامی است.";
    hasError = true;
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    state.errors.slug =
      "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.";
    hasError = true;
  }

  const hasImage = !!state.form.image || !!state.existingImage;
  if (!hasImage) {
    state.errors.image = "انتخاب تصویر الزامی است.";
    hasError = true;
  }

  if (hasError) return;

  const payload = buildCategoryFormData({
    name,
    slug,
    image: state.form.image,
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
  payload.append("id", String(state.selectedId));
  updateCategory({ id: state.selectedId, payload }, { onSuccess, onError });
};

const askDelete = (category: CategoryOut) => {
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
</script>

<template>
  <div class="admin-categories">
    <section class="admin-categories__topbar">
      <div>
        <h1 class="admin-categories__title">مدیریت دسته‌بندی‌ها</h1>
        <p class="admin-categories__subtitle">
          دسته‌بندی‌های فروشگاه را اضافه، ویرایش یا حذف کنید.
        </p>
      </div>

      <AdminButton
        label="دسته‌بندی جدید"
        variant="primary"
        icon="tabler:plus"
        @click="openCreateModal"
      />
    </section>

    <section v-if="isLoading" class="admin-categories__grid">
      <div
        v-for="n in 4"
        :key="n"
        class="admin-categories__skeleton"
        aria-hidden="true"
      />
    </section>

    <section
      v-else-if="error"
      class="admin-categories__state admin-categories__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت دسته‌بندی‌ها. لطفا دوباره تلاش کنید.</span>
    </section>

    <section
      v-else-if="!categories?.length"
      class="admin-categories__state admin-categories__state--empty"
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

    <section v-else class="admin-categories__grid">
      <article
        v-for="category in categories"
        :key="category.id"
        class="admin-categories__card"
      >
        <div class="admin-categories__thumb">
          <img
            v-if="category.image"
            :src="`https://sohangaz.com${category.image}`"
            :alt="category.name"
            class="admin-categories__thumb-img"
            loading="lazy"
          />
          <div v-else class="admin-categories__thumb-placeholder">
            <Icon name="tabler:photo" class="h-8 w-8" />
          </div>
        </div>

        <div class="admin-categories__card-body">
          <h3 class="admin-categories__card-name">
            {{ category.name }}
          </h3>
          <p class="admin-categories__card-slug">
            {{ category.slug }}
          </p>
        </div>

        <div class="admin-categories__card-actions">
          <button
            type="button"
            class="admin-categories__action-button"
            @click="openEditModal(category)"
          >
            <Icon name="tabler:pencil" class="h-4 w-4" />
            ویرایش
          </button>

          <button
            type="button"
            class="admin-categories__action-button admin-categories__action-button--danger"
            :disabled="state.pendingId === category.id"
            @click="askDelete(category)"
          >
            <Icon name="tabler:trash" class="h-4 w-4" />
            حذف
          </button>
        </div>
      </article>
    </section>

    <AdminModal
      v-model="state.modal"
      :title="
        state.mode === 'create' ? 'ایجاد دسته‌بندی جدید' : 'ویرایش دسته‌بندی'
      "
      :action-label="state.mode === 'create' ? 'ایجاد' : 'ذخیره'"
      :loading="isSaving"
      @submit="submitCategory"
    >
      <div class="admin-categories__form">
        <AdminInput
          v-model="state.form.name"
          label="نام دسته‌بندی"
          placeholder="مثال: سوهان"
          :error="state.errors.name"
        />

        <div class="admin-categories__slug-field">
          <AdminInput
            v-model="state.form.slug"
            label="اسلاگ (URL)"
            placeholder="مثال: sohan"
            dir="ltr"
            :error="state.errors.slug"
          />
          <button
            type="button"
            class="admin-categories__slug-generate"
            :disabled="!state.form.name.trim()"
            @click="generateSlugFromName"
          >
            <Icon name="tabler:wand" class="h-3.5 w-3.5" />
            ساخت خودکار از نام
          </button>
        </div>

        <AdminImageUpload
          v-model="state.form.image"
          abel="تصویر دسته‌بندی"
          :existing-url="state.existingImage"
          :error="state.errors.image"
          class="admin-categories__form-full"
          @clear-existing="state.existingImage = ''"
        />
      </div>
    </AdminModal>

    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف دسته‌بندی"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="isDeleting"
      @submit="confirmDelete"
    >
      <p class="admin-categories__confirm-text">
        آیا از حذف دسته‌بندی
        <strong>{{ state.deleteItem?.name }}</strong>
        مطمئن هستید؟ این عملیات قابل بازگشت نیست.
      </p>
    </AdminModal>
  </div>
</template>

<style scoped>
.admin-categories {
  @apply flex flex-col gap-6 p-4;
}

.admin-categories__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-categories__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-categories__subtitle {
  @apply mt-1 text-sm text-slate-500 dark:text-slate-400;
}

.admin-categories__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-categories__state--error {
  @apply text-red-600 dark:text-red-400;
}

.admin-categories__state--empty {
  @apply text-slate-500 dark:text-slate-500;
}

.admin-categories__grid {
  @apply grid justify-center gap-5;
  grid-template-columns: repeat(auto-fill, 270px);
}

.admin-categories__skeleton {
  @apply aspect-[4/5] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60;
}

.admin-categories__card {
  @apply relative flex flex-col cursor-pointer  items-center gap-4 overflow-hidden rounded-2xl
    border-2 border-[--gold-one] bg-white p-4 pt-5 max-w-[300px] shadow-md
    transition duration-300 hover:-translate-y-1 hover:shadow-lg
    dark:bg-black dark:text-white;
}

.admin-categories__card-bg {
  @apply absolute inset-0 z-[-1] rounded-2xl opacity-[0.15];
  background: linear-gradient(
    135deg,
    #cecece 0%,
    #cecece 5%,
    transparent 5%,
    transparent 10%,
    #cecece 10%,
    #cecece 15%,
    transparent 15%,
    transparent 20%,
    #cecece 20%,
    #cecece 25%,
    transparent 25%,
    transparent 30%,
    #cecece 30%,
    #cecece 35%,
    transparent 35%,
    transparent 40%,
    #cecece 40%,
    #cecece 45%,
    transparent 45%,
    transparent 50%,
    #cecece 50%,
    #cecece 55%,
    transparent 55%,
    transparent 60%,
    #cecece 60%,
    #cecece 65%,
    transparent 65%,
    transparent 70%,
    #cecece 70%,
    #cecece 75%,
    transparent 75%,
    transparent 80%,
    #cecece 80%,
    #cecece 85%,
    transparent 85%,
    transparent 90%,
    #cecece 90%,
    #cecece 95%,
    transparent 95%
  );
  background-size: 1.5em 1.5em;
  background-color: #eff6ff;
}

.dark .admin-categories__card-bg {
  background-color: #000;
  opacity: 0.08;
}

.admin-categories__thumb {
  @apply w-[188px] overflow-hidden rounded-xl bg-slate-100 shadow-2xl
    dark:bg-slate-900;
}

.admin-categories__thumb-img {
  @apply h-full w-full object-cover transition duration-300;
  aspect-ratio: 1/1;
}

.admin-categories__card:hover .admin-categories__thumb-img {
  @apply scale-110;
}

.admin-categories__thumb-placeholder {
  @apply flex h-full w-full items-center justify-center text-slate-300
    dark:text-slate-700;
}

.admin-categories__card-body {
  @apply flex flex-col items-center gap-1 text-center;
}

.admin-categories__card-name {
  @apply max-w-[180px] truncate text-lg font-bold text-slate-900
    dark:text-white;
}

.admin-categories__card-slug {
  @apply inline-flex items-center justify-center self-center truncate rounded-xl
    px-3 py-1 text-xs  text-white shadow-md;
  background-image: var(--gold-gradiant);
  direction: ltr;
}

.admin-categories__card-actions {
  @apply flex w-full flex-wrap gap-2;
}

.admin-categories__action-button {
  @apply inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border
    border-slate-300 bg-white px-4 py-3 text-xs font-semibold text-slate-700
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
    dark:hover:border-[--gold-one] dark:hover:text-[--gold-one];
}

.admin-categories__action-button--danger {
  @apply border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-700
    dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400
    dark:hover:border-red-800 dark:hover:bg-red-950/60 dark:hover:text-red-400;
}

/* ---- فرم مودال ---- */

.admin-categories__form {
  @apply grid gap-7 md:grid-cols-2;
}

.admin-categories__form-full {
  @apply md:col-span-2;
}

.admin-categories__slug-field {
  @apply flex flex-col gap-1.5;
}

.admin-categories__slug-generate {
  @apply inline-flex w-fit items-center gap-1 text-xs font-semibold text-slate-500
    transition hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-40
    dark:text-slate-400;
}

.admin-categories__confirm-text {
  @apply text-sm leading-7 text-slate-600 dark:text-slate-300 text-wrap;
}
</style>
