export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

    const isServer = import.meta.server;
    const apiBaseClient = config.public.apiBase;
    const baseURL = isServer? 'http://backend:8000/helma-shop-api/v1' : apiBaseClient; 
    console.log(isServer? 'http://backend:8000/helma-shop-api/v1' : apiBaseClient);
    const api = $fetch.create({
      baseURL: apiBaseClient,
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
