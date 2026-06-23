// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      title:  'فروشگاه سوهان و گز حلما',
      meta: [
        {
          name: 'description',
          content: '✦ خرید آنلاین سوهان و گز | تازه، باکیفیت و ارسال سریع ✦'
        }
      ]
    }
  },
  srcDir: "app/",
  compatibilityDate: "2025-07-15",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@peterbud/nuxt-query"],
  nuxtQuery: {
    /**
     * Specify which Vue Query composables to auto-import
     * Default: `false`, set to `true` to auto-import all Vue Query composables
     */
    autoImports: ["useQuery", "useMutation", "useQueryClient"],

    // Enable/disable Nuxt DevTools integration (default: true)
    devtools: true,

    /**
     * These are the same options as the QueryClient
     * from @tanstack/vue-query, which will be passed
     * to the QueryClient constructor
     * More details: https://tanstack.com/query/v5/docs/reference/QueryClient
     */

    queryClientOptions: {
      defaultOptions: {
        queries: {
          // for example disable refetching on window focus
          refetchOnWindowFocus: false,
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://130.185.73.247/helma-shop-api/v1',
    },
  },
});