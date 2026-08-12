<script setup lang="ts">
definePageMeta({ layout: false });

const { login } = useAuth();
const toast = useAppToast();
const route = useRoute();

const form = reactive({
  mobile: "",
  password: "",
});

const isLoading = ref(false);

const handleSubmit = async () => {
  if (isLoading.value) return;

  const mobile = form.mobile.trim();
  const password = form.password;

  if (!mobile) {
    toast.error("لطفاً شماره موبایل خود را وارد کنید.");
    return;
  }

  if (!password) {
    toast.error("لطفاً رمز عبور خود را وارد کنید.");
    return;
  }

  isLoading.value = true;

  try {
     await login(mobile, password, route.query.redirect as string | undefined);

    toast.success("با موفقیت وارد شدید.");
  } catch (error) {
    toast.apiError(error, "شماره موبایل یا رمز عبور اشتباه است.");
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  navigateTo("/register");
};

useHead({
  script: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
      defer: false,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.waves.min.js",
      defer: false,
    },
  ],
});

const vantaRef = ref<HTMLElement | null>(null);
let vantaEffect: any = null;

// منتظر می‌مونیم تا اسکریپت‌های سراسری (window.THREE و window.VANTA) لود بشن
function waitForVanta(retries = 50): Promise<void> {
  return new Promise((resolve, reject) => {
    const check = () => {
      const w = window as any;
      if (w.THREE && w.VANTA?.WAVES) {
        resolve();
      } else if (retries <= 0) {
        reject(new Error("Vanta/Three did not load"));
      } else {
        retries--;
        setTimeout(check, 100);
      }
    };
    check();
  });
}

onMounted(async () => {
  try {
    await waitForVanta();
    const w = window as any;

    vantaEffect = w.VANTA.WAVES({
      el: vantaRef.value,
      THREE: w.THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xc9962e, // رنگ طلایی هماهنگ با --gold-one
      shininess: 45.0,
      waveHeight: 18.0,
      waveSpeed: 2,
      zoom: 0.85,
      backgroundColor: 0xc9962e, // پس‌زمینه روشن هماهنگ با تم
    });
  } catch (e) {
    // اگر به هر دلیلی Vanta لود نشد، صفحه بدون افکت (فقط رنگ ساده) نمایش داده می‌شه
    console.error("Vanta failed to initialize:", e);
  }
});

onBeforeUnmount(() => {
  vantaEffect?.destroy();
});

const goToHome = () => {
  navigateTo("/");
};
</script>

<template>
  <div class="page-login">
    <!-- پس‌زمینه متحرک -->
    <div ref="vantaRef" class="page-login__bg"></div>
    <button type="button" class="page-login__home" @click="goToHome">
      بازگشت به صفحه اصلی
    </button>

    <div class="page-login__card">
      <div class="page-login__brand">
        <img
          src="/images/helma-logo.webp"
          alt="هلما"
          class="page-login__logo"
        />

        <h1 class="page-login__title">سوهان و گز حلما وفایی</h1>
      </div>

      <form class="page-login__form" @submit.prevent="handleSubmit">
        <AdminInput
          v-model="form.mobile"
          label="شماره موبایل"
          placeholder="شماره موبایل خود را وارد کنید"
          :disabled="isLoading"
          autocomplete="mobile"
        />

        <AdminInput
          v-model="form.password"
          type="password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          :disabled="isLoading"
          autocomplete="current-password"
        />

        <button type="submit" class="page-login__submit" :disabled="isLoading">
          <Icon
            v-if="isLoading"
            name="tabler:loader-2"
            class="page-login__submit-icon animate-spin"
          />

          {{ isLoading ? "در حال ورود..." : "ورود" }}
        </button>

        <div class="page-login__register">
          <span class="page-login__register-text"> حساب کاربری ندارید؟ </span>

          <button
            type="button"
            class="page-login__register-button"
            :disabled="isLoading"
            @click="goToRegister"
          >
            ثبت نام کنید

            <Icon name="tabler:arrow-left" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-login {
  @apply relative flex w-screen h-screen items-center justify-center overflow-hidden
    bg-slate-50 p-4
    dark:bg-black;
}

.page-login__bg {
  @apply absolute inset-0 z-0;
}

.page-login__home {
  @apply absolute top-4 m-auto z-20 flex items-center gap-2 rounded-full
    bg-white px-4 py-2.5 text-sm font-bold text-[--gold-one]
    shadow-lg transition
    hover:bg-[--gold-one] hover:text-white hover:shadow-xl
    dark:bg-slate-950 dark:text-[--gold-one]
    dark:hover:bg-[--gold-one] dark:hover:text-white;
}

.page-login__card {
  @apply relative backdrop:opacity-10 z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6
    shadow-xl backdrop-blur-sm
    dark:border-slate-800 dark:bg-slate-950/90
    sm:p-8;
}

.page-login__brand {
  @apply mb-6 flex flex-col items-center gap-3 text-center;
}

.page-login__logo {
  @apply h-14 w-auto;
}

.page-login__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.page-login__subtitle {
  @apply text-sm text-slate-500 dark:text-slate-400 text-wrap;
}

.page-login__general-error {
  @apply mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50
    px-4 py-3 text-sm font-medium text-red-700
    dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400;
}

.page-login__form {
  @apply flex flex-col gap-4;
}

.page-login__submit {
  @apply mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[--gold-one]
    px-4 py-3 text-sm font-bold text-white transition
    hover:bg-[--gold-two]
    disabled:cursor-not-allowed disabled:opacity-60;
}

.page-login__submit-icon {
  @apply h-4 w-4 animate-spin;
}
.page-login__register {
  @apply mt-6 flex items-center justify-center gap-2
    border-t border-slate-200 pt-5
    dark:border-slate-800;
}

.page-login__register-text {
  @apply text-sm text-slate-500 dark:text-slate-400;
}

.page-login__register-button {
  @apply flex items-center gap-1
    text-sm font-bold text-[--gold-one]
    transition
    hover:text-[--gold-two];
}

.page-login__register-button :deep(svg) {
  @apply h-4 w-4 transition-transform;
}

.page-login__register-button:hover :deep(svg) {
  @apply -translate-x-1;
}
</style>
