export function useSearchSeo(
  query: MaybeRefOrGetter<string | undefined>,
  resultsCount?: MaybeRefOrGetter<number | undefined>,
) {
  const searchTerm = computed(() => toValue(query)?.trim());
  const count = computed(() => toValue(resultsCount));

  const hasQuery = computed(() => !!searchTerm.value);

  const title = computed(() =>
    hasQuery.value
      ? `نتایج جستجو برای «${searchTerm.value}» | ${SITE.name}`
      : `لیست همه محصولات | ${SITE.name}`,
  );

  const description = computed(() =>
    hasQuery.value
      ? `${count.value ?? ""} نتیجه برای جستجوی «${searchTerm.value}» در ${SITE.name}. خرید آنلاین با بهترین قیمت و ارسال سریع.`
      : `محصولات مورد نظر خود را در ${SITE.name} جستجو کنید و با بهترین قیمت و کیفیت خریداری نمایید.`,
  );

  const url = computed(() => `${SITE.url}`);

  useHead({
    link: [{ rel: "canonical", href: `${url}/product` }],
  });

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE.name,
    ogType: "website",
    ogUrl: url,
    ogImage: SITE.logo,
    twitterCard: "summary_large_image",
    robots: "index, follow",
    appleMobileWebAppTitle: SITE.name,
  });

  useSchemaOrg([
    defineWebPage({
      "@type": "SearchResultsPage",
      name: title,
      description: description,
      url: url,
    }),
  ]);
}