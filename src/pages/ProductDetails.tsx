import {useEffect, useState} from "react";
import {fetchProductById} from "../api/products.ts";
import {useParams} from "react-router-dom";
import type {Product} from "../types.ts";
import {useCart} from "../store/cart/cart.ts";
import {formatPrice} from "../utils/format.ts";

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

    if (loading) return <div className="py-10 text-white/80">Loading product...</div>;
    if (error || !product) return (
        <div className="container py-10 text-red-300">
            {error ?? 'Product not found'}
        </div>
    )

    return (
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10">
            <div className="card glass p-6 relative overflow-hidden floating">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
                <div className="absolute -bottom-12 -left-10 w-56 h-56 rounded-full bg-indigo-400/15 blur-3xl" aria-hidden />
                <div className="flex justify-between items-center mb-3 relative z-[1]">
                    <span className="chip capitalize">{product.category}</span>
                    {product.rating &&
                        <div className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-white flex items-center gap-2">
                            <span>Ocena</span>
                            <strong>{product.rating.rate}</strong>
                            <span className="text-white/60">({product.rating.count})</span>
                        </div>
                    }
                </div>
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 grid place-items-center relative z-[1]">
                    <img src={product.image} alt={product.title} className="object-contain max-h-[440px] drop-shadow-2xl"/>
                </div>
            </div>
            <div className="space-y-5 card glass p-6 floating">
                <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>
                <p className="muted leading-relaxed">{product.description}</p>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                        <p className="text-xs uppercase text-white/60">Kategoria</p>
                        <p className="text-white font-semibold capitalize">{product.category}</p>
                    </div>
                    {product.rating && (
                        <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                            <p className="text-xs uppercase text-white/60">Liczba opinii</p>
                            <p className="text-white font-semibold">{product.rating.count}</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-sm uppercase text-white/60">Cena</p>
                        <p className="text-3xl font-bold text-white">{formatPrice(product.price)}</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => add(product)}>Dodaj do koszyka</button>
                </div>
            </div>
        </div>
    )
}
