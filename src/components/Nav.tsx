"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Brand from "@/components/Brand"; // Pindahkan Brand ke sini
import NavItemTooltips from "./NavItemTooltips";
import NavItemButton from "./NavItemButton";
import { getRoutesByRole } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

interface Route {
    title: string;
    link: string;
    icon?: React.ElementType;
    children?: Route[];
    isStable?: boolean;
}

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void; // Tambahkan ini
    routes?: Route[];
}

export default function Nav({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const { authUser } = useAuth();
    const pathname = usePathname();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [navigatingPath, setNavigatingPath] = useState<string | null>(null);

    useEffect(() => {
        if (authUser?.role) {
            const roleRoutes = getRoutesByRole(authUser.role) || [];
            setRoutes(roleRoutes);
        }
    }, [authUser]);

    useEffect(() => {
        setNavigatingPath(null);
    }, [pathname]);

    function isRouteActiveParent(pathname: string, link: string, children?: Route[]) {
        return children?.some((child) => pathname.startsWith(child.link)) || pathname.startsWith(link);
    }

    function isRouteActiveChild(pathname: string, link: string) {
        return pathname.startsWith(link);
    }

    function isRouteLoading(link: string) {
        return navigatingPath === link;
    }

    if (!authUser) {
        return <div>Loading routes...</div>;
    }

    if (routes.length === 0) {
        return <div className="text-red-500 px-4 py-2">Error: No valid routes found. Check user role.</div>;
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            {/* Brand */}
            <div className="mb-4 mt-4">
                <Brand isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>
    
            {/* Navigation */}
            <div data-collapsed={isCollapsed} className="group flex flex-col gap-2 py-2 flex-grow">
                <nav className="grid gap-2 px-2">
                    {routes.map((route) => {
                        console.info(route)
                            const isActive = isRouteActiveParent(pathname, route.link, route.children);
                            const isLoading = isRouteLoading(route.link);

                            return (
                                <div key={route.link} className="relative">
                                    {isCollapsed ? (
                                        <div className="flex justify-center">
                                            <NavItemTooltips isActive={isActive} isLoading={isLoading} route={route} />
                                        </div>
                                    ) : (
                                        <NavItemButton isActive={isActive} isLoading={isLoading} route={route} />
                                    )}

                                    {route.children && route.children.length > 0 && isActive && (
                                        <div className={`ml-5 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>
                                            {route.children.map((routeChild) => {
                                                if (routeChild?.isStable !== false) {
                                                    const isActiveChild = isRouteActiveChild(pathname, routeChild.link);
                                                    return (
                                                        <div key={routeChild.link}>
                                                            {isCollapsed ? (
                                                                <div className="flex justify-center">
                                                                    <NavItemTooltips isActive={isActiveChild} isLoading={isLoading} route={routeChild} isChild />
                                                                </div>
                                                            ) : (
                                                                <NavItemButton isActive={isActiveChild} isLoading={isLoading} route={routeChild} isChild />
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                    })}
                </nav>
            </div>
        </div>
    );
}    