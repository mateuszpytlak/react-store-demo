import {useEffect, useMemo, useState} from "react";
import type {Product} from "../types.ts";
import {fetchCategories, fetchProducts} from "../api/products.ts";
import {ProductCard} from "../components/ProductCard.tsx";

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const [products, cats] = await Promise.all([fetchProducts(), fetchCategories()])
                setProducts(products);
                setCategories(cats)
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Unknown error");
                }
            } finally {
                setLoading(false);
            }
        }
        run();
    }, [])

    const filteredProducts = useMemo( () => {
        let list = [...products];
        if (debouncedQuery) list = list.filter(product => product.title.toLowerCase().includes(debouncedQuery.toLowerCase()));

        return list;
    }, [products, debouncedQuery])

    if (error) return <div className="container py-10 text-red-600">Error: {error}</div>;
    if (loading) return <div className="container py-10">Loading products...</div>;

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>
                <div className="flex flex-wrap gap-3">
                    <input
                        value={query}
                        onChange={ (e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="border border-gray-200 bg-white rounded-lg px-3 py-2"
                    />
                    <select className="border border-gray-200 bg-white rounded-lg px-3 py-2">
                        <option value="all">All cetagories</option>
                        {categories.map( (category) => <option key={category} value={category}>{category}</option> )}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product}/>)}
            </div>
        </section>
    )
}
