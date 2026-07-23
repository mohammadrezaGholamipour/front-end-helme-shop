import type { CategoryOut } from "~/types";

export function useCategorySeo(
  category: MaybeRefOrGetter<CategoryOut | undefined>,
) {
  const data = computed(() => toValue(category));

  const title = computed(() =>
    data.value
      ? (data.value.meta_title ??
        `خرید و قیمت ${data.value.name} درجه یک | ${SITE.name}`)
      : SITE.name, // یا یک عنوان پیش‌فرض مناسب موقع لودینگ
  );

  const description = computed(() =>
    data.value
      ? (data.value.meta_description ??
        `خرید آنلاین انواع ${data.value.name} با تضمین تازگی و بهترین قیمت. ارسال سریع محصولات حلما به سراسر ایران.`)
      : undefined,
  );

  const image = computed(() =>
    data.value?.image ? `${SITE.url}${data.value.image}` : SITE.logo,
  );

  const url = computed(() => `${SITE.url}/categories/${data.value?.slug ?? ""}`);

  useHead({
    link: [{ rel: "canonical", href: url }],
  });

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE.name,
    ogType: "website",
    ogUrl: url,
    ogImage: image,
    ogImageAlt: () => `دسته بندی ${data.value?.name} در ${SITE.name}`,
    twitterCard: "summary_large_image",
    robots: "index, follow",
    appleMobileWebAppTitle: SITE.name,
  });

  useSchemaOrg([
    defineWebPage({
      "@type": "CollectionPage",
      name: title,
      description: description,
      url: url,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: "خانه", item: "/" },
        { name: () => data.value?.name, item: url },
      ],
    }),
  ]);
}
