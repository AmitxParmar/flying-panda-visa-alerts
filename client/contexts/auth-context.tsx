"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentUser, useLogout } from "@/hooks/use-auth";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const { data, isLoading, error, isSuccess, isError } = useGetCurrentUser();
    const logoutMutation = useLogout();

    useEffect(() => {
        if (isSuccess || isError) {
            if (data?.data?.user) {
                setUser(data.data.user);
            } else if (error) {
                // If we get an error (likely 401), clear user
                setUser(null);
            }
            setIsInitialized(true);
        }
    }, [data, error, isSuccess, isError, isLoading]);

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        setUser(null);
        // Redirect to login
        window.location.href = "/login";
    };

    const value: AuthContextType = {
        user,
        isLoading: isLoading || !isInitialized, // Consider loading until initialized
        isAuthenticated: !!user,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
