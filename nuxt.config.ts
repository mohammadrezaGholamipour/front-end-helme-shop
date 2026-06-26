export default defineNuxtConfig({
  site: {
    url: 'https://sohangaz.com',
    name: 'سوهان و گز حلما',
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      meta: [
        { name: 'theme-color', content: '#fbf3e4' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://sohangaz.com' }
      ]
    }
  },
  srcDir: "app/",
  compatibilityDate: "2026-06-26",
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
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
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