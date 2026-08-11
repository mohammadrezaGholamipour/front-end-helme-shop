import type { SliderOut } from "~/types";
import { SliderApi } from "~/services/slider";
import { onServerPrefetch } from "vue";

export const useAllSlider = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["slider"] as const;
  const queryFn = () => SliderApi.list($api);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery<SliderOut[]>({
    queryKey,
    queryFn,
  });
};

export const useCreateSlider = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["slider"] as const;

  return useMutation<SliderOut, unknown, FormData>({
    mutationFn: (payload: FormData) => SliderApi.create($api, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useUpdateSlider = () => {
    const { $api } = useNuxtApp();
    const queryClient = useQueryClient();

    return useMutation<
        SliderOut,
        unknown,
        {
            id: number;
            payload: FormData;
            displayOrder?: number;
        }
    >({
        mutationFn: ({ id, payload, displayOrder }) =>
            SliderApi.update($api, id, payload, displayOrder),

        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["slider"],
            }),
    });
};

export const useDeleteSlider = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["slider"] as const;

  return useMutation<void, unknown, number>({
    mutationFn: (id: number) => SliderApi.delete($api, id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

// چون API بولک برای ترتیب نداریم، برای هر آیتمِ تغییر‌کرده یک PUT جدا می‌زنیم
export const useUpdateSliderDisplayOrder = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  const queryKey = ["slider"] as const;

  return useMutation<unknown, unknown, { id: number; display_order: number }[]>({
    mutationFn: (items) =>
      Promise.all(
        items.map((item) =>
          SliderApi.update($api, item.id, new FormData(), item.display_order),
        ),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};