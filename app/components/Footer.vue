<script setup lang="ts">
const globalStore = useGlobalStore();
</script>
<template>
  <footer>
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
          <NuxtImg
            src="/images/map.png"
            :alt="globalStore.state.store?.address"
          />
        </div>
        <div>
          <p>{{ globalStore.state.store?.phone }}</p>
          <NuxtImg
            src="/images/phone.png"
            :alt="globalStore.state.store?.phone"
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
        <button v-for="item in globalStore.state.store?.social">
          <p>{{ item?.name }}</p>
          <NuxtImg :src="`/images/${item?.icon}.png`" :alt="item?.icon" />
        </button>
      </section>
    </div>
  </footer>
</template>
