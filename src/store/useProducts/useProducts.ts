import { persist } from 'zustand/middleware';
import {create} from "zustand/react";
import {fetchProducts} from "../../api/products.ts";
import type {Product} from "../../types.ts";

const TTL = 5 * 60 * 1000; // 5 minutes

type ProductStore = {
    products: Product[];
    loading: boolean;
    error: string | null;
    cachedAt: number | null;
    fetchAll: () => Promise<void>;
};

export const useProducts = create(
    persist<ProductStore>(
        (set, get) => ({
            products: [],
            loading: false,
            error: null,
            cachedAt: null,
            fetchAll: async () => {
                const { products, cachedAt } = get();
                if (products.length && cachedAt && Date.now() - cachedAt < TTL) return;
                set({ loading: true });
                const data = await fetchProducts();
                set({ products: data, loading: false, cachedAt: Date.now() });
            },
        }),
        { name: 'products-storage' }
    )
);
