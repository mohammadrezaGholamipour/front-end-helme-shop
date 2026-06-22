export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
    // در defineNuxtPlugin
    const isServer = import.meta.server;
    const apiBaseClient = config.public.apiBase;

  
    const baseURL = isServer
      ? 'http://backend:8000/helma-shop-api/v1' // نقطه ویرگول و فضای خالی را حذف کنید
      : apiBaseClient; // از مقداری که در nuxt.config خوانده ایم استفاده کنید

    const api = $fetch.create({
      baseURL: baseURL,
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
