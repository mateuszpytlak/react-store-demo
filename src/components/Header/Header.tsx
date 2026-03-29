import {Link, NavLink, useNavigate} from "react-router-dom";
import {ShoppingCart, UserRound, LogOut, Package} from "lucide-react";
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

    return (
        <header
            className="sticky top-0 z-20"
            style={{
                background: "rgba(11, 11, 16, 0.88)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div className="container flex items-center justify-between h-[58px]">

                {/* Wordmark */}
                <Link to="/products" className="flex flex-col items-start leading-none">
                    <span
                        className="syne text-[1.5rem] font-bold tracking-[0.25em] uppercase leading-none"
                        style={{color: "var(--text)"}}
                    >
                        NOX
                    </span>
                    <span
                        className="text-[8px] font-medium tracking-[0.2em] uppercase mt-[4px]"
                        style={{color: "var(--text-subtle)"}}
                    >
                        select objects
                    </span>
                </Link>

                {/* Right nav */}
                <nav className="flex items-center gap-7">
                    <NavLink
                        to="/products"
                        className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        Shop
                    </NavLink>

                    {/* Cart */}
                    <NavLink
                        to="/cart"
                        className="relative flex items-center transition-colors duration-200"
                        style={{color: "var(--text-muted)"}}
                    >
                        <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        {cartItemsCount > 0 && (
                            <span
                                className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[17px] h-[17px] px-0.5 text-[9px] font-semibold rounded-full leading-none"
                                style={{
                                    background: "var(--accent)",
                                    color: "#0B0B10",
                                    boxShadow: "0 0 10px var(--accent-glow)",
                                }}
                            >
                                {cartItemsCount}
                            </span>
                        )}
                    </NavLink>

                    {/* User */}
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen((prev) => !prev)}
                                className="flex items-center justify-center transition-colors duration-200"
                                style={{color: open ? "var(--text)" : "var(--text-muted)"}}
                                title="My account"
                            >
                                <UserRound className="w-[18px] h-[18px]" strokeWidth={1.5} />
                            </button>

                            {open && (
                                <div
                                    className="absolute right-0 mt-3 w-48 animate-fade-in overflow-hidden"
                                    style={{
                                        background: "rgba(17, 17, 24, 0.96)",
                                        backdropFilter: "blur(24px)",
                                        WebkitBackdropFilter: "blur(24px)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(155,127,255,0.07)",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            navigate("/account");
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[12.5px] font-medium transition-all duration-150"
                                        style={{color: "var(--text-muted)", background: "transparent"}}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text)";
                                            (e.currentTarget as HTMLElement).style.background = "rgba(155,127,255,0.06)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                                            (e.currentTarget as HTMLElement).style.background = "transparent";
                                        }}
                                    >
                                        <Package className="w-3.5 h-3.5 shrink-0" />
                                        My Orders
                                    </button>

                                    <div style={{borderTop: "1px solid rgba(255,255,255,0.05)"}} />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[12.5px] font-medium transition-all duration-150"
                                        style={{color: "var(--text-muted)", background: "transparent"}}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                                            (e.currentTarget as HTMLElement).style.background = "rgba(155,127,255,0.06)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                                            (e.currentTarget as HTMLElement).style.background = "transparent";
                                        }}
                                    >
                                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex items-center justify-center transition-colors duration-200"
                            style={{color: "var(--text-muted)"}}
                            title="Sign in"
                        >
                            <UserRound className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};
