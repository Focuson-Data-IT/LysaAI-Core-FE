"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

interface AuthUser {
    id: number;
    email: string;
    username: string;
    role: string;
}

export function useAuth() {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = Cookies.get("authUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("Retrieved user from cookies:", user); // Add logging
            setAuthUser(user);
            setIsAuthenticated(true);
        }
        setIsLoading(false); // Set loading state to false after checking cookies
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post("http://103.30.195.110:7770/api/auth/login", { email, password });
            if (response.data.code === 200) {
                const user = response.data.data;
                user.role = "client"; // Hardcode role as client for now
                console.log("Setting user:", user); // Add logging
                setAuthUser(user);
                setIsAuthenticated(true);
                const token = uuidv4(); // Generate a token using UUID
                Cookies.set("authToken", token); // Store token in cookies
                Cookies.set("authUser", JSON.stringify(user)); // Store user data in cookies
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setAuthUser(null);
        setIsAuthenticated(false);
        Cookies.remove("authToken"); // Remove token from cookies
        Cookies.remove("authUser"); // Remove user data from cookies
    };

    return {
        authUser,
        isLoading,
        isAuthenticated,
        login,
        logout,
    };
}