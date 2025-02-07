"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import OurLoading from "@/components/OurLoading";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated, authUser } = useAuth();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        console.info(isLoading, isAuthenticated, isReady)

        if (!isLoading) {
            if (!isAuthenticated && window.location.pathname !== "/login") {
                router.replace("/login");
            } else {
                setIsReady(true);
            }
        }
    }, [isLoading, isAuthenticated, router]);

    return (
        <html lang="en">
            <head>
                <title>Monitoring</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body className="bg-gray-100 dark:bg-gray-900">
                {
                    isLoading
                    ? <OurLoading />
                        : !isAuthenticated
                        ? (<main>{children}</main>)
                        : (<Layout key={authUser?.id || "guest"}>{children}</Layout>)
                }
            </body>
        </html>
    );
}