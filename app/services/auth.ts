import type {
  LoginBody,
  RegisterBody,
  TokenResponse,
  UserOut,
} from "~/types";

export const AuthApi = {
  login: ($api: any, payload: LoginBody) => {
    return $api("/auth/login", {
      method: "POST",
      body: payload,
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