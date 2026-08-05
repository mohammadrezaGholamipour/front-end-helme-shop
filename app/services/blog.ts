import type { $Fetch } from "ofetch";

import type {
  BlogCategoryOut,
  BlogListParams,
  BlogListResponse,
  BlogOut,
  CreateBlogBody,
  CreateBlogCategoryBody,
} from "~/types";

export const BlogApi = {
  // -------- Blog (public/website list, used for admin list too) --------
  getAll: (api: $Fetch, params?: BlogListParams) =>
    api<BlogListResponse>("/blog/website/blog/list", {
      params,
    }),

  getBySlug: (api: $Fetch, slug: string) =>
    api<BlogOut>(`/blog/website/${slug}`),

  create: (api: $Fetch, body: CreateBlogBody) =>
    api<BlogOut>("/blog/create-blog", {
      method: "POST",
      body,
    }),

  update: (api: $Fetch, id: number, body: CreateBlogBody) =>
    api<BlogOut>(`/blog/update/${id}`, {
      method: "PUT",
      body,
    }),

  delete: (api: $Fetch, id: number) =>
    api<void>(`/blog/delete/${id}`, {
      method: "DELETE",
    }),

  // -------- Blog Category --------
  getAllCategories: (api: $Fetch) =>
    api<BlogCategoryOut[]>("/blog/website/categories/list"),

  getCategory: (api: $Fetch, id: number) =>
    api<BlogCategoryOut>(`/blog/${id}`),

  createCategory: (api: $Fetch, body: CreateBlogCategoryBody) =>
    api<BlogCategoryOut>("/blog/create-category", {
      method: "POST",
      body,
    }),

  updateCategory: (api: $Fetch, id: number, body: CreateBlogCategoryBody) =>
    api<BlogCategoryOut>(`/blog/${id}`, {
      method: "PUT",
      body,
    }),

  deleteCategory: (api: $Fetch, id: number) =>
    api<void>(`/blog/${id}`, {
      method: "DELETE",
    }),
};