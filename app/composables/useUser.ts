import type { UserListOut } from "~/types";
import { UserApi } from "~/services/user";
import { onServerPrefetch } from "vue";

export const useAllUsers = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();
  const queryKey = ["user", "list"] as const;
  const queryFn = () => UserApi.getAll($api);

  onServerPrefetch(() => queryClient.prefetchQuery({ queryKey, queryFn }));

  return useQuery({ queryKey, queryFn }) as {
    data: Ref<UserListOut[] | undefined>;
    isLoading: Ref<boolean>;
    error: Ref<unknown>;
  };
};