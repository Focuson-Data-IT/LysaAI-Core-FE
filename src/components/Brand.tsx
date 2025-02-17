"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/configs/site";
import Image from "next/image";

interface BrandProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export default function Brand({ isCollapsed, setIsCollapsed }: BrandProps) {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        setTheme(currentTheme);

        const observer = new MutationObserver(() => {
            const updatedTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
            setTheme(updatedTheme);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    return (
        <div
            className={cn(
                "flex items-center justify-center w-full h-[30px] cursor-pointer transition-all duration-500 ease-in-out",
                isCollapsed ? "w-[57px]" : "w-full"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle Sidebar"
        >
            <div className="flex items-center justify-center gap-2">
                <Image
                    src={theme === "light" ? "/logo_icon_d.svg" : "/logo_icon.svg"}
                    alt="brand"
                    width={30}  // Konsisten di semua mode
                    height={30} // Konsisten di semua mode
                    className="transition-all duration-500 ease-in-out"
                />
                {!isCollapsed && <div className="font-bold">{siteConfig.name}</div>}
            </div>
        </div>
    );
}
