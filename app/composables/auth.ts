import type { LoginBody, TokenResponse } from "~/types";
import { AuthApi } from "~/services/auth";

export const useLogin = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  return useMutation<TokenResponse, unknown, LoginBody>({
    mutationFn: (payload: LoginBody) => AuthApi.login($api, payload),
    onSuccess: (data: TokenResponse) => qc.invalidateQueries({}),
  });
};
