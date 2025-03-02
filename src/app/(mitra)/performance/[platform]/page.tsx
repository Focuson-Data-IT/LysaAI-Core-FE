"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePerformanceContext } from "@/context/PerformanceContext";
import OurLoading from "@/components/OurLoading";
import FairScoreContainer from "./components/FairScoreContainer";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/ContentPerformance";
import { FaInstagram, FaTiktok, FaColumns, FaLayerGroup } from "react-icons/fa";
import { motion } from "framer-motion";
import FairDetailCard from "./components/FairDetailCard";
import OurEmptyData from "@/components/OurEmptyData";
import InstagramChart from "./components/charts/GrowthChart";
import TikTokChart from "./components/charts/GrowthChartTiktok";

const Competitor = () => {
    const { platform } = useParams();
    const { authUser } = useAuth();
    const [showCombinedChart, setShowCombinedChart] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { 
        period, selectedAccount, setSelectedAccount, setPeriod
    } = usePerformanceContext();

    const getIconComponent = (platform: string) => {
        const icons = { Instagram: FaInstagram, TikTok: FaTiktok };
        return icons[platform] || null;
    };

    const IconComponent = getIconComponent(Array.isArray(platform) ? platform[0] : platform);

    // 🔥 Reset `selectedAccount` dan `period` saat `platform` berubah
    useEffect(() => {
        setSelectedAccount(null);
        setPeriod(null);
    }, [platform]);

    if (!authUser || !platform) {
        return <OurLoading />;
    }

    return (
        <div className="relative min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center relative z-20 bg-transparent">
                <div>
                    <h1 className="text-xl text-black dark:text-white font-bold">
                        Competitor Analysis
                    </h1>
                    <p className="text-black dark:text-white">
                        Monitor your competitors every single day
                    </p>
                </div>
            </div>

            {/* OVERLAY MESSAGE */}
            {!selectedAccount && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <p className="text-lg font-semibold text-black dark:text-white bg-white/80 dark:bg-black/60 px-4 py-2 rounded-lg shadow-lg">
                        Please select a username to continue...
                    </p>
                </div>
            )}

            {selectedAccount && (!period?.start || !period?.end) && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <p className="text-lg font-semibold text-black dark:text-white bg-white/80 dark:bg-black/60 px-4 py-2 rounded-lg shadow-lg">
                        Please select a month to continue...
                    </p>
                </div>
            )}

            {/* CONTENT */}
            <div
                className={`mt-4 min-h-screen transition-all duration-300 ease-in-out relative ${!selectedAccount || (!period?.start && !period?.end) ? "blur-sm" : ""}`}
            >
                {selectedAccount && period?.start && period?.end && (
                    <>
                        {/* FAIR Score & Top Ranking */}
                        <div className="grid grid-cols-12 gap-4 mt-4">
                            <div className="lg:col-span-9 rounded-lg">
                                <FairScoreContainer platform={platform} description="A measurement for assessing account performance on social media." />
                            </div>
                            <div className="lg:col-span-3 rounded-lg">
                                <TopRankingCard platform={platform} description="Jumlah orang yang mengikuti akun." />
                            </div>
                        </div>

                        {/* Header & Toggle */}
                        <div className="lg:col-span-12 flex justify-between items-center my-4">
                            {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" />}
                            <div className="mx-3 w-auto text-lg font-bold">Growth Metrics</div>
                            <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />

                            {/* Toggle Button dengan Animasi */}
                            <button
                                onClick={() => setShowCombinedChart(prev => !prev)}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:scale-90"
                                title={showCombinedChart ? "Switch to Separate Charts" : "Switch to Combined Chart"}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <motion.div
                                    key={showCombinedChart ? "columns" : "layer"}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: isHovered ? 5 : [1, 0, 1],
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: isHovered ? 0 : 1.5,
                                        ease: "easeInOut",
                                        repeat: isHovered ? 0 : Infinity,
                                    }}
                                >
                                    {showCombinedChart ? (
                                        <FaColumns className="h-6 w-6 text-[#41c2cb]" />
                                    ) : (
                                        <FaLayerGroup className="h-6 w-6 text-[#41c2cb]" />
                                    )}
                                </motion.div>
                            </button>
                        </div>

                        {/* Konten Berdasarkan Toggle */}
                        {showCombinedChart ? (
                            <div className="grid lg:col-span-12 gap-4 mt-4">
                                <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3">
                                    {platform === "Instagram" ? (
                                        <InstagramChart username={selectedAccount} startDate={period.start} endDate={period.end} platform="Instagram" />
                                    ) : platform === "TikTok" ? (
                                        <TikTokChart username={selectedAccount} startDate={period.start} endDate={period.end} platform="TikTok" />
                                    ) : (
                                        <OurEmptyData width={100} />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-12 gap-4 mt-4">
                                {platform === "Instagram" ? (
                                    <>
                                        <FairDetailCard platform={platform} label="Followers" description="Number of Followers" />
                                        <FairDetailCard platform={platform} label="Likes" description="Number of Likes" />
                                        <FairDetailCard platform={platform} label="Views" description="Number of View Counts" />
                                        <FairDetailCard platform={platform} label="Comments" description="Number of Comments" />
                                    </>
                                ) : platform === "TikTok" ? (
                                    <>
                                        <FairDetailCard platform={platform} label="Followers" description="Number of Followers" />
                                        <FairDetailCard platform={platform} label="Likes" description="Number of Likes" />
                                        <FairDetailCard platform={platform} label="Views" description="Number of Views" />
                                        <FairDetailCard platform={platform} label="Comments" description="Number of Comments" />
                                        <FairDetailCard platform={platform} label="Saves" description="Number of Saves" />
                                        <FairDetailCard platform={platform} label="Shares" description="Number of Shares" />
                                        
                                    </>
                                ) : null }
                            </div>
                        )}

                        {/* POST DETAIL */}
                        <div className="flex w-full items-center my-4">
                            {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" />}
                            <div className="mx-3 w-auto text-lg font-bold">Content Performance Report</div>
                            <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                        </div>

                        <div className="grid grid-cols-12 gap-4 mt-4 h-[800px]">
                            <div className="lg:col-span-12 rounded-lg">
                                <PostsTable platform={platform} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Competitor;
