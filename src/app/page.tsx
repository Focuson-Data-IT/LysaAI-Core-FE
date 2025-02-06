"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
    const { authUser, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Jangan lakukan redirect saat masih loading
        if (!isAuthenticated) {
            router.replace("/login"); // Jika belum login, arahkan ke halaman login
            return;
        }

        // Cek role user dan redirect sesuai role
        const userRole = authUser?.role; // Pastikan `authUser.role` ada
        if (userRole === "admin") {
            router.replace("/pageAdmin/home");
        } else {
            router.replace("/pageClient/home");
        }
    }, [authUser, isLoading, isAuthenticated, router]);

    return null; // Tidak perlu render apapun karena langsung redirect
}