"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

interface AuthUser {
    id: number;
    email: string;
    username: string;
    role: string;
}

export function useAuth() {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setAuthUser(user);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post("http://103.30.195.110:7770/api/auth/login", { email, password });
            if (response.data.code === 200) {
                const user = response.data.data;
                user.role = "mitra";
                setAuthUser(user);
                setIsAuthenticated(true);
                const token = uuidv4();
                Cookies.set("authToken", token);
                Cookies.set("user", JSON.stringify(user));

                router.replace("/home");
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setAuthUser(null);
        setIsAuthenticated(false);
        Cookies.remove("authToken");
        Cookies.remove("user");

        router.replace("/login");
    };

    return {
        authUser,
        isLoading,
        isAuthenticated,
        login,
        logout,
    };
}