export * from "./api";

export type TitleItem = {
  textOne?: string | null;
  textTwo?: string | null;
  textThree?: string | null;
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

