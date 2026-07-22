import type { ProductOut, CreateProductBody } from "~/types";
import { ProductApi } from "~/services/product";
import { onServerPrefetch } from "vue";

export const useProduct = () => {
  const { $api } = useNuxtApp();
  const route = useRoute();
  const queryClient = useQueryClient();

  const filters = computed(() => ({
    application_id: 1,

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
