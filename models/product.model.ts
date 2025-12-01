export type ProductModel = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  discount: number;
  description: {
    html: string | null;
    json: string | null;
  };
  images: string[];
};
