import type { CategoryOut } from "~/types";
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

export const useUpdateCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation<
    CategoryOut,
    unknown,
    {
      id: number;
      payload: FormData;
    }
  >({
    mutationFn: ({ payload }) =>
      CategoryApi.update($api, payload),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["category"],
      }),
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
  slug: string;
  image?: File | null;
  display_order?: number | null;
}): FormData {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("slug", data.slug);

  if (data.image) {
    formData.append("image", data.image);
  }

  if (data.display_order !== undefined && data.display_order !== null) {
    formData.append("display_order", String(data.display_order));
  }

  return formData;
}



export const useUpdateCategoryDisplayOrder = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation<
    string,
    unknown,
    {
      id: number;
      display_order: number;
    }[]
  >({
    mutationFn: (payload) => CategoryApi.displayOrder($api, payload),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["category"],
      }),
  });
};