import type { SliderOut } from "~/types";

export const SliderApi = {
  list: ($api: any) =>
    $api("/slider/list") as Promise<SliderOut[]>,

  create: ($api: any, payload: FormData) =>
    $api("/slider/create", {
      method: "POST",
      body: payload,
    }) as Promise<SliderOut>,

  update: ($api: any, id: number, payload: FormData, displayOrder?: number) =>
    $api(`/slider/${id}`, {
      method: "PUT",
      body: payload,
      params:
        displayOrder !== undefined ? { display_order: displayOrder } : {},
    }) as Promise<SliderOut>,

  delete: ($api: any, id: number) =>
    $api(`/slider/${id}`, {
      method: "DELETE",
    }) as Promise<void>,
};