import {Link, NavLink, useNavigate} from "react-router-dom";
import {ShoppingCart, UserRound, LogOut, Package, Terminal} from "lucide-react";
import {useCart} from "../../store/cart/cart";
import {useAuthStore} from "../../store/authStore/authStore";
import {logoutUser} from "../../services/auth";
import {useState, useRef} from "react";
import {useClickOutside} from "../../hooks/useClickOutside";

export const Header = () => {
    const cartItemsCount = useCart((state) => state.totalItems());
    const {user} = useAuthStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useClickOutside(menuRef, () => setOpen(false));

    const handleLogout = async () => {
        await logoutUser();
        setOpen(false);
        navigate("/");
    };

    const navLinkClass = ({isActive}: { isActive: boolean }) =>
        `px-2 py-1 text-sm font-mono transition-colors ${
            isActive ? "text-[#00ff88]" : "text-[#666] hover:text-[#d4d4d4]"
        }`;

    return (
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 border-b border-[#1a1a1a] backdrop-blur-sm">
            <div className="container flex items-center justify-between py-3">
                <Link to="/products" className="inline-flex items-center gap-2.5 group">
                    <span className="flex h-8 w-8 items-center justify-center border border-[#1e1e1e] bg-[#111] text-[#00ff88] group-hover:border-[#00ff88]/40 transition-colors duration-200">
                        <Terminal className="w-4 h-4"/>
                    </span>
                    <div>
                        <p className="font-mono text-[10px] text-[#555] leading-none">~/store</p>
                        <p className="text-sm font-bold text-white leading-tight">dev.shop</p>
                    </div>
                </Link>

                <nav className="flex items-center gap-1">
                    <NavLink to="/products" className={navLinkClass}>
                        products
                    </NavLink>
                    <NavLink
                        to="/cart"
                        className="relative flex items-center gap-1.5 px-2 py-1 text-[#666] hover:text-[#d4d4d4] transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4"/>
                        {cartItemsCount > 0 && (
                            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold bg-[#00ff88] text-[#050505]">
                                {cartItemsCount}
                            </span>
                        )}
                    </NavLink>
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen((prev) => !prev)}
                                className="flex items-center justify-center w-8 h-8 border border-[#222] text-[#666] hover:border-[#444] hover:text-[#d4d4d4] transition-colors"
                                title="My account"
                            >
                                <UserRound className="w-4 h-4"/>
                            </button>
                            {open && (
                                <div className="absolute right-0 mt-1 w-40 bg-[#111] border border-[#222] text-sm animate-fade-in z-30">
                                    <button
                                        onClick={() => {
                                            navigate("/account");
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors font-mono text-xs"
                                    >
                                        <Package className="w-3.5 h-3.5"/>
                                        my orders
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400/60 hover:text-red-300 hover:bg-[#1a1a1a] transition-colors font-mono text-xs"
                                    >
                                        <LogOut className="w-3.5 h-3.5"/>
                                        logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex items-center justify-center w-8 h-8 border border-[#222] text-[#666] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-colors"
                            title="Login"
                        >
                            <UserRound className="w-4 h-4"/>
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};
