import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItemTooltipsProps {
    isActive: boolean;
    isLoading: boolean;
    route: {
        title: string;
        link: string;
        icon?: React.ElementType;
    };
    isChild?: boolean;
}

// export default function NavItemTooltips({ isActive, isLoading, route }: NavItemTooltipsProps) {
//     return (
//         <Link href={route.link} passHref>
//             <Tooltip>
//                 <TooltipTrigger>
//                     <div className={`p-2 rounded ${isActive ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
//                         {isLoading ? "🔄" : route.icon && <route.icon className="h-5 w-5" />}
//                     </div>
//                 </TooltipTrigger>
//                 <TooltipContent>{route.title}</TooltipContent>
//             </Tooltip>
//         </Link>
//     );
// }

import { Loader } from "lucide-react";

export default function NavItemTooltips({ isActive, isLoading, route }: NavItemTooltipsProps) {
    return (
        <Link href={route.link} passHref>
            <Tooltip>
                <TooltipTrigger>
                    <div className={`p-2 rounded ${isActive ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
                        {isLoading ? <Loader className="animate-spin h-5 w-5" /> : route.icon && <route.icon className="h-5 w-5" />}
                    </div>
                </TooltipTrigger>
                <TooltipContent>{route.title}</TooltipContent>
            </Tooltip>
        </Link>
    );
}
