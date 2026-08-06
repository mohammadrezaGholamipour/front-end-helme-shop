export interface VariantFormInput {
  volume: number;
  price: number;
  stock?: number | null;
}

// عکس برای واریانت‌ها فعلا پشتیبانی نمی‌شود؛ اگر بعدا لازم شد
// یک فیلد image اختیاری اینجا و در فرم واریانت اضافه کنید.
export const buildVariantFormData = (data: VariantFormInput) => {
  const fd = new FormData();
  fd.append("volume", String(data.volume));
  fd.append("price", String(data.price));

  if (data.stock !== undefined && data.stock !== null) {
    fd.append("stock", String(data.stock));
  }

  return fd;
};