<script setup lang="ts">
const props = defineProps<{
  textOne?: String|null;
  textTwo?: String|null;
  textThree?: String|null;
  textFour?: String|null;
  seo?: String|null;
}>();
</script>
<template>
  <h1 class="sr-only">
    {{
      seo?.length
        ? seo
        : "فروشگاه سوهان و گز حلما وفایی طعم اصیل سوهان و گز سوغات دست‌ نخورده‌ی ایران"
    }}
  </h1>
  <ClientOnly>
    <h1>
      <span
        v-if="props.textOne?.length"
        v-animate="{
          type: 'blurIn',
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        >{{ props.textOne }}</span
      ><strong
        v-if="props.textTwo?.length"
        v-animate="{
          type: 'blurIn',
          delay: 1000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
        class="text-[var(--gold-two)]"
      >
        {{ props.textTwo }}</strong
      >

      <span
        v-if="props.textThree?.length"
        class="text-wrap"
        v-animate="{
          type: 'blurIn',
          delay: 2000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        {{ props.textThree }}</span
      ><span
        v-if="props.textFour?.length"
        v-animate="{
          type: 'blurIn',
          delay: 3000,
          duration: 1000,
          once: true,
          threshold: 0,
        }"
      >
        {{ props.textFour }}
        <strong
          class="relative top-5 left-2 text-[0.75rem] text-[var(--gold-two)]"
          >قم</strong
        >
      </span>
    </h1>
  </ClientOnly>
</template>
