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



export const useCategorySlug = (slug: string) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  const queryKey = computed(() => ["category", "slug", slug] as const);

  const queryFn = () => CategoryApi.getBySlug($api, slug);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey: queryKey.value, queryFn }));

  return useQuery({
    queryKey: queryKey,
    queryFn,
    enabled: computed(() => slug.length >= 2),
  });
};


export const useCreateCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["category"] as const;
  return useMutation<CategoryOut, unknown, FormData>({
    mutationFn: (payload: FormData) => CategoryApi.create($api, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
};
 
 
 
export const useUpdateCategory = (id: number) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["category"] as const;
  return useMutation<CategoryOut, unknown, FormData>({
    mutationFn: (payload: FormData) => CategoryApi.update($api, id, payload),
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


export function buildCategoryFormData(data: {
  name: string;
  image?: File | null;
}): FormData {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.image) {
    formData.append("image", data.image);
  }
  return formData;
}
