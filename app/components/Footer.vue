<script setup lang="ts">
const globalStore = useGlobalStore();
</script>
<template>
  <footer
    v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }"
    class="parent-footer"
  >
    <div class="parent-footer__map">
      <div>
        <p>ما را پیدا کنید</p>
        <Icon name="tabler:map-pin" class="w-6 h-6 text-[--gold-two]" />
      </div>
      <p>{{ globalStore.state.store?.address }}</p>

      <iframe
        title="سوهان و گز حلما"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d410.17541535498833!2d50.8878354!3d34.6697689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93bb004d715c8f%3A0xab98b4cd8e02297a!2shelmaShop!5e0!3m2!1sen!2s!4v1783716034165!5m2!1sen!2s"
        style="border: 0"
        loading="lazy"
        class="rounded-lg shadow-md"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <ClientOnly>
      <a
        referrerpolicy="origin"
        target="_blank"
        href="https://trustseal.enamad.ir/?id=6967227&Code=2u8elDP41k6UJxkmFPenbFxf4jVU02bC"
        ><img
          referrerpolicy="origin"
          src="https://trustseal.enamad.ir/logo.aspx?id=6967227&Code=2u8elDP41k6UJxkmFPenbFxf4jVU02bC"
          alt=""
          style="cursor: pointer"
          code="2u8elDP41k6UJxkmFPenbFxf4jVU02bC"
      /></a>
    </ClientOnly>
    <section>
      <div class="parent-footer__logo">
        <img src="/images/helma-logo.webp" width="250" alt="سوهان و گز حلما" />
      </div>
      <div class="parent-social-media">
        <div>
          <p>لیست شبکه های اجتماعی حلما شاپ</p>
          <Icon name="tabler:users" class="w-6 h-6 !text-[--gold-two]" />
        </div>
        <div>
          <template v-for="item in globalStore.state.store?.social">
            <a
              v-if="item.name !== 'شماره تماس' && item.name !== 'وبسایت'"
              class="parent-social-media__social-icon"
              :href="item.link"
              :key="item.link"
              target="_blank"
            >
              <img
                :src="`/images/${item?.icon}.webp`"
                width="40"
                height="40"
                :alt="`آدرس ${item?.name} حلما شاپ`"
              />
            </a>
          </template>
        </div>
      </div>
    </section>
    <div class="parent-footer__quick-access">
      <div>
        <Icon name="tabler:bolt" class="w-6 h-6 text-[--gold-two]" />
        <p>دسترسی سریع</p>
      </div>

      <nuxt-link to="/">
        <Icon name="tabler:home" class="w-6 h-6 text-[--gold-two]" />
        <p>صفحه اصلی</p>
      </nuxt-link>

      <nuxt-link to="/contact-us">
        <Icon name="tabler:info-circle" class="w-6 h-6 text-[--gold-two]" />
        <p>درباره ما</p>
      </nuxt-link>
      <div>
        <Icon name="tabler:article" class="w-6 h-6 text-[--gold-two]" />
        <p>وبلاگ</p>
      </div>
    </div>

    <div class="parent-footer__contact-us">
      <div>
        <Icon name="tabler:phone-call" class="w-6 h-6 text-[--gold-two]" />
        <p>تماس باما</p>
      </div>
      <div>
        <Icon name="tabler:device-mobile" class="w-6 h-6 text-[--gold-two]" />
        <p>09122510234</p>
      </div>
      <div>
        <Icon
          name="tabler:device-landline-phone"
          class="w-6 h-6 text-[--gold-two]"
        />
        <p>09197402722</p>
      </div>
      <div>
        <Icon name="tabler:clock-hour-3" class="w-6 h-6 text-[--gold-two]" />
        <p>شنبه تا پنج شبنه 11 تا 22</p>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.parent-footer {
  @apply w-full flex gap-10 flex-wrap justify-evenly items-center text-white bg-[#1E242B] p-5 py-8 rounded-lg shadow-2xl;
}

.parent-footer section {
  @apply flex flex-col order-[-1] md:order-none justify-center items-center gap-5;
}

.parent-footer__logo {
  @apply flex flex-col justify-center items-center gap-2;
}

.parent-footer__logo p {
  @apply text-[0.75rem] font-bold;
}

.parent-footer__quick-access {
  @apply flex flex-col justify-start w-full md:w-auto items-center gap-4 font-thin;
}

.parent-footer__quick-access > a {
  @apply flex items-center justify-center gap-2 cursor-pointer min-w-[220px]  p-4 border-2 border-double border-[--gold-one] rounded-full;
}

.parent-footer__quick-access > div {
  @apply flex items-center justify-center gap-2 cursor-pointer min-w-[220px]  p-4 border-2 border-double border-[--gold-one] rounded-full;
}

.parent-footer__quick-access > div:first-of-type {
  @apply text-white font-bold text-lg !bg-transparent justify-center border-none;
}

.parent-footer__contact-us {
  @apply flex flex-col md:hidden w-full md:w-auto justify-start border-2 border-dashed p-5  rounded-md border-[--gold-one] items-start gap-4 font-thin;
}

.parent-footer__contact-us > div {
  @apply flex items-center justify-center gap-2 cursor-pointer;
}

.parent-footer__contact-us > div:first-of-type {
  @apply text-white font-bold text-lg mb-2;
}

.parent-footer__map {
  @apply flex flex-col justify-start items-center gap-5;
}

.parent-footer__map > div {
  @apply flex flex-row-reverse gap-2 text-white font-bold text-lg;
}

.parent-footer__map > p {
  @apply max-w-[250px] text-wrap text-center;
}

.parent-social-media {
  @apply flex flex-col justify-start items-center gap-5;
}

.parent-social-media > div:first-of-type {
  @apply flex flex-row-reverse gap-2 text-white font-bold text-lg;
}

.parent-social-media > div:last-of-type {
  @apply flex flex-wrap justify-center items-center gap-2;
}

.parent-social-media__social-icon {
  @apply flex items-center justify-center p-3 bg-[#1A1E26] rounded-xl shadow-md cursor-pointer;
}
</style>
