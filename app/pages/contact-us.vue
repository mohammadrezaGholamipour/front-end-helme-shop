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
        <img src="/images/title.png" width="170" alt="سوهان و گز" />
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
<style scoped>
.parent-contact-us {
  @apply min-h-screen w-screen flex justify-center items-start py-2 px-4 bg-[#FCF3E4];
}

.parent-contact-us__card {
  @apply w-full max-w-sm flex flex-col items-center gap-6;
}

.logo {
  @apply flex flex-col items-center gap-1 drop-shadow-xl;
}

.logo img:last-of-type {
  filter: saturate(180%) brightness(85%) contrast(115%);
  aspect-ratio: 4/1.5;
}

.logo__icon {
  @apply w-20 h-20 flex items-center justify-center;
}

.heading {
  @apply text-center flex flex-col gap-1;
}

.heading__title {
  @apply text-xl font-bold flex items-center justify-center gap-2;
}

.heading__diamond {
  @apply text-base;
  color: #c8922a;
}

.heading__subtitle {
  @apply text-sm font-normal;
  color: #c8922a;
}

/* ── Links List ── */
.links {
  @apply w-full flex flex-col gap-3;
}

/* ── Link Card ── */
.link-card {
  @apply w-full flex items-center justify-between drop-shadow-xl rounded-2xl hover:scale-90 px-4 py-3 cursor-pointer transition-all duration-200;
  background-color: #fffdf8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}

.link-card__left {
  @apply flex items-center gap-3;
}

.link-card__icon img {
  aspect-ratio: 1/1;
}

.link-card__text {
  @apply flex flex-col gap-0.5;
}

.link-card__name {
  @apply text-sm font-bold;
  color: #3d2c1e;
}

.link-card__handle {
  @apply text-xs font-normal;
  color: #c8922a;
}

.link-card__arrow {
  @apply text-base flex-shrink-0 mt-2 drop-shadow-lg;
  color: #c8912a86;
}

.footer-info {
  @apply w-full grid grid-cols-3 text-center rounded-2xl overflow-hidden mt-2;
  background-color: #fffdf8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}

.footer-info__cell {
  @apply flex flex-col items-center gap-1 py-4 px-2;
}

.footer-info__cell + .footer-info__cell {
  border-right: 1px solid #ede8df;
}

.footer-info__icon {
  @apply w-6 h-6 flex items-center justify-center;
  color: #c8922a;
}

.footer-info__label {
  @apply text-xs font-bold;
  color: #3d2c1e;
}

.footer-info__value {
  @apply text-xs;
  color: #8a7260;
}

.copyright {
  @apply text-xs text-center pb-4;
  color: #b0a090;
}

/* ── Skeleton Base & Shimmer Animation ── */
@keyframes skeleton-shimmer {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}

.skeleton {
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #d1b37b 25%, #f7f2ea 50%, #ede8df 75%);
  background-size: 800px 100%;
  animation: skeleton-shimmer 3s ease-in-out infinite;
}

.logo__skeleton {
  width: 305px;
  height: 105px;
  border-radius: 0.75rem;
  background-color: #fffdf8 !important;
}

.heading__title-skeleton {
  width: 200px;
  height: 1.5rem;
  background-color: #ffffff !important;
}

.heading__subtitle-skeleton {
  width: 240px;
  height: 1rem;
  margin-top: 0.25rem;
}

.link-card__icon-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
}

.link-card__name-skeleton {
  width: 100px;
  height: 0.875rem;
  border-radius: 0.375rem;
}

.link-card__arrow-skeleton {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.copyright-skeleton {
  display: inline-block;
  width: 220px;
  height: 0.75rem;
  border-radius: 0.375rem;
}
</style>
