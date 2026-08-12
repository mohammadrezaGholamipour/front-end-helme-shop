import type { UserListOut, UserOut } from "~/types";

export const UserApi = {
    getAll: ($api: any) => $api("/user/list") as Promise<UserListOut[]>,
    getMe: ($api: any) => {
        return $api("/user/me", {
            method: "GET",
        }) as Promise<UserOut>;
    },
};