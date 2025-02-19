// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import OurLoading from "@/components/OurLoading";
// import DashboardLayout from "@/components/DashboardLayout";

// export default function ClientLayout({ children }: { children: React.ReactNode }) {
//     const { isLoading, isAuthenticated } = useAuth();
//     const [isReady, setIsReady] = useState(false);

//     useEffect(() => {
//         if (!isLoading) {
//             setIsReady(true);
//         }
//     }, [isLoading]);

//     if (isLoading || !isReady) {
//         return <OurLoading />;
//     }

//     if (!isAuthenticated) {
//         return <main>{children}</main>; // Tidak ada <html> atau <body>
//     }

//     return <DashboardLayout>{children}</DashboardLayout>; // Tidak ada <html> atau <body>
// }


"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PerformanceContextProvider from "@/context/PerformanceContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return <>
        <PerformanceContextProvider>
            <DashboardLayout>{children}</DashboardLayout>;
        </PerformanceContextProvider>
    </>
}