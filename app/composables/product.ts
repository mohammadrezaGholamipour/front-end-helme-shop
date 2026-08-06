import type { ProductOut } from "~/types";
import { ProductApi } from "~/services/product";
import { onServerPrefetch } from "vue";


export const useAllProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  const queryKey = ["product"] as const;
  const queryFn = () => ProductApi.getMine($api);

  onServerPrefetch(() => qc.prefetchQuery({ queryKey, queryFn }));

  return useQuery<ProductOut[]>({
    queryKey,
    queryFn,
  });
};

export const useProductSlug = (slug: string) => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  const queryKey = ["product", slug] as const;
  const queryFn = () => ProductApi.getBySlug($api, slug);

  onServerPrefetch(() => qc.prefetchQuery({ queryKey, queryFn }));

  return useQuery<ProductOut>({
    queryKey,
    queryFn,
  });
};

export const useCreateProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  return useMutation<ProductOut, unknown, FormData>({
    mutationFn: (payload: FormData) => ProductApi.create($api, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product"] }),
  });
};

export const useUpdateProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  return useMutation<ProductOut, unknown, FormData>({
    mutationFn: (payload: FormData) => ProductApi.update($api, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product"] }),
  });
};

export const useDeleteProduct = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: (id: number) => ProductApi.delete($api, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product"] }),
  });
};