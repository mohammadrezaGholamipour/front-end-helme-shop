<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import type { SliderOut } from "~/types";

definePageMeta({
  layout: "admin",
});

const { mutate: createSlider, isPending: isCreating } = useCreateSlider();
const { mutate: deleteSlider, isPending: isDeleting } = useDeleteSlider();
const { mutateAsync: updateDisplayOrder } = useUpdateSliderDisplayOrder();
const queryClient = useQueryClient();
const isReordering = ref(false);
const toast = useAppToast();

const {
  data: sliders,
  isLoading,
  error,
} = useAllSlider() as {
  data: Ref<SliderOut[] | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<unknown>;
};

const sortedSliders = computed(() => {
  if (!sliders.value) return [];
  return [...sliders.value].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
});

const state = reactive({
  modal: false,
  pendingId: null as number | null,
  deleteItem: null as SliderOut | null,

  errors: {
    image: "",
  },

  form: {
    image: null as File | null,
  },
});

const resetForm = () => {
  state.form.image = null;
  state.errors.image = "";
};

const openCreateModal = () => {
  resetForm();
  state.modal = true;
};

const submitSlider = () => {
  state.errors.image = "";

  if (!state.form.image) {
    state.errors.image = "انتخاب تصویر الزامی است.";
    return;
  }

  const payload = new FormData();
  payload.append("image", state.form.image);

  createSlider(payload, {
    onSuccess: () => {
      state.modal = false;
      toast.success("اسلاید ایجاد شد.");
    },
    onError: (err: unknown) => {
      toast.apiError(err, "خطا در ذخیره‌ی اسلاید. دوباره تلاش کنید.");
    },
  });
};

const askDelete = (slider: SliderOut) => {
  state.deleteItem = slider;
};

const cancelDelete = () => {
  if (isDeleting.value) return;
  state.deleteItem = null;
};

const confirmDelete = () => {
  if (!state.deleteItem) return;

  state.pendingId = state.deleteItem.id;

  deleteSlider(state.deleteItem.id, {
    onSuccess: () => {
      state.deleteItem = null;
      toast.success("اسلاید حذف شد.");
    },
    onError: (err: unknown) => {
      toast.apiError(err, "حذف اسلاید با خطا مواجه شد.");
    },
    onSettled: () => {
      state.pendingId = null;
    },
  });
};

const isDeleteModalOpen = computed({
  get: () => !!state.deleteItem,
  set: (value) => {
    if (!value) cancelDelete();
  },
});

/* ---------------- ترتیب‌دهی اسلایدرها ---------------- */

const isReorderModalOpen = ref(false);
const reorderList = ref<SliderOut[]>([]);

const openReorderModal = () => {
  reorderList.value = sortedSliders.value.map((item) => ({ ...item }));
  isReorderModalOpen.value = true;
};

const persistOrder = async (list: SliderOut[]) => {
  const payload = list.reduce<{ id: number; display_order: number }[]>(
    (result, item, index) => {
      const newOrder = index + 1;
      if (item.display_order !== newOrder) {
        result.push({ id: item.id, display_order: newOrder });
      }
      return result;
    },
    [],
  );

  if (!payload.length) return;

  isReordering.value = true;

  try {
    await updateDisplayOrder(payload);
    toast.success("ترتیب اسلایدرها بروزرسانی شد.");
    await queryClient.invalidateQueries({ queryKey: ["slider"] });
  } catch (err) {
    toast.apiError(err, "خطا در بروزرسانی ترتیب اسلایدرها.");
  } finally {
    isReordering.value = false;
  }
};

const saveReorder = async () => {
  await persistOrder(reorderList.value);
  isReorderModalOpen.value = false;
};
</script>

<template>
  <div class="admin-sliders">
    <section class="admin-sliders__topbar">
      <div>
        <h1 class="admin-sliders__title">مدیریت اسلایدر</h1>
        <p class="admin-sliders__subtitle">
          تصاویر اسلایدر صفحه‌ی اصلی را اضافه، حذف یا مرتب کنید.
        </p>
      </div>

      <div class="admin-sliders__topbar-actions">
        <AdminButton
          label="تغییر ترتیب"
          variant="secondary"
          icon="tabler:arrows-sort"
          :disabled="!sliders?.length"
          @click="openReorderModal"
        />
        <AdminButton
          label="اسلاید جدید"
          variant="primary"
          icon="tabler:plus"
          @click="openCreateModal"
        />
      </div>
    </section>

    <section v-if="isLoading" class="admin-sliders__grid">
      <div
        v-for="n in 8"
        :key="n"
        class="admin-sliders__skeleton"
        aria-hidden="true"
      />
    </section>

    <section
      v-else-if="error"
      class="admin-sliders__state admin-sliders__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت اسلایدرها. لطفا دوباره تلاش کنید.</span>
    </section>

    <section
      v-else-if="!sliders?.length"
      class="admin-sliders__state admin-sliders__state--empty"
    >
      <Icon name="tabler:photo" class="h-8 w-8" />
      <p>هنوز اسلایدی ثبت نشده است.</p>
      <AdminButton
        label="ساخت اولین اسلاید"
        variant="secondary"
        icon="tabler:plus"
        @click="openCreateModal"
      />
    </section>

    <section v-else class="admin-sliders__grid">
      <article
        v-for="slider in sortedSliders"
        :key="slider.id"
        class="admin-sliders__card"
      >
        <div class="admin-sliders__thumb">
          <img
            :src="`https://sohangaz.com${slider.image}`"
            alt="اسلاید"
            class="admin-sliders__thumb-img"
            draggable="false"
            loading="lazy"
          />
        </div>

        <div class="admin-sliders__card-actions">
          <button
            type="button"
            class="admin-sliders__action-button admin-sliders__action-button--danger"
            :disabled="state.pendingId === slider.id"
            @click="askDelete(slider)"
          >
            <Icon name="tabler:trash" class="h-4 w-4" />
            حذف
          </button>
        </div>
      </article>
    </section>

    <!-- مودال ایجاد -->
    <AdminModal
      v-model="state.modal"
      title="افزودن اسلاید جدید"
      action-label="ایجاد"
      :loading="isCreating"
      @submit="submitSlider"
    >
      <AdminImageUpload
        v-model="state.form.image"
        label="تصویر اسلایدر"
        :error="state.errors.image"
      />
    </AdminModal>

    <!-- مودال حذف -->
    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف اسلاید"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="isDeleting"
      @submit="confirmDelete"
    >
      <p class="admin-sliders__confirm-text">
        آیا از حذف این اسلاید مطمئن هستید؟ این عملیات قابل بازگشت نیست.
      </p>
    </AdminModal>

    <!-- مودال تغییر ترتیب -->
    <AdminModal
      v-model="isReorderModalOpen"
      title="تغییر ترتیب اسلایدرها"
      action-label="ذخیره ترتیب"
      cancel-label="انصراف"
      :loading="isReordering"
      @submit="saveReorder"
    >
      <p class="admin-sliders__reorder-hint">
        اسلایدها را با گرفتن دستگیره و جابجایی عمودی مرتب کنید.
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
          v-for="slider in reorderList"
          :key="slider.id"
          class="reorder-item"
        >
          <span class="reorder-item__handle" title="جابجایی ترتیب">
            <Icon name="tabler:grip-vertical" class="h-4 w-4" />
          </span>
          <img
            :src="`https://sohangaz.com${slider.image}`"
            class="reorder-item__thumb"
            alt="اسلاید"
          />
        </div>
      </VueDraggable>
    </AdminModal>
  </div>
</template>

<style scoped>
.admin-sliders {
  @apply flex flex-col gap-6 p-4;
}

.admin-sliders__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-sliders__topbar-actions {
  @apply flex flex-wrap gap-2;
}

.admin-sliders__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-sliders__subtitle {
  @apply mt-1 text-sm text-slate-500 dark:text-slate-400 leading-7 text-wrap;
}

.admin-sliders__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-sliders__state--error {
  @apply text-red-600 dark:text-red-400;
}

.admin-sliders__grid {
  @apply grid justify-center gap-5;
  grid-template-columns: repeat(auto-fill, 300px);
}

.admin-sliders__skeleton {
  @apply aspect-video animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60;
}

.admin-sliders__card {
  @apply relative flex flex-col gap-3 overflow-hidden rounded-2xl border-2
    border-[--gold-one] bg-white p-3 shadow-md transition duration-300
    hover:-translate-y-1 hover:shadow-lg dark:bg-black;
}

.admin-sliders__thumb {
  @apply aspect-square w-full overflow-hidden rounded-xl bg-slate-100
    dark:bg-slate-900;
}

.admin-sliders__thumb-img {
  @apply h-full w-full object-cover;
}

.admin-sliders__card-actions {
  @apply flex w-full gap-2;
}

.admin-sliders__action-button {
  @apply inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border
    border-slate-300 bg-white px-4 py-3 text-xs font-semibold text-slate-700
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300;
}

.admin-sliders__action-button--danger {
  @apply border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100
    dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400;
}

.admin-sliders__confirm-text {
  @apply text-sm leading-7 text-slate-600 dark:text-slate-300 text-wrap;
}

.admin-sliders__reorder-hint {
  @apply mb-3 text-xs text-slate-500 dark:text-slate-400;
}

.reorder-list {
  @apply flex max-h-[60vh] flex-col gap-2 overflow-y-auto;
}

.reorder-item {
  @apply flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5
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

.reorder-item__thumb {
  @apply w-[100px] aspect-square rounded-lg shrink-0 object-cover;
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