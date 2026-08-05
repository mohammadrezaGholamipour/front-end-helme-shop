<script setup lang="ts">
definePageMeta({ layout: "admin" });

import type { CategoryOut } from "~/types";
import {
  useAllCategory,
  useCreateCategory,
  useDeleteCategory,
  buildCategoryFormData,
} from "~/composables/category";
import { CategoryApi } from "~/services/category";

const { $api } = useNuxtApp();
const queryClient = useQueryClient();

const { data, isLoading, error } = useAllCategory() as unknown as {
  data: CategoryOut[] | undefined;
  isLoading: boolean;
  error: unknown;
};

const selectedCategoryId = ref<number | null>(null);
const createCategoryMutation = useCreateCategory();
const updateCategoryMutation = useMutation<CategoryOut, unknown, FormData>({
  mutationFn: (payload: FormData) =>
    CategoryApi.update($api, selectedCategoryId.value ?? 0, payload),
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["category"] as const }),
});
const deleteCategoryMutation = useDeleteCategory();

const isModalOpen = ref(false);
const formMode = ref<"create" | "edit">("create");
const formError = ref("");

const formData = reactive<{ name: string; image: File | null }>({
  name: "",
  image: null,
});


const existingImageUrl = ref("");
const pendingId = ref<number | null>(null);
const categoryToDelete = ref<CategoryOut | null>(null);

function openCreateModal() {
  formMode.value = "create";
  selectedCategoryId.value = null;
  formData.name = "";
  formData.image = null;
  existingImageUrl.value = "";
  formError.value = "";
  isModalOpen.value = true;
}

function openEditModal(category: CategoryOut) {
  formMode.value = "edit";
  selectedCategoryId.value = category.id;
  formData.name = category.name;
  formData.image = null;
  existingImageUrl.value = category.image ?? "";
  formError.value = "";
  isModalOpen.value = true;
}

function submitCategory() {
  const name = formData.name.trim();

  if (!name) {
    formError.value = "نام دسته‌بندی الزامی است.";
    return;
  }

  formError.value = "";
  const payload = buildCategoryFormData({ name, image: formData.image });

  if (formMode.value === "create") {
    pendingId.value = null;
    createCategoryMutation.mutate(payload, {
      onSuccess: () => (isModalOpen.value = false),
    });
  } else if (selectedCategoryId.value !== null) {
    updateCategoryMutation.mutate(payload, {
      onSuccess: () => (isModalOpen.value = false),
    });
  }
}

function askDelete(category: CategoryOut) {
  categoryToDelete.value = category;
}

function cancelDelete() {
  categoryToDelete.value = null;
}

function confirmDelete() {
  if (!categoryToDelete.value) return;
  pendingId.value = categoryToDelete.value.id;
  deleteCategoryMutation.mutate(categoryToDelete.value.id, {
    onSettled: () => {
      pendingId.value = null;
      categoryToDelete.value = null;
    },
  });
}

const isSaving = computed(
  () => createCategoryMutation.isLoading || updateCategoryMutation.isLoading,
);

const isDeleteModalOpen = computed({
  get: () => !!categoryToDelete.value,
  set: (value: boolean) => {
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
      v-else-if="!data?.length"
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
        v-for="category in data"
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
          <h3 class="admin-categories__card-name">{{ category.name }}</h3>
          <p class="admin-categories__card-slug">{{ category.slug }}</p>
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
            :disabled="pendingId === category.id"
            @click="askDelete(category)"
          >
            <Icon name="tabler:trash" class="h-4 w-4" />
            حذف
          </button>
        </div>
      </article>
    </section>

    <AdminModal
      v-model="isModalOpen"
      :title="
        formMode === 'create' ? 'ایجاد دسته‌بندی جدید' : 'ویرایش دسته‌بندی'
      "
      :actionLabel="formMode === 'create' ? 'ایجاد' : 'ذخیره'"
      :loading="isSaving"
      @submit="submitCategory"
    >
      <div class="admin-categories__form">
        <AdminInput
          label="نام دسته‌بندی"
          v-model="formData.name"
          placeholder="مثال: سوهان"
          :error="formError"
        />
        <AdminImageUpload
          label="تصویر دسته‌بندی (اختیاری)"
          v-model="formData.image"
          :existing-url="existingImageUrl"
          @clear-existing="existingImageUrl = ''"
        />
      </div>
    </AdminModal>

    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف دسته‌بندی"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="deleteCategoryMutation.isLoading"
      @submit="confirmDelete"
    >
      <p class="admin-categories__confirm-text">
        آیا از حذف دسته‌بندی
        <strong>{{ categoryToDelete?.name }}</strong>
        مطمئن هستید؟ این عملیات قابل بازگشت نیست.
      </p>
    </AdminModal>
  </div>
</template>

<style scoped>
.admin-categories {
  @apply flex flex-col gap-6;
}

.admin-categories__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-categories__title {
  @apply text-xl font-bold sm:text-2xl;
}

.admin-categories__subtitle {
  @apply mt-1 text-sm text-slate-500;
}

.admin-categories__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-700 shadow-sm;
}

.admin-categories__state--error {
  @apply text-red-600;
}

.admin-categories__state--empty {
  @apply text-slate-500;
}

.admin-categories__grid {
  @apply grid justify-center gap-5;
  grid-template-columns: repeat(auto-fill, 220px);
}

.admin-categories__skeleton {
  @apply aspect-[4/5] animate-pulse rounded-3xl bg-slate-200/70;
}

.admin-categories__card {
  @apply flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md;
}

.admin-categories__thumb {
  @apply   overflow-hidden bg-slate-100;
}

.admin-categories__thumb-img {
  @apply h-full w-full object-fill transition duration-300;
  aspect-ratio: 1/1;
  width: 220px;
}

.admin-categories__card:hover .admin-categories__thumb-img {
  @apply scale-105;
}

.admin-categories__thumb-placeholder {
  @apply flex h-full w-full items-center justify-center text-slate-300;
}

.admin-categories__card-body {
  @apply flex flex-1 flex-col gap-1 px-4 pt-3;
}

.admin-categories__card-name {
  @apply truncate text-base font-bold text-slate-900;
}

.admin-categories__card-slug {
  @apply truncate text-xs text-slate-400;
  direction: ltr;
  text-align: right;
}

.admin-categories__card-actions {
  @apply flex flex-wrap gap-2 p-4 pt-3;
}

.admin-categories__action-button {
  @apply inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}

.admin-categories__action-button--danger {
  @apply border-red-200 bg-red-50 text-red-700 hover:bg-red-100;
}

.admin-categories__form {
  @apply grid gap-4 md:grid-cols-2;
}

.admin-categories__confirm-text {
  @apply text-sm leading-7 text-slate-600;
}
</style>
