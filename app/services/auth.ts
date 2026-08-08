import type {
  LoginBody,
  RegisterBody,
  TokenResponse,
  UserOut,
} from "~/types";

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

  register: ($api: any, payload: RegisterBody) => {
    return $api("/auth/register", {
      method: "POST",
      body: payload,
    }) as Promise<UserOut>;
  },

  getMe: ($api: any) => {
    return $api("/user/me", {
      method: "GET",
    }) as Promise<UserOut>;
  },
};