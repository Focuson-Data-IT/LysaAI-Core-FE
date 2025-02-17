// filepath: /Users/macbook/Documents/Kerja/Project Program/lysaAI/LysaAI-Core-FE/src/components/Nav.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavItemTooltips from "./NavItemTooltips";
import NavItemButton from "./NavItemButton";
import { getRoutesByRole } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

interface Route {
    title: string;
    link: string;
    icon?: React.ElementType;
    children?: Route[];
}

interface SidebarProps {
    isCollapsed: boolean;
    routes?: Route[];
}

export default function Nav({ isCollapsed }: SidebarProps) {
    const { authUser } = useAuth();
    const pathname = usePathname();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [navigatingPath, setNavigatingPath] = useState<string | null>(null);

    // Ambil role dari session setelah tersedia
    useEffect(() => {
        if (authUser?.role) {
            const roleRoutes = getRoutesByRole(authUser.role) || []; // Gunakan [] jika null
            setRoutes(roleRoutes);
        }
    }, [authUser]);

    useEffect(() => {
        setNavigatingPath(null);
    }, [pathname]);

    function isRouteActiveParent(pathname: string, link: string, children?: Route[]) {
        if (children?.some((child) => pathname.startsWith(child.link))) {
            return true; // Jika salah satu anak aktif, parent juga aktif
        }
        return pathname.startsWith(link);
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
        <div>
            <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2">
                <nav className="grid gap-1 px-2">
                    {routes.map((route) => {
                        const isActive = isRouteActiveParent(pathname, route.link, route.children);
                        const isLoading = isRouteLoading(route.link);

                        return (
                            <div key={route.link}>
                                {isCollapsed ? (
                                    <NavItemTooltips isActive={isActive} isLoading={isLoading} route={route} />
                                ) : (
                                    <NavItemButton isActive={isActive} isLoading={isLoading} route={route} />
                                )}

                                {route.children && route.children.length > 0 && isActive && (
                                    <div className="ml-5">
                                        {route.children.map((routeChild) => {
                                            const isActiveChild = isRouteActiveChild(pathname, routeChild.link);
                                            return (
                                                <div key={routeChild.link}>
                                                    {isCollapsed ? (
                                                        <NavItemTooltips isActive={isActiveChild} isLoading={isLoading} route={routeChild} isChild />
                                                    ) : (
                                                        <NavItemButton isActive={isActiveChild} isLoading={isLoading} route={routeChild} isChild />
                                                    )}
                                                </div>
                                            );
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