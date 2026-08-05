import type {
  BlogListParams,
  CreateBlogBody,
  CreateBlogCategoryBody,
} from "~/types";
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

  const queryKey = computed(() => ["blogs", resolvedSlug.value] as const);

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

export const useCreateBlog = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBlogBody) => BlogApi.create($api, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateBlogBody }) =>
      BlogApi.update($api, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => BlogApi.delete($api, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

/* ---------------- دسته‌بندی بلاگ ---------------- */

export const useCreateBlogCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBlogCategoryBody) =>
      BlogApi.createCategory($api, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};

export const useUpdateBlogCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateBlogCategoryBody;
    }) => BlogApi.updateCategory($api, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};

export const useDeleteBlogCategory = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => BlogApi.deleteCategory($api, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};

/**
 * چون اندپوینت bulk-reorder جدایی برای دسته‌بندی بلاگ توی داکس نبود،
 * ترتیب هر آیتمی که عوض شده رو تک‌تک از طریق همون اندپوینت آپدیت می‌فرستیم.
 * اگه بعدا اندپوینت bulk اضافه شد، این تابع رو با یه فراخوانی واحد جایگزین کن.
 */
export const useUpdateBlogCategoryDisplayOrder = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      items: { id: number; name: string; slug: string; display_order: number }[],
    ) => {
      await Promise.all(
        items.map((item) => {
          const formData = new FormData();
          formData.append("name", item.name);
          formData.append("slug", item.slug);
          formData.append("display_order", String(item.display_order));
          return BlogApi.updateCategory($api, item.id, formData);
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};