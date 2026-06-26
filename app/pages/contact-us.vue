<script setup>
definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "ارتباط با سوهان و گز حلما | شبکه‌های اجتماعی و راه‌های تماس",
  ogTitle: "ارتباط با سوهان و گز حلما",
  ogSiteName: "سوهان و گز حلما",
  
  description:
    "راه‌های ارتباط با فروشگاه سوهان و گز حلما | مشاهده شبکه‌های اجتماعی، وبسایت و مسیرهای رسمی تماس برای خرید سوهان و گز تازه",
  ogDescription:
    "از طریق شبکه‌های اجتماعی و راه‌های رسمی با فروشگاه سوهان و گز حلما در ارتباط باشید",
  keywords:
    "ارتباط با سوهان و گز حلما, تماس با حلما, شبکه های اجتماعی حلما, خرید سوهان, خرید گز, فروشگاه سوهان و گز",
  ogImage: "https://sohangaz.com/images/helma-logo-og.jpg",
  twitterCard: "summary_large_image",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: "https://sohangaz.com/contact-us",
    },
  ],
});

useSchemaOrg([
  defineWebPage({
    name: "ارتباط با سوهان و گز حلما",
    description:
      "صفحه رسمی ارتباط با فروشگاه سوهان و گز حلما شامل شبکه‌های اجتماعی و راه‌های تماس.",
    url: "https://sohangaz.com/contact-us",
  }),
  defineOrganization({
    name: "سوهان و گز حلما",
    logo: "https://sohangaz.com/images/helma-logo-og.jpg",
    url: "https://sohangaz.com",
  }),
]);

const globalStore = useGlobalStore();
</script>

<template>
  <div class="parent-contact-us" v-show="globalStore.state.store?.social">
    <header class="sr-only">
      <h1>مرکز فروش سوهان و گز حلما - ارسال مستقیم سوغات</h1>
    </header>
    <div class="parent-contact-us__card">
      <!-- Logo -->
      <div v-animate="'slideUp'" class="logo">
        <img
          :src="globalStore.state.store?.logo"
          alt="فروشگاه سوهان و گز حلما"
          height="105"
          width="305"
        />
      </div>
      <!-- Heading -->
      <div v-animate="'slideUp'" class="heading">
        <h2 class="heading__title">
          <span class="heading__diamond">&#9670;</span>
          به دنیای ما خوش آمدید
          <span class="heading__diamond">&#9670;</span>
        </h2>
        <p class="heading__subtitle">
          از طریق شبکه‌های اجتماعی با ما در ارتباط باشید
        </p>
      </div>
      <!-- Social Links -->
      <div class="links" v-animate-stagger="{ delay: 500, gap: 120 }">
        <a
          v-for="item in globalStore.state.store?.social"
          :href="item.link"
          :key="item.link"
          class="link-card"
          target="_blank"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
              <img
                :src="`/images/${item?.icon}.webp`"
                :alt="`سوهان و گز حلما ${item?.name}`"
                height="40"
                width="40"
              />
            </div>
            <div class="link-card__text">
              <span class="link-card__name">{{ item?.name }}</span>
            </div>
          </div>
          <span class="link-card__arrow">
            <Icon
              name="tabler:square-rounded-arrow-left-filled"
              class="w-6 h-6"
          /></span>
        </a>
        <!-- Copyright -->
        <p class="copyright">
          تمامی حقوق محفوظ است | فروشگاه سوهان و گز حلما وفایی
        </p>
      </div>
    </div>
  </div>
</template>
