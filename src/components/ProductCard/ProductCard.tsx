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
        <div className="group relative flex flex-col bg-[#111] border-r border-b border-[#1a1a1a] hover:bg-[#131313] transition-colors duration-150">
            {/* left accent bar — slides in on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00ff88] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top"/>

            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <span className="chip capitalize">{product.category}</span>
                <span className="font-mono text-[10px] text-[#444]">
                    #{String(product.id).padStart(2, "0")}
                </span>
            </div>

            <Link to={`/products/${product.id}`} className="flex flex-col px-3 gap-3">
                <div className="aspect-square w-full grid place-items-center bg-[#0d0d0d] border border-[#171717] overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.description}
                        className="object-contain max-h-44 p-4 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
                <h3 className="text-sm font-medium text-[#888] group-hover:text-[#d4d4d4] line-clamp-2 leading-snug transition-colors duration-150">
                    {product.title}
                </h3>
            </Link>

            <div className="mt-auto flex items-center justify-between px-3 pb-3 pt-3 border-t border-[#171717]">
                <span className="font-mono text-base font-bold text-white">
                    {formatPrice(product.price)}
                </span>
                <button
                    className="btn btn-primary font-mono text-[11px] px-3 py-1.5"
                    onClick={() => add(product)}
                >
                    + cart
                </button>
            </div>
        </div>
    );
}
