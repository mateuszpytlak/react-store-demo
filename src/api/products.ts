import type { Product } from "../types";

const BASE_URL = 'https://fakestoreapi.com';

async function apiFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Http ${response.status} - from ${path}`)
    }

    return response.json();
}

export const fetchProducts = () => apiFetch<Product[]>('/products');
export const fetchProductById = (id: string | number) => apiFetch<Product>(`/products/${id}`);
export const fetchCategories = () => apiFetch<string[]>('/products/categories');