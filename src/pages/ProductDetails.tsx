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

    if (loading) return (
        <div className="py-10 font-mono text-xs text-[#555]">loading...</div>
    );
    if (error || !product) return (
        <div className="border border-red-900/30 px-4 py-3 font-mono text-xs text-red-400">
            error: {error ?? "product not found"}
        </div>
    );

    return (
        <div className="grid md:grid-cols-[1fr_1fr] border border-[#1a1a1a]">
            {/* ── Image panel ────────────────────────────────────── */}
            <div className="bg-[#111] p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#1a1a1a]">
                <div className="flex justify-between items-center">
                    <span className="chip capitalize">{product.category}</span>
                    {product.rating && (
                        <div className="font-mono text-[10px] text-[#555] border border-[#1e1e1e] px-2 py-1">
                            ★ {product.rating.rate}
                            <span className="text-[#444] ml-1">({product.rating.count})</span>
                        </div>
                    )}
                </div>
                <div className="aspect-square bg-[#0d0d0d] border border-[#171717] grid place-items-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="object-contain max-h-[380px] p-8"
                    />
                </div>
            </div>

            {/* ── Info panel ─────────────────────────────────────── */}
            <div className="bg-[#111] p-6 flex flex-col gap-5">
                <div>
                    <p className="font-mono text-[10px] text-[#555] uppercase tracking-widest mb-2">
                        product detail
                    </p>
                    <h1 className="text-2xl font-bold text-white leading-tight">{product.title}</h1>
                </div>

                <p className="text-[#555] text-sm leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="border border-[#1e1e1e] px-3 py-2">
                        <p className="font-mono text-[10px] text-[#555] uppercase">category</p>
                        <p className="text-sm text-[#aaa] font-medium capitalize">{product.category}</p>
                    </div>
                    {product.rating && (
                        <div className="border border-[#1e1e1e] px-3 py-2">
                            <p className="font-mono text-[10px] text-[#555] uppercase">reviews</p>
                            <p className="text-sm text-[#aaa] font-medium">{product.rating.count}</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#1a1a1a]">
                    <div>
                        <p className="font-mono text-[10px] text-[#555] uppercase mb-0.5">price</p>
                        <p className="font-mono text-3xl font-bold text-white">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                    <button
                        className="btn btn-primary font-mono text-xs px-5"
                        onClick={() => add(product)}
                    >
                        + add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}
