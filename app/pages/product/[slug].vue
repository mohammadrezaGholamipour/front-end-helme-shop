<script setup lang="ts">
import type { ProductOut } from "~/types";
import { useRoute } from "vue-router";

const route = useRoute();

const slug = String(route.params.slug);
const { data } = useProduct(slug) as unknown as {
  data: ProductOut | undefined;
  isLoading: boolean;
  error: unknown;
};
</script>

<template>
  <div
    v-animate="{ type: 'blurIn', delay: 300, duration: 1000, once: true }"
    class="product-page"
  >
    <section class="product-page__image">
      <img
        :src="data?.image ? `https://sohangaz.com${data?.image}` : ''"
        alt="product"
        width="500"
      />
    </section>

    <div class="product-page__content">
      <section class="product-page__text">
        <h1>{{ data?.name }}</h1>
        <p>{{ data?.description }}</p>
      </section>

      <section class="product-page__info">
        <div>
          <p>تهیه شده از بهترین مواد اولیه</p>
          <Icon
            name="tabler:rosette-discount-check-filled"
            class="w-8 h-8 text-[--gold-one] cursor-pointer"
          />
        </div>
        <div>
          <p>بدون مواد نگهدارنده</p>
          <Icon
            name="tabler:rosette-discount-check-filled"
            class="w-8 h-8 text-[--gold-one] cursor-pointer"
          />
        </div>
        <div>
          <p>طعم سنتی و اصیل</p>
          <Icon
            name="tabler:rosette-discount-check-filled"
            class="w-8 h-8 text-[--gold-one] cursor-pointer"
          />
        </div>
        <div>
          <p>تازه و باکیفیت</p>
          <Icon
            name="tabler:rosette-discount-check-filled"
            class="w-8 h-8 text-[--gold-one] cursor-pointer"
          />
        </div>
      </section>

      <section class="product-page__volume-and-count">
        <section class="product-page__volume">
          <p>وزن دلخواه خود را انتخاب کنید :</p>
          <section>
            <div class="product-page__volume--active">
              <p>500 گرمی</p>
              <p>400.000 تومان</p>
            </div>
            <div>
              <p>یک کیلویی</p>
              <p>800.000 تومان</p>
            </div>
          </section>
        </section>

        <section class="product-page__count">
          <p>چند بسته نیاز دارید؟</p>
          <div>
            <Icon
              name="tabler:square-rounded-minus-filled"
              class="w-8 h-8 text-[--gold-one] cursor-pointer"
            />
            <p>3 عدد</p>
            <Icon
              name="tabler:square-rounded-plus-filled"
              class="w-8 h-8 text-[--gold-one] cursor-pointer"
            />
          </div>
        </section>
      </section>

      <section class="product-page__price">
        <p>378.000 تومان</p>
        <p>یک عدد سوهان نباتی باقوایی 500 گرمی</p>
      </section>

      <button class="product-page__Shopping-cart">
        <p>افزودن به سبد خرید</p>
        <Icon name="tabler:shopping-cart-up" class="w-10 h-10 cursor-pointer" />
      </button>

      <section class="product-page__description">
        <p>توضیحات محصول</p>
        <p>
          یکی از محبوب ترین محصولات سنتی ایرانی است که با ترکیب خلال پسته مغز
          بادام و طعم دلنشین هل تهیه میشود. این سوهان با بافتی ترد و طعمی بینظیر
          انتخاب عالی برای پیداریی از مهمانان و هیده دادن به عزیزان شماست .
        </p>
      </section>

      <section class="product-page__delivery">
        <div>
          <Icon name="tabler:lock-check" class="w-10 h-10 cursor-pointer" />
          <p>پرداخت امن</p>
        </div>
        <div>
          <Icon name="tabler:package" class="w-10 h-10 cursor-pointer" />
          <p>بسته بندی مناسب</p>
        </div>
        <div>
          <Icon
            name="tabler:rosette-discount-check"
            class="w-10 h-10 cursor-pointer"
          />
          <p>تضمین کیفیت محصول</p>
        </div>
        <div>
          <Icon name="tabler:truck-delivery" class="w-10 h-10 cursor-pointer" />
          <p>ارسال سریع سراسر کشور</p>
        </div>
      </section>
    </div>
  </div>
</template>
