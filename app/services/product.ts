import type { CreateProductBody, ProductFilters, ProductOut } from "~/types";

export const ProductApi = {
  getAll: ($api: any, params: ProductFilters) =>
    $api("/product/me", {
      params,
    }) as Promise<ProductOut[]>,
  getBySlug: ($api: any, slug: string) =>
    $api(`/product/${slug}`) as Promise<ProductOut>,
  create: ($api: any, payload: CreateProductBody) =>
    $api.post("/product/create", payload),
  update: ($api: any, id: number, payload: CreateProductBody) =>
    $api.put(`/product/${id}`, payload),
  delete: ($api: any, id: number) => $api.delete(`/product/${id}`),
};
