import {Header} from "./components/Header/Header.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {Products} from "./pages/Products.tsx";
import {ProductDetails} from "./pages/ProductDetails.tsx";
import {Cart} from "./pages/Cart.tsx";
import {Checkout} from "./pages/Checkout.tsx";
import {useEffect} from "react";
import {initAuthListener} from "./services/auth.ts";
import {Login} from "./pages/Login.tsx";
import {Register} from "./pages/Register.tsx";
import {ForgotPassword} from "./pages/ForgotPassword.tsx";
import {MyOrders} from "./pages/MyOrders.tsx";
import {PrivateRoute} from "./components/PrivateRoute/PrivateRoute.tsx";
import {Analytics} from "@vercel/analytics/react";

export default function App() {
    useEffect(() => {
        initAuthListener();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>

            <main className="grow">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:id" element={<ProductDetails/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/account" element={<PrivateRoute><MyOrders/></PrivateRoute>}/>
                </Routes>
            </main>

            <footer className="mt-auto" style={{borderTop: "1px solid var(--border)"}}>
                <div className="container py-5 flex items-center justify-between">
                    <span className="syne text-xs font-bold tracking-[0.2em] uppercase" style={{color: "var(--text-subtle)"}}>NOX</span>
                    <span className="text-xs" style={{color: "var(--text-subtle)"}}>FakeStore API</span>
                </div>
            </footer>

            <Analytics />
        </div>
    );
}
