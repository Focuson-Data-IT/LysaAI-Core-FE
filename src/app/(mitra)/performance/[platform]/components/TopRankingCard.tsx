import React, {useEffect, useState} from 'react';
import request from "@/utils/request";
import {usePerformanceContext} from "@/context/PerformanceContext";
import moment from "moment";
import {useAuth} from "@/hooks/useAuth";
import {scoreFormatter} from "@/utils/numberFormatter";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";

const TopRankingCard = ({platform = null}) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'dark');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    const { authUser } = useAuth();

    const { period, selectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [fairRankingData, setFairRankingData] = useState(null);

    const getFairRanking = async () => {
        setLoading(true)
        const response = await request.get(`/getFairRanking?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`)

        return response.data?.data;
    }

    useEffect(() => {
        getFairRanking().then((v) => {
            setFairRankingData(v);

            if (selectedCompetitor && selectedCompetitor.length > 0) {
                const filteredData = v.filter((item: any) => {
                    return selectedCompetitor.some((competitor: any) => competitor.value === item.username);
                });
                setFairRankingData(filteredData);
            }

            setLoading(false);
        })
    }, [authUser, platform, period, selectedCompetitor])

    return (
        <div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-900 transition-colors h-full">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="font-bold">Top Ranking</div>
                <div className="mr-1 font-bold">Score</div>
            </div>

            {/* Ranking List */}
            <div className="overflow-y-scroll h-[350px]">
                {
                    loading ? (
                            <div className="flex items-center justify-center h-full">
                                <OurLoading />
                            </div>
                        ) :
                        fairRankingData?.length === 0
                            ?
                            <div className="flex items-center justify-center h-[300px]">
                                <OurEmptyData width={100} />
                            </div>
                            :
                        fairRankingData?.map((item, index) => (
                    <a
                        key={index}
                        href={platform === 'Instagram' ? `https://www.instagram.com/${item?.username}` : `https://www.tiktok.com/@${item?.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <div className="flex items-center">
                            <img src={`/bintang-${index < 3 ? 'kuning' : theme === 'dark' ? 'putih' : 'd'}.svg`} alt="icon" className="h-8" />
                            <div className="ml-3">
                                <div className="text-[12px]">{item?.username}</div>
                                <div className="text-[10px] text-[#0ED1D6]">{platform === 'Instagram' ? `https://www.instagram.com/${item?.username}` : `https://www.tiktok.com/@${item?.username}`}</div>
                            </div>
                        </div>
                        <div className={`${index === 0 ? 'font-bold text-lg' : 'text-sm'}`}>{scoreFormatter(item?.fair_score)}</div>
                    </a>
                ))
                }
            </div>
        </div>
    );
};

export default TopRankingCard;
