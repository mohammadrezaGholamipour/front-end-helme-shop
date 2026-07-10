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
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d410.17541535498833!2d50.8878354!3d34.6697689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93bb004d715c8f%3A0xab98b4cd8e02297a!2shelmaShop!5e0!3m2!1sen!2s!4v1783716034165!5m2!1sen!2s"
         style="border: 0"
        loading="lazy"
        class="rounded-lg shadow-md"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
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
              <img :src="`/images/${item?.icon}.webp`" width="40" alt="" />
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
      <div>
        <Icon name="tabler:home" class="w-6 h-6 text-[--gold-two]" />
        <p>صفحه اصلی</p>
      </div>
      <div>
        <Icon name="tabler:info-circle" class="w-6 h-6 text-[--gold-two]" />
        <p>درباره ما</p>
      </div>
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
  <!-- <footer
    v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill="#d6b46c"
        fill-opacity="1"
        d="M0,192L20,170.7C40,149,80,107,120,96C160,85,200,107,240,149.3C280,192,320,256,360,245.3C400,235,440,149,480,144C520,139,560,213,600,250.7C640,288,680,288,720,261.3C760,235,800,181,840,133.3C880,85,920,43,960,69.3C1000,96,1040,192,1080,213.3C1120,235,1160,181,1200,181.3C1240,181,1280,235,1320,229.3C1360,224,1400,160,1420,128L1440,96L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"
      ></path>
    </svg>
    <div
      class="footer"
      v-animate-stagger="{ delay: 500, threshold: 0.1, once: true }"
    >
      <section>
        <div>
          <p>{{ globalStore.state.store?.address }}</p>
          <Icon name="tabler:map-pin-filled" class="w-10 h-10" />
        </div>
        <div>
          <p>{{ globalStore.state.store?.phone }}</p>
          <img
            src="/images/footer-phone.webp"
            :alt="`${globalStore.state.store?.phone} شماره تلفن سوهان و گز حلما`"
            width="40"
            height="40"
          />
        </div>
      </section>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d821.5757134180984!2d50.79468376962758!3d34.54588660294193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93a35a3182c78b%3A0x569309d4a8cfd093!2sShahab%20Danesh%20University!5e0!3m2!1sen!2s!4v1781537845333!5m2!1sen!2s"
        width="1200"
        height="150"
        style="border: 0"
        loading="lazy"
        class="rounded-lg shadow-md"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>

      <section
        v-animate-stagger="{ delay: 500, threshold: 0.1, once: true }"
        v-if="globalStore.state.store?.social?.length"
      >
        <template v-for="item in globalStore.state.store?.social">
          <a
            v-if="item.name !== 'شماره تماس' && item.name !== 'وبسایت'"
            :href="item.link"
            :key="item.link"
            target="_blank"
          >
            <p>{{ item?.name }}</p>
            <img
              :src="`/images/footer-${item?.icon}.webp`"
              :alt="`${item?.name} سوهان و گز حلما `"
              width="40"
              height="40"
            />
          </a>
        </template>
      </section>
    </div>
  </footer> -->
</template>
