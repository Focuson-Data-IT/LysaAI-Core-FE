"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/configs/site";
import Image from "next/image";

interface BrandProps {
    isCollapsed: boolean;
}

export default function Brand({ isCollapsed }: BrandProps) {
    const { theme } = useTheme();

    return (
        <div
            className={cn(
                "flex h-[40px] items-center px-3",
                isCollapsed ? "h-10 w-10 justify-center" : "w-full"
            )}
            aria-label="OBE"
        >
            <Image
                src={theme === "light" ? "/logo_icon_d.svg" : "/logo_icon.svg"}
                alt="brand"
                width={30}
                height={30}
            />
            {!isCollapsed && <div className="ml-2 font-bold">{siteConfig.name}</div>}
        </div>
    );
}
