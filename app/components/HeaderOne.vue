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
    <img
      v-animate="{
        type: 'scaleIn',
        delay: 300,
        duration: 1000,
        once: true,
        threshold: 0,
      }"
      src="/images/helma-logo.webp"
      alt="سوهان و گز حلما"
      fetchpriority="high"
      width="305"
      height="102"
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
      <button class="min-h-[47px]">
        <p class="min-w-[55px] tabular-nums">{{ time }}</p>
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
<style scoped>
.header-one {
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    display: grid;
    width: 100%;
}

@media (max-width: 1300px) {
    .header-one {
        @apply text-sm;
        grid-template-columns: 1fr;
        gap: 0rem;

    }

    .header-one>* {
        justify-self: center !important;
    }

    .header-one>section:first-of-type {
        @apply px-2 !mt-1  justify-start md:justify-center;
        order: 1 !important;
        overflow-x: auto;
        width: 100%;
    }

    .header-one>section:last-of-type{
        @apply mt-5 md:justify-center;
         width: 100%;
    }
}


.header-one>section:first-of-type {
    justify-self: start;
}

.header-one>section {
    @apply flex items-center gap-4;
}


.header-one>section:nth-of-type(2) {
    justify-self: center;
}

.header-one>section:last-of-type {
    @apply px-2 justify-start md:!justify-center overflow-auto xl:!justify-end;
    width: 100%;

}

.header-one button {
    @apply flex items-center gap-3 border p-3 px-5 border-[var(--gold-one)] rounded-2xl text-[var(--gold-one)] font-bold;
}
</style>