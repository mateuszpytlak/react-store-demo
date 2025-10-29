import {useEffect, useState} from "react";
import {fetchProductById} from "../api/products.ts";
import {useParams} from "react-router-dom";
import type {Product} from "../types.ts";
import {useCart} from "../store/cart/cart.ts";

export const ProductDetails = () => {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const add = useCart((state) => state.add);

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const product = id ? await fetchProductById(id) : null;
                setProduct(product);
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
    }, [id])

    if (loading) return <div className="py-10">Loading product...</div>;
    if (error || !product) return (
        <div className="container py-10 text-red-600">
            {error ?? 'Product not found'}
        </div>
    )

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
                <img src={product.image} alt={product.title} className="object-contain mx-auto max-h-[420px]"/>
            </div>
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <div className="text-gray-600 capitalize">{product.category}</div>
                {
                    product.rating &&
                    <div className="text-sm text-gray-600">Rating: {product.rating.rate} ({product.rating.count})</div>
                }
                <p className="text-gray-700">{product.description}</p>
                <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold">{product.price}</span>
                    <button className="btn btn-primary" onClick={ ()=> add(product)}>Add to cart</button>
                </div>
            </div>
        </div>
    )
}
