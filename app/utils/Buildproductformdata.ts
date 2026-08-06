/**
 * FormData را برای ایجاد/ویرایش محصول می‌سازد.
 * دقیقا هم‌الگو با buildCategoryFormData موجود در پروژه‌ی شما.
 * این فایل را در همان مسیری بگذارید که buildCategoryFormData قرار دارد
 * (مثلا utils/formData.ts) و از همان‌جا export کنید.
 */
export interface ProductFormPayload {
  name: string;
  price: number;
  volume: number;
  description?: string | null;
  category_id: number;
  image?: File | null;
  slug: string
  product_type?: string | null;
  product_model?: string | null;
  oil_type?: string | null;
  is_packaged?: boolean | null;
}

export function buildProductFormData(data: ProductFormPayload): FormData {
  const fd = new FormData();

  fd.append("name", data.name);
  fd.append("price", String(data.price));
  fd.append("volume", String(data.volume));
  fd.append("slug", String(data.slug));
  fd.append("category_id", String(data.category_id));

  if (data.description) {
    fd.append("description", data.description);
  }

  if (data.image) {
    fd.append("image", data.image);
  }

  if (data.product_type) {
    fd.append("product_type", data.product_type);
  }

  if (data.product_model) {
    fd.append("product_model", data.product_model);
  }

  if (data.oil_type) {
    fd.append("oil_type", data.oil_type);
  }

  if (data.is_packaged !== undefined && data.is_packaged !== null) {
    fd.append("is_packaged", String(data.is_packaged));
  }

  return fd;
}