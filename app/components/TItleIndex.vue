<template>
  <h1 class="sr-only">
    فروشگاه سوهان و گز حلما وفایی طعم اصیل سوهان و گز سوغات دست‌نخورده‌ی ایران
  </h1>
  <ClientOnly>
    <h1>
      <span
        v-animate="{
          type: 'blurIn',
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        >فروشگاه</span
      ><strong
        v-animate="{
          type: 'blurIn',
          delay: 1000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        class="text-[var(--gold-two)]"
      >
        سوهان و گز حلما وفایی</strong
      >

      <span
        v-animate="{
          type: 'blurIn',
          delay: 2000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        طعم اصیل سوهان و گز ,</span
      ><span
        v-animate="{
          type: 'blurIn',
          delay: 3000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        سوغات دست‌نخورده‌ی ایران
        <strong
          class="relative top-5 left-2 text-[0.75rem] text-[var(--gold-two)]"
          >قم</strong
        >
      </span>
    </h1>
  </ClientOnly>
</template>

