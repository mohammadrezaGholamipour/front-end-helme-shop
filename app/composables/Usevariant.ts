import type { VariantOut } from "~/types";
import { VariantApi } from "~/services/variant";

export const useCreateVariant = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  return useMutation<
    VariantOut,
    unknown,
    { productId: number; payload: FormData }
  >({
    mutationFn: ({ productId, payload }) =>
      VariantApi.create($api, productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product"] }),
  });
};

export const useUpdateVariant = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  return useMutation<
    VariantOut,
    unknown,
    { variantId: number; payload: FormData }
  >({
    mutationFn: ({ variantId, payload }) =>
      VariantApi.update($api, variantId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product"] }),
  });
};

export const useDeleteVariant = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: (variantId: number) => VariantApi.delete($api, variantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product"] }),
  });
};