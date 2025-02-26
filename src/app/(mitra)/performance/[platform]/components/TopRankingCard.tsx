import React, { useEffect, useState } from 'react';
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { scoreFormatter } from "@/utils/numberFormatter";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import { FaEquals, FaArrowUp, FaArrowDown } from "react-icons/fa";
import TooltipIcon from '@/components/TooltipIcon';
import { primaryColors } from "@/constant/PerfomanceContants";
import moment from "moment";

const TopRankingCard = ({ platform = null, description }) => {
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState(true);
    const [fairRankingData, setFairRankingData] = useState([]);
    const [avatars, setAvatars] = useState({});
    const [stickyProfiles, setStickyProfiles] = useState([]);
    // const [selectedCompetitors, setSelectedCompetitors] = useState([]);

    const monthLabel = `${moment(period?.end).format("MMMM")}`;

    const getFairRanking = async () => {
        if (!authUser?.username || !period?.start || !period?.end || !platform || !description) {
            console.warn("Required data is missing, skipping API request.");
            return;
        }

        try {
            const response = await request.get(
                `/getFairRanking?platform=${platform}&kategori=${authUser.username}&start_date=${period.start}&end_date=${period.end}`
            );

            const rankingData = response.data?.data || [];
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
        if (authUser && period && platform) {
            setLoading(true);
            getFairRanking();
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

        if (delta > 0) return { delta: `+${delta}`, icon: <FaArrowUp />, color: "text-green-500", description: "Your FAIR Score has increased compared last month" };
        if (delta < 0) return { delta: `${delta}`, icon: <FaArrowDown />, color: "text-red-500", description: "Your FAIR Score has decreased compared last month" };

        return { icon: <FaEquals />, color: "text-yellow-500", description: "Your FAIR Score remains the same compared last month" };
    };

    const toggleCompetitorSelection = (username) => {
        if (username === selectedAccount) return;

        const isSelected = selectedCompetitor.some((competitor) => competitor.value === username);

        if (isSelected) {
            setSelectedCompetitor((prev) => prev.filter((competitor) => competitor.value !== username));
        } else if (selectedCompetitor.length < 6) {
            setSelectedCompetitor((prev) => [...prev, { value: username }]);
        }
    };

    const isSelectable = (username) =>
        selectedCompetitor.length < 6 || selectedCompetitor.some((competitor) => competitor.value === username) || username === selectedAccount;

    // const displayedProfiles = fairRankingData.filter(
    //     (item) => item.username === selectedAccount || selectedCompetitor.some((competitor) => competitor.value === item.username)
    // );

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
                <div className="mr-1 font-bold">FAIR Score</div>
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
                    fairRankingData.map((item, index) => {
                        const isSelected = item.username === selectedAccount || selectedCompetitor.some((competitor) => competitor.value === item.username);
                        const isDisabled = !isSelected && !isSelectable(item.username);

                        return (
                            <div
                                key={item.username}
                                className={`
                                    max-h-[75px] mb-2 p-3 flex items-center justify-between rounded-md cursor-pointer transition-transform duration-150 ease-in-out hover:scale-95 active:scale-90
                                    ${item.username === selectedAccount ? 'sticky top-0 bottom-0 bg-gray-500 text-[#0ED1D6] z-50' : ""}
                                    ${isDisabled ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-300 dark:hover:bg-gray-400'}
                                    ${isSelected && item.username !== selectedAccount ? 'sticky top-0 bottom-0 bg-gray-700 z-30' : ''}
                                `}
                                onClick={() => toggleCompetitorSelection(item.username)}
                                style={{
                                    border: isSelected
                                        ? `2px solid ${
                                            item.username === selectedAccount
                                                ? primaryColors[0]
                                                : primaryColors[selectedCompetitor.findIndex((competitor) => competitor.value === item.username) + 1]
                                        }`
                                        : 'none'
                                }}
                            >

                                {/* Ranking & Icon */}
                                <div className="flex items-center w-[15%] text-right">
                                    <div className="w-6 text-[16px]"
                                        dangerouslySetInnerHTML={{ __html: getMedal(index) }}></div>
                                </div>

                                {/* Username & Avatar */}
                                <div className="flex items-center flex-1 min-w-0 gap-x-2">
                                    <img
                                        src={avatars[item?.username] || '/default-avatar.png'}
                                        className="w-9 h-9 object-cover rounded-full border border-gray-300"
                                        alt={item?.username}
                                    />
                                    <div className="">
                                        <div className="text-[14px] font-semibold truncate w-40">{item?.username}</div>
                                        <div className="text-[11px] text-[#0ED1D6] truncate w-40">
                                            <button
                                                className="hover:text-gray-500 p-1 rounded dark:bg-gray-800 border-none cursor-pointer w-full"
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
                        );
                    }))
                }
            </div>
        </div>
    );
};

export default TopRankingCard;