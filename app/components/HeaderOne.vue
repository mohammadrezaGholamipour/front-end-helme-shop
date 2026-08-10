<script setup lang="ts">
const { user, isAdmin, isCustomer } = useAuth();
const { time, date } = useDateTime();
const showCartDialog = ref(false);
const cartStore = useCartStore();
const openCartDialog = (): void => {
  showCartDialog.value = true;
};
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
      <NuxtLink to="/product">
        <button>
          <p>همه محصولات</p>
          <Icon name="tabler:brand-walmart" class="w-6 h-6" />
        </button>
      </NuxtLink>
      <NuxtLink to="/contact-us">
        <button>
          <p>ارتباط باما</p>
          <Icon name="tabler:phone-filled" class="w-6 h-6" />
        </button>
      </NuxtLink>
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
      <nuxt-link
        class="flex gap-1 items-center"
        :to="!user ? '/login' : user.role === 'ADMIN' ? '/admin' : '/dashboard'"
      >
        <button>
          <p>{{ user ? "نمایش پنل" : "ورود به پنل" }}</p>
          <Icon name="tabler:user-filled" class="w-6 h-6" />
        </button>
      </nuxt-link>
      <button @click="openCartDialog" class="relative md:!hidden">
        <p>سبد خرید</p>
        <Icon name="tabler:shopping-cart" class="w-6 h-6" />
        <span
          v-animate="{
            type: 'blurIn',
            delay: 300,
            duration: 1000,
            once: true,
            threshold: 0,
          }"
          v-if="cartStore.totalItems > 0"
          class="absolute -top-0 -right-3.5 border border-dashed flex h-7 w-7 items-center justify-center rounded-full bg-red-700 font-bold text-white"
        >
          {{ cartStore.totalItems }}
        </span>
      </button>
      <NuxtLink to="/blog">
        <button>
          <p>وبلاگ</p>
          <Icon name="tabler:library-filled" class="w-6 h-6" />
        </button>
      </NuxtLink>
      <button>
        <p class="min-w-[55px] tabular-nums">{{ time }}</p>
        |
        <p>{{ date }}</p>
      </button>
    </section>
  </div>

  <CartDialog v-model="showCartDialog" />
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

  .header-one > * {
    justify-self: center !important;
  }

  .header-one > section:first-of-type {
    @apply px-2 justify-start mt-2 md:justify-center;
    order: 1 !important;
    overflow-x: auto;
    width: 100%;
  }

  .header-one > section:last-of-type {
    @apply mt-5  md:justify-center;
    width: 100%;
  }
}

.header-one > section:first-of-type {
  justify-self: start;
}

.header-one > section {
  @apply flex items-center gap-4;
}

.header-one > section:nth-of-type(2) {
  justify-self: center;
}

.header-one > section:last-of-type {
  @apply px-2 justify-start items-stretch md:!justify-center overflow-x-scroll md:overflow-hidden xl:!justify-end;
  width: 100%;
}

.header-one button {
  @apply flex items-center gap-3 border p-3 px-5 border-[var(--gold-one)] rounded-2xl text-[var(--gold-one)] font-bold;
}
</style>
