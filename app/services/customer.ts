import type { CustomerProfileOut, UpdateCustomerProfileBody } from "~/types";

export const CustomerApi = {
    getProfile: ($api: any) =>
        $api(`/customer/profile`, {
            method: "GET",
        }) as Promise<CustomerProfileOut>,

    updateProfile: ($api: any, payload: UpdateCustomerProfileBody) =>
        $api(`/customer/profile`, {
            method: "PUT",
            body: payload,
        }) as Promise<CustomerProfileOut>,
};