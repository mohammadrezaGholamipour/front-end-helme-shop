<script setup lang="ts">
import type { BlogOut } from "~/types";
import { BlogStatus } from "~/types";
import type { AdminSelectOption } from "~/components/Admin/AdminSelect.vue";

interface BlogFormInput {
  title: string;
  slug: string;
  category_id: number;
  summary: string;
  content: string;
  image: File | null;
  status: BlogStatus;
  is_featured: boolean;
  reading_time: number | null;
  meta_title: string;
  meta_description: string;
}

const props = defineProps<{
  mode: "create" | "edit";
  initialData?: BlogOut | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: BlogFormInput): void;
}>();

const { data: categories } = useAllBlogCategories();

const state = reactive({
  showSeo: false,

  errors: {
    title: "",
    slug: "",
    category_id: "",
    content: "",
    image: "",
  },

  form: {
    title: "",
    slug: "",
    category_id: null as number | null,
    summary: "",
    content: "",
    image: null as File | null,
    status: BlogStatus.DRAFT as BlogStatus,
    is_featured: false,
    reading_time: null as number | null,
    meta_title: "",
    meta_description: "",
  },
});

const existingImage = ref("");

watchEffect(() => {
  if (!props.initialData) return;

  const blog = props.initialData;

  state.form.title = blog.title;
  state.form.slug = blog.slug;
  state.form.category_id = blog.category_id;
  state.form.summary = blog.summary ?? "";
  state.form.content = blog.content;
  state.form.status = blog.status;
  state.form.is_featured = blog.is_featured;
  state.form.reading_time = blog.reading_time;
  state.form.meta_title = blog.meta_title ?? "";
  state.form.meta_description = blog.meta_description ?? "";

  existingImage.value = blog.image ? `https://sohangaz.com${blog.image}` : "";
});

const generateSlugFromTitle = () => {
  state.form.slug = slugify(state.form.title);
};

const statusOptions = [
  { label: "پیش‌نویس", value: BlogStatus.DRAFT },
  { label: "منتشر شده", value: BlogStatus.PUBLISHED },
];

const categoryOptions = computed<AdminSelectOption[]>(
  () =>
    categories.value?.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })) ?? [],
);

const validate = () => {
  state.errors.title = "";
  state.errors.slug = "";
  state.errors.category_id = "";
  state.errors.content = "";
  state.errors.image = "";

  let hasError = false;

  if (!state.form.title.trim()) {
    state.errors.title = "عنوان بلاگ الزامی است.";
    hasError = true;
  }

  if (!state.form.slug.trim()) {
    state.errors.slug = "اسلاگ الزامی است.";
    hasError = true;
  } else if (!/^[a-z0-9-]+$/.test(state.form.slug.trim())) {
    state.errors.slug =
      "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.";
    hasError = true;
  }

  if (!state.form.category_id) {
    state.errors.category_id = "انتخاب دسته‌بندی الزامی است.";
    hasError = true;
  }

  if (!state.form.content.trim() || state.form.content === "<p></p>") {
    state.errors.content = "محتوای بلاگ الزامی است.";
    hasError = true;
  }

  const hasImage = !!state.form.image || !!existingImage.value;
  if (!hasImage) {
    state.errors.image = "انتخاب تصویر کاور الزامی است.";
    hasError = true;
  }

  return !hasError;
};

const handleSubmit = () => {
  if (!validate()) return;

  emit("submit", {
    title: state.form.title.trim(),
    slug: state.form.slug.trim(),
    category_id: state.form.category_id as number,
    summary: state.form.summary.trim(),
    content: state.form.content,
    image: state.form.image,
    status: state.form.status,
    is_featured: state.form.is_featured,
    reading_time: state.form.reading_time,
    meta_title: state.form.meta_title.trim(),
    meta_description: state.form.meta_description.trim(),
  });
};

defineExpose({ handleSubmit });
</script>

<template>
  <form class="admin-blog-form" @submit.prevent="handleSubmit">
    <div class="admin-blog-form__main">
      <div class="admin-blog-form__section">
        <AdminInput
          v-model="state.form.title"
          label="عنوان بلاگ"
          placeholder="مثال: راهنمای خرید سوهان اصفهان"
          :error="state.errors.title"
        />

        <div class="admin-blog-form__slug-field">
          <AdminInput
            v-model="state.form.slug"
            label="اسلاگ (URL)"
            placeholder="مثال: sohan-buying-guide"
            dir="ltr"
            :error="state.errors.slug"
          />
          <button
            type="button"
            class="admin-blog-form__slug-generate"
            :disabled="!state.form.title.trim()"
            @click="generateSlugFromTitle"
          >
            <Icon name="tabler:wand" class="h-3.5 w-3.5" />
            ساخت خودکار از عنوان
          </button>
        </div>

        <div class="admin-blog-form__field">
          <label class="admin-blog-form__label">خلاصه</label>
          <textarea
            v-model="state.form.summary"
            rows="3"
            class="admin-blog-form__textarea"
            placeholder="یک خلاصه‌ی کوتاه که در لیست بلاگ‌ها نمایش داده می‌شود"
          />
        </div>

        <AdminRichTextEditor
          v-model="state.form.content"
          label="محتوای بلاگ"
          :error="state.errors.content"
        />

        <button
          type="button"
          class="admin-blog-form__seo-toggle"
          @click="state.showSeo = !state.showSeo"
        >
          <Icon
            name="tabler:chevron-down"
            class="h-4 w-4 transition"
            :class="{ 'rotate-180': state.showSeo }"
          />
          تنظیمات سئو (اختیاری)
        </button>

        <div v-if="state.showSeo" class="admin-blog-form__section">
          <AdminInput
            v-model="state.form.meta_title"
            label="عنوان متا"
            placeholder="در صورت خالی بودن از عنوان بلاگ استفاده می‌شود"
          />
          <div class="admin-blog-form__field">
            <label class="admin-blog-form__label">توضیحات متا</label>
            <textarea
              v-model="state.form.meta_description"
              rows="3"
              class="admin-blog-form__textarea"
              placeholder="توضیحاتی که در نتایج گوگل نمایش داده می‌شود"
            />
          </div>
        </div>
      </div>
    </div>

    <aside class="admin-blog-form__sidebar">
      <div class="admin-blog-form__card">
        <h3 class="admin-blog-form__card-title">انتشار</h3>

        <div class="admin-blog-form__field">
          <label class="admin-blog-form__label">وضعیت</label>
          <AdminSelect v-model="state.form.status" :options="statusOptions" />
        </div>

        <button
          type="button"
          class="featured-toggle"
          :class="{ 'featured-toggle--active': state.form.is_featured }"
          @click="state.form.is_featured = !state.form.is_featured"
        >
          <span class="featured-toggle__icon">
            <Icon
              :name="
                state.form.is_featured ? 'tabler:star-filled' : 'tabler:star'
              "
              class="h-5 w-5"
            />
          </span>

          <span class="featured-toggle__text">
            <span class="featured-toggle__title">مقاله ویژه</span>
            <span class="featured-toggle__desc">
              مقالات ویژه با نشان طلایی و در جایگاه برجسته نمایش داده می‌شوند
            </span>
          </span>

        </button>

        <div class="admin-blog-form__field">
          <label class="admin-blog-form__label">زمان مطالعه (دقیقه)</label>
          <input
            v-model.number="state.form.reading_time"
            type="number"
            min="0"
            class="admin-blog-form__input-number"
            placeholder="مثال: 5"
          />
        </div>
      </div>

      <div class="admin-blog-form__card">
        <h3 class="admin-blog-form__card-title">دسته‌بندی</h3>

        <div class="admin-blog-form__field">
          <AdminSelect
            v-model="state.form.category_id"
            :options="categoryOptions"
            placeholder="انتخاب دسته‌بندی"
          />
          <p v-if="state.errors.category_id" class="admin-blog-form__error">
            {{ state.errors.category_id }}
          </p>
        </div>
      </div>

      <div class="admin-blog-form__card">
        <h3 class="admin-blog-form__card-title">تصویر کاور</h3>
        <AdminImageUpload
          v-model="state.form.image"
          :existing-url="existingImage"
          :error="state.errors.image"
          @clear-existing="existingImage = ''"
        />
      </div>
    </aside>
  </form>
</template>

<style scoped>
.admin-blog-form {
  @apply grid grid-cols-1 text-wrap gap-6 lg:grid-cols-[1fr_320px];
}

.admin-blog-form__main {
  @apply flex flex-col gap-6 text-wrap;
}

.admin-blog-form__section {
  @apply flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5
    dark:border-slate-800 text-wrap dark:bg-slate-950;
}

.admin-blog-form__sidebar {
  @apply flex flex-col gap-4 text-wrap;
}

.admin-blog-form__card {
  @apply flex flex-col gap-3 text-wrap rounded-2xl border border-slate-200 bg-white p-4
    dark:border-slate-800 dark:bg-slate-950;
}

.admin-blog-form__card-title {
  @apply text-sm font-bold text-wrap text-slate-800 dark:text-slate-100;
}

.admin-blog-form__field {
  @apply flex flex-col  gap-1.5 text-wrap;
}

.admin-blog-form__label {
  @apply text-sm font-medium text-wrap text-slate-700 dark:text-slate-300;
}

.admin-blog-form__textarea {
  @apply w-full rounded-xl border text-wrap border-slate-300 bg-white px-3 py-2 text-sm leading-7
    text-slate-900 outline-none transition focus:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

.admin-blog-form__select {
  @apply w-full rounded-xl text-wrap border border-slate-300 bg-white px-3 py-2.5 text-sm
    text-slate-900 outline-none transition focus:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

.featured-toggle {
  @apply flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4
    text-right transition-all duration-300
    hover:border-[--gold-one]
    dark:border-slate-800 dark:bg-slate-900;
}

.featured-toggle--active {
  @apply border-[--gold-one] bg-gradient-to-l from-[--gold-one] to-transparent
    shadow-[0_0_0_4px_rgba(0,0,0,0.02)]
    dark:from-[--gold-one];
}

.featured-toggle__icon {
  @apply flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100
    text-slate-400 transition-all duration-300
    dark:bg-slate-800 dark:text-slate-500;
}

.featured-toggle--active .featured-toggle__icon {
  @apply bg-[--gold-one] text-white;
  animation: pop 0.3s ease;
}

.featured-toggle__text {
  @apply flex flex-1 flex-col gap-3;
}

.featured-toggle__title {
  @apply text-sm font-bold text-slate-800 dark:text-white;
}

.featured-toggle__desc {
  @apply text-xs leading-5 text-wrap text-slate-400 dark:text-white;
}

.featured-toggle__switch {
  @apply relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition-colors duration-300
    dark:bg-slate-700;
}

.featured-toggle--active .featured-toggle__switch {
  @apply bg-[--gold-one];
}

.featured-toggle__switch-dot {
  @apply absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white shadow-md
    transition-transform duration-300;
}

.featured-toggle--active .featured-toggle__switch-dot {
  transform: translateX(-1.25rem);
}

@keyframes pop {
  0% {
    transform: scale(0.7);
  }
  60% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.admin-blog-form__input-number {
  @apply w-full rounded-xl border text-wrap border-slate-300 bg-white px-3 py-2.5 text-sm
    text-slate-900 outline-none transition focus:border-[--gold-one]
    dark:border-slate-700 dark:bg-slate-900 dark:text-white;
}

.admin-blog-form__checkbox {
  @apply flex items-center text-wrap gap-2 text-sm font-medium text-slate-700
    dark:text-slate-300;
}

.admin-blog-form__slug-field {
  @apply flex flex-col gap-1.5 text-wrap;
}

.admin-blog-form__slug-generate {
  @apply inline-flex w-fit items-center gap-1 text-xs font-semibold text-slate-500
    transition hover:text-[--gold-one]
    disabled:cursor-not-allowed disabled:opacity-40
    dark:text-slate-400 text-wrap;
}

.admin-blog-form__seo-toggle {
  @apply inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-600
    transition hover:text-[--gold-one]
    dark:text-slate-300 text-wrap;
}

.admin-blog-form__error {
  @apply text-xs font-medium text-wrap text-red-600 dark:text-red-400;
}
</style>
