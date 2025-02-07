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

    // Sinkronkan tema dengan class <html> saat halaman dimuat
    useEffect(() => {
        const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        setTheme(currentTheme);

        // Tambahkan event listener untuk mendeteksi perubahan class <html>
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
