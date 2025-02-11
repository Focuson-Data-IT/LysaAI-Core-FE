"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LogoAnimated() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
        }

        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
            setTheme(newTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative w-24 h-24 animate-pulse">
                <Image
                    src={theme === "dark" ? "/logo_icon.svg" : "/logo_icon_d.svg"}
                    alt="Animated Logo"
                    width={96}
                    height={96}
                    className="transition-transform duration-500 ease-in-out transform hover:scale-110"
                />
            </div>
        </div>
    );
}
