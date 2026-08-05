// middleware/admin-auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/admin")) return;
  if (to.path === "/admin/login") return;

  const token = useCookie("helma_token");
  if (!token.value) {
    return navigateTo("/admin/login");
  }
});