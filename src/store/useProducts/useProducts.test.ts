import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from './useProducts';

vi.mock('../../api/products.ts', () => ({
    fetchProducts: vi.fn(),
}));

// Import after mock so we get the mocked version
import { fetchProducts } from '../../api/products';

const mockFetchProducts = fetchProducts as ReturnType<typeof vi.fn>;

const mockProducts = [
    { id: 1, title: 'Laptop', price: 999, description: '', category: 'electronics', image: '' },
    { id: 2, title: 'Shirt', price: 29, description: '', category: "men's clothing", image: '' },
];

describe('useProducts store', () => {
    beforeEach(() => {
        useProducts.setState({ products: [], loading: false, error: null, cachedAt: null });
        useProducts.persist?.clearStorage?.();
        mockFetchProducts.mockClear();
        mockFetchProducts.mockResolvedValue(mockProducts);
    });

    it('fetches products and updates state', async () => {
        await useProducts.getState().fetchAll();

        const { products, loading, cachedAt } = useProducts.getState();
        expect(products).toEqual(mockProducts);
        expect(loading).toBe(false);
        expect(cachedAt).toBeGreaterThan(0);
        expect(fetchProducts).toHaveBeenCalledTimes(1);
    });

    it('sets loading to true while fetching', async () => {
        let loadingDuringFetch = false;

        mockFetchProducts.mockImplementationOnce(async () => {
            loadingDuringFetch = useProducts.getState().loading;
            return mockProducts;
        });

        await useProducts.getState().fetchAll();

        expect(loadingDuringFetch).toBe(true);
        expect(useProducts.getState().loading).toBe(false);
    });

    it('uses cached data and skips fetch when TTL has not expired', async () => {
        await useProducts.getState().fetchAll();
        mockFetchProducts.mockClear();

        await useProducts.getState().fetchAll();

        expect(fetchProducts).not.toHaveBeenCalled();
        expect(useProducts.getState().products).toEqual(mockProducts);
    });

    it('re-fetches when cache is stale (older than 5 minutes)', async () => {
        useProducts.setState({
            products: mockProducts,
            cachedAt: Date.now() - 6 * 60 * 1000, // 6 minutes ago
        });

        await useProducts.getState().fetchAll();

        expect(fetchProducts).toHaveBeenCalledTimes(1);
    });

    it('re-fetches when products list is empty regardless of cachedAt', async () => {
        useProducts.setState({ products: [], cachedAt: Date.now() });

        await useProducts.getState().fetchAll();

        expect(fetchProducts).toHaveBeenCalledTimes(1);
    });
});
