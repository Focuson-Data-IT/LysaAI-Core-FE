"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Brand from "@/components/Brand";
import Nav from "@/components/Nav";
import ModeToggle from "@/components/ModeToggle";
import UserNav from "@/components/UserNav";
import { Dot } from "lucide-react";
import { getRoutesByRole } from "@/config/routes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { authUser } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!authUser) {
        return (
            <html lang="en">
                <head>
                    <title>Monitoring</title>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body className="bg-gray-100 dark:bg-gray-900">
                    <div className="text-red-500 text-center mt-10">Error: User not found</div>
                </body>
            </html>
        );
    }

    const routes = getRoutesByRole(authUser.role);

    return (
        <html lang="en">
            <head>
                <title>Admin Dashboard</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body className="bg-gray-100 dark:bg-gray-900">
                <div className="w-screen h-screen flex items-start text-black dark:text-white bg-gray-200 dark:bg-gray-800">
                    {/* Sidebar */}
                    <div
                        className={cn(
                            "border-r-gray-200 dark:border-r-gray-800",
                            isCollapsed ? "w-[57px]" : "sm:w-[250px]"
                        )}
                    >
                        <div className={cn("mt-3 flex justify-between bg-gray-200 dark:bg-gray-800", isCollapsed ? "justify-center" : "px-2")}>
                            <button onClick={() => setIsCollapsed(!isCollapsed)} title="Home">
                                <Brand isCollapsed={isCollapsed} />
                            </button>
                        </div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-800" />
                        <Nav isCollapsed={isCollapsed} routes={routes} />
                    </div>

                    {/* Main Content */}
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800">
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800">
                            <div className="flex h-[50px] w-[400px] items-center px-3 pt-2 font-bold">
                                <Dot className="mr-2 h-3 w-3 rounded-full bg-[#0ED1D6] text-[#0ED1D6]" />
                                {authUser.username || ""}
                            </div>
                            <div className="ml-auto mr-2 mt-1 flex w-full items-center justify-end space-x-2 text-lg">
                                <ModeToggle />
                                <UserNav />
                            </div>
                        </div>

                        <div className="h-1 bg-gray-200 dark:bg-gray-800" />
                        {/* Page Content */}
                        <div className="flex-1 h-[calc(100vh-55px)] overflow-auto bg-white dark:bg-black">
                            <div className="w-full px-6 pt-3">{children}</div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
