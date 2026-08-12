import type { CustomerProfileOut, UpdateCustomerProfileBody } from "~/types";
import { CustomerApi } from "~/services/customer";
import { onServerPrefetch } from "vue";

export const useProfile = () => {
    const { $api } = useNuxtApp();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const queryKey = ["customer", "profile"] as const;
    const queryFn = () => CustomerApi.getProfile($api);

    onServerPrefetch(() => {
        if (isAuthenticated.value) {
            return queryClient.prefetchQuery({ queryKey, queryFn });
        }
    });

    return useQuery<CustomerProfileOut>({
        queryKey,
        queryFn,
        enabled: isAuthenticated,
    });
};

export const useUpdateProfile = () => {
    const { $api } = useNuxtApp();
    const qc = useQueryClient();
    const queryKey = ["customer", "profile"] as const;

    return useMutation<CustomerProfileOut, unknown, UpdateCustomerProfileBody>({
        mutationFn: (payload: UpdateCustomerProfileBody) =>
            CustomerApi.updateProfile($api, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });
};