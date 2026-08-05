import type { CategoryOut } from "~/types";

export const CategoryApi = {
  getAll: ($api: any) => $api("/category/me") as Promise<CategoryOut[]>,

  getBySlug: ($api: any, slug: string) =>
    $api(`/category/${slug}`) as Promise<CategoryOut>,

  create: ($api: any, payload: FormData) =>
    $api.post("/category/create", payload),

  update: ($api: any, id: number, payload: FormData) =>
    $api.put(`/category/${id}`, payload),

  delete: ($api: any, id: number) =>
    $api.delete(`/category/${id}`),
};
