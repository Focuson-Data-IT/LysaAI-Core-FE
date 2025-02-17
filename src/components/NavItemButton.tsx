import Link from "next/link";
// import { Button } from "@/components/ui/button";

interface NavItemButtonProps {
    isActive: boolean;
    isLoading: boolean;
    route: {
        title: string;
        link: string;
        icon?: React.ElementType;
    };
    isChild?: boolean;
}

// export default function NavItemButton({ isActive, isLoading, route, isChild }: NavItemButtonProps) {
//     return (
//         <Link href={route.link} passHref>
//             <Button
//                 variant={isActive && !isChild ? "default" : "ghost"}
//                 className={`w-full justify-start ${
//                     isActive ? "font-bold dark:hover:bg-gray-500 dark:hover:text-white" : "dark:text-white dark:hover:bg-gray-500 dark:hover:text-white"
//                 }`}
//             >
//                 {isLoading ? "🔄" : route.icon && <route.icon className="mr-3 size-5" />}
//                 {route.title}
//             </Button>
//         </Link>
//     );
// }

// import { Loader } from "lucide-react";
// import { Button } from "./ui/button";

// export default function NavItemButton({ isActive, isLoading, route, isChild }: NavItemButtonProps) {
//     return (
//         <Link href={route.link} passHref>
//             <Button
//                 variant={isActive && !isChild ? "default" : "ghost"}
//                 className={`w-full justify-start ${
//                     isActive ? "font-bold dark:hover:bg-gray-500 dark:hover:text-white" : "dark:text-white dark:hover:bg-gray-500 dark:hover:text-white"
//                 }`}
//             >
//                 {isLoading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : route.icon && <route.icon className="mr-3 size-5" />}
//                 {route.title}
//             </Button>
//         </Link>
//     );
// }

import { Loader } from "lucide-react";
import { Button } from "./ui/button";

export default function NavItemButton({ isActive, isLoading, route, isChild }: NavItemButtonProps) {
    return (
        <Link href={route.link} passHref>
            <Button
                variant={isActive && !isChild ? "default" : "ghost"}
                className={`w-full justify-start ${isActive
                        ? "font-bold dark:hover:bg-gray-500 dark:hover:text-white"
                        : "dark:text-white dark:hover:bg-gray-500 dark:hover:text-white"
                    }`}
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

