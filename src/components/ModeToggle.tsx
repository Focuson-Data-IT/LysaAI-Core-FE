"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Check theme preference in localStorage on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
            console.log(`Theme set to ${savedTheme}`);
        }
    }, []);

    // Change theme and save to localStorage
    const changeTheme = (mode: "light" | "dark") => {
        setTheme(mode);
        localStorage.setItem("theme", mode);
        document.documentElement.classList.toggle("dark", mode === "dark");
        console.log(`Theme changed to ${mode}`);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
        </Button>
    );
}