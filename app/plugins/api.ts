export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const isServer = import.meta.server;
  const apiBaseClient = config.public.apiBase;
  const baseURL = isServer
    ? "http://backend:8000/helma-shop-api/v1"
    : apiBaseClient;

  const api = $fetch.create({
    baseURL: baseURL,
    query: {
      application_id: "1",
    },
    onRequest({ options }) {
      const token = useCookie<string | null>(TOKEN_COOKIE).value;

      if (token) {
        options.headers = new Headers(options.headers);
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const token = useCookie<string | null>(TOKEN_COOKIE);
        token.value = null;

        // جلوگیری از ری‌دایرکت تکراری اگه از قبل توی صفحه‌ی لاگین هستیم
        const route = useRoute();
        if (route.path !== "/admin/login") {
          navigateTo("/admin/login");
        }
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});