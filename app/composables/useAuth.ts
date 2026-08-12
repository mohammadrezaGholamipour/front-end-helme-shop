import type { UserOut, UserCreate } from "~/types";
import { AuthApi } from "~/services/auth";

const TOKEN_COOKIE = "helma_token";

export function useAuth() {
  const { $api } = useNuxtApp();

  // =========================
  // TOKEN
  // =========================

  const token = useCookie<string | null>(TOKEN_COOKIE, {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });

  // =========================
  // USER
  // =========================

  const user = useState<UserOut | null>("auth-user", () => null);

  // =========================
  // COMPUTED
  // =========================

  const isAuthenticated = computed(() => !!token.value);

  const isAdmin = computed(
    () => user.value?.role === "ADMIN"
  );

  const isCustomer = computed(
    () => user.value?.role === "CUSTOMER"
  );

  // =========================
  // LOGIN
  // =========================

 async function login(mobile: string, password: string) {
  const response = await AuthApi.login($api, { mobile, password });
  token.value = response.access_token;
  await nextTick();
  user.value = await AuthApi.getMe($api);

  if (user.value.role === "ADMIN") {
    await navigateTo("/admin");
  } else {
    const route = useRoute();
    const redirect = route.query.redirect as string | undefined;
    await navigateTo(redirect || "/dashboard");
  }

  return user.value;
}


  async function register(payload: UserCreate) {
    await AuthApi.register($api, payload);

    // بعد از ثبت نام، مستقیماً login
    const user = await login(
      payload.mobile,
      payload.password,
    );

    return user;
  }


  // =========================
  // FETCH ME
  // =========================

  async function fetchMe() {
    if (!token.value) {
      user.value = null;
      return null;
    }

    try {
      user.value = await AuthApi.getMe($api);

      return user.value;
    } catch (error) {
      console.error("GET ME ERROR:", error);

      token.value = null;
      user.value = null;

      return null;
    }
  }

  // =========================
  // LOGOUT
  // =========================

  async function logout() {
    token.value = null;
    user.value = null;

    await navigateTo("/login");
  }

  return {
    token,
    user,

    isAuthenticated,
    isAdmin,
    isCustomer,

    login,
    register,
    fetchMe,
    logout,
  };
}