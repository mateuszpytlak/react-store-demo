import { useAuthStore } from "../../store/authStore/authStore";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { user, initialized } = useAuthStore();

    if (!initialized) return null;
    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};
