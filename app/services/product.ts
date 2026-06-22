import type { CreateProductBody, ProductOut } from "~/types";

export const ProductApi = {
  getAll: ($api: any) => $api("/product") as Promise<ProductOut[]>,
  getById: ($api: any, id: number) =>
    $api(`/product/${id}`) as Promise<ProductOut>,
  create: ($api: any, payload: CreateProductBody) =>
    $api.post("/product/create", payload),
  update: ($api: any, id: number, payload: CreateProductBody) =>
    $api.put(`/product/${id}`, payload),
  delete: ($api: any, id: number) => $api.delete(`/product/${id}`),
};
