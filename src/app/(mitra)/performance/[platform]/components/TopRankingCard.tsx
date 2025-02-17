import React, { useEffect, useState } from 'react';
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { scoreFormatter } from "@/utils/numberFormatter";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";

const TopRankingCard = ({ platform = null, description }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const { authUser } = useAuth();
    const { period, selectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState(true);
    const [fairRankingData, setFairRankingData] = useState([]);
    const [stickyProfiles, setStickyProfiles] = useState([]);

    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'dark');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const getFairRanking = async () => {
        setLoading(true);
        const response = await request.get(`/getFairRanking?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`);
        setLoading(false);
        return response.data?.data || [];
    };

    useEffect(() => {
        getFairRanking().then((data) => {
            setFairRankingData(data);
        });
    }, [authUser, platform, period]);

    // Menentukan profile yang harus sticky (berdasarkan selection)
    useEffect(() => {
        if (selectedCompetitor?.length > 0) {
            const selected = fairRankingData.filter((item) =>
                selectedCompetitor.some((competitor) => competitor.value === item.username)
            );
            setStickyProfiles(selected);
        } else {
            setStickyProfiles([]);
        }
    }, [selectedCompetitor, fairRankingData]);

    return (
        <div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-900 transition-colors h-full relative">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="flex items-center space-x-2">
                <div className="font-bold">Fair Ranking</div>
                {description && (
                                    <div className="relative group">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 256 256"
                                            className="cursor-pointer"
                                        >
                                            <g fill="#8f8f8f">
                                                <g transform="scale(9.84615,9.84615)">
                                                    <path d="M13,1.1875c-6.52344,0 -11.8125,5.28906 -11.8125,11.8125c0,6.52344 5.28906,11.8125 11.8125,11.8125c6.52344,0 11.8125,-5.28906 11.8125,-11.8125c0,-6.52344 -5.28906,-11.8125 -11.8125,-11.8125zM15.46094,19.49609c-0.60937,0.23828 -1.09375,0.42188 -1.45703,0.54688c-0.36328,0.125 -0.78125,0.1875 -1.26172,0.1875c-0.73437,0 -1.30859,-0.17969 -1.71875,-0.53906c-0.40625,-0.35547 -0.60937,-0.8125 -0.60937,-1.36719c0,-0.21484 0.01563,-0.43359 0.04688,-0.65625c0.02734,-0.22656 0.07813,-0.47656 0.14453,-0.76172l0.76172,-2.6875c0.06641,-0.25781 0.125,-0.5 0.17188,-0.73047c0.04688,-0.23047 0.06641,-0.44141 0.06641,-0.63281c0,-0.33984 -0.07031,-0.58203 -0.21094,-0.71484c-0.14453,-0.13672 -0.41406,-0.20312 -0.8125,-0.20312c-0.19531,0 -0.39844,0.03125 -0.60547,0.08984c-0.20703,0.0625 -0.38281,0.12109 -0.53125,0.17578l0.20313,-0.82812c0.49609,-0.20312 0.97266,-0.375 1.42969,-0.51953c0.45313,-0.14453 0.88672,-0.21875 1.28906,-0.21875c0.73047,0 1.29688,0.17969 1.69141,0.53125c0.39453,0.35156 0.59375,0.8125 0.59375,1.375c0,0.11719 -0.01172,0.32422 -0.03906,0.61719c-0.02734,0.29297 -0.07812,0.5625 -0.15234,0.8125l-0.75781,2.67969c-0.0625,0.21484 -0.11719,0.46094 -0.16797,0.73438c-0.04687,0.27344 -0.07031,0.48438 -0.07031,0.625c0,0.35547 0.07813,0.60156 0.23828,0.73047c0.15625,0.12891 0.43359,0.19141 0.82813,0.19141c0.18359,0 0.39063,-0.03125 0.625,-0.09375c0.23047,-0.06641 0.39844,-0.12109 0.50391,-0.17187z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                        <span className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-normal w-[150px] text-left dark:bg-black bg-black text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100">
                                            {description}
                                        </span>
                                    </div>
                                )}
                </div>
                
                <div className="mr-1 font-bold">Score</div>
                
            </div>
            

            {/* Sticky Profile yang Dipilih */}
            {stickyProfiles.length > 0 && (
                <div className="mb-2 bg-gray-300 dark:bg-gray-800 rounded-t-lg">
                    {stickyProfiles.map((profile, index) => (
                        <a
                            key={`sticky-${index}`}
                            href={platform === 'Instagram' ? `https://www.instagram.com/${profile?.username}` : `https://www.tiktok.com/@${profile?.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-sm p-3"
                        >
                            <div className="flex items-center w-1/5">
                                <div className="w-8 text-right text-[15px]">{fairRankingData.findIndex(item => item.username === profile.username) + 1}.</div>
                                <img src={`/bintang-${theme === 'dark' ? 'putih' : 'd'}.svg`}
                                    alt="icon" className="h-6 w-6 mx-2" />
                            </div>

                            {/* Username & Link */}
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-medium truncate">{profile?.username}</div>
                                <div className="text-[10px] text-[#0ED1D6] truncate">
                                    {platform === 'Instagram' ? `https://www.instagram.com/${profile?.username}` :
                                        `https://www.tiktok.com/@${profile?.username}`}
                                </div>
                            </div>

                            {/* Skor */}
                            <div className="w-16 text-right">
                                <span className="text-sm font-bold">{scoreFormatter(profile?.fair_score)}</span>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {/* Ranking List */}
            <div className="overflow-y-scroll h-[350px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <OurLoading />
                    </div>
                ) : fairRankingData.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <OurEmptyData width={100} />
                    </div>
                ) : (
                    fairRankingData.map((item, index) => (
                        <a
                            key={index}
                            href={platform === 'Instagram' ? `https://www.instagram.com/${item?.username}` : `https://www.tiktok.com/@${item?.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            <div className="flex items-center justify-between w-full px-4 py-2 rounded-lg bg-opacity-10"
                                // style={{ backgroundColor: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.05)" }}
                                >

                                {/* Peringkat & Icon */}
                                <div className="flex items-center w-1/5">
                                    <div className="w-8 text-right text-[15px]">{index + 1}.</div>
                                    <img src={`/bintang-${index < 3 ? 'kuning' : theme === 'dark' ? 'putih' : 'd'}.svg`}
                                        alt="icon" className="h-6 w-6 mx-2" />
                                </div>

                                {/* Username & Link */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-medium truncate">{item?.username}</div>
                                    <div className="text-[10px] text-[#0ED1D6] truncate">
                                        {platform === 'Instagram' ? `https://www.instagram.com/${item?.username}` :
                                            `https://www.tiktok.com/@${item?.username}`}
                                    </div>
                                </div>
                            </div>
                            {/* Skor */}
                            <div className="w-16 text-right">
                                <span className={`${index === 0 ? 'font-bold text-lg' : 'text-sm'}`}>
                                    {scoreFormatter(item?.fair_score)}
                                </span>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopRankingCard;
