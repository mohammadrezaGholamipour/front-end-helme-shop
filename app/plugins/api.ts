export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    query: {
      application_id: '1',
    },
  });
  return {
    provide: {
      api,
    },
  };
});
