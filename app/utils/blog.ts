import { BlogStatus } from "~/types";

export interface BlogFormInput {
  title: string;
  slug: string;
  category_id: number;
  summary?: string | null;
  content: string;
  image?: File | null;
  status: BlogStatus;
  is_featured: boolean;
  reading_time?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  display_order?: number;
}

/**
 * الگوی این تابع دقیقا مثل buildCategoryFormData موجودته.
 * اگه توی پروژه از قبل همچین هلپری داری، همون رو استفاده کن و این رو حذف کن.
 */
export const buildBlogFormData = (input: BlogFormInput): FormData => {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("slug", input.slug);
  formData.append("category_id", String(input.category_id));
  formData.append("content", input.content);
  formData.append("status", input.status);
  formData.append("is_featured", String(input.is_featured));

  if (input.summary) formData.append("summary", input.summary);
  if (input.reading_time != null)
    formData.append("reading_time", String(input.reading_time));
  if (input.meta_title) formData.append("meta_title", input.meta_title);
  if (input.meta_description)
    formData.append("meta_description", input.meta_description);
  if (input.display_order != null)
    formData.append("display_order", String(input.display_order));

  if (input.image) formData.append("image", input.image);

  return formData;
};

export interface BlogCategoryFormInput {
  name: string;
  slug: string;
  display_order?: number;
}

export const buildBlogCategoryFormData = (
  input: BlogCategoryFormInput,
): FormData => {
  const formData = new FormData();

  formData.append("name", input.name);
  formData.append("slug", input.slug);

  if (input.display_order != null)
    formData.append("display_order", String(input.display_order));

  return formData;
};