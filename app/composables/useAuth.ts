import type { UserOut, UserCreate } from "~/types";
import { CustomerApi } from "~/services/customer";
import { useCartStore } from "~/stores/cart";
import { OrderApi } from "~/services/order";
import { AuthApi } from "~/services/auth";
import { UserApi } from "~/services/user";

const TOKEN_COOKIE = "helma_token";

export function useAuth() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();
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
  const isAdmin = computed(() => user.value?.role === "ADMIN");
  const isCustomer = computed(() => user.value?.role === "CUSTOMER");

  // =========================
  // تکمیل سفارش معلق بعد از لاگین
  // =========================

  async function completePendingCheckout(): Promise<boolean> {
    const cartStore = useCartStore();

    if (!cartStore.cartItems.length) return false;

    try {
      const profile = await CustomerApi.getProfile($api);

      const isProfileComplete =
        !!profile?.first_name && !!profile?.last_name && !!profile?.address;

      if (!isProfileComplete) {
        await navigateTo("/dashboard?tab=profile");
        return true;
      }

      await OrderApi.create($api, {
        items: cartStore.cartItems.map((item) => ({
          product_id: item.id,
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      });

      cartStore.clearCart();

      await navigateTo("/dashboard?tab=orders");
      return true;
    } catch (error) {
      console.error("AUTO CHECKOUT ERROR:", error);
      // حتی اگه ثبت سفارش شکست خورد، کاربر رو به داشبورد ببر
      // تا بتونه از سبد خرید دوباره تلاش کنه
      await navigateTo("/dashboard?tab=orders");
      return true;
    }
  }

  // =========================
  // LOGIN
  // =========================

  async function login(mobile: string, password: string) {
    const response = await AuthApi.login($api, { mobile, password });
    token.value = response.access_token;
    await nextTick();
    user.value = await UserApi.getMe($api);

    if (user.value.role === "ADMIN") {
      await navigateTo("/admin");
      return user.value;
    }

    const route = useRoute();
    const shouldCheckout = route.query.checkout === "1";

    if (shouldCheckout) {
      const handled = await completePendingCheckout();
      if (handled) return user.value;
    }

    const redirect = route.query.redirect as string | undefined;
    await navigateTo(redirect || "/dashboard");

    return user.value;
  }

  async function register(payload: UserCreate) {
    await AuthApi.register($api, payload);
    const user = await login(payload.mobile, payload.password);
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
      user.value = await UserApi.getMe($api);
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
    cartStore.clearCart();
    queryClient.clear();
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