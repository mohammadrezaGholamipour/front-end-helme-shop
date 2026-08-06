import type { ProductFilters, ProductOut } from "~/types";

export const ProductApi = {
  getAll: ($api: any, params: ProductFilters) =>
    $api("/product/me", {
      params,
    }) as Promise<ProductOut[]>,

  getMine: ($api: any) =>
    $api("/product/me") as Promise<ProductOut[]>,

  getBySlug: ($api: any, slug: string) =>
    $api(`/product/${slug}`) as Promise<ProductOut>,

  create: ($api: any, payload: FormData) =>
    $api("/product/create", {
      method: "POST",
      body: payload,
    }) as Promise<ProductOut>,

  update: ($api: any, payload: FormData) =>
    $api("/product/update", {
      method: "PUT",
      body: payload,
    }) as Promise<ProductOut>,

  delete: ($api: any, id: number) =>
    $api(`/product/delete/${id}`, {
      method: "DELETE",
    }) as Promise<void>
};