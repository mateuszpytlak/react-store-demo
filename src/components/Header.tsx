import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <header className="border-b bg-white sticky top-0 z-10">
            <div className="container flex items-center justify-between py-3 gap-4">
                <Link to="/products" className="text-lg font-semibold">ReactStore</Link>
            </div>
        </header>
    )
}
