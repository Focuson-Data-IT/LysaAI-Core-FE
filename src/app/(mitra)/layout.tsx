"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PerformanceContextProvider from "@/context/PerformanceContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return <>
        <PerformanceContextProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </PerformanceContextProvider>
    </>
}