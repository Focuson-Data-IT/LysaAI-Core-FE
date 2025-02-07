"use client";

import Layout from "@/components/Layout";
import "@/app/globals.css";
import OurLoading from "@/components/OurLoading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const pathname = window.location.pathname;
        if (!isLoading && !isAuthenticated && pathname !== "/login") {
            router.push("/login"); // Redirect to login page if not authenticated and not already on login page
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <OurLoading />;
    }

    return (
        <html lang="en">
            <body>
                {isAuthenticated ? <Layout>{children}</Layout> : children}
            </body>
        </html>
    );
}