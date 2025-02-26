"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/PostDetailCard";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";
import request from "@/utils/request";
import { useAuth } from "@/hooks/useAuth";
import { usePerformanceContext } from "@/context/PerformanceContext";
import OurLoading from "@/components/OurLoading";
import InstagramChart from "./components/charts/GrowthChart";
import TikTokChart from "./components/charts/GrowthChartTiktok";
import OurEmptyData from "@/components/OurEmptyData";
import FairDetailCard from "./components/FairDetailCard";
import {FaColumns, FaLayerGroup} from "react-icons/fa";

const Competitor = () => {
    const { platform } = useParams();
    const { authUser } = useAuth();

    const [accountOptions, setAccountOptions] = useState([]);
    const [competitorOptions, setCompetitorOptions] = useState([]);
    const [isShowDatepicker, setIsShowDatepicker] = useState(false);
    const [showCombinedChart, setShowCombinedChart] = useState(false);

    const {
        period,
        selectedCompetitor,
        selectedAccount,
        setPeriod,
        setSelectedCompetitor,
        setSelectedAccount,
    } = usePerformanceContext();

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
                    setCompetitorOptions(formattedOptions);
                } catch (error) {
                    console.error("Error fetching usernames:", error);
                }
            }
        };

        fetchUsernames();
    }, [authUser, platform]);

    const getIconComponent = (platform: string) => {
        const icons = {
            Instagram: FaInstagram,
            TikTok: FaTiktok,
        };
        return icons[platform] || null;
    };

    const IconComponent = getIconComponent(Array.isArray(platform) ? platform[0] : platform);

    const toggleChartView = () => setShowCombinedChart((prev) => !prev);

    if (!authUser || !period || !platform) {
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

                {/* SELECTIONS */}
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
            </div>

            {/* OVERLAY MESSAGE */}
            {!selectedAccount && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <p className="text-lg font-semibold text-black dark:text-white bg-white/80 dark:bg-black/60 px-4 py-2 rounded-lg shadow-lg">
                        Please select a username to continue...
                    </p>
                </div>
            )}

            {selectedAccount && (!period.start || !period.end) && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <p className="text-lg font-semibold text-black dark:text-white bg-white/80 dark:bg-black/60 px-4 py-2 rounded-lg shadow-lg">
                        Please select a month to continue...
                    </p>
                </div>
            )}

            {/* CONTENT */}
            <div
                className={`mt-4 min-h-screen transition-all duration-300 ease-in-out relative ${!selectedAccount || (!period.start && !period.end) ? "blur-sm" : ""
                    }`}
            >
                {selectedAccount && period.start && period.end && (
                    <>
                        {/* FAIR Score & Top Ranking */}
                        <div className="grid grid-cols-12 gap-4 mt-4">
                            <div className="lg:col-span-9 rounded-lg">
                                <FairScoreCard
                                    platform={platform}
                                    description="A measurement for assessing account performance on social media."
                                />
                            </div>
                            <div className="lg:col-span-3 rounded-lg">
                                <TopRankingCard
                                    platform={platform}
                                    description="Jumlah orang yang mengikuti akun."
                                />
                            </div>
                        </div>

                        {/* Header & Toggle */}
                        <div className="lg:col-span-12 flex justify-between items-center my-4">
                            
                                {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" />}
                                <div className="mx-3 w-auto text-lg font-bold">Growth Metrics</div>
                                
                                {/* Toggle Button */}
                            <button
                                onClick={toggleChartView}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                title={showCombinedChart ? "Switch to Separate Charts" : "Switch to Combined Chart"}
                            >
                                {showCombinedChart ? (
                                    <FaColumns className="h-6 w-6 text-[#41c2cb]" /> // Pisah
                                ) : (
                                    <FaLayerGroup className="h-6 w-6 text-[#41c2cb]" /> // Gabungan
                                )}
                            </button>
                            <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />

                        </div>

                        {/* Konten Berdasarkan Toggle */}
                        {showCombinedChart ? (
                            // ✅ Tampilan Gabungan
                            <div className="grid lg:col-span-12 gap-4 mt-4">
                                <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3">
                                    {platform === "Instagram" ? (
                                        <InstagramChart
                                            username={selectedAccount}
                                            startDate={period.start}
                                            endDate={period.end}
                                            platform="Instagram"
                                        />
                                    ) : platform === "TikTok" ? (
                                        <TikTokChart
                                            username={selectedAccount}
                                            startDate={period.start}
                                            endDate={period.end}
                                            platform="TikTok"
                                        />
                                    ) : (
                                        <OurEmptyData width={100} />
                                    )}
                                </div>
                            </div>
                        ) : (
                            // ✅ Tampilan Pisah (FairDetailCard)
                            <div className="grid grid-cols-12 gap-4 mt-4">
                                {platform === "Instagram" && (
                                    <>
                                        <FairDetailCard platform={platform} label="Followers" description="Number of Followers" />
                                        <FairDetailCard platform={platform} label="Likes" description="Number of Likes" />
                                        <FairDetailCard platform={platform} label="Views" description="Number of View Counts" />
                                        <FairDetailCard platform={platform} label="Comments" description="Number of Comments" />
                                    </>
                                )}

                                {platform === "TikTok" && (
                                    <>
                                        <FairDetailCard platform={platform} label="Followers" description="Number of Followers" />
                                        <FairDetailCard platform={platform} label="Views" description="Number of View Counts" />
                                        <FairDetailCard platform={platform} label="Likes" description="Number of Likes" />
                                        <FairDetailCard platform={platform} label="Saves" description="Number of Save Counts" />
                                        <FairDetailCard platform={platform} label="Comments" description="Number of Comments" />
                                        <FairDetailCard platform={platform} label="Shares" description="Number of Shares" />
                                    </>
                                )}
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
    )
};

export default Competitor;
