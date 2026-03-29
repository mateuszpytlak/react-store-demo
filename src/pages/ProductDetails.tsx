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
        <div className="py-16 flex flex-col items-center gap-4">
            <div
                className="w-7 h-7 rounded-full animate-spin"
                style={{
                    border: "2px solid var(--surface-raised)",
                    borderTopColor: "var(--accent)",
                    filter: "drop-shadow(0 0 6px var(--accent-glow))",
                }}
            />
        </div>
    );

    if (error || !product) return (
        <div
            className="mx-6 mt-8 px-4 py-3 text-sm font-medium"
            style={{
                border: "1px solid rgba(255,80,80,0.25)",
                color: "#FF7070",
                background: "rgba(255,80,80,0.05)",
                borderRadius: "4px",
            }}
        >
            {error ?? "Product not found"}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
        <div
            className="grid md:grid-cols-[1fr_1fr]"
            style={{border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden"}}
        >
            {/* ── Image panel ────────────────────────────────────── */}
            <div
                className="p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r"
                style={{
                    background: "var(--surface-raised)",
                    borderColor: "var(--border)",
                }}
            >
                <div className="flex justify-between items-center">
                    <span className="chip capitalize">{product.category}</span>
                    {product.rating && (
                        <div
                            className="text-[11px] px-2.5 py-1 font-medium"
                            style={{
                                color: "var(--text-muted)",
                                border: "1px solid var(--border)",
                                background: "var(--surface)",
                                borderRadius: "2px",
                            }}
                        >
                            ★ {product.rating.rate}
                            <span className="ml-1" style={{color: "var(--text-subtle)"}}>({product.rating.count})</span>
                        </div>
                    )}
                </div>

                <div
                    className="aspect-square grid place-items-center"
                    style={{background: "var(--bg)"}}
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="object-contain max-h-[380px] p-8"
                        style={{filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))"}}
                    />
                </div>
            </div>

            {/* ── Info panel ─────────────────────────────────────── */}
            <div
                className="p-6 flex flex-col gap-5"
                style={{background: "var(--surface)"}}
            >
                <div>
                    <p
                        className="text-[10px] font-medium uppercase tracking-[0.18em] mb-2"
                        style={{color: "var(--text-subtle)"}}
                    >
                        Product detail
                    </p>
                    <h1 className="text-2xl font-semibold leading-tight" style={{color: "var(--text)"}}>
                        {product.title}
                    </h1>
                </div>

                <p className="text-sm leading-relaxed" style={{color: "var(--text-muted)"}}>
                    {product.description}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                    <div
                        className="px-3 py-2"
                        style={{border: "1px solid var(--border)", borderRadius: "3px"}}
                    >
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-0.5" style={{color: "var(--text-subtle)"}}>
                            Category
                        </p>
                        <p className="text-sm font-medium capitalize" style={{color: "var(--text-muted)"}}>
                            {product.category}
                        </p>
                    </div>
                    {product.rating && (
                        <div
                            className="px-3 py-2"
                            style={{border: "1px solid var(--border)", borderRadius: "3px"}}
                        >
                            <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-0.5" style={{color: "var(--text-subtle)"}}>
                                Reviews
                            </p>
                            <p className="text-sm font-medium" style={{color: "var(--text-muted)"}}>
                                {product.rating.count}
                            </p>
                        </div>
                    )}
                </div>

                <div
                    className="flex items-center justify-between pt-4 mt-auto"
                    style={{borderTop: "1px solid var(--border)"}}
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-0.5" style={{color: "var(--text-subtle)"}}>
                            Price
                        </p>
                        <p className="syne text-3xl font-bold tracking-tight" style={{color: "var(--accent)"}}>
                            {formatPrice(product.price)}
                        </p>
                    </div>
                    <button
                        className="btn btn-primary text-xs px-6"
                        onClick={() => add(product)}
                    >
                        + Add to cart
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}
