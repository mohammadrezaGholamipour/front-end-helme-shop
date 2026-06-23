<script setup>
definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="parent-contact-us">
    <div class="parent-contact-us__card">
      <!-- Logo -->

      <div class="logo">
        <img src="../assets/images/helma-logo.png" />
      </div>

      <!-- Heading -->
      <div class="heading">
        <h1 class="heading__title">
          <span class="heading__diamond">&#9670;</span>
          به دنیای ما خوش آمدید
          <span class="heading__diamond">&#9670;</span>
        </h1>
        <p class="heading__subtitle">
          از طریق شبکه‌های اجتماعی با ما در ارتباط باشید
        </p>
      </div>

      <!-- Social Links -->
      <div class="links">
        <!-- Instagram -->
        <a
          href="https://www.instagram.com/sohangaz_helma?utm_source=qr&igsh=ZDl4d3ZjMW9wa2Zm"
          class="link-card"
          target="_blank"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
              <img src="../assets/images/instagram.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">اینستاگرام</span>
            </div>
          </div>
          <span class="link-card__arrow">  <Icon name="tabler:square-rounded-arrow-left-filled" class="w-6 h-6" /></span>
        </a>

        <!-- Telegram -->
        <a href="https://t.me/Sohangaz_helma" class="link-card" target="_blank">
          <div class="link-card__left">
            <div class="link-card__icon">
                <img src="../assets/images/telegram.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">تلگرام</span>
            </div>
          </div>
          <span class="link-card__arrow">  <Icon name="tabler:square-rounded-arrow-left-filled" class="w-6 h-6" /></span>
        </a>

        <!-- WhatsApp -->
        <a
          href="https://chat.whatsapp.com/FkXj30LJGvdFn5sKyFLfpG?s=sh&p=a&mlu=4"
          class="link-card"
          target="_blank"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
              <img src="../assets/images/whatsapp.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">واتساپ</span>
            </div>
          </div>
          <span class="link-card__arrow">  <Icon name="tabler:square-rounded-arrow-left-filled" class="w-6 h-6" /></span>
        </a>

        <!-- Eitaa -->
        <a
          href="https://eitaa.com/SohanGaz_Helma"
          class="link-card"
          target="_blank"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
               <img src="../assets/images/eita.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">ایتا</span>
            </div>
          </div>
          <span class="link-card__arrow">
            <Icon
              name="tabler:square-rounded-arrow-left-filled"
              class="w-6 h-6"
            />
          </span>
        </a>

        <!-- Bale -->
        <a
          href="https://ble.ir/sohangaz_helma"
          class="link-card"
          target="_blank"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
                <img src="../assets/images/bale.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">بله</span>
            </div>
          </div>
          <span class="link-card__arrow">
            <Icon
              name="tabler:square-rounded-arrow-left-filled"
              class="w-6 h-6"
          /></span>
        </a>

        <!-- Rubika -->
        <a
          href="https://rubika.ir/sohanhelma"
          class="link-card"
          target="_blank"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
                <img src="../assets/images/rubika.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">روبیکا</span>
            </div>
          </div>
          <span class="link-card__arrow">
            <Icon
              name="tabler:square-rounded-arrow-left-filled"
              class="w-6 h-6"
          /></span>
        </a>

        <!-- Website -->
        <a href="" class="link-card" target="_blank">
          <div class="link-card__left">
            <div class="link-card__icon">
                <img src="../assets/images/website.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">وبسایت</span>
            </div>
          </div>
          <span class="link-card__arrow">
            <Icon
              name="tabler:square-rounded-arrow-left-filled"
              class="w-6 h-6"
            />
          </span>
        </a>

        <!-- Phone -->
        <a href="tel:02112345678" class="link-card">
          <div class="link-card__left">
            <div class="link-card__icon">
                <img src="../assets/images/phone.png" >
            </div>
            <div class="link-card__text">
              <span class="link-card__name">تماس با ما</span>
            </div>
          </div>
          <span class="link-card__arrow">
            <Icon
              name="tabler:square-rounded-arrow-left-filled"
              class="w-6 h-6"
          /></span>
        </a>
      </div>

      <!-- Copyright -->
      <p class="copyright">
        تمامی حقوق محفوظ است | فروشگاه سوهان و گز حلما وفایی
      </p>
    </div>
  </div>
</template>
