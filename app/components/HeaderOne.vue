<script setup lang="ts">
const { time, date } = useDateTime();
</script>

<template>
  <div class="header-one">
    <section
      v-animate="{
        type: 'slideLeft',
        delay: 300,
        duration: 1000,
        once: true,
        threshold: 0,
      }"
    >
      <NuxtLink to="/">
        <button>
          <p>صفحه اصلی</p>
          <Icon name="tabler:home-filled" class="w-6 h-6" />
        </button>
      </NuxtLink>
      <NuxtLink to="/contact-us">
        <button>
          <p>ارتباط باما</p>
          <Icon name="tabler:phone-filled" class="w-6 h-6" />
        </button>
      </NuxtLink>
      <button>
        <p>وبلاگ</p>
        <Icon name="tabler:library-filled" class="w-6 h-6" />
      </button>
    </section>
    <NuxtImg
      v-animate="{
        type: 'scaleIn',
        delay: 300,
        duration: 1000,
        once: true,
        threshold: 0,
      }"
      src="/images/helma-logo.png"
      alt="سوهان و گز حلما"
      format="webp"
      width="200"
      height="67"
    />
    <section
      v-animate="{
        type: 'slideRight',
        delay: 300,
        duration: 1000,
        once: true,
        threshold: 0,
      }"
    >
      <button class="min-w-[205px] min-h-[47px]">
        <p class="min-w-[55px]">{{ time }}</p>
        |
        <p>{{ date }}</p>
      </button>
      <button>
        <p>ورود | ثبت نام</p>
        <Icon name="tabler:user-filled" class="w-6 h-6" />
      </button>
    </section>
  </div>
</template>
