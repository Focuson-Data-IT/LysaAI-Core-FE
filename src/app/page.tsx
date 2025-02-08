"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function EntryPage() {
    const { authUser, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Do not redirect while loading
        if (!isAuthenticated) {
            router.replace("/login"); // Redirect to login if not authenticated
            return;
        }

        // Check user role and redirect accordingly
        const userRole = authUser?.role;
        if (userRole === "admin") {
            router.replace("/pageAdmin/home");
        } else {
            router.replace("/pageClient/home");
        }
    }, [authUser, isLoading, isAuthenticated, router]);

    return null;
}