import { AuthApi } from "~/services/auth";
import type { UserOut } from "~/types";

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

  async function login(
    username: string,
    password: string
  ) {
    const response = await AuthApi.login($api, {
      username,
      password,
    });

    // ذخیره توکن
    token.value = response.access_token;

    await nextTick();

    // دریافت اطلاعات کاربر
    user.value = await AuthApi.getMe($api);

    // هدایت بر اساس role
    if (user.value.role === "ADMIN") {
      await navigateTo("/admin");
    } else {
      await navigateTo("/");
    }

    return user.value;
  }


  async function register(payload: UserCreate) {
    await AuthApi.register($api, payload);

    // بعد از ثبت نام، مستقیماً login
    const user = await login(
      payload.username,
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