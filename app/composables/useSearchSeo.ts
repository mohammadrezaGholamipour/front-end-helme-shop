import type { LocationQueryValue } from "vue-router";
import type { MaybeRefOrGetter } from "vue";
import { computed } from "vue";

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  SOHAN: "سوهان",
  GAZ: "گز",
};

const PRODUCT_MODEL_LABELS: Record<string, string> = {
  HOBEH: "حبه‌ای",
  LOGHMEH: "لقمه‌ای",
  SEKKEI: "سکه‌ای",
  GOL: "گل",
  BAGHLAVAEI: "باقلوایی",
  MEDADI: "مدادی",
  COMBINATION: "ترکیبی از چند مدل",
};

const OIL_TYPE_LABELS: Record<string, string> = {
  ANIMAL_OIL: "روغن حیوانی",
  VEGETABLE_BUTTER: "کره گیاهی",
  NABATI_OIL: "روغن نباتی",
};

export function useSearchSeo(
  query: MaybeRefOrGetter<string | undefined>,
  resultsCount?: MaybeRefOrGetter<number | undefined>,
) {
  const route = useRoute();

  const searchTerm = computed(() => toValue(query)?.trim());
  const count = computed(() => toValue(resultsCount));



  function getLabel(
    value: LocationQueryValue | LocationQueryValue[] | undefined,
    labels: Record<string, string>,
  ) {
    const key = Array.isArray(value) ? value[0] : value;

    if (typeof key !== "string") {
      return undefined;
    }

    return labels[key] ?? key;
  }

  const productType = computed(() =>
    getLabel(route.query.product_type, PRODUCT_TYPE_LABELS),
  );

  const productModel = computed(() =>
    getLabel(route.query.product_model, PRODUCT_MODEL_LABELS),
  );

  const oilType = computed(() =>
    getLabel(route.query.oil_type, OIL_TYPE_LABELS),
  );

  const title = computed(() => {
    if (searchTerm.value) {
      return `نتایج جستجو برای «${searchTerm.value}» | ${SITE.name}`;
    }

    const parts: string[] = [];

    if (productType.value) {
      parts.push(productType.value);
    }

    if (productModel.value) {
      parts.push(productModel.value);
    }

    if (oilType.value) {
      parts.push(`با ${oilType.value}`);
    }

    if (parts.length) {
      return `خرید ${parts.join(" ")} | ${SITE.name}`;
    }

    return `لیست همه محصولات | ${SITE.name}`;
  });

  const description = computed(() => {
    if (searchTerm.value) {
      return `${count.value ?? ""} نتیجه برای جستجوی «${searchTerm.value}» در ${SITE.name}. خرید آنلاین با بهترین قیمت و ارسال سریع.`;
    }

    const parts: string[] = [];

    if (productType.value) {
      parts.push(productType.value);
    }

    if (productModel.value) {
      parts.push(productModel.value);
    }

    if (oilType.value) {
      parts.push(`با ${oilType.value}`);
    }

    if (parts.length) {
      return `خرید ${parts.join(" ")} با بهترین کیفیت، قیمت مناسب و ارسال سریع از ${SITE.name}.`;
    }

    return `محصولات مورد نظر خود را در ${SITE.name} جستجو کنید و با بهترین قیمت و کیفیت خریداری نمایید.`;
  });

  const canonical = computed(() => `${SITE.url}${route.fullPath}`);

  useHead({
    link: [
      {
        rel: "canonical",
        href: canonical,
      },
    ],
  });

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE.name,
    ogType: "website",
    ogUrl: canonical,
    ogImage: SITE.logo,
    twitterCard: "summary_large_image",
    robots: "index, follow",
    appleMobileWebAppTitle: SITE.name,
  });

  useSchemaOrg([
    defineWebPage({
      "@type": "SearchResultsPage",
      name: title,
      description,
      canonical,
    }),
  ]);
}