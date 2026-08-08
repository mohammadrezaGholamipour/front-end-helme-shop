import type { CreateOrUpdateStoreBody, StoreOut } from "~/types";

export const StoreApi = {
  get: ($api: any) => $api("/store") as Promise<StoreOut>,
  create: ($api: any, payload: CreateOrUpdateStoreBody) =>
    $api.post("/store/create", payload),
  update: ($api: any, id: number, payload: CreateOrUpdateStoreBody) =>
    $api.put(`/store/${id}`, payload),
  delete: ($api: any, id: number) => $api.delete(`/store/${id}`),
};
