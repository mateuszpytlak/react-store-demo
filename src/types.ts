export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
};

export type CartItem = {
    id: number;
    title: string;
    price: number;
    image: string;
    qty: number;
}

export type CartState = {
    items: CartItem[];
    add: (p: Product, qty?: number) => void;
    remove: (id: number) => void;
    setQty: (id: number, qty: number) => void;
    clear: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}
