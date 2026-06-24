<template>
  <div class="parent-contact-us">
    <div class="parent-contact-us__card">

      <!-- Logo -->
      <div class="logo">
        <div class="skeleton logo__skeleton" />
      </div>

      <!-- Heading -->
      <div class="heading">
        <h1 class="heading__title">
          <div class="skeleton heading__title-skeleton" />
        </h1>
        <p class="heading__subtitle">
          <div class="skeleton heading__subtitle-skeleton" ></div>
        </p>
      </div>

      <!-- Social Links -->
      <div class="links">
        <div
          v-for="i in 7"
          :key="i"
          class="link-card"
        >
          <div class="link-card__left">
            <div class="link-card__icon">
              <div class="skeleton link-card__icon-skeleton" />
            </div>
            <div class="link-card__text">
              <div class="skeleton link-card__name-skeleton" />
            </div>
          </div>
          <div class="skeleton link-card__arrow-skeleton" />
        </div>

        <!-- Copyright -->
        <p class="copyright flex flex-col justify-center items-center">
          <span class="skeleton copyright-skeleton mt-5" />
          <span class="skeleton copyright-skeleton mt-5" />
        </p>
      </div>

    </div>
  </div>
</template>
