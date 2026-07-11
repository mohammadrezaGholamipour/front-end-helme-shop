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
        {
          name: 'theme-color',
          media: '(prefers-color-scheme: light)',
          content: '#d3b46d'
        },
        {
          name: 'theme-color',
          media: '(prefers-color-scheme: dark)',
          content: '#000000'
        },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://sohangaz.com' }
      ],
      script: [
        {
          innerHTML: `
            (() => {
              const theme = localStorage.getItem('colorMode');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
        },
      ],
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
    "@peterbud/nuxt-query",
    'nuxt-keen-slider',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    "nuxt-bezier",
    "@pinia/nuxt",
    "@nuxt/icon",
  ],
  nuxtQuery: {
    autoImports: ["useQuery", "useMutation", "useQueryClient"],
    devtools: true,
    queryClientOptions: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60,
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