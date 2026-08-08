import type { ProductOut } from "~/types";
import { ProductApi } from "~/services/product";
import { onServerPrefetch } from "vue";


export const useAllProduct = () => {
  const { $api } = useNuxtApp();
  const route = useRoute();
  const queryClient = useQueryClient();

  const filters = computed<ProductFilters>(() => ({
    search: route.query.search as string | undefined,

    product_type: route.query.product_type as string | undefined,
    product_model: route.query.product_model as string | undefined,
    oil_type: route.query.oil_type as string | undefined,

    min_price: route.query.min_price
      ? Number(route.query.min_price)
      : undefined,

    max_price: route.query.max_price
      ? Number(route.query.max_price)
      : undefined,
  }));

  const queryKey = computed(() => [
    "products",
    filters.value,
  ]);

  const queryFn = () =>
    ProductApi.getAll($api, filters.value);

  onServerPrefetch(() =>
    queryClient.prefetchQuery({
      queryKey: queryKey.value,
      queryFn,
    })
  );

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