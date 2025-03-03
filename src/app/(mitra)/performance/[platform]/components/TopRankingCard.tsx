import React, { useEffect, useState } from 'react';
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { numberFormatter } from "@/utils/numberFormatter";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import { FaEquals, FaArrowUp, FaArrowDown } from "react-icons/fa";
import TooltipIcon from '@/components/TooltipIcon';
import { primaryColors } from "@/constant/PerfomanceContants";
import moment from "moment";

const TopRankingCard = ({ platform = null, description = null }) => {
    const { authUser } = useAuth();
    const { period, activeTab, selectedAccount, selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState(true);
    const [fairRankingData, setFairRankingData] = useState([]);
    const [avatars, setAvatars] = useState({});
    const [stickyProfiles, setStickyProfiles] = useState([]);

    const monthLabel = `${moment(period?.end).format("MMMM")}`;

    // ✅ Label Map untuk API Request
    const labelMap = {
        FAIR: "FairScores",
        Followers: "Followers",
        Activities: "Activities",
        Interactions: "Interactions",
        Responsiveness: "Responsiveness"
    };

    const label = labelMap[activeTab] || "FairScores"; // ✅ Default harus "FairScores"

    const getFairRanking = async () => {
        if (!authUser?.username || !period?.start || !period?.end || !platform) return;

        setLoading(true);
        try {
            let response;
            let rankingData = [];

            if (activeTab === "FAIR") {
                response = await request.get(
                    `/getFairRanking?platform=${platform}&kategori=${authUser.username}&start_date=${period.start}&end_date=${period.end}`
                );
            } else {
                response = await request.get(
                    `/get${label}Ranking?platform=${platform}&kategori=${authUser.username}&start_date=${period.start}&end_date=${period.end}`
                );
            }

            rankingData = response.data?.data || [];
            setFairRankingData(rankingData);

            if (rankingData.length > 0) {
                await fetchAvatars(rankingData);
            }
        } catch (error) {
            console.error("Error fetching fair ranking:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvatars = async (rankingData) => {
        const newAvatars = { ...avatars };

        const avatarPromises = rankingData.map(async (user) => {
            if (!newAvatars[user.username]) {
                try {
                    const response = await request.get(
                        `/getPictureData?kategori=${authUser?.username}&platform=${platform}&username=${user.username}`
                    );
                    newAvatars[user.username] = response.data?.data[0]?.profile_pic_url || null;
                } catch (error) {
                    console.error("Error fetching avatar:", error);
                    newAvatars[user.username] = null;
                }
            }
        });

        await Promise.all(avatarPromises);
        setAvatars((prevAvatars) => ({ ...prevAvatars, ...newAvatars }));
    };

    useEffect(() => {
        if (authUser && period && platform) {
            getFairRanking(); // ✅ Jangan pass `labelMap[activeTab]`, sudah ditangani di dalam fungsi
        }
    }, [authUser, platform, period, activeTab]);

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

        if (delta > 0) return { delta: `+${delta}`, icon: <FaArrowUp />, color: "text-green-500", description: "Your FAIR Score has increased compared last month" };
        if (delta < 0) return { delta: `${delta}`, icon: <FaArrowDown />, color: "text-red-500", description: "Your FAIR Score has decreased compared last month" };

        return { icon: <FaEquals />, color: "text-yellow-500", description: "Your FAIR Score remains the same compared last month" };
    };

    interface Competitor {
        value: string;
    }

    const toggleCompetitorSelection = (username: string) => {
        if (username === selectedAccount) return;

        setSelectedCompetitor((prev: Competitor[]) => {
            const isSelected = prev.some((competitor) => competitor.value === username);

            if (isSelected) {
                return prev.filter((competitor) => competitor.value !== username);
            } else if (prev.length < 6) {
                return [...prev, { value: username }];
            }

            return prev;
        });
    };

    interface SelectableProps {
        username: string;
    }

    const isSelectable = (username) => 
        (selectedCompetitor?.length < 6 || 
        selectedCompetitor?.some((competitor) => competitor.value === username) || 
        username === selectedAccount);
    

    if (!authUser || !period || !platform || !description) {
        return <OurLoading />;
    }

    return (
        <div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-900 transition-colors h-full relative">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="flex items-center space-x-2">
                    <div className="font-bold">{monthLabel} Leaderboard</div>
                </div>
                <div className="mr-1 font-bold">{label}</div>
            </div>


            {/* Ranking List */}
            <div className="overflow-y-auto h-[700px] relative">
                {loading ? (
                    <OurLoading />
                ) : fairRankingData.length === 0 ? (
                    <OurEmptyData width={100} />
                ) : selectedAccount == null ? (
                    <p className="text-sm text-center">Please fill your account first</p>
                ) : (
                    fairRankingData.map((item, index) => {
                        const isSelected = item.username === selectedAccount || selectedCompetitor.some((competitor) => competitor.value === item.username);
                        const isDisabled = !isSelected && !isSelectable(item.username);

                        return (
                                <div
                                    key={`${item.username}-${index}`}
                                    className={`
                                    max-h-[75px] mb-2 p-3 flex items-center justify-between rounded-md cursor-pointer transition-transform duration-150 ease-in-out hover:scale-90 active:scale-85 scale-95
                                    ${item.username === selectedAccount ? 'sticky top-0 bottom-0 bg-gray-500 text-[#0ED1D6] z-50' : ""}
                                    ${isDisabled ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-300 dark:hover:bg-gray-400'}
                                    ${isSelected && item.username !== selectedAccount ? 'sticky top-0 bottom-0 bg-gray-700 z-30' : ''}
                                `}
                                    onClick={() => toggleCompetitorSelection(item.username)}
                                    style={{
                                        border: isSelected
                                            ? `2px solid ${item.username === selectedAccount
                                                ? primaryColors[0]
                                                : primaryColors[selectedCompetitor.findIndex((competitor) => competitor.value === item.username) + 1]
                                            }`
                                            : 'none',
                                    }}
                                >
                                    
                                    {/* Indikator perubahan posisi (di atas & mepet ke kiri) */}
                                    <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
                                        {(item.username === selectedAccount || selectedCompetitor.some((comp) => comp.value === item.username)) && (() => {
                                            const { delta, icon, color } = getPositionChange(item.current_rank, item.previous_rank);
                                            return (
                                                <div className={`text-[10px] font-medium ${color} flex gap-1 items-center justify-between`}>
                                                    <span>{delta}</span>
                                                    <span className="text-[12px]">{icon}</span>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Ranking & Icon */}
                                    <div className="ml-3 relative flex items-center w-[15%] text-right">
                                        {/* Wrapper untuk Ranking dan Indikator Posisi */}
                                        <div className="relative flex flex-col items-center">
                                            {/* Ranking Number / Medal */}
                                            <div
                                                className={`w-6 text-[16px]`}
                                                dangerouslySetInnerHTML={{ __html: getMedal(index) }}
                                            />
                                        </div>
                                    </div>

                                    {/* Username & Avatar */}
                                    <div className="ml-1 flex items-center flex-1 min-w-0 gap-x-2">
                                        <img
                                            src={avatars[item?.username] || '/default-avatar.png'}
                                            className="w-9 h-9 object-cover rounded-full border border-gray-300"
                                            alt={item?.username}
                                        />
                                        <div className="ml-1">
                                            <div className="text-[14px] font-semibold truncate w-40">{item?.username}</div>
                                            <div className="text-[11px] text-[#0ED1D6] truncate w-40">
                                                <button
                                                    className="hover:text-gray-500 p-1 rounded dark:bg-gray-800 border-none cursor-pointer w-[85%]"
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
                                            ${index === 0 ? "text-[16px]" :
                                                    index === 1 ? "text-[16px]" :
                                                        index === 2 ? "text-[16px]" :
                                                            "text-[16px]"
                                                }
                                            ${item.username === selectedAccount ? 'text-[#0ED1D6]' : ''}
                                        `}
                                        >
                                            {numberFormatter(item?.value)}
                                        </div>
                                    </div>
                                </div>
                        );
                    }))
                }
            </div>
        </div>
    );
};

export default TopRankingCard;
