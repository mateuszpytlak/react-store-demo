import {Link, NavLink, useNavigate} from "react-router-dom";
import {ShoppingCart, UserRound, LogOut, Package} from "lucide-react";
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

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="container flex items-center justify-between py-3 px-4 md:px-6">
                <Link to="/products" className="text-lg font-semibold tracking-tight">
                    ReactStore
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    <NavLink
                        to="/products"
                        className={({isActive}) =>
                            `hover:text-blue-600 transition ${isActive ? "font-semibold text-blue-500" : ""}`
                        }
                    >
                        Products
                    </NavLink>
                    <NavLink to="/cart" className="relative flex items-center">
                        <ShoppingCart className="w-5 h-5"/>
                        {cartItemsCount > 0 && (
                            <span
                                className="absolute -top-2 -right-3 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-blue-600 text-white"
                            >
                                {cartItemsCount}
                            </span>
                        )}
                    </NavLink>
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen((prev) => !prev)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                title="My account"
                            >
                                <UserRound className="w-4 h-4 text-gray-700"/>
                            </button>
                            {open && (
                                <div
                                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden text-sm animate-fade-in">
                                    <button
                                        onClick={() => {
                                            navigate("/account");
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                                    >
                                        <Package className="w-4 h-4 text-gray-500"/>
                                        My Orders
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
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
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                            title="Login"
                        >
                            <UserRound className="w-4 h-4 text-blue-600"/>
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};
