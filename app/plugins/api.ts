export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const baseURL = import.meta.server
    ? "http://backend:8000/helma-shop-api/v1"
    : config.public.apiBase;

  const api = $fetch.create({
    baseURL,

    onRequest({ options }) {
      const token = useCookie<string | null>(TOKEN_COOKIE);

      if (!token.value) {
        return;
      }

      const headers = new Headers(options.headers);

      headers.set(
        "Authorization",
        `Bearer ${token.value}`,
      );

      options.headers = headers;
    },

    onResponseError({ response }) {
      if (response.status !== 401) {
        return;
      }

      const token = useCookie<string | null>(TOKEN_COOKIE);

      token.value = null;

      const route = useRoute();

      if (route.path !== "/login") {
        navigateTo("/login");
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});