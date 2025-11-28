import {Link, NavLink, useNavigate} from "react-router-dom";
import {ShoppingCart, UserRound, LogOut, Package, Sparkle} from "lucide-react";
import {useCart} from "../../store/cart/cart";
import {useAuthStore} from "../../store/authStore/authStore";
import {logoutUser} from "../../services/auth";
import {useState, useRef, useEffect} from "react";

export const Header = () => {
    const cartItemsCount = useCart((state) => state.totalItems());
    const {user} = useAuthStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        setOpen(false);
        navigate("/");
    };

    const navLinkClass = ({isActive}: { isActive: boolean }) =>
        `px-3 py-2 rounded-full text-sm font-semibold transition ${
            isActive ? "bg-white/15 text-white shadow-inner" : "text-white/70 hover:text-white"
        }`;

    return (
        <header className="sticky top-0 z-20 backdrop-blur bg-black/30 border-b border-white/10">
            <div className="container flex items-center justify-between py-4">
                <Link to="/products" className="inline-flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30">
                        <Sparkle className="w-5 h-5"/>
                    </span>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">React Store</p>
                        <p className="text-lg font-bold text-white leading-tight">Kolekcja Premium</p>
                    </div>
                </Link>

                <nav className="flex items-center gap-3 text-sm">
                    <NavLink to="/products" className={navLinkClass}>
                        Products
                    </NavLink>
                    <NavLink to="/cart" className="relative flex items-center rounded-full px-3 py-2 text-white/80 hover:text-white transition">
                        <ShoppingCart className="w-5 h-5"/>
                        {cartItemsCount > 0 && (
                            <span
                                className="absolute -top-2 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg"
                            >
                                {cartItemsCount}
                            </span>
                        )}
                    </NavLink>
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen((prev) => !prev)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition shadow-md"
                                title="My account"
                            >
                                <UserRound className="w-4 h-4"/>
                            </button>
                            {open && (
                                <div
                                    className="absolute right-0 mt-2 w-44 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-sm animate-fade-in glass">
                                    <button
                                        onClick={() => {
                                            navigate("/account");
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/5 text-white/90"
                                    >
                                        <Package className="w-4 h-4 text-white/70"/>
                                        My Orders
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-red-300 hover:bg-red-900/30"
                                    >
                                        <LogOut className="w-4 h-4"/>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 transition hover:opacity-90"
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
