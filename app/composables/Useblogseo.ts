import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import type { BlogOut } from "~/types";

export function useBlogSeo(
  blog: MaybeRefOrGetter<BlogOut | undefined | null>,
) {
  const data = computed(() => toValue(blog));

  const title = computed(() =>
    data.value
      ? `${data.value.meta_title ?? data.value.title} | ${SITE.name}`
      : SITE.name,
  );

  const description = computed(
    () =>
      data.value?.meta_description ??
      data.value?.summary ??
      `${data.value?.title ?? ""} | مقالات وبلاگ ${SITE.name}`,
  );

  const image = computed(() =>
    data.value?.image
      ? `${SITE.url}${data.value.image}`
      : SITE.logo,
  );

  const url = computed(() => `${SITE.url}/blog/${data.value?.slug ?? ""}`);

  useHead({
    link: [{ rel: "canonical", href: url }],
  });

  useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogDescription: description,
    ogType: "article",
    ogSiteName: SITE.name,
    ogUrl: url,
    ogImage: image,
    ogImageAlt: () => data.value?.title,

    articlePublishedTime: () => data.value?.published_at ?? undefined,
    articleModifiedTime: () => data.value?.updated_at,

    twitterCard: "summary_large_image",

    robots: data.value?.status === "PUBLISHED"
      ? "index, follow"
      : "noindex, nofollow",
  });

  useSchemaOrg([
    defineArticle({
      headline: () => data.value?.title,
      description: () => description.value,
      image: () => (image.value ? [image.value] : []),

      datePublished: () => data.value?.published_at ?? undefined,
      dateModified: () => data.value?.updated_at,

      author: {
        "@type": "Organization",
        name: SITE.name,
      },
    }),

    defineBreadcrumb({
      itemListElement: [
        { name: "خانه", item: "/" },
        { name: "وبلاگ", item: "/blog" },
        { name: () => data.value?.title, item: url },
      ],
    }),
  ]);
}

// سئوی صفحه لیست وبلاگ
export function useBlogListSeo() {
  const title = `وبلاگ | ${SITE.name}`;
  const description = `آخرین مقالات، اخبار و راهنمای خرید در وبلاگ ${SITE.name}`;
  const url = `${SITE.url}/blog`;

  useHead({
    link: [{ rel: "canonical", href: url }],
  });

  useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE.name,
    ogUrl: url,
    ogImage: SITE.logo,

    twitterCard: "summary_large_image",
    robots: "index, follow",
  });

  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: [
        { name: "خانه", item: "/" },
        { name: "وبلاگ", item: url },
      ],
    }),
  ]);
}