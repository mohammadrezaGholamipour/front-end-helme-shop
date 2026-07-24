// Generated types from provided Swagger models

export interface CreateCategoryBody {
  name: string;
  images?: string | null;
}

export interface CreateOrUpdateStoreBody {
  name: string;
  phone: string;
  address: string;
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  lat?: number | null;
  lng?: number | null;
  logo?: string | null;
}

export interface CreateProductBody {
  name: string;
  price: number;
  volume: number;
  description?: string | null;
  category_id: number;
  images?: string | null;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface CategoryOut {
  id: number;
  image?: string | null;
  name: string;
  description?: string | null;
  meta_title: string;
  application_id: string;
  meta_description: string;
  slug: string;
}


export interface CategorySlugOut {
  category: CategoryOut;

  products: ProductOut[];

  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateAndUpdateCategory {
  name: string;
  image?: string | null;
}

export interface ProductVariantOut {
  id: number;
  product_id: number;
  volume: number;
  price: number;
  stock: number;
  image: string | null;
  selected: boolean | null;
}

export interface CategoryForProductOut {
  id: number;
  name: string;
  slug: string;
}

export interface ProductOut {
  id: number;
  category_id: number;

  name: string;
  slug: string;

  description: string | null;
  image: string | null;
  is_packaged: Boolean
  display_order: Number
  product_type: String
  product_model: String
  oil_type: String
  meta_title: string | null;
  meta_description: string | null;

  category: CategoryForProductOut;
  variants: ProductVariantOut[];
}

export interface StoreOut {
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  rubika?: string | null;
  bale?: string | null;
  eita?: string | null;
  address: string;
  phone: string;
  id: number;
}


export interface StoreUI extends StoreOut {
  social: { icon: string; link: string, name: string; }[];
  logo: string
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  mobile: string;
  userName: string;
  password: string;
  repeatPassword: string;
}

export interface UserOut {
  id: number;
  mobile: string;
  userName: string;
  application_id: number;
}


export interface ProductFilters {
  application_id: string;
  search?: string;

  min_price?: number;
  max_price?: number;

  product_type?: string;
  product_model?: string;
  oil_type?: string;
}

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface BlogCategoryOut {
  id: number;
  name: string;
  slug: string;
  display_order: number;
}

export interface BlogOut {
  id: number;

  category_id: number;

  title: string;
  slug: string;

  summary: string | null;
  content: string;

  image: string | null;

  status: BlogStatus;

  display_order: number;

  reading_time: number | null;

  views: number;

  is_featured: boolean;

  meta_title: string | null;
  meta_description: string | null;

  published_at: string | null;

  created_at: string;
  updated_at: string;

  category: BlogCategoryOut | null;
}

/**
 * برای صفحه لیست وبلاگ‌ها
 */
export type BlogListItem = Omit<BlogOut, "content">;

export interface BlogListParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  search?: string;
  status?: BlogStatus;
  is_featured?: boolean;
}

/**
 * خروجی API لیست وبلاگ‌ها
 */
export interface BlogListResponse {
  blogs: BlogListItem[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

/**
 * ایجاد وبلاگ
 */
export interface CreateBlogBody {
  title: string;
  slug: string;
  category_id: number;

  summary?: string;
  content: string;

  status?: BlogStatus;

  display_order?: number;

  reading_time?: number;

  is_featured?: boolean;

  meta_title?: string;
  meta_description?: string;

  published_at?: string;

  image?: File;
}

/**
 * ویرایش وبلاگ
 */
export type UpdateBlogBody = Partial<CreateBlogBody>;