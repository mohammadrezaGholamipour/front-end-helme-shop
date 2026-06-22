import { AuthApi } from "~/services/auth";
import type { LoginBody, TokenResponse } from "~/types";

export const useLogin = () => {
  const { $api } = useNuxtApp();
  const qc = useQueryClient();
  return useMutation<TokenResponse, unknown, LoginBody>({
    mutationFn: (payload: LoginBody) => AuthApi.login($api, payload),
    onSuccess: (data: TokenResponse) => {
      // store token in Nuxt auth plugin or localStorage as needed
      // example: localStorage.setItem('token', data.access_token)
      qc.invalidateQueries({});
    },
  });
};
