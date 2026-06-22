import { onServerPrefetch } from "vue";
import { ProductApi } from "~/services/product";
import type { ProductOut, CreateProductBody } from "~/types";

export const useAllProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["product"] as const;
  const queryFn = () => ProductApi.getAll($api);

  onServerPrefetch(() => qc.prefetchQuery({ queryKey, queryFn }));

  return useQuery<ProductOut[]>({
    queryKey,
    queryFn,
  });
};

export const useProduct = (id: number) => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["product", id] as const;
  const queryFn = () => ProductApi.getById($api, id);

  onServerPrefetch(() => qc.prefetchQuery({ queryKey, queryFn }));

  return useQuery<ProductOut>({
    queryKey,
    queryFn,
  });
};

export const useCreateProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["product"] as const;
  return useMutation<ProductOut, unknown, CreateProductBody>({
    mutationFn: (payload: CreateProductBody) =>
      ProductApi.create($api, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useUpdateProduct = (id: number) => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["product", id] as const;
  return useMutation<ProductOut, unknown, CreateProductBody>({
    mutationFn: (payload: CreateProductBody) =>
      ProductApi.update($api, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useDeleteProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["product"] as const;
  return useMutation<void, unknown, number>({
    mutationFn: (id: number) => ProductApi.delete($api, id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};
