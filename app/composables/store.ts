import type { StoreOut, CreateOrUpdateStoreBody } from "~/types";
import { StoreApi } from "~/services/store";
import { onServerPrefetch } from "vue";

export const useAllStore = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["store"] as const;
  const queryFn = () => StoreApi.getAll($api);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery<StoreOut[]>({
    queryKey,
    queryFn,
  });
};

export const useStore = (id: number) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["store", id] as const;
  const queryFn = () => StoreApi.getById($api, id);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery<StoreOut>({
    queryKey,
    queryFn,
  });
};

export const useCreateStore = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["store"] as const;
  return useMutation<StoreOut, unknown, CreateOrUpdateStoreBody>({
    mutationFn: (payload: CreateOrUpdateStoreBody) =>
      StoreApi.create($api, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useUpdateStore = (id: number) => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["store", id] as const;
  return useMutation<StoreOut, unknown, CreateOrUpdateStoreBody>({
    mutationFn: (payload: CreateOrUpdateStoreBody) =>
      StoreApi.update($api, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useDeleteStore = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["store"] as const;
  return useMutation<void, unknown, number>({
    mutationFn: (id: number) => StoreApi.delete($api, id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};
