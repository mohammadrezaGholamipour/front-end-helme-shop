import type { CategoryOut, CreateAndUpdateCategory } from "~/types";
import { CategoryApi } from "~/services/category";
import { onServerPrefetch } from "vue";

export const useAllCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["category"] as const;
  const queryFn = () => CategoryApi.getAll($api);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery({ queryKey, queryFn });
};



export const useCategorySearch = (name:string) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  const queryKey = computed(() => ["category", "search", name] as const);

  const queryFn = () => CategoryApi.getByName($api, name);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey: queryKey.value, queryFn }));

  return useQuery({
    queryKey: queryKey,
    queryFn,
    enabled: computed(() => name.length >= 2),
  });
};


export const useCreateCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["category"] as const;
  return useMutation<CategoryOut, unknown, CreateAndUpdateCategory>({
    mutationFn: (payload: CreateAndUpdateCategory) =>
      CategoryApi.create($api, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
};



export const useUpdateCategory = (id: number) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["category", id] as const;
  return useMutation<CategoryOut, unknown, CreateAndUpdateCategory>({
    mutationFn: (payload: CreateAndUpdateCategory) =>
      CategoryApi.update($api, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
};

export const useDeleteCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["category"] as const;
  return useMutation<void, unknown, number>({
    mutationFn: (id: number) => CategoryApi.delete($api, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
};
