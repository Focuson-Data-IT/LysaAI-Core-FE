import React, { useEffect, useState } from 'react';
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { scoreFormatter } from "@/utils/numberFormatter";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";

const TopRankingCard = ({ platform = null, description }) => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor } = usePerformanceContext();

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
        if (!authUser || !period || !platform || !description ) return [];
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
        if (authUser && period && platform) setLoading(true);{
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

    if (!authUser || !period || !platform || !description) {
        return <OurLoading />;
    }

    return (
        <div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-900 transition-colors h-full relative">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="flex items-center space-x-2">
                    <div className="font-bold">FAIR Ranking</div>
                </div>
                <div className="mr-1 font-bold">Score</div>
            </div>

            {/* Sticky Profile */}
            {stickyProfiles.length > 0 && (
                <div className="mb-2 bg-gray-300 dark:bg-gray-800 rounded-t-lg">
                    {stickyProfiles.map((profile, index) => (
                        <a
                            key={`sticky-${index}`}
                            href={`https://www.instagram.com/${profile?.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-sm p-3"
                        >
                            <div className="flex items-center w-1/5">
                                <div className="w-8 text-right text-[18px]">
                                    {fairRankingData.findIndex(item => item.username === profile.username) + 1}.
                                </div>
                                <img src={`/medal-${theme === 'dark' ? 'white' : 'dark'}.svg`}
                                    alt="icon" className="h-10 w-10 mx-2" />
                            </div>

                            {/* Username & Avatar */}
                            <div className="flex items-center flex-1 min-w-0">
                                <img
                                    src={avatars[profile?.username] || '/default-avatar.png'}
                                    className="w-10 h-10 object-cover rounded-full border border-gray-300"
                                    alt={profile.username}
                                />
                                <div className="ml-3">
                                    <div className="text-[15px] font-medium truncate">{profile?.username}</div>
                                    <div className="text-[12px] text-[#0ED1D6] truncate">
                                        {`https://www.instagram.com/${profile?.username}`}
                                    </div>
                                </div>
                            </div>

                            {/* Skor */}
                            <div className="w-16 text-right font-bold">{scoreFormatter(profile?.fair_score)}</div>
                        </a>
                    ))}
                </div>
            )}

            {/* Ranking List */}
            <div className="overflow-y-scroll h-[600px]">
                {loading ? (
                    <OurLoading />
                ) : fairRankingData.length === 0 ? (
                    <OurEmptyData width={100} />
                ) : selectedAccount == null ? (
                    <p className="text-sm text-center">Please fill your account first</p>
                ) : (
                    fairRankingData.map((item, index) => (
                        <a
                            key={index}
                            href={`https://www.instagram.com/${item?.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between p-2 rounded-md transition duration-300 ${item.username == selectedAccount ? 'sticky top-0 bottom-0' : ''} ${item.username == selectedAccount ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                            {/* Ranking & Icon */}
                            <div className="flex items-center w-[15%] text-right">
                                <div className="w-6 text-[16px]" dangerouslySetInnerHTML={{ __html: getMedal(index) }}></div>
                            </div>

                            {/* Username & Avatar */}
                            <div className="flex items-center flex-1 min-w-0 gap-x-2">
                                <img
                                    src={avatars[item?.username] || '/default-avatar.png'}
                                    className="w-9 h-9 object-cover rounded-full border border-gray-300"
                                    alt={item?.username}
                                />
                                <div className="ml-2 min-w-0">
                                    <div className="text-[14px] font-semibold truncate">{item?.username}</div>
                                    <div className="text-[11px] text-[#0ED1D6] truncate">
                                        https://www.instagram.com/...
                                    </div>
                                </div>
                            </div>

                            {/* Score */}
                            <div
                                className={`w-20 text-right font-bold 
                                    ${index === 0 ? "text-[22px]" :  // Peringkat 1 paling besar
                                        index === 1 ? "text-[20px]" :  // Peringkat 2 lebih kecil
                                            index === 2 ? "text-[18px]" :  // Peringkat 3 lebih kecil lagi
                                                "text-[16px]" // Peringkat lainnya default
                                    }`}
                            >
                                {scoreFormatter(item?.fair_score)}
                            </div>

                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopRankingCard;
