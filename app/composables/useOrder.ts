import type { OrderOut, OrderCreate } from "~/types";
import { OrderApi } from "~/services/order";
import { onServerPrefetch } from "vue";
import type { MaybeRef } from "vue";

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
        queryClient.prefetchQuery({ queryKey: queryKey.value, queryFn })
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