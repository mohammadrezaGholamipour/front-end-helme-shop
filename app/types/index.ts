export * from "./api";

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

