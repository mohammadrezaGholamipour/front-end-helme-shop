import { MovieApi } from "~/services/category";
///////////////////////////////////////////

export const useAllCategory = () => {
  const { $api } = useNuxtApp();
  return useQuery({
    queryKey: ["category"],
    queryFn: () => MovieApi.getAll($api),
  });
};
