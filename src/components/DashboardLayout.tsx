"use client";

import { useParams, usePathname } from "next/navigation"; // Import usePathname
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import request from "@/utils/request";
import Nav from "@/components/Nav";
import ModeToggle from "@/components/ModeToggle";
import UserNav from "@/components/UserNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePerformanceContext } from "@/context/PerformanceContext";
import dynamic from "next/dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const OurDatePicker = dynamic(() => import("@/components/OurDatePicker"), { ssr: false });
    const OurSelect = dynamic(() => import("@/components/OurSelect"), { ssr: false });

    const { authUser } = useAuth();
    const { platform } = useParams();
    const pathname = usePathname(); // 🔥 Ambil pathname

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [accountOptions, setAccountOptions] = useState([]);
    const [isShowDatepicker, setIsShowDatepicker] = useState(false);

    const { selectedAccount, setSelectedAccount } = usePerformanceContext();

    const isPerformancePage = pathname.startsWith("/performance"); // 🔥 Cek apakah di halaman Performance

    useEffect(() => {
        const fetchUsernames = async () => {
            if (authUser?.username) {
                try {
                    const response = await request.get(
                        `/getAllUsername?kategori=${authUser.username}&platform=${platform}`
                    );
                    const usernames = response.data?.data || [];
                    const formattedOptions = usernames.map((user: { username: string }) => ({
                        label: user.username,
                        value: user.username,
                    }));

                    setAccountOptions(formattedOptions);
                } catch (error) {
                    console.error("Error fetching usernames:", error);
                }
            }
        };

        fetchUsernames();
    }, [authUser, platform]);

    return (
        <TooltipProvider>
            <div className="justify-center overflow-x-hidden w-screen h-screen flex items-start text-black dark:text-white bg-gray-200 dark:bg-gray-800">
                {/* Sidebar */}
                <div
                    className={cn(
                        "border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col",
                        isCollapsed ? "w-[57px]" : "sm:w-[250px]"
                    )}
                >
                    <Nav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                </div>

                {/* Main Content */}
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800">
                        <div className="flex w-full z-50 items-center px-3 pt-3 pb-2">
                            {/* 🔥 Tampilkan SELECTIONS hanya jika di halaman Performance */}
                            {isPerformancePage && (
                                <div className="flex justify-between gap-5 items-center">
                                    <OurSelect
                                        options={accountOptions}
                                        value={accountOptions.find((option) => option.value === selectedAccount)}
                                        onChange={(selected) => setSelectedAccount(selected?.value)}
                                        isMulti={false}
                                        placeholder="Type / Select Username"
                                    />
                                    <OurDatePicker
                                        disabled={!selectedAccount}
                                        onClick={() => setIsShowDatepicker(!isShowDatepicker)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="ml-auto mr-2 mt-1 flex w-full items-center justify-end space-x-2 text-lg">
                            <ModeToggle />
                            <UserNav />
                        </div>
                    </div>

                    <div className="h-1 bg-gray-200 dark:bg-gray-800" />
                    {/* Page Content */}
                    <div className="flex-1 h-[calc(100vh-55px)] overflow-auto bg-white dark:bg-black">
                        <div className="w-full px-6 pt-3">{children}</div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}

