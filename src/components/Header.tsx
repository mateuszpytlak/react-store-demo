import {Link, NavLink} from "react-router-dom";

export const Header = () => {
    const totalItems = 0;

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="container flex items-center justify-between py-3 gap-4">
                <Link to="/products" className="text-lg font-semibold">ReactStore</Link>
                <nav className="flex items-center gap-4 text-sm">
                    <NavLink to="/products"
                             className={({isActive}) => isActive ? 'font-semibold' : ''}>Products</NavLink>
                    <NavLink to="/cart" className={({isActive}) => isActive ? 'font-semibold' : ''}>Cart <span
                        className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-black text-white ml-1">{totalItems}</span></NavLink>
                </nav>
            </div>
        </header>
    )
}
