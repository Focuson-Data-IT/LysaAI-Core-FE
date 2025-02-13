"use client";

import React, { useEffect, useState } from "react";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import request from "@/utils/request";
import {usePerformanceContext} from "@/context/PerformanceContext";
import {useAuth} from "@/hooks/useAuth";
import {followersValueFormatter} from "@/utils/numberFormatter";

const FairDetailBar = ({ platform = null, label = null, description = null, unit = null }) => {
    const { authUser } = useAuth();
    const { period, selectedCompetitor } = usePerformanceContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [fairChartData, setFairDetailData] = useState<any>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filteredData, setFilteredData] = useState<any[]>([]);


    const getFairDetailData = async () => {
        const url = `/get${label}?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`;
        const response = await request.get(url);
        const newResponse = response.data?.data?.map((v: any) => {
            return {
                ...v,
                percentage: (v.value / v.max_value) * 100,
            };
        });

        return newResponse;
    };

    const sortData = (v) => {
        if (v) {
            const sortedData = [...v].sort((a, b) =>
                sortOrder === 'asc' ? a.value - b.value : b.value - a.value
            );
            setFairDetailData(sortedData);
        }
    };
    
    useEffect(() => {
        getFairDetailData().then((v) => {
            let filteredData = v;

            setFairDetailData(filteredData);

            if (selectedCompetitor && selectedCompetitor.length > 0) {
                filteredData = v.filter((item: any) => {
                    return selectedCompetitor.some((competitor: any) => competitor.value === item.username);
                });
            }

            sortData(filteredData);

            setLoading(false);
        });
    }, [authUser, period, platform, selectedCompetitor]);

    useEffect(() => {
        sortData(fairChartData);
    }, [sortOrder]);


    return (
        <div className={`flex-1 xl:block shadow-[4px_0_8px_rgba(0,0,0,0.05)]`}>
            <div className="h-full w-full rounded-lg bg-gray-200 dark:bg-gray-900">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <OurLoading />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between border-b border-bgray-300 p-5 py-3 dark:border-darkblack-400">
                            <div
                                className="text-md font-bold text-bgray-900 dark:text-white flex items-center space-x-2">
                                <span className={'font-bold'}>{label}</span>
                                <span className="relative group">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="15"
            height="15"
            viewBox="0,0,256,256"
        >
            <g
                fill="#8f8f8f"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
                style={{mixBlendMode: 'normal'}}
            >
                <g transform="scale(9.84615,9.84615)">
                    <path
                        d="M13,1.1875c-6.52344,0 -11.8125,5.28906 -11.8125,11.8125c0,6.52344 5.28906,11.8125 11.8125,11.8125c6.52344,0 11.8125,-5.28906 11.8125,-11.8125c0,-6.52344 -5.28906,-11.8125 -11.8125,-11.8125zM15.46094,19.49609c-0.60937,0.23828 -1.09375,0.42188 -1.45703,0.54688c-0.36328,0.125 -0.78125,0.1875 -1.26172,0.1875c-0.73437,0 -1.30859,-0.17969 -1.71875,-0.53906c-0.40625,-0.35547 -0.60937,-0.8125 -0.60937,-1.36719c0,-0.21484 0.01563,-0.43359 0.04688,-0.65625c0.02734,-0.22656 0.07813,-0.47656 0.14453,-0.76172l0.76172,-2.6875c0.06641,-0.25781 0.125,-0.5 0.17188,-0.73047c0.04688,-0.23047 0.06641,-0.44141 0.06641,-0.63281c0,-0.33984 -0.07031,-0.58203 -0.21094,-0.71484c-0.14453,-0.13672 -0.41406,-0.20312 -0.8125,-0.20312c-0.19531,0 -0.39844,0.03125 -0.60547,0.08984c-0.20703,0.0625 -0.38281,0.12109 -0.53125,0.17578l0.20313,-0.82812c0.49609,-0.20312 0.97266,-0.375 1.42969,-0.51953c0.45313,-0.14453 0.88672,-0.21875 1.28906,-0.21875c0.73047,0 1.29688,0.17969 1.69141,0.53125c0.39453,0.35156 0.59375,0.8125 0.59375,1.375c0,0.11719 -0.01172,0.32422 -0.03906,0.61719c-0.02734,0.29297 -0.07812,0.5625 -0.15234,0.8125l-0.75781,2.67969c-0.0625,0.21484 -0.11719,0.46094 -0.16797,0.73438c-0.04687,0.27344 -0.07031,0.48438 -0.07031,0.625c0,0.35547 0.07813,0.60156 0.23828,0.73047c0.15625,0.12891 0.43359,0.19141 0.82813,0.19141c0.18359,0 0.39063,-0.03125 0.625,-0.09375c0.23047,-0.06641 0.39844,-0.12109 0.50391,-0.17187zM15.32422,8.61719c-0.35156,0.32813 -0.77734,0.49219 -1.27344,0.49219c-0.49609,0 -0.92578,-0.16406 -1.28125,-0.49219c-0.35547,-0.32812 -0.53125,-0.72656 -0.53125,-1.19141c0,-0.46484 0.17969,-0.86719 0.53125,-1.19922c0.35547,-0.33203 0.78516,-0.49609 1.28125,-0.49609c0.49609,0 0.92188,0.16406 1.27344,0.49609c0.35547,0.33203 0.53125,0.73438 0.53125,1.19922c0,0.46484 -0.17578,0.86328 -0.53125,1.19141z"></path>
                </g>
            </g>
        </svg>
        <span
            className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-[200px] block box-border dark:bg-white/50 bg-black/50 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100"
        >
            {description}
        </span>
    </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                                title="Sort"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18M3 12h12M3 18h6" />
                                </svg>
                            </button>
                        </div>
                        {fairChartData.length ? (
                            <div className="flex flex-col h-[300px] p-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
                                {fairChartData.map((v, key) => (
                                    <div className="flex items-center mb-2" key={key}>
                                        <div className="flex-1">
                                            <div className="mb-2 flex justify-between">
                                                <span className="text-sm font-medium text-bgray-900 dark:text-white">
                                                    {v.username}
                                                </span>
                                                <span className="text-sm font-medium dark:text-white">
                                                    {
                                                        label === 'Followers'
                                                            ?
                                                        followersValueFormatter(v?.value)
                                                            :
                                                            label === 'Activities' || label === 'Interactions' || label === 'Responsiveness'
                                                        ?
                                                                v.value?.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 1,
                                                                    maximumFractionDigits: 1,
                                                                })
                                                                :
                                                            v.value
                                                    } {unit}
                                                </span>
                                            </div>
                                            <div className="relative h-[10px] w-full overflow-hidden rounded bg-bgray-100 dark:bg-gray-700">
                                                <div
                                                    style={{ width: `${v.percentage || 0}%` }}
                                                    className={`absolute left-0 top-0 h-full rounded ${
                                                        (v.percentage ?? 0) <= 30
                                                            ? "bg-red-400"
                                                            : (v.percentage ?? 0) > 30 && (v.percentage ?? 0) <= 60
                                                            ? "bg-yellow-400"
                                                            : "bg-green-400"
                                                    }`}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px]">
                                <OurEmptyData width={100} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FairDetailBar;