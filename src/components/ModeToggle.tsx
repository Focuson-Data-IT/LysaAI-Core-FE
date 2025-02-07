"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark") ? "dark" : "light";
        }
        return "light";
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        }
    }, []);

    const changeTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={changeTheme}
        >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
        </Button>
    );
}
