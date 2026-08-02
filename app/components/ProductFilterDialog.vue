<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true });

const router = useRouter();
const route = useRoute();

const PRICE_MIN = 0;
const PRICE_MAX = 1_000_000;
const PRICE_STEP = 10_000;

const filters = reactive({
  productType: route.query.product_type as string | undefined,
  productModel: route.query.product_model as string | undefined,
  oilType: route.query.oil_type as string | undefined,
  minPrice: route.query.min_price ? Number(route.query.min_price) : PRICE_MIN,
  maxPrice: route.query.max_price ? Number(route.query.max_price) : PRICE_MAX,
});

const productTypeOptions = [
  { value: "SOHAN", label: "سوهان" },
  { value: "GAZ", label: "گز" },
];

const productModelOptions = [
  { value: "HOBEH", label: "حبه‌ای" },
  { value: "LOGHMEH", label: "لقمه‌ای" },
  { value: "SEKKEI", label: "سکه‌ای" },
  { value: "GOL", label: "گل" },
  { value: "BAGHLAVAEI", label: "باقلوایی" },
  { value: "MEDADI", label: "مدادی" },
  { value: "COMBINATION", label: "ترکیبی از چند مدل" },
];

const oilTypeOptions = [
  { value: "ANIMAL_OIL", label: "روغن حیوانی" },
  { value: "VEGETABLE_BUTTER", label: "کره گیاهی" },
  { value: "NABATI_OIL", label: "روغن نباتی" },
];

function toggle(
  key: "productType" | "productModel" | "oilType",
  value: string,
) {
  filters[key] = filters[key] === value ? undefined : value;
}

// جلوگیری از رد شدن دستگیره‌ها از هم
function onMinInput() {
  if (filters.minPrice > filters.maxPrice - PRICE_STEP) {
    filters.minPrice = filters.maxPrice - PRICE_STEP;
  }
}
function onMaxInput() {
  if (filters.maxPrice < filters.minPrice + PRICE_STEP) {
    filters.maxPrice = filters.minPrice + PRICE_STEP;
  }
}

const minPercent = computed(
  () => ((filters.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
);
const maxPercent = computed(
  () => ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
);

function formatPrice(value: number) {
  return value.toLocaleString("fa-IR");
}

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.productType) count++;
  if (filters.productModel) count++;
  if (filters.oilType) count++;
  if (filters.minPrice > PRICE_MIN || filters.maxPrice < PRICE_MAX) count++;
  return count;
});

function applyFilters() {
  router.push({
    path: "/product",
    query: {
      ...route.query,
      product_type: filters.productType || undefined,
      product_model: filters.productModel || undefined,
      oil_type: filters.oilType || undefined,
      min_price: filters.minPrice > PRICE_MIN ? filters.minPrice : undefined,
      max_price: filters.maxPrice < PRICE_MAX ? filters.maxPrice : undefined,
    },
  });

  modelValue.value = false;
}

function clearFilters() {
  filters.productType = undefined;
  filters.productModel = undefined;
  filters.oilType = undefined;
  filters.minPrice = PRICE_MIN;
  filters.maxPrice = PRICE_MAX;

  router.push({ path: "/" });
  modelValue.value = false;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div
        v-if="modelValue"
        class="filter-dialog__overlay"
        @click="modelValue = false"
      />
    </Transition>

    <Transition name="drawer-slide">
      <div v-if="modelValue" dir="rtl" class="filter-dialog" @click.stop>
        <!-- Header -->
        <div class="filter-dialog__header">
          <div class="filter-dialog__title-wrap">
            <h2 class="filter-dialog__title">فیلتر محصولات</h2>
            <span
              v-animate="{
                type: 'scaleIn',
                delay: 300,
                duration: 1000,
                once: true,
                threshold: 0,
              }"
              v-if="activeFiltersCount > 0"
              class="filter-dialog__badge"
            >
              {{ activeFiltersCount }}
            </span>
          </div>

          <button class="filter-dialog__close" @click="modelValue = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="filter-dialog__close-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="filter-dialog__body">
          <div class="filter-dialog__section">
            <label class="filter-dialog__section-label">نوع محصول</label>
            <div class="filter-dialog__options">
              <button
                v-for="item in productTypeOptions"
                :key="item.value"
                type="button"
                class="filter-dialog__option"
                :class="{
                  'filter-dialog__option--active':
                    filters.productType === item.value,
                }"
                @click="toggle('productType', item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="filter-dialog__section">
            <label class="filter-dialog__section-label">مدل محصول</label>
            <div class="filter-dialog__options">
              <button
                v-for="item in productModelOptions"
                :key="item.value"
                type="button"
                class="filter-dialog__option"
                :class="{
                  'filter-dialog__option--active':
                    filters.productModel === item.value,
                }"
                @click="toggle('productModel', item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="filter-dialog__section">
            <label class="filter-dialog__section-label">نوع روغن</label>
            <div class="filter-dialog__options">
              <button
                v-for="item in oilTypeOptions"
                :key="item.value"
                type="button"
                class="filter-dialog__option"
                :class="{
                  'filter-dialog__option--active':
                    filters.oilType === item.value,
                }"
                @click="toggle('oilType', item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <!-- قیمت: Range Slider -->
          <div class="filter-dialog__section">
            <div class="filter-dialog__price-header">
              <label
                class="filter-dialog__section-label filter-dialog__section-label--no-margin"
                >محدوده قیمت</label
              >
              <span class="filter-dialog__price-hint"
                >قیمت ها به تومان هستند</span
              >
            </div>

            <div class="filter-dialog__price-values">
              <div class="filter-dialog__price-value">
                <span class="filter-dialog__price-value-label">از</span>
                <span class="filter-dialog__price-value-amount">{{
                  formatPrice(filters.minPrice)
                }}</span>
              </div>
              <span class="filter-dialog__price-separator">—</span>
              <div class="filter-dialog__price-value">
                <span class="filter-dialog__price-value-label">تا</span>
                <span class="filter-dialog__price-value-amount">{{
                  formatPrice(filters.maxPrice)
                }}</span>
              </div>
            </div>

            <div class="filter-dialog__slider">
              <!-- ترک پس‌زمینه -->
              <div class="filter-dialog__slider-track" />
              <!-- ترک پرشده بین دو دستگیره -->
              <div
                class="filter-dialog__slider-range"
                :style="{
                  right: minPercent + '%',
                  left: 100 - maxPercent + '%',
                }"
              />

              <input
                v-model.number="filters.minPrice"
                type="range"
                :min="PRICE_MIN"
                :max="PRICE_MAX"
                :step="PRICE_STEP"
                class="filter-dialog__slider-input"
                @input="onMinInput"
              />
              <input
                v-model.number="filters.maxPrice"
                type="range"
                :min="PRICE_MIN"
                :max="PRICE_MAX"
                :step="PRICE_STEP"
                class="filter-dialog__slider-input"
                @input="onMaxInput"
              />
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div class="filter-dialog__footer">
          <button class="filter-dialog__clear-btn" @click="clearFilters">
            حذف فیلتر
          </button>

          <button
            class="filter-dialog__apply-btn"
            @click="applyFilters"
            :disabled="!!!activeFiltersCount"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.filter-dialog__overlay {
  @apply fixed inset-0 z-50 bg-black/50 backdrop-blur-sm;
}

.filter-dialog {
  @apply fixed inset-y-0 right-0 z-50 flex h-screen w-full max-w-md flex-col shadow-2xl;
  @apply bg-white dark:bg-gray-900;
}

.filter-dialog::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;

  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.025) 0px,
    rgba(0, 0, 0, 0.025) 1px,
    transparent 1px,
    transparent 18px
  );
}

:global(.dark) .filter-dialog::before {
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.03) 0px,
    rgba(255, 255, 255, 0.03) 1px,
    transparent 1px,
    transparent 18px
  );
}

/* Header */
.filter-dialog__header {
  @apply flex items-center justify-between border-b px-6 py-5;
  @apply border-gray-100 dark:border-gray-800;
}

.filter-dialog__title-wrap {
  @apply flex items-center gap-2;
}

.filter-dialog__title {
  @apply text-lg font-bold;
  @apply text-gray-900 dark:text-gray-100;
}

.filter-dialog__badge {
  @apply flex h-8 min-w-8 items-center justify-center rounded-full bg-[--gold-one] px-1.5 font-bold text-white;
}

.filter-dialog__close {
  @apply flex h-9 w-9 items-center justify-center rounded-full transition;
  @apply text-gray-500 hover:bg-gray-100 hover:text-gray-900;
  @apply dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100;
}

.filter-dialog__close-icon {
  @apply h-5 w-5;
}

/* Body */
.filter-dialog__body {
  @apply flex-1 space-y-7 overflow-y-auto px-6 py-6;
}

.filter-dialog__section-label {
  @apply mb-3 block text-sm font-semibold;
  @apply text-gray-700 dark:text-gray-300;
}

.filter-dialog__section-label--no-margin {
  @apply mb-0;
}

.filter-dialog__options {
  @apply flex flex-wrap gap-2;
}

.filter-dialog__option {
  @apply flex-1 rounded-full border px-4 py-2 text-sm font-medium transition;
  @apply border-gray-200 bg-gray-50 text-gray-700 hover:bg-amber-50;
  @apply dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700;
}

.filter-dialog__option--active {
  @apply !bg-[--gold-one] text-white dark:text-gray-700 shadow-sm shadow-amber-200 dark:shadow-amber-900/40;
}

/* Price */
.filter-dialog__price-header {
  @apply mb-4 flex items-center justify-between;
}

.filter-dialog__price-hint {
  @apply text-xs font-medium;
  @apply text-gray-500 dark:text-gray-400;
}

.filter-dialog__price-values {
  @apply mb-5 flex items-center justify-between gap-3;
}

.filter-dialog__price-value {
  @apply flex-1 rounded-xl px-3 py-2 text-center;
  @apply bg-gray-50 dark:bg-gray-800;
}

.filter-dialog__price-value-label {
  @apply block text-[10px];
  @apply text-gray-400 dark:text-gray-500;
}

.filter-dialog__price-value-amount {
  @apply text-sm font-bold;
  @apply text-gray-800 dark:text-gray-200;
}

.filter-dialog__price-separator {
  @apply text-gray-300 dark:text-gray-600;
}

/* Slider */
.filter-dialog__slider {
  @apply relative h-6;
}

.filter-dialog__slider-track {
  @apply absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full;
  @apply bg-gray-200 dark:bg-gray-700;
}

.filter-dialog__slider-range {
  @apply absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[--gold-one];
}

.filter-dialog__slider-input {
  @apply pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent;
}

/* Footer */
.filter-dialog__footer {
  @apply flex gap-3 border-t px-6 py-5;
  @apply border-gray-100 dark:border-gray-800;
}

.filter-dialog__clear-btn {
  @apply rounded-xl border px-5 py-3 text-sm font-medium transition;
  @apply border-gray-200 text-gray-600 hover:bg-gray-50;
  @apply dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800;
}

.filter-dialog__apply-btn {
  @apply flex-1 rounded-xl py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-25;
  @apply bg-gray-900 hover:bg-black;
  @apply dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white;
}

/* Transitions */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

/* استایل دستگیره‌های اسلایدر */
.filter-dialog__slider-input::-webkit-slider-thumb {
  pointer-events: auto;
  appearance: none;
  width: 30px;
  height: 20px;
  border-radius: 9999px;
  background: white;
  border: 3px solid #d8bb64;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.filter-dialog__slider-input::-moz-range-thumb {
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: white;
  border: 3px solid #f59e0b;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
</style>
