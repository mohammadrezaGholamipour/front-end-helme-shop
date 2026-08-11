<script setup lang="ts">
const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();
const { data: profile, isPending, isError, refetch } = useProfile();
const { user } = useAuth();
const toast = useAppToast();

const isEditing = ref(false);

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  address: "",
  postal_code: "",
  latitude: 0,
  longitude: 0,
});

function syncFormFromProfile() {
  if (!profile.value) return;

  form.first_name = profile.value.first_name ?? "";
  form.last_name = profile.value.last_name ?? "";
  form.email = profile.value.email ?? "";
  form.address = profile.value.address ?? "";
  form.postal_code = profile.value.postal_code ?? "";
  form.latitude = profile.value.latitude ?? 0;
  form.longitude = profile.value.longitude ?? 0;
}

watch(profile, syncFormFromProfile, { immediate: true });

const hasIdentity = computed(() => {
  return Boolean(profile.value?.first_name || profile.value?.last_name);
});

const fullName = computed(() => {
  if (!profile.value) return "";

  return `${profile.value.first_name ?? ""} ${
    profile.value.last_name ?? ""
  }`.trim();
});

function startEditing() {
  syncFormFromProfile();
  isEditing.value = true;
}

function cancelEditing() {
  // اگر کاربر هنوز هیچ اطلاعاتی ثبت نکرده، انصراف معنی ندارد
  if (!hasIdentity.value) return;

  syncFormFromProfile();
  isEditing.value = false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_REGEX = /^\d{10}$/;

async function handleSave() {
  if (isSaving.value) return;

  const first_name = form.first_name.trim();
  const last_name = form.last_name.trim();
  const email = form.email.trim();
  const address = form.address.trim();
  const postal_code = form.postal_code.trim();

  if (!first_name || !last_name) {
    toast.error("لطفاً نام و نام خانوادگی را کامل وارد کنید.");
    return;
  }

  if (email && !EMAIL_REGEX.test(email)) {
    toast.error("ایمیل وارد شده معتبر نیست.");
    return;
  }

  if (!address) {
    toast.error("لطفاً آدرس خود را وارد کنید.");
    return;
  }

  if (!postal_code) {
    toast.error("لطفاً کد پستی را وارد کنید.");
    return;
  }

  if (!POSTAL_CODE_REGEX.test(postal_code)) {
    toast.error("کد پستی باید ۱۰ رقم و فقط شامل عدد باشد.");
    return;
  }

  try {
    await updateProfile({
      first_name,
      last_name,
      email,
      address,
      postal_code,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
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
    <!-- Loading -->
    <div v-if="isPending" class="profile-card__loading">
      <div class="profile-card__skeleton profile-card__skeleton--avatar" />

      <div class="profile-card__skeleton-lines">
        <div class="profile-card__skeleton profile-card__skeleton--line" />

        <div
          class="profile-card__skeleton profile-card__skeleton--line profile-card__skeleton--short"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="profile-card__error">
      <Icon name="tabler:alert-triangle" class="h-6 w-6" />

      <p>دریافت اطلاعات حساب ممکن نشد.</p>

      <button
        type="button"
        class="profile-card__retry"
        @click="() => refetch()"
      >
        تلاش دوباره
      </button>
    </div>

    <template v-else>
      <!-- Empty / Onboarding -->
      <div v-if="!hasIdentity && !isEditing" class="profile-card__onboarding">
        <SohanSeal :size="56">
          <Icon name="tabler:user-circle" class="h-6 w-6" />
        </SohanSeal>

        <p class="profile-card__onboarding-title">
          اطلاعات حساب خود را تکمیل کنید
        </p>

        <p class="profile-card__onboarding-text">
          هنوز نام و نام‌خانوادگی‌ای برای حساب شما ثبت نشده است.
        </p>

        <button
          type="button"
          class="profile-card__primary-btn"
          @click="startEditing"
        >
          <Icon name="tabler:pencil" class="h-4 w-4" />
          تکمیل اطلاعات
        </button>
      </div>

      <template v-else>
        <!-- Identity -->
        <div class="profile-card__identity">
          <SohanSeal class="animate-pulse" :size="56">
            <Icon name="tabler:user-circle" class="h-6 w-6" />
          </SohanSeal>

          <div class="profile-card__identity-text">
            <h2 class="profile-card__name">
              {{ fullName || "کاربر گرامی" }}
            </h2>

            <p
              class="profile-card__email"
              :class="{
                'profile-card__email--muted': !profile?.email,
              }"
            >
              {{ user?.mobile }}
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

        <!-- View -->
        <div
          v-if="!isEditing"
          key="view"
          class="profile-card__grid"
          v-animate="{
            type: 'slideLeft',
            delay: 300,
            duration: 1000,
            once: true,
            threshold: 0,
          }"
        >
          <!-- First Name -->
          <div class="profile-card__field">
            <span class="profile-card__field-label"> نام </span>

            <span
              class="profile-card__field-value"
              :class="{
                'profile-card__field-value--empty': !profile?.first_name,
              }"
            >
              {{ profile?.first_name || "ثبت نشده" }}
            </span>
          </div>

          <!-- Last Name -->
          <div class="profile-card__field">
            <span class="profile-card__field-label"> نام خانوادگی </span>

            <span
              class="profile-card__field-value"
              :class="{
                'profile-card__field-value--empty': !profile?.last_name,
              }"
            >
              {{ profile?.last_name || "ثبت نشده" }}
            </span>
          </div>

          <!-- Email -->
          <div class="profile-card__field">
            <span class="profile-card__field-label"> ایمیل </span>

            <span
              class="profile-card__field-value"
              :class="{
                'profile-card__field-value--empty': !profile?.email,
              }"
            >
              {{ profile?.email || "ثبت نشده" }}
            </span>
          </div>

          <!-- Postal Code -->
          <div class="profile-card__field">
            <span class="profile-card__field-label"> کد پستی </span>

            <span
              class="profile-card__field-value"
              :class="{
                'profile-card__field-value--empty': !profile?.postal_code,
              }"
            >
              {{ profile?.postal_code || "ثبت نشده" }}
            </span>
          </div>

          <!-- Address -->
          <div class="profile-card__field profile-card__field--full">
            <span class="profile-card__field-label"> آدرس </span>

            <span
              class="profile-card__field-value"
              :class="{
                'profile-card__field-value--empty': !profile?.address,
              }"
            >
              {{ profile?.address || "ثبت نشده" }}
            </span>
          </div>
        </div>

        <!-- Edit Form -->
        <form
          v-else
          key="edit"
          class="profile-card__form"
          v-animate="{
            type: 'slideLeft',
            delay: 300,
            duration: 1000,
            once: true,
            threshold: 0,
          }"
          @submit.prevent="handleSave"
        >
          <!-- First Name -->
          <div class="profile-card__input-group">
            <label for="profile-first-name" class="profile-card__input-label">
              نام
            </label>

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

          <!-- Last Name -->
          <div class="profile-card__input-group">
            <label for="profile-last-name" class="profile-card__input-label">
              نام خانوادگی
            </label>

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

          <!-- Email -->
          <div class="profile-card__input-group">
            <label for="profile-email" class="profile-card__input-label">
              ایمیل
              <span class="profile-card__input-optional"> (اختیاری) </span>
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

          <!-- Postal Code -->
          <div class="profile-card__input-group">
            <label for="profile-postal-code" class="profile-card__input-label">
              کد پستی
            </label>

            <input
              id="profile-postal-code"
              v-model="form.postal_code"
              type="text"
              inputmode="numeric"
              maxlength="10"
              class="profile-card__input"
              placeholder="کد پستی ۱۰ رقمی"
            />
          </div>

          <!-- Address -->
          <div
            class="profile-card__input-group profile-card__input-group--full"
          >
            <label for="profile-address" class="profile-card__input-label">
              آدرس
            </label>

            <textarea
              id="profile-address"
              v-model="form.address"
              class="profile-card__input profile-card__textarea"
              placeholder="آدرس کامل خود را وارد کنید"
              :disabled="isSaving"
              rows="3"
              autocomplete="street-address"
            />
          </div>

          <!-- Actions -->
          <div class="profile-card__form-actions">
            <button
              type="submit"
              class="profile-card__save-btn"
              :disabled="isSaving"
            >
              <Icon
                v-if="isSaving"
                name="tabler:loader-2"
                class="h-4 w-4 animate-spin"
              />

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

/* --- Onboarding --- */

.profile-card__onboarding {
  @apply flex flex-col items-center gap-3 py-6 text-center;
}

.profile-card__onboarding-title {
  @apply text-base font-bold;
  color: var(--dash-ink);
}

.profile-card__onboarding-text {
  @apply max-w-xs text-sm text-wrap opacity-60;
  color: var(--dash-ink);
}

.profile-card__primary-btn {
  @apply mt-1 flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition;
  background: var(--dash-primary);
}

.profile-card__primary-btn:hover {
  background: var(--dash-primary-deep);
}

/* --- Identity --- */

.profile-card__identity {
  @apply flex flex-wrap items-center justify-center gap-4 md:justify-start;
}

.profile-card__identity-text {
  @apply flex-1;
}

.profile-card__name {
  @apply text-center text-lg font-bold sm:text-xl md:text-start;
  color: var(--dash-ink);
}

.profile-card__email {
  @apply text-center text-sm opacity-70 md:text-start;
  color: var(--dash-ink);
}

.profile-card__email--muted {
  @apply italic opacity-50;
}

.profile-card__edit-btn {
  @apply flex flex-1 items-center justify-center gap-1.5 rounded-2xl border px-4 py-2 text-sm font-bold transition;
  color: var(--dash-primary-deep);
  border-color: color-mix(in srgb, var(--dash-primary) 35%, transparent);
}

.profile-card__edit-btn:hover {
  background: color-mix(in srgb, var(--dash-primary) 10%, transparent);
}

/* --- View --- */

.profile-card__grid {
  @apply mt-6 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
}

.profile-card__field {
  @apply flex flex-col gap-1;
}

.profile-card__field--full {
  @apply sm:col-span-2;
}

.profile-card__field-label {
  @apply text-xs font-bold opacity-60;
  color: var(--dash-ink);
}

.profile-card__field-value {
  @apply text-sm font-medium break-words;
  color: var(--dash-ink);
}

.profile-card__field-value--empty {
  @apply italic font-normal opacity-45;
}

/* --- Form --- */

.profile-card__form {
  @apply mt-6 flex flex-col gap-4 border-t pt-6;
  border-color: color-mix(in srgb, var(--dash-primary) 14%, transparent);
}

.profile-card__input-group {
  @apply flex flex-col gap-1.5;
}

.profile-card__input-group--full {
  @apply w-full;
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

.profile-card__textarea {
  @apply min-h-24 resize-none leading-7;
}

.profile-card__coordinates {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2;
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

/* --- Motion --- */

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
