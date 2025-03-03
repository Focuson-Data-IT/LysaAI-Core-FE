"use client";

import React, { useEffect, useState } from 'react';
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import TooltipIcon from '@/components/TooltipIcon';
import { IoInformationCircle } from "react-icons/io5";
import AiModal from "@/components/AiModal";

// Import Chart Components
import LineChart from "./ChartComponents/LineChart";
import PieChart from "./ChartComponents/PieChart";
import RadarChart from "./ChartComponents/RadarChart";
import BarChart from "./ChartComponents/BarChart";
import HorizontalBarChart from "./ChartComponents/HorizontalBarChart";

const FairScoreContainer = ({ platform, description }) => {
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fairScoreData, setFairScoreData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>("FAIR");

    const getFairScoreChartData = async (label: string) => {
        if (!authUser || !period || !platform || !description) return [];
        let response;

        if (activeTab === "FAIR") {
            response = await request.get(
                `/getFairScores?kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}&platform=${platform}`
            );
        } else {
            response = await request.get(
                `/get${label}?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`
            );
        }

        return response.data?.data;
    };

    useEffect(() => {
        if (authUser && period && platform) {
            setIsLoading(true);
            getFairScoreChartData(activeTab).then((data) => {
                setFairScoreData(data);
                setIsLoading(false);
            });
        }
    }, [authUser, period, platform, activeTab]);

    const handleTabChange = (tab: string) => setActiveTab(tab);

    const getIconComponent = (platform: string) => {
        const icons = { Instagram: FaInstagram, TikTok: FaTiktok };
        return icons[platform] || null;
    };

    const IconComponent = getIconComponent(platform);
    const tabDescriptions = {
        FAIR: "Performance score over time",
        Followers: "Total number of followers",
        Activities: "Average posts per day",
        Interactions: "Average likes per post",
        Responsiveness: "Percentage of comments replied"
    };

    if (!authUser || !period || !platform) return <OurLoading />;

    return (
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3 transition-colors h-full relative">
            {/* Header */}
            <div className="relative flex flex-col">
                <div className="flex items-center">
                    {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" />}
                    <div className="font-bold mx-3 text-lg">FAIR Score Performance</div>
                    {description && (
                        <TooltipIcon description={description}>
                            <IoInformationCircle size={18} className="cursor-pointer text-gray-500" />
                        </TooltipIcon>
                    )}
                </div>

                {/* 🔥 Chrome-Style Tabs */}
                <div className="relative mt-4">
                    <div className="absolute w-full top-[100%] flex justify-start border-b border-gray-300">
                        {["FAIR", "Followers", "Activities", "Interactions", "Responsiveness"].map((tab, index) => (
                            <button
                                key={tab}
                                className={`relative px-5 py-2 text-sm font-medium transition-all
                                    ${activeTab === tab
                                        ? "bg-white dark:bg-gray-800 text-blue-500 shadow-md border-t border-x border-gray-300 dark:border-gray-700"
                                        : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }
                                    rounded-t-lg mx-1`}
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="h-[650px] flex items-center justify-center pt-12">
                {isLoading ? <OurLoading /> : fairScoreData.length === 0 ? <OurEmptyData width={100} /> : (
                    <>
                        {activeTab === "FAIR" && <LineChart data={fairScoreData} selectedCompetitor={selectedCompetitor} selectedAccount={selectedAccount} period={period} />}
                        {activeTab === "Followers" && <PieChart data={fairScoreData} selectedCompetitor={selectedCompetitor} selectedAccount={selectedAccount}/>}
                        {activeTab === "Activities" && <RadarChart data={fairScoreData} selectedCompetitor={selectedCompetitor}/>}
                        {activeTab === "Interactions" && <BarChart data={fairScoreData} selectedCompetitor={selectedCompetitor} selectedAccount={selectedAccount}/>}
                        {activeTab === "Responsiveness" && <HorizontalBarChart data={fairScoreData} selectedCompetitor={selectedCompetitor} selectedAccount={selectedAccount}/>}
                    </>
                )}
            </div>

            <AiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={aiData} isLoading={isLoading} />
        </div>
    );
};

export default FairScoreContainer;
