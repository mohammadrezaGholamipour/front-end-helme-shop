<script setup lang="ts">
import type { ProductOut, VariantOut } from "~/types";

definePageMeta({
  layout: "admin",
});

// ---------- محصول ----------
const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

// ---------- مدل محصول (وزن / قیمت / موجودی) ----------
const { mutate: createVariant, isPending: isCreatingVariant } =
  useCreateVariant();
const { mutate: updateVariant, isPending: isUpdatingVariant } =
  useUpdateVariant();
const { mutate: deleteVariant, isPending: isDeletingVariant } =
  useDeleteVariant();

const toast = useAppToast();

const {
  data: products,
  isLoading,
  error,
} = useAllProduct() as {
  data: Ref<ProductOut[] | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<unknown>;
};

// برای پرکردن select دسته‌بندی از همان composable صفحه‌ی دسته‌بندی‌ها استفاده می‌کنیم
const { data: categories } = useAllCategory() as {
  data: Ref<{ id: number; name: string }[] | undefined>;
};

const productTypeOptions = [
  { label: "سوهان", value: "SOHAN" },
  { label: "گز", value: "GAZ" },
];

const productModelOptions = [
  { label: "حبه", value: "HOBEH" },
  { label: "بقلوایی", value: "BAGHLAVAEI" },
  { label: "گل", value: "GOL" },
  { label: "سکه‌ای", value: "SEKKEI" },
  { label: "لقمه", value: "LOGHMEH" },
  { label: "مدادی", value: "MEDADI" },
  { label: "ترکیبی", value: "COMBINATION" },
];

const oilTypeOptions = [
  { label: "روغن حیوانی", value: "ANIMAL_OIL" },
  { label: "کره گیاهی", value: "VEGETABLE_BUTTER" },
  { label: "روغن نباتی", value: "NABATI_OIL" },
];

const packageOptions = [
  { label: "بسته‌بندی شده", value: true },
  { label: "کیلویی", value: false },
];

const categoryOptions = computed(() =>
  (categories.value ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  })),
);

const sortedProducts = computed(() => {
  if (!products.value) return [];
  return [...products.value].sort(
    (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
  );
});

// ===================================================================
// STATE
// ===================================================================

const state = reactive({
  modal: false,
  mode: "create" as "create" | "edit",
  activeTab: "info" as "info" | "variants",
  selectedId: null as number | null,
  pendingId: null as number | null,
  existingImage: "",
  deleteItem: null as ProductOut | null,

  errors: {
    name: "",
    slug: "",
    category_id: "",
    image: "",
    product_type: "",
    product_model: "",
    oil_type: "",
  },

  form: {
    name: "",
    slug: "",
    description: "",
    category_id: null as number | null,
    image: null as File | null,
    product_type: "",
    product_model: "",
    oil_type: "",
    is_packaged: false,
  },

  // --- مدل محصول‌ها ---
  variants: [] as VariantOut[],
  variantFormOpen: false,
  variantMode: "create" as "create" | "edit",
  variantForm: {
    id: null as number | null,
    volume: null as number | null,
    price: null as number | null,
    stock: null as number | null,
  },
  variantErrors: {
    volume: "",
    price: "",
  },
  deleteVariantItem: null as VariantOut | null,
});

const generateSlugFromName = () => {
  state.form.slug = slugify(state.form.name);
};

watch(
  () => state.variantForm.volume,
  (value) => {
    state.variantForm.volume = filterNumbersWithSep(value);
  },
);

watch(
  () => state.variantForm.price,
  (value) => {
    state.variantForm.price = filterNumbersWithSep(value);
  },
);

watch(
  () => state.variantForm.stock,
  (value) => {
    state.variantForm.stock = filterNumbersWithSep(value);
  },
);

// ===================================================================
// محصول: باز و بسته کردن مودال
// ===================================================================

const resetForm = () => {
  Object.assign(state.form, {
    name: "",
    slug: "",
    description: "",
    category_id: null,
    image: null,
    product_type: "",
    product_model: "",
    oil_type: "",
    is_packaged: false,
  });

  state.selectedId = null;
  state.existingImage = "";
  state.activeTab = "info";
  state.variants = [];
  state.variantFormOpen = false;
  state.deleteVariantItem = null;
  resetVariantForm();

  state.errors.name = "";
  state.errors.slug = "";
  state.errors.category_id = "";
  state.errors.product_type = "";
  state.errors.product_model = "";
  state.errors.oil_type = "";
  state.errors.image = "";
};

const openCreateModal = () => {
  resetForm();
  state.mode = "create";
  state.modal = true;
};

const openEditModal = (product: ProductOut) => {
  resetForm();
  state.mode = "edit";
  state.selectedId = product.id;
  state.form.slug = product.slug ?? "";
  state.form.name = product.name;
  state.form.description = product.description ?? "";
  state.form.category_id = product.category_id;
  state.form.product_type = (product.product_type as string) ?? "";
  state.form.product_model = (product.product_model as string) ?? "";
  state.form.oil_type = (product.oil_type as string) ?? "";
  state.form.is_packaged = Boolean(product.is_packaged);

  state.variants = [...(product.variants ?? [])];

  state.existingImage = product.image
    ? `https://sohangaz.com${product.image}`
    : "";
  state.modal = true;
};

// ===================================================================
// محصول: ذخیره اطلاعات پایه
// ===================================================================

const submitProduct = () => {
  const name = state.form.name.trim();
  const slug = state.form.slug.trim();

  state.errors.slug = "";
  state.errors.product_type = "";
  state.errors.product_model = "";
  state.errors.oil_type = "";
  state.errors.name = "";
  state.errors.category_id = "";
  state.errors.image = "";

  let hasError = false;

  if (!name) {
    state.errors.name = "نام محصول الزامی است.";
    hasError = true;
  }

  if (!state.form.category_id) {
    state.errors.category_id = "انتخاب دسته‌بندی الزامی است.";
    hasError = true;
  }

  const hasImage = !!state.form.image || !!state.existingImage;
  if (!hasImage) {
    state.errors.image = "انتخاب تصویر الزامی است.";
    hasError = true;
  }

  if (!state.form.product_type) {
    state.errors.product_type = "نوع محصول الزامی است.";
    hasError = true;
  }

  if (!state.form.product_model) {
    state.errors.product_model = "مدل محصول الزامی است.";
    hasError = true;
  }

  if (!state.form.oil_type) {
    state.errors.oil_type = "نوع روغن الزامی است.";
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

  const payload = buildProductFormData({
    name,
    slug,
    description: state.form.description || null,
    category_id: state.form.category_id as number,
    image: state.form.image,
    product_type: state.form.product_type || null,
    product_model: state.form.product_model || null,
    oil_type: state.form.oil_type || null,
    is_packaged: state.form.is_packaged,
  });

  const onError = (err: unknown) => {
    toast.apiError(err, "خطا در ذخیره‌ی محصول. دوباره تلاش کنید.");
  };

  if (state.mode === "create") {
    createProduct(payload, {
      onSuccess: (created) => {
        // محصول ساخته شد؛ حالا برای افزودن وزن/قیمت به تب مدل محصول‌ها می‌رویم
        state.mode = "edit";
        state.selectedId = created.id;
        state.existingImage = created.image
          ? `https://sohangaz.com${created.image}`
          : state.existingImage;
        state.activeTab = "variants";
        toast.success(
          "محصول ایجاد شد. حالا حداقل یک وزن و قیمت برایش اضافه کنید.",
        );
      },
      onError,
    });
    return;
  }

  if (!state.selectedId) return;
  payload.append("product_id", String(state.selectedId));
  updateProduct(payload, {
    onSuccess: () => toast.success("اطلاعات محصول ذخیره شد."),
    onError,
  });
};

const askDelete = (product: ProductOut) => {
  state.deleteItem = product;
};

const cancelDelete = () => {
  if (isDeleting.value) return;
  state.deleteItem = null;
};

const confirmDelete = () => {
  if (!state.deleteItem) return;

  state.pendingId = state.deleteItem.id;

  deleteProduct(state.deleteItem.id, {
    onSuccess: () => {
      state.deleteItem = null;
      toast.success("محصول حذف شد.");
    },
    onError: (err: unknown) => {
      toast.apiError(err, "حذف محصول با خطا مواجه شد.");
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

const hasCategories = computed(() => (categories.value?.length ?? 0) > 0);
// ===================================================================
// مدل محصول‌ها: افزودن / ویرایش / حذف
// ===================================================================

const isVariantSaving = computed(
  () => isCreatingVariant.value || isUpdatingVariant.value,
);

const sortedVariants = computed(() =>
  [...state.variants].sort((a, b) => a.volume - b.volume),
);

const canManageVariants = computed(() => !!state.selectedId);

const resetVariantForm = () => {
  state.variantForm.id = null;
  state.variantForm.volume = null;
  state.variantForm.price = null;
  state.variantForm.stock = null;
  state.variantErrors.volume = "";
  state.variantErrors.price = "";
};

const openAddVariant = () => {
  resetVariantForm();
  state.variantMode = "create";
  state.variantFormOpen = true;
};

const openEditVariant = (variant: VariantOut) => {
  state.variantMode = "edit";
  state.variantForm.id = variant.id;
  state.variantForm.volume = variant.volume;
  state.variantForm.price = variant.price;
  state.variantForm.stock = variant.stock ?? null;
  state.variantErrors.volume = "";
  state.variantErrors.price = "";
  state.variantFormOpen = true;
};

const cancelVariantForm = () => {
  if (isVariantSaving.value) return;
  state.variantFormOpen = false;
  resetVariantForm();
};

const submitVariantForm = () => {
  state.variantErrors.volume = "";
  state.variantErrors.price = "";
  let hasError = false;

  if (state.variantForm.volume === null || state.variantForm.volume <= 0) {
    state.variantErrors.volume = "وزن باید بزرگ‌تر از صفر باشد.";
    hasError = true;
  }

  if (state.variantForm.price === null || state.variantForm.price <= 0) {
    state.variantErrors.price = "قیمت باید بزرگ‌تر از صفر باشد.";
    hasError = true;
  }

  if (hasError) return;

  const payload = buildVariantFormData({
    volume: state.variantForm.volume as number,
    price: state.variantForm.price as number,
    stock: state.variantForm.stock,
  });

  const onError = (err: unknown) => {
    toast.apiError(err, "ذخیره‌ی ویژگی های محصول با خطا مواجه شد.");
  };

  if (state.variantMode === "create") {
    if (!state.selectedId) return;
    createVariant(
      { productId: state.selectedId, payload },
      {
        onSuccess: (created) => {
          state.variants.push(created);
          state.variantFormOpen = false;
          resetVariantForm();
          toast.success("مدل محصول اضافه شد.");
        },
        onError,
      },
    );
    return;
  }

  if (!state.variantForm.id) return;
  updateVariant(
    { variantId: state.variantForm.id, payload },
    {
      onSuccess: (updated) => {
        const index = state.variants.findIndex((v) => v.id === updated.id);
        if (index !== -1) state.variants[index] = updated;
        state.variantFormOpen = false;
        resetVariantForm();
        toast.success("مدل محصول ویرایش شد.");
      },
      onError,
    },
  );
};

const askDeleteVariant = (variant: VariantOut) => {
  state.deleteVariantItem = variant;
};

const cancelDeleteVariant = () => {
  if (isDeletingVariant.value) return;
  state.deleteVariantItem = null;
};

const isDeleteVariantModalOpen = computed({
  get: () => !!state.deleteVariantItem,
  set: (value) => {
    if (!value) cancelDeleteVariant();
  },
});

const confirmDeleteVariant = () => {
  if (!state.deleteVariantItem) return;
  const target = state.deleteVariantItem;

  deleteVariant(target.id, {
    onSuccess: () => {
      state.variants = state.variants.filter((v) => v.id !== target.id);
      state.deleteVariantItem = null;
      toast.success("مدل محصول حذف شد.");
    },
    onError: (err: unknown) => {
      toast.apiError(err, "حذف ويژگی محصول با خطا مواجه شد.");
    },
  });
};

// ===================================================================
// نمایش
// ===================================================================

const formatPrice = (price?: number | null) => {
  if (price === undefined || price === null) return "—";
  return `${price.toLocaleString("fa-IR")} تومان`;
};

const formatVolume = (volume?: number | null) => {
  if (volume === undefined || volume === null) return "—";
  return `${volume.toLocaleString("fa-IR")} گرم`;
};

const priceRangeLabel = (product: ProductOut) => {
  const variants = product.variants ?? [];
  if (!variants.length) return "بدون وزن و قیمت";
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? formatPrice(min)
    : `${formatPrice(min)} تا ${formatPrice(max)}`;
};
</script>

<template>
  <div class="admin-products">
    <section class="admin-products__topbar">
      <div>
        <h1 class="admin-products__title">مدیریت محصولات</h1>
        <p class="admin-products__subtitle">
          محصولات فروشگاه را اضافه، ویرایش یا حذف کنید.
        </p>
      </div>

      <div class="admin-products__topbar-actions">
        <AdminButton
          label="محصول جدید"
          variant="primary"
          icon="tabler:plus"
          @click="openCreateModal"
        />
      </div>
    </section>

    <section v-if="isLoading" class="admin-products__grid">
      <div
        v-for="n in 12"
        :key="n"
        class="admin-products__skeleton"
        aria-hidden="true"
      />
    </section>

    <section
      v-else-if="error"
      class="admin-products__state admin-products__state--error"
    >
      <Icon name="tabler:alert-circle" class="h-6 w-6" />
      <span>خطا در دریافت محصولات. لطفا دوباره تلاش کنید.</span>
    </section>

    <section
      v-else-if="!products?.length"
      class="admin-products__state admin-products__state--empty"
    >
      <Icon name="tabler:box" class="h-8 w-8" />
      <p>هنوز محصولی ثبت نشده است.</p>
      <AdminButton
        label="ساخت اولین محصول"
        variant="secondary"
        icon="tabler:plus"
        @click="openCreateModal"
      />
    </section>

    <section v-else class="admin-products__grid">
      <article
        v-for="product in sortedProducts"
        :key="product.id"
        class="admin-products__card"
      >
        <div class="admin-products__thumb">
          <img
            v-if="product.image"
            :src="`https://sohangaz.com${product.image}`"
            :alt="product.name"
            class="admin-products__thumb-img"
            draggable="false"
            loading="lazy"
          />
          <div v-else class="admin-products__thumb-placeholder">
            <Icon name="tabler:photo" class="h-8 w-8" />
          </div>

          <span
            v-if="product.variants?.length"
            class="admin-products__variant-badge"
          >
            <Icon name="tabler:layers-intersect" class="h-5 w-5" />
            {{ product.variants.length }} مدل
          </span>
        </div>

        <div class="admin-products__card-body">
          <h3 class="admin-products__card-name">
            {{ product.name }}
          </h3>
          <p class="admin-products__card-category">
            {{ product.category?.name }}
          </p>
          <p class="admin-products__card-price">
            {{ priceRangeLabel(product) }}
          </p>
        </div>

        <div class="admin-products__card-actions">
          <button
            type="button"
            class="admin-products__action-button"
            @click="openEditModal(product)"
          >
            <Icon name="tabler:pencil" class="h-4 w-4" />
            ویرایش
          </button>

          <button
            type="button"
            class="admin-products__action-button admin-products__action-button--danger"
            :disabled="state.pendingId === product.id"
            @click="askDelete(product)"
          >
            <Icon name="tabler:trash" class="h-4 w-4" />
            حذف
          </button>
        </div>
      </article>
    </section>

    <!-- مودال ایجاد / ویرایش محصول -->
    <AdminModal
      v-model="state.modal"
      :title="state.mode === 'create' ? 'ایجاد محصول جدید' : 'ویرایش محصول'"
      :action-label="
        state.mode === 'create' ? 'ایجاد و ادامه' : 'ذخیره اطلاعات'
      "
      :loading="isSaving"
      @submit="submitProduct"
    >
      <!-- تب‌ها -->
      <div class="admin-products__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="admin-products__tab"
          :class="{ 'admin-products__tab--active': state.activeTab === 'info' }"
          @click="state.activeTab = 'info'"
        >
          <Icon name="tabler:info-circle" class="h-4 w-4" />
          اطلاعات محصول
        </button>

        <button
          type="button"
          role="tab"
          class="admin-products__tab"
          :class="{
            'admin-products__tab--active': state.activeTab === 'variants',
          }"
          :disabled="!canManageVariants"
          :title="!canManageVariants ? 'ابتدا محصول را ایجاد کنید' : ''"
          @click="canManageVariants && (state.activeTab = 'variants')"
        >
          <Icon name="tabler:currency-toman" class="h-4 w-4" />
          وزن و قیمت
          <span v-if="state.variants.length" class="admin-products__tab-count">
            {{ state.variants.length }}
          </span>
        </button>
      </div>

      <!-- تب اطلاعات محصول -->
      <div v-show="state.activeTab === 'info'" class="admin-products__form">
        <AdminInput
          v-model="state.form.name"
          label="نام محصول"
          placeholder="مثال: سوهان زعفرانی"
          :error="state.errors.name"
        />

        <div class="admin-products__slug-field">
          <AdminInput
            v-model="state.form.slug"
            label="اسلاگ (URL)"
            placeholder="مثال: sohan-saffron"
            dir="ltr"
            :error="state.errors.slug"
          />

          <button
            type="button"
            class="admin-products__slug-generate"
            :disabled="!state.form.name.trim()"
            @click="generateSlugFromName"
          >
            <Icon name="tabler:wand" class="h-3.5 w-3.5" />
            ساخت خودکار از نام
          </button>
        </div>

        <div class="admin-products__select-field">
          <label class="admin-products__select-label"> دسته‌بندی </label>

          <template v-if="hasCategories">
            <AdminSelect
              v-model="state.form.category_id"
              :options="categoryOptions"
              placeholder="انتخاب دسته‌بندی"
            />

            <span
              v-if="state.errors.category_id"
              class="admin-products__select-error"
            >
              {{ state.errors.category_id }}
            </span>
          </template>

          <div v-else class="admin-products__category-empty">
            <div class="admin-products__category-empty-content">
              <Icon name="tabler:folders-off" class="h-8 w-8" />

              <div>
                <h4>هیچ دسته‌بندی‌ای وجود ندارد</h4>
                <p>
                  ابتدا یک دسته‌بندی ایجاد کنید تا بتوانید محصول جدید ثبت کنید.
                </p>
              </div>
            </div>

            <NuxtLink
              to="/admin/category"
              class="admin-products__category-link"
            >
              <Icon name="tabler:folder-plus" class="h-5 w-5" />
              مدیریت دسته‌بندی‌ها
            </NuxtLink>
          </div>
        </div>
        <div class="admin-products__select-field">
          <label class="admin-products__select-label"> نوع محصول </label>

          <AdminSelect
            v-model="state.form.product_type"
            :options="productTypeOptions"
            placeholder="انتخاب نوع محصول"
          />

          <span
            v-if="state.errors.product_type"
            class="admin-products__select-error"
          >
            {{ state.errors.product_type }}
          </span>
        </div>

        <div class="admin-products__select-field">
          <label class="admin-products__select-label"> مدل محصول </label>

          <AdminSelect
            v-model="state.form.product_model"
            :options="productModelOptions"
            placeholder="انتخاب مدل محصول"
          />

          <span
            v-if="state.errors.product_model"
            class="admin-products__select-error"
          >
            {{ state.errors.product_model }}
          </span>
        </div>

        <div class="admin-products__select-field">
          <label class="admin-products__select-label"> نوع روغن </label>

          <AdminSelect
            v-model="state.form.oil_type"
            :options="oilTypeOptions"
            placeholder="انتخاب نوع روغن"
          />

          <span
            v-if="state.errors.oil_type"
            class="admin-products__select-error"
          >
            {{ state.errors.oil_type }}
          </span>
        </div>

        <div class="admin-products__select-field">
          <label class="admin-products__select-label"> نوع فروش </label>

          <AdminSelect
            v-model="state.form.is_packaged"
            :options="packageOptions"
            placeholder="نوع فروش را انتخاب کنید"
            icon="tabler:package"
          />
        </div>

        <div class="admin-products__form-full">
          <label class="admin-products__textarea-label">
            توضیحات (اختیاری)
          </label>
          <textarea
            v-model="state.form.description"
            rows="4"
            class="admin-products__textarea"
            placeholder="توضیحات محصول را وارد کنید..."
          />
        </div>

        <AdminImageUpload
          v-model="state.form.image"
          label="تصویر محصول"
          :existing-url="state.existingImage"
          :error="state.errors.image"
          class="admin-products__form-full"
          @clear-existing="state.existingImage = ''"
        />
      </div>

      <!-- تب وزن و قیمت (مدل محصول‌ها) -->
      <div
        v-show="state.activeTab === 'variants'"
        class="admin-products__variants"
      >
        <p class="admin-products__variants-hint">
          <Icon name="tabler:bulb" class="h-4 w-4" />
          هر تغییر در این بخش بلافاصله و مستقل از دکمه‌ی «ذخیره اطلاعات» ثبت
          می‌شود.
        </p>

        <div
          v-if="!state.variants.length && !state.variantFormOpen"
          class="admin-products__variants-empty"
        >
          <Icon name="tabler:scale" class="h-7 w-7" />
          <p>هنوز هیچ وزن/قیمتی برای این محصول ثبت نشده است.</p>
          <AdminButton
            label="افزودن اولین مدل محصول"
            variant="secondary"
            icon="tabler:plus"
            @click="openAddVariant"
          />
        </div>

        <ul v-else class="admin-products__variant-list">
          <li
            v-for="variant in sortedVariants"
            :key="variant.id"
            class="admin-products__variant-row"
          >
            <div class="admin-products__variant-row-main">
              <span class="admin-products__variant-volume">
                {{ formatVolume(variant.volume) }}
              </span>
              <span class="admin-products__variant-price">
                {{ formatPrice(variant.price) }}
              </span>
              <span
                v-if="variant.stock !== null && variant.stock !== undefined"
                class="admin-products__variant-stock"
              >
                <Icon name="tabler:package" class="h-3.5 w-3.5" />
                موجودی: {{ variant.stock.toLocaleString("fa-IR") }}
              </span>
            </div>

            <div class="admin-products__variant-row-actions">
              <button
                type="button"
                class="admin-products__icon-button"
                @click="openEditVariant(variant)"
              >
                <Icon name="tabler:pencil" class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="admin-products__icon-button admin-products__icon-button--danger"
                @click="askDeleteVariant(variant)"
              >
                <Icon name="tabler:trash" class="h-4 w-4" />
              </button>
            </div>
          </li>
        </ul>

        <button
          v-if="state.variants.length && !state.variantFormOpen"
          type="button"
          class="admin-products__variant-add-trigger"
          @click="openAddVariant"
        >
          <Icon name="tabler:plus" class="h-4 w-4" />
          افزودن وزن دیگر
        </button>

        <div v-if="state.variantFormOpen" class="admin-products__variant-form">
          <div class="admin-products__variant-form-grid">
            <AdminInput
              v-model="state.variantForm.volume"
              type="text"
              inputmode="numeric"
              label="وزن (گرم)"
              placeholder="مثال: 500"
              :error="state.variantErrors.volume"
            />
            <AdminInput
              v-model="state.variantForm.price"
              type="text"
              inputmode="numeric"
              label="قیمت (تومان)"
              placeholder="مثال: 150000"
              :error="state.variantErrors.price"
            />
            <AdminInput
              v-model="state.variantForm.stock"
              type="text"
              inputmode="numeric"
              label="موجودی (اختیاری)"
              placeholder="مثال: 20"
            />
          </div>

          <div class="admin-products__variant-form-actions">
            <AdminButton
              :label="
                state.variantMode === 'create' ? 'افزودن' : 'ذخیره تغییرات'
              "
              variant="primary"
              icon="tabler:check"
              :loading="isVariantSaving"
              @click="submitVariantForm"
            />
            <AdminButton
              label="انصراف"
              variant="secondary"
              icon="tabler:x"
              :disabled="isVariantSaving"
              @click="cancelVariantForm"
            />
          </div>
        </div>
      </div>
    </AdminModal>

    <!-- مودال حذف محصول -->
    <AdminModal
      v-model="isDeleteModalOpen"
      title="حذف محصول"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="isDeleting"
      @submit="confirmDelete"
    >
      <p class="admin-products__confirm-text">
        آیا از حذف محصول
        <strong>{{ state.deleteItem?.name }}</strong>
        مطمئن هستید؟ این عملیات قابل بازگشت نیست.
      </p>
    </AdminModal>

    <!-- مودال حذف مدل محصول -->
    <AdminModal
      v-model="isDeleteVariantModalOpen"
      title="حذف مدل محصول"
      action-label="حذف"
      cancel-label="انصراف"
      :loading="isDeletingVariant"
      @submit="confirmDeleteVariant"
    >
      <p class="admin-products__confirm-text">
        آیا از حذف مدل محصول
        <strong>{{ formatVolume(state.deleteVariantItem?.volume) }}</strong>
        مطمئن هستید؟
      </p>
    </AdminModal>
  </div>
</template>

<style scoped>
.admin-products {
  @apply flex flex-col gap-6 p-4;
}

.admin-products__topbar {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between;
}

.admin-products__topbar-actions {
  @apply flex flex-wrap gap-2;
}

.admin-products__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-products__subtitle {
  @apply mt-1 text-sm text-slate-500 dark:text-slate-400 leading-7 text-wrap;
}

.admin-products__state {
  @apply flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-10
    text-center text-slate-700 shadow-sm
    dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300;
}

.admin-products__state--error {
  @apply text-red-600 dark:text-red-400;
}

.admin-products__state--empty {
  @apply text-slate-500 dark:text-slate-500;
}

.admin-products__grid {
  @apply grid justify-center gap-5;
  grid-template-columns: repeat(auto-fill, 270px);
}

.admin-products__skeleton {
  @apply aspect-[4/5] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60;
}

.admin-products__card {
  @apply relative flex cursor-default flex-col items-center gap-3 overflow-hidden rounded-2xl
    border-2 border-[--gold-one] bg-white p-4 pt-5 max-w-[300px] shadow-md
    transition duration-300 hover:-translate-y-1 hover:shadow-lg
    dark:bg-black dark:text-white;
}

.admin-products__thumb {
  @apply relative w-[188px] overflow-hidden rounded-xl bg-slate-100 shadow-2xl
    dark:bg-slate-900;
}

.admin-products__thumb-img {
  @apply h-full w-full object-cover transition duration-300;
  aspect-ratio: 1/1;
}

.admin-products__card:hover .admin-products__thumb-img {
  @apply scale-110;
}

.admin-products__thumb-placeholder {
  @apply flex h-full w-full items-center justify-center text-slate-300
    dark:text-slate-700;
}

.admin-products__variant-badge {
  @apply absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full
    bg-black/70 px-2 py-0.5  font-semibold text-white backdrop-blur-sm;
}

.admin-products__card-body {
  @apply flex flex-col items-center gap-1 text-center;
}

.admin-products__card-name {
  @apply max-w-[180px] truncate text-lg font-bold text-slate-900
    dark:text-white;
}

.admin-products__card-category {
  @apply text-xs font-medium text-slate-400 dark:text-slate-500;
}

.admin-products__card-price {
  @apply text-wrap text-sm font-bold text-[--gold-one];
}

.admin-products__card-actions {
  @apply flex w-full flex-wrap gap-2;
}

.admin-products__action-button {
  @apply inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border
    border-slate-300 bg-white px-4 py-3 text-xs font-semibold text-slate-700
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
    dark:hover:border-[--gold-one] dark:hover:text-[--gold-one];
}

.admin-products__action-button--danger {
  @apply border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-700
    dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400
    dark:hover:border-red-800 dark:hover:bg-red-950/60 dark:hover:text-red-400;
}

/* ---- تب‌های مودال ---- */

.admin-products__tabs {
  @apply mb-5 flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1
    dark:border-slate-800 dark:bg-slate-900/60;
}

.admin-products__tab {
  @apply relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5
    text-sm font-semibold text-slate-500 transition-all duration-300
    disabled:cursor-not-allowed disabled:opacity-40
    dark:text-slate-400;
}

.admin-products__tab--active {
  @apply bg-white text-slate-900 shadow-sm
    dark:bg-slate-800 dark:text-white;
}

.admin-products__tab--active :deep(svg) {
  color: var(--gold-one);
}

.admin-products__tab-count {
  @apply inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[--gold-one]
    px-1 text-[11px] font-bold text-white;
}

/* ---- فرم اطلاعات محصول ---- */

.admin-products__form {
  @apply grid gap-7 md:grid-cols-2 p-1;
}

.admin-products__form-full {
  @apply md:col-span-2;
}

.admin-products__textarea-label {
  @apply mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300;
}

.admin-products__textarea {
  @apply w-full rounded-xl border text-wrap leading-8 border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
    outline-none transition focus:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

.admin-products__select-field {
  @apply flex flex-col gap-1.5;
}

.admin-products__select-label {
  @apply text-sm font-medium text-slate-700 dark:text-slate-300;
}

.admin-products__select-error {
  @apply text-xs font-medium text-red-600 dark:text-red-400;
}

/* ---- تب وزن و قیمت (مدل محصول‌ها) ---- */

.admin-products__variants {
  @apply flex flex-col gap-4 p-1;
}

.admin-products__variants-hint {
  @apply flex items-center gap-1.5 text-wrap leading-7 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700
    dark:bg-amber-950/30 dark:text-amber-400;
}

.admin-products__variants-empty {
  @apply flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-8
    text-center text-sm text-slate-500
    dark:border-slate-700 dark:text-slate-400;
}

.admin-products__variant-list {
  @apply flex flex-col gap-2;
}

.admin-products__variant-row {
  @apply flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3
    transition hover:border-[--gold-one]
    dark:border-slate-800 dark:bg-slate-900;
}

.admin-products__variant-row-main {
  @apply flex flex-wrap items-center gap-x-4 gap-y-1;
}

.admin-products__variant-volume {
  @apply text-sm font-bold text-slate-900 dark:text-white;
}

.admin-products__variant-price {
  @apply text-sm font-semibold text-[--gold-one];
}

.admin-products__variant-stock {
  @apply inline-flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500;
}

.admin-products__variant-row-actions {
  @apply flex items-center gap-1.5;
}

.admin-products__icon-button {
  @apply flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500
    transition hover:border-[--gold-one] hover:text-[--gold-one]
    dark:border-slate-700 dark:text-slate-400;
}

.admin-products__icon-button--danger {
  @apply hover:border-red-300 hover:text-red-600
    dark:hover:border-red-800 dark:hover:text-red-400;
}

.admin-products__variant-add-trigger {
  @apply flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300
    py-2.5 text-sm font-semibold text-slate-500 transition hover:border-[--gold-one] hover:text-[--gold-one]
    dark:border-slate-700 dark:text-slate-400;
}

.admin-products__variant-form {
  @apply flex flex-col gap-4 rounded-2xl border border-[--gold-one] bg-amber-50/40 p-4
    dark:bg-amber-950/10;
}

.admin-products__variant-form-grid {
  @apply grid gap-4 sm:grid-cols-3;
}

.admin-products__variant-form-actions {
  @apply flex items-center gap-2;
}

/* ---- سایر ---- */

.admin-products__slug-field {
  @apply flex flex-col gap-1.5;
}

.admin-products__slug-generate {
  @apply mt-1 inline-flex w-fit items-center gap-1 text-xs font-semibold text-[--gold-one]
    transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40;
}

.admin-products__confirm-text {
  @apply text-sm leading-7 text-slate-600 dark:text-slate-300 text-wrap;
}

.admin-products__category-empty {
  @apply flex flex-col gap-5 rounded-2xl border-2 border-dashed
    border-amber-300 bg-amber-50 p-5
    dark:border-amber-700/40 dark:bg-amber-950/10;
}

.admin-products__category-empty-content {
  @apply flex items-start gap-4 text-amber-700 text-wrap
    dark:text-amber-400;
}

.admin-products__category-empty-content h4 {
  @apply text-sm font-bold;
}

.admin-products__category-empty-content p {
  @apply mt-1 text-xs leading-6 opacity-80 text-wrap;
}

.admin-products__category-link {
  @apply inline-flex  flex-1 items-center justify-center gap-2 rounded-xl
    bg-[--gold-one] px-4 py-3 text-sm font-semibold
    text-white transition-all duration-300
    hover:-translate-y-0.5 hover:shadow-lg;
}
</style>
