import Link from "next/link";

interface NavItemButtonProps {
    isActive: boolean;
    isLoading: boolean;
    route: {
        title: string;
        link: string;
        icon?: React.ElementType;
        children?: { title: string; link: string; icon?: React.ElementType }[];
    };
    isChild?: boolean;
}

import { Loader } from "lucide-react";
import { Button } from "./ui/button";

export default function NavItemButton({ isActive, isLoading, route, isChild }: NavItemButtonProps) {
    const hasChildren = route.children && route.children.length > 0;

    return (
        <Link href={route.link} passHref>
            <Button
                variant={
                    (!hasChildren && isActive) || (hasChildren && isActive && isChild) ? "default" : "ghost"
                } // Jika tidak ada child, parent-nya aktif. Jika ada child, hanya child yang aktif.
                className={`w-full justify-start whitespace-nowrap overflow-hidden text-ellipsis 
                ${(!hasChildren && isActive) || (hasChildren && isActive && isChild)
                        ? "dark:bg-gray-500 dark:text-white"
                        : "dark:text-white dark:hover:bg-gray-500 dark:hover:text-white"
                    } mb-1 py-2`} // Tambahkan margin bottom dan padding
            >
                {isLoading ? (
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                ) : (
                    route.icon && <route.icon className={`mr-3 size-5 ${isActive ? "text-[#0ED1D6] " : ""}`} />
                )}
                {route.title}
            </Button>
        </Link>
    );
}
