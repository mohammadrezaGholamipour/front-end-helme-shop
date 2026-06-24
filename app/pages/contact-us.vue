<script setup>
definePageMeta({
  layout: false,
});

const globalStore = useGlobalStore();
</script>

<template>
  <BlurTransition mode="out-in">
    <ContactUsSkeleton key="loading" v-if="globalStore.state.loading" />
    <div v-else key="contetnt" class="parent-contact-us">
      <div class="parent-contact-us__card">
        <!-- Logo -->
        <div v-animate="'slideUp'" class="logo">
          <NuxtImg
            src="/images/helma-logo.png"
            alt="فروشگاه سوهان و گز حلما"
            format="webp"
            height="105"
            width="305"
          />
        </div>
        <!-- Heading -->
        <div v-animate="'slideUp'" class="heading">
          <h1 class="heading__title">
            <span class="heading__diamond">&#9670;</span>
            به دنیای ما خوش آمدید
            <span class="heading__diamond">&#9670;</span>
          </h1>
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
                <NuxtImg
                  :src="`/images/${item?.icon}.png`"
                  :alt="`سوهان و گز حلما ${item?.name}`"
                  format="webp"
                  height="38"
                  width="38"
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
          <a class="link-card" target="_blank">
            <div class="link-card__left">
              <div class="link-card__icon">
                <NuxtImg
                  src="/images/website.png"
                  alt="وبسایت فروشگاه سوهان و ز حلما"
                  format="webp"
                  height="38"
                  width="38"
                />
              </div>
              <div class="link-card__text">
                <span class="link-card__name">وبسایت</span>
              </div>
            </div>
            <span class="link-card__arrow">
              <Icon
                name="tabler:square-rounded-arrow-left-filled"
                class="w-6 h-6"
            /></span>
          </a>
          <a class="link-card" target="_blank">
            <div class="link-card__left">
              <div class="link-card__icon">
                <NuxtImg
                  src="/images/phone.png"
                  alt="وبسایت فروشگاه سوهان و ز حلما"
                  format="webp"
                  height="38"
                  width="38"
                />
              </div>
              <div class="link-card__text">
                <span class="link-card__name">شماره تماس</span>
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
  </BlurTransition>
</template>
