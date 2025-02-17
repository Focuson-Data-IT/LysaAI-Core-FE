"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Brand from "@/components/Brand";
import Nav from "@/components/Nav";
import ModeToggle from "@/components/ModeToggle";
import UserNav from "@/components/UserNav";
import { Dot, Menu, X } from "lucide-react";
import { getRoutesByRole } from "@/config/routes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { authUser } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false); // Untuk control collapse/expand
    const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Default sidebar hide di mobile

    // Pastikan sidebar terlihat di layar md ke atas (reset visibilitas)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarVisible(true); // Tampilkan sidebar di md ke atas
            } else {
                setIsSidebarVisible(false); // Hide sidebar di bawah md
            }
        };
        handleResize(); // Jalankan saat pertama kali di-load

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const routes = getRoutesByRole(authUser?.role);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
            {/* Sidebar */}
            <div
                className={cn(
                    "fixed md:relative z-30 h-full border-r border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 transition-transform duration-300 ease-in-out", // Animasi masuk/keluar
                    isCollapsed ? "w-[57px]" : "w-[250px]", // Ukuran collapsed/expanded
                    isSidebarVisible ? "translate-x-0" : "-translate-x-full", // Tampilkan/hide sidebar
                    "md:translate-x-0" // Selalu terlihat di ukuran md ke atas
                )}
            >
                {/* Sidebar Header */}
                <div
                    className={cn(
                        "mt-3 flex justify-between items-center",
                        isCollapsed ? "justify-center" : "px-2"
                    )}
                >
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title="Collapse Sidebar"
                    >
                        <Brand isCollapsed={isCollapsed} />
                    </button>

                    {/* Tombol Close Sidebar pada Mobile */}
                    <button
                        className="md:hidden" // Hanya muncul di layar kecil
                        onClick={() => setIsSidebarVisible(false)}
                        title="Close Sidebar"
                    >
                        <X className="h-6 w-6 text-gray-700 dark:text-white" />
                    </button>
                </div>
                <div className="h-1 bg-gray-200 dark:bg-gray-700" />

                {/* Navigasi */}
                <Nav isCollapsed={isCollapsed} routes={routes} />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col w-full">
                {/* Header */}
                <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 px-4 py-2">
                    {/* Tombol Open Sidebar untuk Mobile */}
                    {!isSidebarVisible && (
                        <button
                            className="md:hidden" // Hanya muncul di layar kecil
                            onClick={() => setIsSidebarVisible(true)}
                            title="Open Sidebar"
                        >
                            <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
                        </button>
                    )}
                    <div className="ms-2 flex items-center space-x-2">
                        <Dot className="h-3 w-3 rounded-full bg-[#0ED1D6] text-[#0ED1D6]" />
                        <span className="font-bold">{authUser?.username || ""}</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <ModeToggle />
                        <UserNav />
                    </div>
                </div>

                {/* Garis Horizontal */}
                <div className="h-1 bg-gray-200 dark:bg-gray-700" />

                {/* Page Content */}
                <div className="flex-1 h-[calc(100vh-55px)] overflow-auto bg-white dark:bg-black p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}