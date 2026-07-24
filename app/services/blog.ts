import type { $Fetch } from "ofetch";

import type {
    BlogCategoryOut,
    BlogListParams,
    BlogListResponse,
    BlogOut,
    CreateBlogBody,
} from "~/types";

export const BlogApi = {

    getAll: (api: $Fetch, params?: BlogListParams) =>
        api<BlogListResponse>("/blog/website/blog/list", {
            params,
        }),

    getAllCategories: (api: $Fetch) =>
        api<BlogCategoryOut[]>("/blog/website/categories/list"),    


    getBySlug: (api: $Fetch, slug: string) =>
        api<BlogOut>(`/blog/website/${slug}`),

    create: (api: $Fetch, body: CreateBlogBody) =>
        api<BlogOut>("/blog/create-blog", {
            method: "POST",
            body,
        }),


    getById: (api: $Fetch, id: number) =>
        api<BlogOut>(`/blog/${id}`),

    getCategory: (api: $Fetch, id: number) =>
        api<BlogCategoryOut>(`/blog/${id}`),
};