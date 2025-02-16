"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import OurLoading from "@/components/OurLoading";

export default function App() {
    const { authUser, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        // Check user role and redirect accordingly
        const userRole = authUser?.role;
        if (userRole === "admin") {
            router.replace("/admin/home");
        } else {
            router.replace("/home");
        }
    }, [authUser, isLoading, isAuthenticated, router]);

    return <OurLoading />; // Tampilkan loading sementara redirect berlangsung
}