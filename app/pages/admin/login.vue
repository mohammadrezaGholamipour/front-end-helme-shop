<!-- pages/admin/login.vue -->
<script setup lang="ts">
definePageMeta({ layout: false });

const { login, isAuthenticated } = useAdminAuth();

if (isAuthenticated.value) {
  await navigateTo("/admin");
}

const form = reactive({
  username: "",
  password: "",
});

const fieldErrors = reactive({
  username: "",
  password: "",
});

const generalError = ref("");
const isLoading = ref(false);

function resetErrors() {
  fieldErrors.username = "";
  fieldErrors.password = "";
  generalError.value = "";
}

const toast = useAppToast();

async function handleSubmit() {
  resetErrors();

  if (!form.username.trim()) fieldErrors.username = "نام کاربری را وارد کنید.";
  if (!form.password.trim()) fieldErrors.password = "رمز عبور را وارد کنید.";
  if (fieldErrors.username || fieldErrors.password) return;

  isLoading.value = true;

  try {
    await login(form.username.trim(), form.password);
    await navigateTo("/admin");
  } catch (err) {
    toast.apiError(err, "نام کاربری یا رمز عبور اشتباه است.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="admin-login" dir="rtl">
    <div class="admin-login__bg" />

    <div class="admin-login__card">
      <div class="admin-login__brand">
        <img
          src="/images/helma-logo.webp"
          alt="هلما"
          class="admin-login__logo"
        />
        <h1 class="admin-login__title">ورود به پنل مدیریت</h1>
        <p class="admin-login__subtitle">
          برای دسترسی به پنل، نام کاربری و رمز عبور خود را وارد کنید.
        </p>
      </div>

      <p v-if="generalError" class="admin-login__general-error">
        <Icon name="tabler:alert-circle" class="h-4 w-4" />
        {{ generalError }}
      </p>

      <form class="admin-login__form" @submit.prevent="handleSubmit">
        <AdminInput
          v-model="form.username"
          label="نام کاربری"
          placeholder="نام کاربری خود را وارد کنید"
          :error="fieldErrors.username"
          :disabled="isLoading"
        />

        <AdminInput
          v-model="form.password"
          type="password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          :error="fieldErrors.password"
          :disabled="isLoading"
        />

        <button type="submit" class="admin-login__submit" :disabled="isLoading">
          <Icon
            v-if="isLoading"
            name="tabler:loader-2"
            class="admin-login__submit-icon"
          />
          {{ isLoading ? "در حال ورود..." : "ورود" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.admin-login {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden
    bg-slate-50 p-4
    dark:bg-black;
}

.admin-login__bg {
  @apply pointer-events-none absolute inset-0 -z-10;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(214, 180, 108, 0.15),
      transparent 45%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(231, 188, 76, 0.12),
      transparent 45%
    );
}

.admin-login__card {
  @apply w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6
    shadow-xl
    dark:border-slate-800 dark:bg-slate-950
    sm:p-8;
}

.admin-login__brand {
  @apply mb-6 flex flex-col items-center gap-3 text-center;
}

.admin-login__logo {
  @apply h-14 w-auto;
}

.admin-login__title {
  @apply text-xl font-bold text-slate-900 dark:text-white sm:text-2xl;
}

.admin-login__subtitle {
  @apply text-sm text-slate-500 dark:text-slate-400 text-wrap;
}

.admin-login__general-error {
  @apply mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50
    px-4 py-3 text-sm font-medium text-red-700
    dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400;
}

.admin-login__form {
  @apply flex flex-col gap-4;
}

.admin-login__submit {
  @apply mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[--gold-one]
    px-4 py-3 text-sm font-bold text-white transition
    hover:bg-[--gold-two]
    disabled:cursor-not-allowed disabled:opacity-60;
}

.admin-login__submit-icon {
  @apply h-4 w-4 animate-spin;
}
</style>
