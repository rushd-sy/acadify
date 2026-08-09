import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authSessionService } from '../services/auth-session.service';

export const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const isAuth = await authSessionService.isAuthenticated();
                setIsAuthenticated(isAuth);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
            }
        };
        verifySession();
    }, []);

    if (isAuthenticated === null) {
        return <div className="flex h-screen items-center justify-center">Loading... </div>
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
