<template>
  <div class="header-one">
    <section>
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
    <img src="../assets/images/helma-logo.png" alt="سوهان و گز حلما" />
    <section>
      <button>
        <p>17:22:11</p>
        |
        <p>چهارشنبه,15,آذر</p>
      </button>
      <button>
        <p>ورود | ثبت نام</p>
        <Icon name="tabler:user-filled" class="w-6 h-6" />
      </button>
    </section>
  </div>
</template>
