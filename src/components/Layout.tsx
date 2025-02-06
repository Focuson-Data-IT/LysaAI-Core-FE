"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Brand from "@/components/Brand";
import Nav from "@/components/Nav";
import ModeToggle from "@/components/ModeToggle";
import UserNav from "@/components/UserNav";
import { Dot } from "lucide-react";
import { getRoutesByRole } from "@/config/routes";
import OurLoading from "./OurLoading";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { authUser, isLoading } = useAuth();

    if (isLoading) {
        return <OurLoading />;
    }

    console.log("authUser:", authUser); // Add logging

    if (!authUser?.role) {
        return <div className="text-red-500 text-center mt-10">Error: User role not found. Please relogin.</div>;
    }

    const routes = getRoutesByRole(authUser.role);

    return (
        <div className="flex items-start bg-gray-200 dark:bg-gray-800">
            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full w-[250px] bg-gray-800 text-white transition-all",
                    isCollapsed ? "w-[57px]" : "sm:w-[250px]"
                )}
            >
                <div className={cn("mt-3 flex justify-between px-2")}>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} title="Home">
                        <Brand isCollapsed={isCollapsed} />
                    </button>
                </div>
                <div className="mt-2">
                    <Nav isCollapsed={isCollapsed} routes={routes} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full ml-[250px] transition-all">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex h-[50px] w-[400px] items-center px-3 pt-2 font-bold">
                        <Dot className="mr-2 h-3 w-3 rounded-full bg-[#0ED1D6] text-[#0ED1D6]" />
                        {authUser.username || ""}
                    </div>
                    <div className="ml-auto mr-2 mt-1 flex w-full items-center justify-end space-x-2 text-lg">
                        <ModeToggle />
                        <UserNav />
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 h-[calc(100vh-55px)] overflow-auto bg-white dark:bg-black">
                    <div className="w-full px-6 pt-3">{children}</div>
                </div>
            </div>
        </div>
    );
}