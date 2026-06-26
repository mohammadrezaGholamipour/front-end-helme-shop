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
  description: string;
  meta_title: string;
  application_id: string;
  meta_description: string;
  slug: string;
}


export interface CategorySlugOut {
  id: number;
  image?: string | null;
  name: string;
  description: string;
  meta_title: string;
  application_id: string;
  meta_description: string;
  products?: ProductOut[];
}

export interface CreateAndUpdateCategory {
  name: string;
  image?: string | null;
}

export interface ProductOut {
  id: number;
  name: string;
  price: number;
  volume: number;
  description?: string | null;
  meta_title: string | null;
  application_id: string;
  meta_description: string | null;
  image?: string | null;
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
