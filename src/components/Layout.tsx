"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Brand from "@/components/Brand";
import Nav from "@/components/Nav";
import ModeToggle from "@/components/ModeToggle";
import UserNav from "@/components/UserNav";
import { Dot } from "lucide-react";
import { getRoutesByRole } from "@/config/routes";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { data: session, status } = useSession();

    if (status === "loading") {
        return null
    }

    if (!session?.user?.role) {
        return <div className="text-red-500 text-center mt-10">Error: User role not found. Please relogin.</div>;
    }

    const routes = getRoutesByRole(session.user.role);

    return (
        <div className="flex items-start bg-gray-200 dark:bg-gray-800">
            {/* Sidebar */}
            <div
                className={cn(
                    "border border-r border-r-gray-200 dark:border-r-gray-800",
                    isCollapsed ? "w-[57px]" : "sm:w-[250px]"
                )}
            >
                <div className={cn("mt-3 flex justify-between", isCollapsed ? "justify-center" : "px-2")}>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} title="Home">
                        <Brand isCollapsed={isCollapsed} />
                    </button>
                </div>
                <div className="h-1" />
                <Nav isCollapsed={isCollapsed} routes={routes} />
            </div>

            {/* Main Content */}
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex h-[50px] w-[400px] items-center px-3 pt-2 font-bold">
                        <Dot className="mr-2 h-3 w-3 rounded-full bg-[#0ED1D6] text-[#0ED1D6]" />
                        {session.user.name || ""}
                    </div>
                    <div className="ml-auto mr-2 mt-1 flex w-full items-center justify-end space-x-2 text-lg">
                        <ModeToggle />
                        <UserNav />
                    </div>
                </div>

                <div className="h-1" />
                {/* Page Content */}
                <div className="h-[calc(100vh-55px)] w-full overflow-scroll rounded-tl-xl bg-white pl-1 dark:bg-black">
                    <div className="px-3 pt-3">{children}</div>
                </div>
            </div>
        </div>
    );
}
