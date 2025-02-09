"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function App() {
    const { authUser, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        const userRole = authUser?.role;
        if (userRole === "admin") {
            router.replace("/admin/home");
        } else {
            router.replace("/home");
        }
    }, [authUser, isLoading, isAuthenticated, router]);

    return null;
}