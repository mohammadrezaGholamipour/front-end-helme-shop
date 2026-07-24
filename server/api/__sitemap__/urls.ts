import type {
  BlogListResponse,
  CategoryOut,
  ProductOut,
} from "~/types/api";

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const now = new Date().toISOString();
  const applicationId = 1;

  const [categories, products, blogs] = await Promise.all([
    $fetch<CategoryOut[]>(`${config.public.apiBase}/category/me`, {
      query: {
        application_id: applicationId,
      },
    }),

    $fetch<ProductOut[]>(`${config.public.apiBase}/product/me`, {
      query: {
        application_id: applicationId,
      },
    }),

    $fetch<BlogListResponse>(
      `${config.public.apiBase}/blog/website/blog/list`,
      {
        query: {
          application_id: applicationId,
          per_page: 100,
          page: 1,
        },
      },
    ),
  ]);

  const urls: { loc: string; lastmod: string }[] = [
    { loc: "/", lastmod: now },
    { loc: "/product", lastmod: now },
    { loc: "/blog", lastmod: now },
    { loc: "/contact-us", lastmod: now },
  ];

  urls.push(
    ...categories.map((category) => ({
      loc: `/categories/${category.slug}`,
      lastmod: now,
    })),
  );

  urls.push(
    ...products.map((product) => ({
      loc: `/product/${product.slug}`,
      lastmod: now,
    })),
  );

  urls.push(
    ...blogs.blogs.map((blog) => ({
      loc: `blog/website/${blog.slug}`,
      lastmod: blog.updated_at ?? blog.created_at,
    })),
  );

  return urls;
});