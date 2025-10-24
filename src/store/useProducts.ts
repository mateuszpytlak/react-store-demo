import { persist } from 'zustand/middleware';
import {create} from "zustand/react";
import {fetchProducts} from "../api/products.ts";
import type {Product} from "../types.ts";

type ProductStore = {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
};

export const useProducts = create(
    persist<ProductStore>(
        (set, get) => ({
            products: [],
            loading: false,
            error: null,
            fetchAll: async () => {
                if (get().products.length) return;
                set({ loading: true });
                const products = await fetchProducts();
                set({ products, loading: false });
            },
        }),
        { name: 'products-storage' }
    )
);
