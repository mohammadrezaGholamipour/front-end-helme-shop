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

const productTypeOptions = ["سوهان", "گز"];
const productModelOptions = [
  "حبه‌ای",
  "لقمه‌ای",
  "سکه‌ای",
  "گل",
  "باقلوایی",
  "مدادی",
  "ترکیبی از چند مدل",
];
const oilTypeOptions = ["روغن حیوانی", "کره گیاهی", "روغن نباتی"];

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
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="modelValue = false"
      />
    </Transition>

    <Transition name="drawer-slide">
      <div
        v-if="modelValue"
        dir="rtl"
        class="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl product-filter-dialog"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-5"
        >
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-gray-900">فیلتر محصولات</h2>
            <span
              v-animate="{
                type: 'scaleIn',
                delay: 300,
                duration: 1000,
                once: true,
                threshold: 0,
              }"
              v-if="activeFiltersCount > 0"
              class="flex h-8 min-w-8 items-center justify-center rounded-full bg-[--gold-one] px-1.5 font-bold text-white"
            >
              {{ activeFiltersCount }}
            </span>
          </div>

          <button
            class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            @click="modelValue = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
        <div class="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700"
              >نوع محصول</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in productTypeOptions"
                :key="item"
                type="button"
                class="rounded-full flex-1 border px-4 py-2 text-sm font-medium transition"
                :class="
                  filters.productType === item
                    ? 'bg-[--gold-one]  text-white shadow-sm shadow-amber-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                "
                @click="toggle('productType', item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700"
              >مدل محصول</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in productModelOptions"
                :key="item"
                type="button"
                class="rounded-full border flex-1 px-4 py-2 text-sm font-medium transition"
                :class="
                  filters.productModel === item
                    ? 'bg-[--gold-one] text-white shadow-sm shadow-amber-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                "
                @click="toggle('productModel', item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700"
              >نوع روغن</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in oilTypeOptions"
                :key="item"
                type="button"
                class="rounded-full flex-1 border px-4 py-2 text-sm font-medium transition"
                :class="
                  filters.oilType === item
                    ? 'bg-[--gold-one] text-white shadow-sm shadow-amber-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                "
                @click="toggle('oilType', item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <!-- قیمت: Range Slider -->
          <div>
            <div class="mb-4 flex items-center justify-between">
              <label class="text-sm font-semibold text-gray-700"
                >محدوده قیمت</label
              >
              <span class="text-xs font-medium text-gray-500"
                >قیمت ها به تومان هستند</span
              >
            </div>

            <div class="mb-5 flex items-center justify-between gap-3">
              <div class="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-center">
                <span class="block text-[10px] text-gray-400">از</span>
                <span class="text-sm font-bold text-gray-800">{{
                  formatPrice(filters.minPrice)
                }}</span>
              </div>
              <span class="text-gray-300">—</span>
              <div class="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-center">
                <span class="block text-[10px] text-gray-400">تا</span>
                <span class="text-sm font-bold text-gray-800">{{
                  formatPrice(filters.maxPrice)
                }}</span>
              </div>
            </div>

            <div class="relative h-6">
              <!-- ترک پس‌زمینه -->
              <div
                class="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200"
              />
              <!-- ترک پرشده بین دو دستگیره -->
              <div
                class="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[--gold-one]"
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
                class="range-thumb pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
                @input="onMinInput"
              />
              <input
                v-model.number="filters.maxPrice"
                type="range"
                :min="PRICE_MIN"
                :max="PRICE_MAX"
                :step="PRICE_STEP"
                class="range-thumb pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
                @input="onMaxInput"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <img
            v-animate="{
              type: 'scaleIn',
              delay: 300,
              duration: 1000,
              once: true,
              threshold: 0,
            }"
            src="/images/helma-logo.webp"
            alt="سوهان و گز حلما"
            fetchpriority="high"
            width="350"
          />
        </div>
        <!-- Footer -->
        <div class="flex gap-3 border-t border-gray-100 px-6 py-5">
          <button
            class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            @click="clearFilters"
          >
            حذف فیلتر
          </button>

          <button
            class="flex-1 rounded-xl disabled:opacity-25 disabled:cursor-not-allowed bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-black active:scale-[0.98]"
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

<style>
.product-filter-dialog::before {
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
.range-thumb::-webkit-slider-thumb {
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

.range-thumb::-moz-range-thumb {
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
