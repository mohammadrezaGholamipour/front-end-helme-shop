// composables/useAdminAuth.ts
import { AuthApi } from "~/services/auth";

const TOKEN_COOKIE = "helma_token";

export function useAdminAuth() {
  const { $api } = useNuxtApp();

  const token = useCookie<string | null>(TOKEN_COOKIE, {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string) {
    const response = await AuthApi.login($api, { username, password });
    token.value = response.access_token;
    return response;
  }

  function logout() {
    token.value = null;
    return navigateTo("/admin/login");
  }

  return { token, isAuthenticated, login, logout };
}