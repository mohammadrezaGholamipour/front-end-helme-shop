<script setup lang="ts">
import type { RegisterBody } from "~/types";

definePageMeta({
  layout: false,
});

const router = useRouter();
const toast = useAppToast();
const { register } = useAuth();

const form = reactive<RegisterBody>({
  mobile: "",
  password: "",
  repeat_password: "",
});

const isLoading = ref(false);

function validateForm() {
  if (!form.mobile.trim()) {
    toast.error("شماره موبایل را وارد کنید");
    return false;
  }

  if (!/^09\d{9}$/.test(form.mobile.trim())) {
    toast.error("شماره موبایل معتبر نیست");
    return false;
  }

  if (!form.password) {
    toast.error("رمز عبور را وارد کنید");
    return false;
  }

  if (!form.repeat_password) {
    toast.error("تکرار رمز عبور را وارد کنید");
    return false;
  }

  if (form.password !== form.repeat_password) {
    toast.error("رمز عبور و تکرار آن یکسان نیستند");
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (isLoading.value) return;

  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await register({
      mobile: form.mobile.trim(),
      password: form.password,
      repeat_password: form.repeat_password,
    });
  } catch (err: unknown) {
    toast.apiError(err, "ثبت نام انجام نشد. دوباره تلاش کنید.");
  } finally {
    isLoading.value = false;
  }
}

async function goToLogin() {
  await router.push("/login");
}
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
      gyroControls: true,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xc9962e, // رنگ طلایی هماهنگ با --gold-one
      shininess: 45.0,
      waveHeight: 18.0,
      waveSpeed: 3,
      zoom: 1,
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
</script>

<template>
  <main class="page-register">
    <!-- پس‌زمینه متحرک -->
    <div ref="vantaRef" class="page-register__bg"></div>

    <div class="page-register__card">
      <!-- Brand -->
      <div class="page-register__brand">
        <img
          src="/images/helma-logo.webp"
          alt="سوهان و گز حلما وفایی"
          class="page-register__logo"
        />

        <h1 class="page-register__title">سوهان و گز حلما وفایی</h1>
      </div>

      <!-- Register Form -->
      <form class="page-register__form" @submit.prevent="handleSubmit">
        <AdminInput
          v-model="form.mobile"
          label="شماره موبایل"
          placeholder="مثلاً 09123456789"
          :disabled="isLoading"
          autocomplete="tel"
          inputmode="numeric"
          dir="ltr"
        />

        <AdminInput
          v-model="form.password"
          type="password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          :disabled="isLoading"
          autocomplete="new-password"
        />

        <AdminInput
          v-model="form.repeat_password"
          type="password"
          label="تکرار رمز عبور"
          placeholder="رمز عبور خود را دوباره وارد کنید"
          :disabled="isLoading"
          autocomplete="new-password"
        />

        <button
          type="submit"
          class="page-register__submit"
          :disabled="isLoading"
        >
          <Icon
            v-if="isLoading"
            name="tabler:loader-2"
            class="page-register__submit-icon animate-spin"
          />

          {{ isLoading ? "در حال ایجاد حساب..." : "ایجاد حساب کاربری" }}
        </button>
      </form>

      <!-- Login -->
      <div class="page-register__login">
        <span> قبلاً حساب کاربری ساخته‌اید؟ </span>

        <button
          type="button"
          class="page-register__login-button"
          :disabled="isLoading"
          @click="goToLogin"
        >
          ورود به حساب
        </button>
         <Icon class="text-[--gold-one]" name="tabler:arrow-left" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-register {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden
   bg-slate-100 px-4 py-8
   dark:bg-black;
}

.page-register__bg {
  @apply absolute inset-0 z-0;
}

.page-register__card {
  @apply relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6
  shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90 sm:p-8;
}

.page-register__brand {
  @apply mb-6 flex flex-col items-center gap-3 text-center;
}

.page-register__logo {
  @apply h-14 w-auto;
}

.page-register__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.page-register__subtitle {
  @apply text-sm text-slate-500 text-wrap dark:text-slate-400;
}

.page-register__general-error {
  @apply mb-4 flex items-center gap-2 rounded-2xl border border-red-200
  bg-red-50 px-4 py-3 text-sm font-medium text-red-700
  dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400;
}

.page-register__form {
  @apply flex flex-col gap-4;
}

.page-register__submit {
  @apply mt-2 flex items-center justify-center gap-2 rounded-2xl
  bg-[--gold-one] px-4 py-3 text-sm font-bold text-white
  transition hover:bg-[--gold-two]
  disabled:cursor-not-allowed disabled:opacity-60;
}

.page-register__submit-icon {
  @apply h-4 w-4;
}

.page-register__login {
  @apply mt-6 flex items-center justify-center gap-2 text-sm  border-t border-slate-200 pt-5
    dark:border-slate-800 text-slate-500 dark:text-slate-400;
}

.page-register__login-button {
  @apply font-bold text-[--gold-one] transition
  hover:text-[--gold-two]
  disabled:cursor-not-allowed disabled:opacity-60;
}
</style>
