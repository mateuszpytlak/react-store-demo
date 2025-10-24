import {afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {fetchCategories, fetchProductById, fetchProducts} from './products';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch as unknown as typeof fetch);

afterEach(() => {
    mockFetch.mockReset();
});

afterAll(() => {
    vi.unstubAllGlobals();
});

describe('products api', () => {
    it('fetches products successfully', async () => {
        const products = [
            {
                id: 1,
                title: 'Item',
                price: 10,
                description: '',
                category: 'all',
                image: ''
            }
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(products),
        });

        await expect(fetchProducts()).resolves.toEqual(products);
        expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    });

    it('throws an error when products request fails', async () => {
        mockFetch.mockResolvedValueOnce({ok: false});

        await expect(fetchProducts()).rejects.toThrow('Failed to fetch products');
    });

    it('fetches single product and categories', async () => {
        const product = {id: 2, title: 'Phone', price: 20, description: '', category: 'tech', image: ''};
        const categories = ['tech', 'fashion'];

        mockFetch
            .mockResolvedValueOnce({ok: true, json: () => Promise.resolve(product)})
            .mockResolvedValueOnce({ok: true, json: () => Promise.resolve(categories)});

        await expect(fetchProductById(product.id)).resolves.toEqual(product);
        expect(mockFetch).toHaveBeenCalledWith(`https://fakestoreapi.com/products/${product.id}`);

        await expect(fetchCategories()).resolves.toEqual(categories);
        expect(mockFetch).toHaveBeenLastCalledWith('https://fakestoreapi.com/products/categories');
    });
});
