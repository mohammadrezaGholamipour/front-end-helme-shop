<script setup lang="ts">
import SohanSeal from "@/components/dashboard/SohanSeal.vue";

const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();
const { data: profile, isPending, isError, refetch } = useProfile();
const toast = useAppToast();

const isEditing = ref(false);

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
});

function syncFormFromProfile() {
  if (!profile.value) return;
  form.first_name = profile.value.first_name ?? "";
  form.last_name = profile.value.last_name ?? "";
  form.email = profile.value.email ?? "";
}

watch(profile, syncFormFromProfile, { immediate: true });

// آیا هیچ اطلاعات هویتی‌ای (نام/نام‌خانوادگی) ثبت نشده؟
const hasIdentity = computed(() => {
  return Boolean(profile.value?.first_name || profile.value?.last_name);
});

const fullName = computed(() => {
  if (!profile.value) return "";
  return `${profile.value.first_name ?? ""} ${profile.value.last_name ?? ""}`.trim();
});

function startEditing() {
  syncFormFromProfile();
  isEditing.value = true;
}

function cancelEditing() {
  // اگر کاربر هنوز هیچ اطلاعاتی ثبت نکرده، انصراف معنی نداره؛ در حالت ادیت می‌مونیم
  if (!hasIdentity.value) return;
  syncFormFromProfile();
  isEditing.value = false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleSave() {
  if (isSaving.value) return;

  const first_name = form.first_name.trim();
  const last_name = form.last_name.trim();
  const email = form.email.trim();

  if (!first_name || !last_name) {
    toast.error("لطفاً نام و نام خانوادگی را کامل وارد کنید.");
    return;
  }

  if (email && !EMAIL_REGEX.test(email)) {
    toast.error("ایمیل وارد شده معتبر نیست.");
    return;
  }

  try {
    await updateProfile({
      first_name,
      last_name,
      // ایمیل اختیاری است؛ اگر خالی باشد چیزی برای کاربر ثبت نمی‌کنیم
      ...(email ? { email } : {}),
    });
    toast.success("اطلاعات حساب با موفقیت به‌روزرسانی شد.");
    isEditing.value = false;
  } catch (error) {
    toast.apiError(error, "به‌روزرسانی اطلاعات با خطا مواجه شد.");
  }
}
</script>

<template>
  <section class="profile-card">
    <div v-if="isPending" class="profile-card__loading">
      <div class="profile-card__skeleton profile-card__skeleton--avatar" />
      <div class="profile-card__skeleton-lines">
        <div class="profile-card__skeleton profile-card__skeleton--line" />
        <div
          class="profile-card__skeleton profile-card__skeleton--line profile-card__skeleton--short"
        />
      </div>
    </div>

    <div v-else-if="isError" class="profile-card__error">
      <Icon name="tabler:alert-triangle" class="h-6 w-6" />
      <p>دریافت اطلاعات حساب ممکن نشد.</p>
      <button type="button" class="profile-card__retry" @click="() => refetch()">
        تلاش دوباره
      </button>
    </div>

    <template v-else>
      <!-- حالتی که کاربر هنوز هیچ اطلاعاتی ثبت نکرده و در حال ویرایش هم نیست -->
      <div v-if="!hasIdentity && !isEditing" class="profile-card__onboarding">
        <SohanSeal :size="56">
          <Icon name="tabler:user-circle" class="h-6 w-6" />
        </SohanSeal>
        <p class="profile-card__onboarding-title">اطلاعات حساب خود را تکمیل کنید</p>
        <p class="profile-card__onboarding-text">
          هنوز نام و نام‌خانوادگی‌ای برای حساب شما ثبت نشده است.
        </p>
        <button type="button" class="profile-card__primary-btn" @click="startEditing">
          <Icon name="tabler:pencil" class="h-4 w-4" />
          تکمیل اطلاعات
        </button>
      </div>

      <template v-else>
        <div class="profile-card__identity">
          <SohanSeal :size="56">
            <Icon name="tabler:user-circle" class="h-6 w-6" />
          </SohanSeal>

          <div class="profile-card__identity-text">
            <h2 class="profile-card__name">
              {{ fullName || "کاربر گرامی" }}
            </h2>
            <p class="profile-card__email" :class="{ 'profile-card__email--muted': !profile?.email }">
              {{ profile?.email || "ایمیلی ثبت نشده است" }}
            </p>
          </div>

          <button
            v-if="!isEditing"
            type="button"
            class="profile-card__edit-btn"
            @click="startEditing"
          >
            <Icon name="tabler:pencil" class="h-4 w-4" />
            ویرایش اطلاعات
          </button>
        </div>

        <Transition name="profile-fade" mode="out-in">
          <div v-if="!isEditing" key="view" class="profile-card__grid">
            <div class="profile-card__field">
              <span class="profile-card__field-label">نام</span>
              <span
                class="profile-card__field-value"
                :class="{ 'profile-card__field-value--empty': !profile?.first_name }"
              >
                {{ profile?.first_name || "ثبت نشده" }}
              </span>
            </div>
            <div class="profile-card__field">
              <span class="profile-card__field-label">نام خانوادگی</span>
              <span
                class="profile-card__field-value"
                :class="{ 'profile-card__field-value--empty': !profile?.last_name }"
              >
                {{ profile?.last_name || "ثبت نشده" }}
              </span>
            </div>
          </div>

          <form v-else key="edit" class="profile-card__form" @submit.prevent="handleSave">
            <div class="profile-card__input-group">
              <label for="profile-first-name" class="profile-card__input-label">نام</label>
              <input
                id="profile-first-name"
                v-model="form.first_name"
                type="text"
                class="profile-card__input"
                placeholder="نام خود را وارد کنید"
                :disabled="isSaving"
                autocomplete="given-name"
              />
            </div>

            <div class="profile-card__input-group">
              <label for="profile-last-name" class="profile-card__input-label">نام خانوادگی</label>
              <input
                id="profile-last-name"
                v-model="form.last_name"
                type="text"
                class="profile-card__input"
                placeholder="نام خانوادگی خود را وارد کنید"
                :disabled="isSaving"
                autocomplete="family-name"
              />
            </div>

            <div class="profile-card__input-group">
              <label for="profile-email" class="profile-card__input-label">
                ایمیل <span class="profile-card__input-optional">(اختیاری)</span>
              </label>
              <input
                id="profile-email"
                v-model="form.email"
                type="email"
                class="profile-card__input"
                placeholder="ایمیل خود را وارد کنید"
                :disabled="isSaving"
                autocomplete="email"
              />
            </div>

            <div class="profile-card__form-actions">
              <button type="submit" class="profile-card__save-btn" :disabled="isSaving">
                <Icon v-if="isSaving" name="tabler:loader-2" class="h-4 w-4 animate-spin" />
                {{ isSaving ? "در حال ذخیره..." : "ذخیره تغییرات" }}
              </button>
              <button
                v-if="hasIdentity"
                type="button"
                class="profile-card__cancel-btn"
                :disabled="isSaving"
                @click="cancelEditing"
              >
                انصراف
              </button>
            </div>
          </form>
        </Transition>
      </template>
    </template>
  </section>
</template>

<style scoped>
.profile-card {
  @apply rounded-3xl border p-6 sm:p-8;
  background: var(--dash-surface);
  border-color: color-mix(in srgb, var(--dash-primary) 18%, transparent);
}

.profile-card__loading {
  @apply flex items-center gap-4;
}

.profile-card__skeleton {
  @apply animate-pulse rounded-full;
  background: color-mix(in srgb, var(--dash-primary) 12%, transparent);
}

.profile-card__skeleton--avatar {
  @apply h-16 w-16 shrink-0;
}

.profile-card__skeleton-lines {
  @apply flex flex-1 flex-col gap-2;
}

.profile-card__skeleton--line {
  @apply h-3 w-2/3 rounded-full;
}

.profile-card__skeleton--short {
  @apply w-1/3;
}

.profile-card__error {
  @apply flex flex-col items-center gap-3 py-6 text-center;
  color: var(--dash-ink);
}

.profile-card__retry {
  @apply rounded-xl px-4 py-2 text-sm font-bold text-white transition;
  background: var(--dash-primary);
}

.profile-card__retry:hover {
  background: var(--dash-primary-deep);
}

/* --- Onboarding / empty state --- */
.profile-card__onboarding {
  @apply flex flex-col items-center gap-3 py-6 text-center;
}

.profile-card__onboarding-title {
  @apply text-base font-bold;
  color: var(--dash-ink);
}

.profile-card__onboarding-text {
  @apply max-w-xs text-sm opacity-60 text-wrap;
  color: var(--dash-ink);
}

/* دکمه اصلی هماهنگ با استایل دکمه ورود در صفحه لاگین */
.profile-card__primary-btn {
  @apply mt-1 flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition;
  background: var(--dash-primary);
}

.profile-card__primary-btn:hover {
  background: var(--dash-primary-deep);
}

.profile-card__identity {
  @apply flex flex-wrap justify-center md:justify-start items-center gap-4;
}

.profile-card__identity-text {
  @apply flex-1;
}

.profile-card__name {
  @apply text-lg font-bold sm:text-xl text-center md:text-start;
  color: var(--dash-ink);
}

.profile-card__email {
  @apply text-sm opacity-70 text-center md:text-start;
  color: var(--dash-ink);
}

.profile-card__email--muted {
  @apply italic opacity-50;
}

.profile-card__edit-btn {
  @apply flex items-center gap-1.5 flex-1 justify-center rounded-2xl border px-4 py-2 text-sm font-bold transition;
  color: var(--dash-primary-deep);
  border-color: color-mix(in srgb, var(--dash-primary) 35%, transparent);
}

.profile-card__edit-btn:hover {
  background: color-mix(in srgb, var(--dash-primary) 10%, transparent);
}

.profile-card__grid {
  @apply mt-6 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
}

.profile-card__field {
  @apply flex flex-col gap-1;
}

.profile-card__field-label {
  @apply text-xs font-bold opacity-60;
  color: var(--dash-ink);
}

.profile-card__field-value {
  @apply text-sm font-medium;
  color: var(--dash-ink);
}

.profile-card__field-value--empty {
  @apply italic font-normal opacity-45;
}

.profile-card__form {
  @apply mt-6 flex flex-col gap-4 border-t pt-6;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
}

.profile-card__input-group {
  @apply flex flex-col gap-1.5;
}

.profile-card__input-label {
  @apply text-xs font-bold opacity-70;
  color: var(--dash-ink);
}

.profile-card__input-optional {
  @apply font-normal opacity-60;
}

.profile-card__input {
  @apply rounded-2xl border px-4 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60;
  background: var(--dash-surface);
  border-color: color-mix(in srgb, var(--dash-primary) 25%, transparent);
  color: var(--dash-ink);
}

.profile-card__input::placeholder {
  color: color-mix(in srgb, var(--dash-ink) 40%, transparent);
}

.profile-card__input:focus {
  border-color: var(--dash-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dash-primary) 18%, transparent);
}

.profile-card__form-actions {
  @apply mt-2 flex items-center gap-3;
}

.profile-card__save-btn {
  @apply flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60;
  background: var(--dash-primary);
}

.profile-card__save-btn:hover:not(:disabled) {
  background: var(--dash-primary-deep);
}

.profile-card__cancel-btn {
  @apply rounded-2xl px-5 py-2.5 text-sm font-bold opacity-70 transition hover:opacity-100 disabled:cursor-not-allowed;
  color: var(--dash-ink);
}

.profile-fade-enter-active,
.profile-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.profile-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.profile-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .profile-fade-enter-active,
  .profile-fade-leave-active {
    transition: none;
  }
}
</style>