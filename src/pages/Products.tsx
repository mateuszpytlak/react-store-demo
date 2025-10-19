import {useEffect, useState} from "react";
import type {Product} from "../types.ts";
import {fetchProducts} from "../api/products.ts";

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const [products] = await Promise.all([fetchProducts()])
                setProducts(products);
            } catch (e: any) {
                setError(e?.message ?? 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        run();
    }, [])

    if (error) return <div className="container py-10 text-red-600">Error: {error}</div>;
    if (loading) return <div className="container py-10">Loading products...</div>;

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                { products.map((product) => (
                    <div>{product.title}</div>
                )) }
            </div>
        </section>
    )
}
