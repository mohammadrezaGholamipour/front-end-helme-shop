import type { MaybeRefOrGetter } from "vue";
import type { ProductOut } from "~/types";

export function useProductSeo(
  product: MaybeRefOrGetter<ProductOut | undefined | null>,
) {
  const data = computed(() => toValue(product));

  // اگر دیتا هنوز لود نشده، بقیه کد اجرا نشود
  if (!data.value) return;

  const title = computed(() => `${data.value?.name} | خرید و قیمت | ${SITE.name}`);

  const description = computed(
    () => data.value?.meta_description ??
      `${data.value?.name} درجه یک حلما، تهیه شده از بهترین مواد اولیه. مشاهده قیمت و خرید آنلاین با ارسال سریع.`
  );

  const image = computed(() =>
    data.value?.image ? `${SITE.url}${data.value.image}` : SITE.logo
  );

  const url = computed(() => `${SITE.url}/products/${data.value?.slug}`);

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
    ogImage: image,
    ogImageAlt: () => data.value?.name,
    twitterCard: "summary_large_image",
    robots: "index, follow",
  });

  useSchemaOrg([
    defineProduct({
      name: () => data.value?.name,
      description: () => data.value?.description || description.value,
      image: [image.value], // گوگل لیست آرایه ای را ترجیح میدهد
      sku: () => `HELMA-${data.value?.id}`, // SKU معتبرتر
      // اگر برند خاصی دارید اینجا اضافه کنید
      brand: {
        "@type": "Brand",
        name: SITE.name
      },
      offers: () => data.value?.variants.map((variant) => ({
        "@type": "Offer",
        // اگر قیمت شما به تومان است، اینجا تبدیل به ریال کنید
        price: variant.price * 10,
        priceCurrency: "IRR",
        availability: variant.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: url.value,
        priceValidUntil: new Date(new Date().getFullYear() + 1, 0, 1).toISOString() // اعتبار قیمت
      })),
    }),

    defineBreadcrumb({
      itemListElement: [
        { name: "خانه", item: "/" },
        { name: data.value.category.name, item: `/categories/${data.value.category.slug}` },
        { name: () => data.value?.name, item: url },
      ],
    }),
  ]);
}
