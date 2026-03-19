import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useProductFilters } from './useProductFilters';
import type { Product } from '../types';

vi.mock('../api/products', () => ({
    fetchCategories: vi.fn().mockResolvedValue(['electronics', "men's clothing", 'footwear']),
}));

const products: Product[] = [
    { id: 1, title: 'Laptop Pro',    price: 1200, description: '', category: 'electronics',    image: '' },
    { id: 2, title: 'Basic Shirt',   price: 20,   description: '', category: "men's clothing",  image: '' },
    { id: 3, title: 'Wireless Mouse',price: 45,   description: '', category: 'electronics',    image: '' },
    { id: 4, title: 'Running Shoes', price: 89,   description: '', category: 'footwear',       image: '' },
];

describe('useProductFilters', () => {
    it('returns all products by default', () => {
        const { result } = renderHook(() => useProductFilters(products));

        expect(result.current.filteredProducts).toHaveLength(products.length);
    });

    it('fetches and exposes categories on mount', async () => {
        const { result } = renderHook(() => useProductFilters(products));

        await waitFor(() => {
            expect(result.current.categories).toEqual(['electronics', "men's clothing", 'footwear']);
        });
    });

    it('filters products by selected category', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => { result.current.setSelectedCategory('electronics'); });

        expect(result.current.filteredProducts).toHaveLength(2);
        expect(result.current.filteredProducts.every((p) => p.category === 'electronics')).toBe(true);
    });

    it('returns all products when category is reset to "all"', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => { result.current.setSelectedCategory('electronics'); });
        act(() => { result.current.setSelectedCategory('all'); });

        expect(result.current.filteredProducts).toHaveLength(products.length);
    });

    it('sorts by price ascending', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => { result.current.setSort('price-asc'); });

        const prices = result.current.filteredProducts.map((p) => p.price);
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    it('sorts by price descending', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => { result.current.setSort('price-desc'); });

        const prices = result.current.filteredProducts.map((p) => p.price);
        expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    it('sorts by title ascending', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => { result.current.setSort('title-asc'); });

        const titles = result.current.filteredProducts.map((p) => p.title);
        expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
    });

    it('sorts by title descending', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => { result.current.setSort('title-desc'); });

        const titles = result.current.filteredProducts.map((p) => p.title);
        expect(titles).toEqual([...titles].sort((a, b) => b.localeCompare(a)));
    });

    it('applies sorting on top of category filter', () => {
        const { result } = renderHook(() => useProductFilters(products));

        act(() => {
            result.current.setSelectedCategory('electronics');
            result.current.setSort('price-asc');
        });

        const [first, second] = result.current.filteredProducts;
        expect(first.price).toBeLessThanOrEqual(second.price);
    });

    // Debounce tests use fake timers so they stay deterministic and fast
    describe('debounced search', () => {
        beforeEach(() => { vi.useFakeTimers(); });
        afterEach(() => { vi.useRealTimers(); });

        it('does not filter before the debounce delay elapses', () => {
            const { result } = renderHook(() => useProductFilters(products));

            act(() => { result.current.setQuery('laptop'); });

            expect(result.current.filteredProducts).toHaveLength(products.length);
        });

        it('filters by search query after 500 ms debounce', () => {
            const { result } = renderHook(() => useProductFilters(products));

            act(() => { result.current.setQuery('laptop'); });
            act(() => { vi.runAllTimers(); });

            expect(result.current.filteredProducts).toHaveLength(1);
            expect(result.current.filteredProducts[0].title).toBe('Laptop Pro');
        });

        it('search is case-insensitive', () => {
            const { result } = renderHook(() => useProductFilters(products));

            act(() => { result.current.setQuery('WIRELESS'); });
            act(() => { vi.runAllTimers(); });

            expect(result.current.filteredProducts).toHaveLength(1);
            expect(result.current.filteredProducts[0].id).toBe(3);
        });

        it('returns empty list when no products match the query', () => {
            const { result } = renderHook(() => useProductFilters(products));

            act(() => { result.current.setQuery('xyz-nonexistent-9999'); });
            act(() => { vi.runAllTimers(); });

            expect(result.current.filteredProducts).toHaveLength(0);
        });

        it('combines category filter and search query', () => {
            const { result } = renderHook(() => useProductFilters(products));

            act(() => { result.current.setSelectedCategory('electronics'); });
            act(() => { result.current.setQuery('mouse'); });
            act(() => { vi.runAllTimers(); });

            expect(result.current.filteredProducts).toHaveLength(1);
            expect(result.current.filteredProducts[0].title).toBe('Wireless Mouse');
        });
    });
});
