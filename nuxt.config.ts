export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      title: 'فروشگاه سوهان و گز حلما',
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
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@peterbud/nuxt-query",
    "@pinia/nuxt",
    "nuxt-bezier",
  ],
  nuxtQuery: {
    autoImports: ["useQuery", "useMutation", "useQueryClient"],
    devtools: true,
    queryClientOptions: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://sohangaz.com/helma-shop-api/v1',
    },
  },
});