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
                "flex h-[35px] items-center gap-2 p-2 text-left",
                isCollapsed && "h-9 w-9 shrink-0 items-center justify-center p-0"
            )}
            aria-label="OBE"
        >
            <div className="mx-1">
                <Image
                    src={theme === "light" ? "/logo_icon.svg" : "/logo_icon_d.svg"}
                    alt="brand"
                    width={25}
                    height={25}
                />
            </div>
            {!isCollapsed && <div className="ml-0 font-bold">{siteConfig.name}</div>}
        </div>
    );
}
