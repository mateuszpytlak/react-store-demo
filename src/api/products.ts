import type {Product} from "../types.ts";

const BASE_URL = 'https://fakestoreapi.com';

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products`);

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return response.json();
}

export async function fetchProductById(id: string | number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }

    return response.json();
}

export async function fetchCategories(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/products/categories`);

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    return response.json();
}
