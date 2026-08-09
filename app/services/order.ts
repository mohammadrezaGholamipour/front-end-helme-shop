import type { OrderOut } from "~/types";

export const OrderApi = {
    list: ($api: any) =>
        $api(`/order`, {
            method: "GET",
        }) as Promise<OrderOut[]>,

    get: ($api: any, orderId: number) =>
        $api(`/order/${orderId}`, {
            method: "GET",
        }) as Promise<OrderOut>,
};