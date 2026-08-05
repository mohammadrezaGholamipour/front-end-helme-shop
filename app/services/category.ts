import type { CategoryOut } from "~/types";

export const CategoryApi = {
  getAll: ($api: any) => $api("/category/me") as Promise<CategoryOut[]>,

  getBySlug: ($api: any, slug: string) =>
    $api(`/category/${slug}`) as Promise<CategoryOut>,

  create: ($api: any, payload: FormData) =>
    $api("/category/create", {
      method: "POST",
      body: payload,
    }),

  update: ($api: any, payload: FormData) =>
    $api(`/category/update`, {
      method: "PUT",
      body: payload,
    }),

  delete: ($api: any, id: number) =>
    $api(`/category/delete/${id}`, {
      method: "DELETE",
    }),
};
