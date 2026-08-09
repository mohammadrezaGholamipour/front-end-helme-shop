<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import ProfileCard from "@/components/dashboard/ProfileCard.vue";
import OrdersList from "@/components/dashboard/OrdersList.vue";
definePageMeta({ layout: false });

const { data: profile } = useProfile();
const { logout } = useAuth();

type DashTab = "profile" | "orders";
type DashTheme = "saffron" | "pistachio";

const activeTab = ref<DashTab>("profile");
const theme = ref<DashTheme>("saffron");

const tabs: { id: DashTab; label: string; icon: string }[] = [
  { id: "profile", label: "اطلاعات کاربری", icon: "tabler:user-circle" },
  { id: "orders", label: "سفارشات من", icon: "tabler:package" },
];

onMounted(() => {
  const saved = window.localStorage.getItem("dash-theme") as DashTheme | null;
  if (saved === "saffron" || saved === "pistachio") {
    theme.value = saved;
  }
});

function toggleTheme() {
  theme.value = theme.value === "saffron" ? "pistachio" : "saffron";
  window.localStorage.setItem("dash-theme", theme.value);
}

async function handleLogout() {
  try {
    await logout?.();
  } finally {
    navigateTo("/login");
  }
}
</script>

<template>
  <div class="dashboard-page" :data-theme="theme">
    <div class="dashboard-page__container">
      <DashboardHeader
        :greeting-name="profile?.first_name ?? ''"
        :theme="theme"
        @toggle-theme="toggleTheme"
        @logout="handleLogout"
      />

      <nav class="dashboard-page__tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="dashboard-page__tab"
          :class="{ 'dashboard-page__tab--active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </nav>

      <main class="dashboard-page__content">
        <Transition name="tab-fade" mode="out-in">
          <ProfileCard v-if="activeTab === 'profile'" key="profile" />
          <OrdersList v-else key="orders" />
        </Transition>
      </main>
    </div>
  </div>
</template>

<style>
.dashboard-page[data-theme="saffron"] {
  --dash-primary: #c9962e;
  --dash-primary-deep: #8a6415;
  --dash-surface: #fffbf2;
  --dash-surface-2: #f7ecd3;
  --dash-ink: #3b2a12;
  --dash-bg-1: #fef8ea;
  --dash-bg-2: #f4e6c4;
}

.dashboard-page[data-theme="pistachio"] {
  --dash-primary: #6b8e4e;
  --dash-primary-deep: #3f5a2c;
  --dash-surface: #f7faf1;
  --dash-surface-2: #e7efd6;
  --dash-ink: #29391d;
  --dash-bg-1: #f2f8ea;
  --dash-bg-2: #dfeece;
}
</style>

<style scoped>
.dashboard-page {
  @apply min-h-screen w-full transition-colors duration-300;
  background: linear-gradient(180deg, var(--dash-bg-1), var(--dash-bg-2));
}

.dashboard-page__container {
  @apply mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10;
}

.dashboard-page__tabs {
  @apply flex gap-2 rounded-2xl border p-1.5;
  background: var(--dash-surface);
  border-color: color-mix(in srgb, var(--dash-primary) 16%, transparent);
}

.dashboard-page__tab {
  @apply flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition;
  color: var(--dash-ink);
  opacity: 0.55;
}

.dashboard-page__tab--active {
  opacity: 1;
  background: var(--dash-primary);
  color: #fff;
}

.dashboard-page__content {
  @apply pb-4;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-page,
  .tab-fade-enter-active,
  .tab-fade-leave-active {
    transition: none;
  }
}
</style>
