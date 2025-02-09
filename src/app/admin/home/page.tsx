"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import OurLoading from "@/components/OurLoading";

export default function HomePage() {

    const { isLoading } = useAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
        }
    }, [isLoading]);

    if (isLoading || !isReady) {
        return <OurLoading />;
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Welcome to My Page</h1>
        </div>
    );
}
