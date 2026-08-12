import type { OrderOut, OrderCreate } from "~/types";

export const OrderApi = {
    list: ($api: any) =>
        $api(`/order`, { method: "GET" }) as Promise<OrderOut[]>,

    get: ($api: any, orderId: number) =>
        $api(`/order/${orderId}`, { method: "GET" }) as Promise<OrderOut>,

    create: ($api: any, payload: OrderCreate) =>
        $api(`/order/create`, {
            method: "POST",
            body: payload,
        }) as Promise<OrderOut>,

    remove: ($api: any, orderId: number) =>
        $api(`/order/${orderId}`, { method: "DELETE" }) as Promise<void>,
};