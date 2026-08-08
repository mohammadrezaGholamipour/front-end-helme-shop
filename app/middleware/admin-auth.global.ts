export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/admin")) return;
  if (to.path === "/login") return;

  const token = useCookie("helma_token");
  if (!token.value) {
    return navigateTo("/login");
  }
});