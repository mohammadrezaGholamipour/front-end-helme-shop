<script setup lang="ts">
const [container, slider] = useKeenSlider({
  loop: true,
  mode: "snap",
  slides: {
    perView: 1,
    spacing: 15,
  },
});
</script>
<template>
  <div ref="container" class="keen-slider sm:!hidden">
    <div class="slider slider-one keen-slider__slide">
      <img
        alt="ارائه دهنده انواع سوهان با روغن های حیوانی"
        class="w-full h-full object-cover"
        src="/images/banner-one-small.webp"
        fetchpriority="high"
        height="500"
        width="500"
      />
      <div
        v-animate="{
          type: 'blurIn',
          delay: 2000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        class="slider-one__content"
      >
        <p>ســـــــــوهان</p>
        <p>تهیه‌شده با کره مرغوب و خلال‌های خوش‌عطر</p>
        <p>کیفیت و طعم اصیل را بچشید</p>
      </div>
    </div>
    <div class="slider slider-two keen-slider__slide">
      <img
        class="w-full h-full object-cover"
        src="/images/banner-three-small.webp"
        alt=" مجموعه‌ای چشم‌نواز برای پذیرایی و هدیه، با ترکیبی از طعم اصیل، بسته‌بندی
        شکیل و کیفیتی که هر لحظه را به خاطره‌ای ماندگار تبدیل می‌کند."
        fetchpriority="high"
        width="500"
        height="500"
      />
      <p
        v-animate="{
          type: 'blurIn',
          delay: 1000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        چیدمان خوش‌مزه ایرانی
      </p>
      <p
        v-animate="{
          type: 'blurIn',
          delay: 2000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        مجموعه‌ای چشم‌نواز برای پذیرایی و هدیه، با ترکیبی از طعم اصیل، بسته‌بندی
        شکیل و کیفیتی که هر لحظه را به خاطره‌ای ماندگار تبدیل می‌کند.
      </p>
      <p
        v-animate="{
          type: 'blurIn',
          delay: 3000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        همراهی دلخواه برای هر مناسبت
      </p>
    </div>
  </div>
</template>
<style>
.slider {
  @apply relative w-full rounded-lg overflow-hidden aspect-[1/1];
}

.slider-one__content {
  @apply absolute  z-10 left-[15vw] top-[26vw] flex flex-col gap-7 items-center;
}

.slider-one__content p:nth-child(1) {
  @apply text-2xl font-bold text-[var(--gold-two)];
}

.slider-one__content p:nth-child(2) {
  @apply text-base font-bold text-white max-w-[35vw] text-center text-wrap;
}

.slider-one__content p:nth-child(3) {
  @apply text-[0.70rem]  font-bold text-[var(--gold-two)]  text-center text-wrap;
}

.slider-two__content {
  @apply absolute  z-10  top-[38vw] flex flex-col gap-2 items-start;
}

.slider-two > p:nth-of-type(1) {
  @apply text-2xl top-[10vw] absolute right-0 left-0 m-auto text-center font-bold text-[var(--gold-two)];
}
.slider-two > p:nth-of-type(2) {
  @apply text-[0.60rem]  top-[41vw] absolute right-[9vw] text-justify max-w-[30vw] text-wrap font-bold text-white;
}
.slider-two > p:nth-of-type(3) {
  @apply text-sm top-[80vw] absolute right-0 left-0 m-auto text-center font-bold text-[var(--gold-two)];
}
</style>
