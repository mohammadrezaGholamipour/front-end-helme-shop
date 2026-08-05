export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const SERVER_ERROR_MESSAGE = "خطا در ارتباط با سرور . لطفا به تیم فنی اطلاع دهید";

const toasts = ref<ToastItem[]>([]);
let counter = 0;

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

const pushToast = (message: string, type: ToastType, duration = 4000) => {
  const id = ++counter;
  toasts.value.push({ id, message, type, duration });

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
};

const getErrorStatus = (err: unknown): number | undefined => {
  return (
    (err as any)?.status ??
    (err as any)?.statusCode ??
    (err as any)?.response?.status
  );
};


const isNetworkError = (err: unknown): boolean => {
  const status = getErrorStatus(err);
  if (status !== undefined) return false;

  const message = (err as any)?.message ?? "";
  return (
    message.includes("Failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("NetworkError") ||
    message.includes("Load failed") // Safari
  );
};

export const getErrorMessage = (err: unknown, fallback: string): string => {
  const status = getErrorStatus(err);

  if (status !== undefined && status >= 500) {
    return SERVER_ERROR_MESSAGE;
  }

  if (isNetworkError(err)) {
    return SERVER_ERROR_MESSAGE;
  }

  const data = (err as any)?.data ?? (err as any)?.response?._data;

  if (data) {
    if (Array.isArray(data.error) && data.error[0]?.message) {
      return data.error[0].message;
    }

    if (data.error?.message) {
      return data.error.message;
    }

    if (typeof data.error === "string") {
      return data.error;
    }

    if (Array.isArray(data.errors) && data.errors[0]?.message) {
      return data.errors[0].message;
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
};

export const useAppToast = () => {
  return {
    toasts: readonly(toasts),

    success: (message: string, duration?: number) =>
      pushToast(message, "success", duration),

    error: (message: string, duration?: number) =>
      pushToast(message, "error", duration),

    info: (message: string, duration?: number) =>
      pushToast(message, "info", duration),

    warning: (message: string, duration?: number) =>
      pushToast(message, "warning", duration),

    apiError: (err: unknown, fallback: string, duration?: number): string => {
      const message = getErrorMessage(err, fallback);
      pushToast(message, "error", duration);
      return message;
    },

    remove: removeToast,
  };
};