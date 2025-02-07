"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/configs/site";
import Image from "next/image";

interface BrandProps {
    isCollapsed: boolean;
}

export default function Brand({ isCollapsed }: BrandProps) {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Check theme preference in localStorage on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <div
            className={cn(
                "flex h-[40px] items-center px-3",
                isCollapsed ? "h-10 w-10 justify-center" : "w-full"
            )}
            aria-label="OBE"
        >
            <Image
                src={theme === "dark" ? "/logo_icon.svg" : "/logo_icon_d.svg"}
                alt="brand"
                width={30}
                height={30}
            />
            {!isCollapsed && <div className="ml-2 font-bold">{siteConfig.name}</div>}
        </div>
    );
}