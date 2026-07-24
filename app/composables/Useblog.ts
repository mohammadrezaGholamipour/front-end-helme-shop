
import type { BlogListParams } from "~/types";
import { BlogApi } from "~/services/blog";

export const useAllBlogs = (
  params?: MaybeRefOrGetter<BlogListParams | undefined>,
) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  const resolvedParams = computed(() => toValue(params));

  const queryKey = computed(
    () => ["blogs", resolvedParams.value ?? {}] as const,
  );

  const queryFn = () => BlogApi.getAll($api, resolvedParams.value);

  onServerPrefetch(() =>
    queryClient.prefetchQuery({
      queryKey: queryKey.value,
      queryFn,
    }),
  );

  return useQuery({
    queryKey,
    queryFn,
  });
};

export const useBlog = (slug: MaybeRefOrGetter<string>) => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  const resolvedSlug = computed(() => toValue(slug));

  const queryKey = computed(
    () => ["blogs", resolvedSlug.value] as const,
  );

  const queryFn = () => BlogApi.getBySlug($api, resolvedSlug.value);

  onServerPrefetch(() =>
    queryClient.prefetchQuery({
      queryKey: queryKey.value,
      queryFn,
    }),
  );

  return useQuery({
    queryKey,
    queryFn,
    enabled: computed(() => !!resolvedSlug.value),
  });
};

export const useAllBlogCategories = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  const queryKey = ["blog-categories"] as const;

  const queryFn = () => BlogApi.getAllCategories($api);

  onServerPrefetch(() =>
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
    }),
  );

  return useQuery({
    queryKey,
    queryFn,
  });
};