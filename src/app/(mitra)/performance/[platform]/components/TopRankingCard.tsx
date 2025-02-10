import React, {useEffect, useState} from 'react';
import request from "@/utils/request";
import {usePerformanceContext} from "@/context/PerformanceContext";
import moment from "moment";
import {useAuth} from "@/hooks/useAuth";

const TopRankingCard = ({platform = null}) => {
    const { authUser } = useAuth();

    const { period, selectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [fairRankingData, setFairRankingData] = useState(null);

    const getFairRanking = async () => {
        setLoading(true);

        console.info(authUser)

        const response = await request.get(`/getFairRanking?platform=${platform}&kategori=${authUser?.username}&start_date=${period}&end_date=${moment(period)?.endOf('month').format("YYYY-MM-DD")}`)
        // const response = await request.get(`/getFairRanking?platform=${platform}&kategori=${user?.username}&start_date=2025-01-01&end_date=2025-01-09`)

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
    }, [platform, period, selectedCompetitor])

    return (
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="font-bold">Top Ranking</div>
                <div className="mr-1 font-bold">Score</div>
            </div>

            {/* Ranking List */}
            <div className="overflow-auto h-[250px]">
                {fairRankingData?.map((item, index) => (
                    <a
                        key={index}
                        href={platform === 'instagram' ? `https://www.instagram.com/${item?.username}` : `https://www.tiktok.com/@${item?.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <div className="flex items-center">
                            <img src="/bintang-d.svg" alt="icon" className="h-8" />
                            <div className="ml-3">
                                <div className="text-[12px]">{item?.username}</div>
                                <div className="text-[10px] text-[#0ED1D6]">{platform === 'instagram' ? `https://www.instagram.com/${item?.username}` : `https://www.tiktok.com/@${item?.username}`}</div>
                            </div>
                        </div>
                        <div className={`${index === 0 ? 'font-bold text-lg' : 'text-sm'}`}>{item?.max_value}</div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default TopRankingCard;
