import React, { useEffect, useState } from 'react';
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { scoreFormatter } from "@/utils/numberFormatter";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import { FaEquals, FaArrowUp, FaArrowDown } from "react-icons/fa";
import TooltipIcon from '@/components/TooltipIcon';
import { Tooltip } from 'chart.js';
import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect-error";
import {primaryColors} from "@/constant/PerfomanceContants";
import {TOption} from "@/types/PerformanceTypes";

const TopRankingCard = ({ platform = null, description }) => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState(true);
    const [fairRankingData, setFairRankingData] = useState([]);
    const [avatars, setAvatars] = useState({});
    const [stickyProfiles, setStickyProfiles] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const observer = new MutationObserver(() => {
                const newTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
                setTheme(newTheme);
            });

            observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

            return () => observer.disconnect();
        }
    }, []);


    const getFairRanking = async () => {
        if (!authUser || !period?.start || !period?.end  || !platform || !description) return [];
        try {
            const response = await request.get(
                `/getFairRanking?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`
            );
            const rankingData = response.data?.data || [];

            setFairRankingData(rankingData);
            await fetchAvatars(rankingData); // Fetch avatar setelah mendapatkan ranking
        } catch (error) {
            console.error("Error fetching fair ranking:", error);
        }
        setLoading(false);
    };

    const fetchAvatars = async (rankingData) => {
        const newAvatars = { ...avatars };

        for (const user of rankingData) {
            if (!newAvatars[user.username]) {
                try {
                    console.log(`Fetching avatar for: ${user.username}`);

                    const response = await request.get(
                        `/getPictureData?kategori=${authUser?.username}&platform=${platform}&username=${user.username}`
                    );

                    if (response.data?.data[0]?.profile_pic_url) {
                        newAvatars[user.username] = response.data.data[0].profile_pic_url;
                    } else {
                        newAvatars[user.username] = null;
                    }
                } catch (error) {
                    console.error("Error fetching avatar:", error);
                    newAvatars[user.username] = null;
                }
            }
        }

        setAvatars((prevAvatars) => ({ ...prevAvatars, ...newAvatars }));
    };

    useEffect(() => {
        if (authUser && period && platform) setLoading(true); {
            getFairRanking();
            setLoading(false);
        }
    }, [authUser, platform, period]);

    useEffect(() => {
        if (selectedCompetitor?.length > 0) {
            const selected = fairRankingData.filter((item) =>
                selectedCompetitor.some((competitor) => competitor.value === item.username)
            );
            setStickyProfiles(selected);
        } else {
            setStickyProfiles([]);
        }
    }, [selectedAccount, selectedCompetitor, fairRankingData]);

    const getMedal = (index) => {
        if (index === 0) return '<span style="font-size: 42px;">🥇</span>';
        if (index === 1) return '<span style="font-size: 38px;">🥈</span>';
        if (index === 2) return '<span style="font-size: 35px;">🥉</span>';
        return `<span style="font-size: 16px;">${index + 1}</span><text style="font-size: .75em; vertical-align: super; z-index: 0;">th</text>`;
    };

    const getPositionChange = (currentRank: number, previousRank: number | null) => {
        if (previousRank === null || previousRank === undefined) {
            return { delta: "0", icon: <FaEquals />, color: "text-gray-400" };
        }

        const delta = previousRank - currentRank;

        if (delta > 0) return { delta: `+${delta}`, icon: <FaArrowUp />, color: "text-green-500", description: "Your FAIR Score has increased compared to yesterday" };
        if (delta < 0) return { delta: `${delta}`, icon: <FaArrowDown />, color: "text-red-500", description: "Your FAIR Score has decreased compared to yesterday" };

        return { delta: "0", icon: <FaEquals />, color: "text-yellow-500", description: "Your FAIR Score remains the same compared to yesterday" };
    };

    if (!authUser || !period || !platform || !description) {
        return <OurLoading />;
    }

    return (
        <div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-900 transition-colors h-full relative">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="flex items-center space-x-2">
                    <div className="font-bold">FAIR Leaderboard</div>
                </div>
                <div className="mr-1 font-bold">Score</div>
            </div>

            {/* Ranking List */}
            <div className="overflow-y-scroll h-[700px]">
                {loading ? (
                    <OurLoading />
                ) : fairRankingData.length === 0 ? (
                    <OurEmptyData width={100} />
                ) : selectedAccount == null ? (
                    <p className="text-sm text-center">Please fill your account first</p>
                ) : (
                    fairRankingData.map((item, index: number) => (
                        <div
                            key={index}
                            rel="noopener noreferrer"
                            className={`
                                mb-1 cursor-pointer flex items-center justify-between p-2 rounded-md transition duration-300 
                                ${item.username == selectedAccount ? 'sticky top-0 bottom-0' : ''} 
                                ${item.username == selectedAccount ? 'bg-gray-100 dark:bg-gray-700' : ''} 
                                hover:bg-gray-100 dark:hover:bg-gray-300
                                ${index < 5 ? `border border-[${primaryColors[index]}]` : ''}`}
                            style={{borderColor: index < 5 ? primaryColors[index] : undefined}}
                            onClick={(e) => {
                                if (selectedAccount === item.username) {
                                    e.preventDefault();
                                } else {
                                    const checkboxContainer = e.currentTarget.querySelector(".checkbox-container");
                                    if (checkboxContainer) {
                                        checkboxContainer.style.display = checkboxContainer.style.display === "flex" ? "none" : "flex";
                                    }
                                }
                            }}
                        >
                            {/* Checkbox */}
                            <div className="checkbox-container flex items-center w-[10%] text-left"
                                 style={{display: "none"}}>
                                <input
                                    type="checkbox"
                                    className="form-checkbox w-5 h-5"
                                    checked={selectedCompetitor.some((competitor) => competitor.value === item.username)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCompetitor((prev: TOption[]) => [
                                                ...prev,
                                                {
                                                    value: item.username,
                                                    label: item.username
                                                }
                                            ]);
                                        } else {
                                            setSelectedCompetitor((prev: TOption[]) =>
                                                prev.filter((competitor) => competitor.value !== item.username)
                                            );
                                        }
                                    }}
                                />
                            </div>

                            {/* Ranking & Icon */}
                            <div className="flex items-center w-[15%] text-right">
                                <div className="w-6 text-[16px]"
                                     dangerouslySetInnerHTML={{__html: getMedal(index)}}></div>
                            </div>

                            {/* Username & Avatar */}
                            <div className="flex items-center flex-1 min-w-0 gap-x-2">
                                <img
                                    src={avatars[item?.username] || '/default-avatar.png'}
                                    className="w-9 h-9 object-cover rounded-full border border-gray-300"
                                    alt={item?.username}
                                />
                                <div className="">
                                    <div className="text-[14px] font-semibold truncate">{item?.username}</div>
                                    <div className="text-[11px] text-[#0ED1D6] truncate w-40">
                                        <button
                                            className="hover:text-gray-500 p-1.5 rounded dark:bg-gray-800 border-none cursor-pointer w-full"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(
                                                    platform === "Instagram"
                                                        ? `https://www.instagram.com/${item?.username}`
                                                        : platform === "TikTok"
                                                            ? `https://www.tiktok.com/@${item?.username}`
                                                            : "#",
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            View profile
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Score & Position Change */}
                            <div className="w-20 text-right flex flex-col items-end">
                                {/* Skor */}
                                <div
                                    className={`font-bold
                                        ${index === 0 ? "text-[22px]" :
                                        index === 1 ? "text-[20px]" :
                                            index === 2 ? "text-[18px]" :
                                                "text-[16px]"
                                    }
                                        ${item.username === selectedAccount ? 'text-[#0ED1D6]' : ''}
                                    `}
                                >
                                    {scoreFormatter(item?.fair_score)}
                                </div>

                                {/* Perubahan Posisi */}
                                {item.username === selectedAccount && (() => {
                                    const {
                                        delta,
                                        icon,
                                        color,
                                        description
                                    } = getPositionChange(item.current_rank, item.previous_rank);
                                    return (
                                        <TooltipIcon description={description}>
                                            <div
                                                className={`text-[14px] font-medium ${color} mt-1 flex items-center justify-end gap-1`}>
                                                <span>{delta}</span>
                                                <span className="text-[18px]">{icon}</span>
                                            </div>
                                        </TooltipIcon>
                                    );
                                })()}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopRankingCard;
