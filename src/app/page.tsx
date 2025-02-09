"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import OurLoading from "@/components/OurLoading";

export default function App() {
    const { authUser, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Jangan redirect saat loading
        if (!isAuthenticated) {
            router.replace("/login"); 
            return;
        }

        // Redirect berdasarkan role user
        const userRole = authUser?.role;
        if (userRole === "admin") {
            router.replace("/pageAdmin/home");
        } else {
            router.replace("/pageClient/home");
        }
    }, [authUser, isLoading, isAuthenticated, router]);

    return <OurLoading />; // Tampilkan loading sementara redirect berlangsung
}
