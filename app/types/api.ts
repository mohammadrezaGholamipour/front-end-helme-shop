// Generated types from provided Swagger models

export interface CreateCategoryBody {
  name: string;
  images?: string | null;
}

export type TitleItem = {
  textOne?: string | null;
  textTwo?: string | null;
  textThree?: string | null;
  srOnly?: string | null
};




export type CartItem = {
  product: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
  };
  variant: {
    id: number;
    volume: number;
    price: number;
    stock: number;
  };
  count: number;
  lineTotal: number;
};

export type CartStoreItem = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  variantId?: number;
};


export type AddCartPayload = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity?: number;
  variantId?: number;
};



export interface UserOut {
  id: number;
  mobile: string;
  role: "ADMIN" | "CUSTOMER";
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
  mobile: string;
  password: string;
}
export interface VariantOut {
  volume: number
  price: number
  stock: number
}

export interface CategoryOut {
  id: number;
  image?: string | null;
  name: string;
  description?: string | null;
  meta_title: string;
  meta_description: string;
  display_order: number;
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


export interface CreateProductBody {
  name: string;
  price: number;
  volume: number;
  description?: string | null;
  category_id: number;
  images?: string | null;

  // فیلدهای اختیاری - در ProductOut موجودند
  product_type?: string | null;
  product_model?: string | null;
  oil_type?: string | null;
  is_packaged?: boolean | null;
}

export type UpdateProductBody = Partial<CreateProductBody> & {
  product_id: number;
};
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  mobile: string;
  password: string;
  repeat_password: string;
}


export interface RegisterBody {
  mobile: string;
  password: string;
  repeat_password: string;
}


export interface ProductFilters {
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
  category?: string;
  search?: string;
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


// types/auth.ts

export interface AdminLoginPayload {
  mobile: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
}

export interface ApiErrorItem {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiErrorItem[];
}

export interface CustomerProfileOut {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
  user_id: number;
}

export interface UpdateCustomerProfileBody {
  first_name: string;
  last_name: string;
  email: string;
}


// یوزوان روی مقدار enum واقعی بک‌اند: توی داکیومنت فقط "PENDING" مثال زده شده.
// بقیه مقادیر رو حدس زدم، لطفاً با مقادیر واقعی enum سمت بک‌اند مقایسه/اصلاح کن.
// ترفند `string & {}` باعث می‌شه هم autocomplete مقادیر بالا کار کنه، هم هر string دیگه‌ای رد نشه.
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | (string & {});

// اسکیمای items توی داکیومنت داده نشده (همیشه [] برگشته). فیلدهای رایج رو گذاشتم
// و همه رو اختیاری کردم تا با اسکیمای واقعی که بعداً می‌فرستی راحت جایگزین بشه.
export interface OrderItemOut {
  id?: number;
  title?: string;
  product_name?: string;
  variant_name?: string;
  quantity?: number;
  unit_price?: string;
  total_price?: string;
  image?: string;
  [key: string]: unknown;
}

export interface OrderOut {
  status: OrderStatus;
  total_amount: string;
  discount_amount: string;
  shipping_amount: string;
  payable_amount: string;
  id: number;
  user_id: number;
  items: OrderItemOut[];
}