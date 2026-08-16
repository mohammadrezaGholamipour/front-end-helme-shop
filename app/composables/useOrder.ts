import type { OrderOut, OrderCreate, OrderStatus } from "~/types";
import { OrderApi } from "~/services/order";
import { onServerPrefetch } from "vue";
import type { MaybeRef } from "vue";

/* ---------------- سفارش‌های خود کاربر (فروشگاه) ---------------- */

export const useOrders = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["orders"] as const;
  const queryFn = () => OrderApi.list($api);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery<OrderOut[]>({
    queryKey,
    queryFn,
  });
};

export const useOrder = (orderId: MaybeRef<number>) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const id = computed(() => unref(orderId));
  const queryKey = computed(() => ["orders", id.value] as const);
  const queryFn = () => OrderApi.get($api, id.value);

  onServerPrefetch(() =>
    queryClient.prefetchQuery({ queryKey: queryKey.value, queryFn }),
  );

  return useQuery<OrderOut>({
    queryKey,
    queryFn,
    enabled: computed(() => !!id.value),
  });
};

export const useCreateOrder = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderCreate) => OrderApi.create($api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => OrderApi.remove($api, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/* ---------------- سفارش‌های همه‌ی کاربران (پنل ادمین) ---------------- */
// جدا از useOrders نگه داشته شده چون /order فقط سفارش‌های خودِ کاربره.
// این هوک باید در صفحه‌ی admin/orders استفاده بشه، نه useOrders.

export const useAdminOrders = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["orders", "admin"] as const;
  const queryFn = () => OrderApi.adminList($api);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery<OrderOut[]>({
    queryKey,
    queryFn,
  });
};

/* ---------------- تغییر وضعیت سفارش (ادمین) ---------------- */

interface UpdateOrderStatusPayload {
  orderId: number;
  status: OrderStatus;
}

export const useUpdateOrderStatus = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const adminKey = ["orders", "admin"] as const;

  return useMutation({
    mutationFn: ({ orderId, status }: UpdateOrderStatusPayload) =>
      OrderApi.updateStatus($api, orderId, status),

    // به‌روزرسانی خوش‌بینانه روی لیست ادمین: قبل از برگشتن جواب سرور، لیست
    // لوکال رو عوض می‌کنیم تا UI فوری واکنش نشون بده. اگه سرور خطا داد،
    // برمی‌گردونیم به حالت قبل.
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: adminKey });
      const previous = queryClient.getQueryData<OrderOut[]>(adminKey);

      queryClient.setQueryData<OrderOut[]>(adminKey, (old) =>
        old?.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(adminKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKey });
    },
  });
};