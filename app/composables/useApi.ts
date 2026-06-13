export const useApi = () => {
  const config = useRuntimeConfig();

  const request = $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      console.log(response._data.error[0].message);
    },
  });

  return { request };
};
