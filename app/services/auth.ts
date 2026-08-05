import type { LoginBody, TokenResponse } from "~/types";

export const AuthApi = {
  login: ($api: any, payload: LoginBody) => {
    const body = new URLSearchParams();
    body.set("username", payload.username);
    body.set("password", payload.password);

    return $api("/auth/login", {
      method: "POST",
      body,
    }) as Promise<TokenResponse>;
  },
};