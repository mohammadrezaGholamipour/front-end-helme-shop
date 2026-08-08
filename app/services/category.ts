import type { CategoryOut } from "~/types";

export const CategoryApi = {
  get: ($api: any) => $api("/category") as Promise<CategoryOut[]>,

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

  displayOrder: (
    $api: any,
    payload: {
      id: number;
      display_order: number;
    }[],
  ) =>
    $api("/category/display-order", {
      method: "PUT",
      body: payload,
    }),
};
