import type { LoginBody, TokenResponse } from "~/types";

export const AuthApi = {
  login: ($api: any, payload: LoginBody) =>
    $api.post("/auth/login", payload) as Promise<TokenResponse>,
};
