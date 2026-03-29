import type {Product} from "../../types.ts";
import {Link} from "react-router-dom";
import {useCart} from "../../store/cart/cart.ts";
import {formatPrice} from "../../utils/format.ts";

type Props = {
    product: Product;
}

export const ProductCard = ({product}: Props) => {
    const add = useCart((state) => state.add);

    return (
        <div
            className="group relative flex flex-col transition-colors duration-300"
            style={{background: "var(--surface)"}}
        >
            {/* Neon border on hover */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{boxShadow: "inset 0 0 0 1px rgba(155,127,255,0.2)"}}
            />

            {/* Image */}
            <Link to={`/products/${product.id}`} className="block overflow-hidden">
                <div
                    className="aspect-square flex items-center justify-center p-8 transition-colors duration-300"
                    style={{background: "var(--surface-raised)"}}
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="object-contain max-h-36 transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                        loading="lazy"
                        style={{filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))"}}
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4">
                <span
                    className="text-[10px] font-medium tracking-widest uppercase mb-2"
                    style={{color: "var(--text-subtle)"}}
                >
                    {product.category}
                </span>

                <Link to={`/products/${product.id}`} className="flex-1">
                    <h3
                        className="text-[13px] font-normal leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-(--text)"
                        style={{color: "var(--text-muted)"}}
                    >
                        {product.title}
                    </h3>
                </Link>

                <div
                    className="flex items-center justify-between mt-4 pt-3.5"
                    style={{borderTop: "1px solid var(--border)"}}
                >
                    <span
                        className="text-[15px] font-semibold tracking-tight"
                        style={{color: "var(--accent)"}}
                    >
                        {formatPrice(product.price)}
                    </span>

                    <button
                        className="text-[10px] font-semibold tracking-widest uppercase px-4 py-2 transition-all duration-200"
                        style={{
                            background: "var(--accent-dim)",
                            color: "var(--accent)",
                            border: "1px solid rgba(155,127,255,0.18)",
                            borderRadius: "2px",
                        }}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "var(--accent)";
                            el.style.color = "#0B0B10";
                            el.style.boxShadow = "0 0 18px var(--accent-glow)";
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "var(--accent-dim)";
                            el.style.color = "var(--accent)";
                            el.style.boxShadow = "none";
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            add(product);
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};
