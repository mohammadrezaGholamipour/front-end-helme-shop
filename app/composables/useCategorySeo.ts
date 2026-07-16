import type { CategoryOut } from "~/types";

export function useCategorySeo(
  category: MaybeRefOrGetter<CategoryOut | undefined>,
) {
  const data = computed(() => toValue(category));

  // جلوگیری از اجرای کد سئو اگر دیتا هنوز نرسیده است
  if (!data.value) return;

  const title = computed(
    () =>
      data.value?.meta_title ??
      `خرید و قیمت ${data.value?.name} درجه یک | ${SITE.name}`,
  );

  const description = computed(
    () =>
      data.value?.meta_description ??
      `خرید آنلاین انواع ${data.value?.name} با تضمین تازگی و بهترین قیمت. ارسال سریع محصولات حلما به سراسر ایران.`,
  );

  const image = computed(() =>
    data.value?.image ? `${SITE.url}${data.value.image}` : SITE.logo,
  );

  const url = computed(() => `${SITE.url}/categories/${data.value?.slug}`);

  useHead({
    link: [{ rel: "canonical", href: url }],
  });

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE.name,
    ogType: "website", // برای دسته بندی website درست است
    ogUrl: url,
    ogImage: image,
    ogImageAlt: () => `دسته بندی ${data.value?.name} در ${SITE.name}`,
    twitterCard: "summary_large_image",
    robots: "index, follow",
    // اضافه کردن متای مخصوص موبایل و اپل در صورت نیاز
    appleMobileWebAppTitle: SITE.name,
  });

  useSchemaOrg([
    defineWebPage({
      "@type": "CollectionPage",
      name: title,
      description: description,
      url: url,
    }),
    // Breadcrumb در اسکیما برای سئو عالی است حتی اگر در UI مخفی باشد
    defineBreadcrumb({
      itemListElement: [
        { name: "خانه", item: "/" }, // آدرس نسبی در Nuxt Schema Org بهتر کار میکند
        { name: () => data.value?.name, item: url },
      ],
    }),
  ]);
}
