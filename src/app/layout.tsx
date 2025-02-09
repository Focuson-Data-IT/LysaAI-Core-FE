"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import OurLoading from "@/components/OurLoading";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated && window.location.pathname !== "/login") {
                router.replace("/login");
            } else {
                setIsReady(true);
            }
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isReady) {
        return <OurLoading />;
    }

    return (
        <html lang="en">
        <head>
            <title>Monitoring</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className="bg-gray-100 dark:bg-gray-900">
        {children}
        </body>
        </html>
    );
}