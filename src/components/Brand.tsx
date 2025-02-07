"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/configs/site";
import Image from "next/image";

interface BrandProps {
    isCollapsed: boolean;
}

export default function Brand({ isCollapsed }: BrandProps) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Pastikan komponen sudah dimount sebelum membaca theme
    useEffect(() => {
        setMounted(true);
    }, []);

    // Menentukan theme yang sedang aktif (baik dari system maupun manual)
    const currentTheme = mounted ? (theme === "system" ? systemTheme : theme) : "light";

    return (
        <div
            className={cn(
                "flex h-[40px] items-center px-3",
                isCollapsed ? "h-10 w-10 justify-center" : "w-full"
            )}
            aria-label="OBE"
        >
            <Image
                src={currentTheme === "light" ? "/logo_icon.svg" : "/logo_icon_d.svg"}
                alt="brand"
                width={30}
                height={30}
            />
            {!isCollapsed && <div className="ml-2 font-bold">{siteConfig.name}</div>}
        </div>
    );
}
