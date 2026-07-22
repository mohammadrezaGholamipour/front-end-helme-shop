<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true });

const router = useRouter();
const route = useRoute();

const filters = reactive({
  productType: route.query.product_type as string | undefined,
  productModel: route.query.product_model as string | undefined,
  oilType: route.query.oil_type as string | undefined,
  minPrice: route.query.min_price ? Number(route.query.min_price) : undefined,
  maxPrice: route.query.max_price ? Number(route.query.max_price) : undefined,
});

const productTypeOptions = ["سوهان", "گز"];
const productModelOptions = [
  "حبه ای",
  "لقمه ای",
  "سکه ای",
  "گل",
  "باقلوایی",
  "مدادی",
  "ترکیبی",
];
const oilTypeOptions = ["روغن حیوانی", "کره گیاهی", "روغن نباتی"];

function toggle(key: "productType" | "productModel" | "oilType", value: string) {
  filters[key] = filters[key] === value ? undefined : value;
}

const activeFiltersCount = computed(() => {
  return Object.values(filters).filter((v) => v !== undefined && v !== "").length;
});

function applyFilters() {
  router.push({
    path: "/product",
    query: {
      ...route.query,
      product_type: filters.productType || undefined,
      product_model: filters.productModel || undefined,
      oil_type: filters.oilType || undefined,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
    },
  });

  modelValue.value = false;
}

function clearFilters() {
  filters.productType = undefined;
  filters.productModel = undefined;
  filters.oilType = undefined;
  filters.minPrice = undefined;
  filters.maxPrice = undefined;

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
        class="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl rounded-r-none rounded-l-3xl"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-5"
        >
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-gray-900">فیلتر محصولات</h2>
            <span
              v-if="activeFiltersCount > 0"
              class="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white"
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

        <!-- Body (scrollable) -->
        <div class="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          <!-- نوع محصول -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700">
              نوع محصول
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in productTypeOptions"
                :key="item"
                type="button"
                class="rounded-full border px-4 py-2 text-sm font-medium transition"
                :class="
                  filters.productType === item
                    ? 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                "
                @click="toggle('productType', item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <!-- مدل محصول -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700">
              مدل محصول
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in productModelOptions"
                :key="item"
                type="button"
                class="rounded-full border px-4 py-2 text-sm font-medium transition"
                :class="
                  filters.productModel === item
                    ? 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                "
                @click="toggle('productModel', item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <!-- نوع روغن -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700">
              نوع روغن
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in oilTypeOptions"
                :key="item"
                type="button"
                class="rounded-full border px-4 py-2 text-sm font-medium transition"
                :class="
                  filters.oilType === item
                    ? 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                "
                @click="toggle('oilType', item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <!-- قیمت -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700">
              محدوده قیمت (تومان)
            </label>
            <div class="grid grid-cols-2 gap-3">
              <div class="relative">
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  از
                </span>
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="حداقل"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-9 pl-3 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div class="relative">
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  تا
                </span>
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="حداکثر"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-9 pl-3 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer (sticky) -->
        <div class="flex gap-3 border-t border-gray-100 px-6 py-5">
          <button
            class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            @click="clearFilters"
          >
            حذف فیلتر
          </button>

          <button
            class="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-black active:scale-[0.98]"
            @click="applyFilters"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
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
</style>