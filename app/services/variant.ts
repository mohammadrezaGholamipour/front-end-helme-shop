import type { VariantOut } from "~/types";

export const VariantApi = {
  create: ($api: any, productId: number, payload: FormData) =>
    $api(`/variant/${productId}`, {
      method: "POST",
      body: payload,
    }) as Promise<VariantOut>,

  update: ($api: any, variantId: number, payload: FormData) =>
    $api(`/variant/${variantId}`, {
      method: "PATCH",
      body: payload,
    }) as Promise<VariantOut>,

  delete: ($api: any, variantId: number) =>
    $api(`/variant/${variantId}`, {
      method: "DELETE",
    }) as Promise<void>,
};