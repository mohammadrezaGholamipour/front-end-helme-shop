export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("helma_token");

  const isAuthenticated = !!token.value;

  // صفحات خصوصی
  const isProtectedRoute =
    to.path.startsWith("/admin") ||
    to.path.startsWith("/dashboard");

  // صفحات احراز هویت
  const isAuthPage =
    to.path === "/login" ||
    to.path === "/register";

  // اگر صفحه خصوصی است و توکن نداریم
  if (isProtectedRoute && !isAuthenticated) {
    return navigateTo("/login");
  }

  // اگر توکن داریم، ورود به login/register ممنوع
  if (isAuthPage && isAuthenticated) {
    return navigateTo("/dashboard");
  }
});