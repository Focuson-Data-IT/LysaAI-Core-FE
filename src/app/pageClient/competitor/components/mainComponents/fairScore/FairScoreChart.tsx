"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import request from "@/utils/request";
import FairScoreGraph from "./FairScoreGraph";
import FairScoreFilters from "./FairScoreFilters";
import FairScoreLoader from "./FairScoreLoader";
import FairScoreEmptyData from "./FairScoreEmptyData";

const FairScoreChart: React.FC<{ setParentPeriod: any; setParentSelectedOption: any }> = ({
    setParentPeriod,
    setParentSelectedOption
}) => {
    const user = JSON.parse(localStorage.getItem("user")) || null;

    const [period, setPeriod] = useState({
        startDate: moment().toDate(),
        endDate: moment().toDate(),
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [fairScoreData, setFairScoreData] = useState<any>(null);
    // const [datasets, setDatasets] = useState<any>(null);
    const [selectedOptions, setSelectedOptions] = useState<Array<{ label: string; value: string }> | null>(null);
    const [permaOptions, setPermaOptions] = useState<Array<{ label: string; value: string }> | null>(null);

    const getFairScoreChartData = async (payload: any) => {
        setLoading(true);
        const response = await request.get(
            `/getFairScores?kategori=${user?.username}&start_date=${moment(payload?.startDate).format("YYYY-MM-DD")}&end_date=${moment(payload?.endDate || payload?.startDate).format("YYYY-MM-DD")}`
        );
        setFairScoreData(response.data?.data);
        setLoading(false);
    };

    useEffect(() => {
        getFairScoreChartData(period);
    }, [period]);

    return (
        <div className="flex w-full flex-col rounded-lg bg-white p-3 dark:bg-darkblack-600 lg:px-8 lg:py-7 h-[400px] shadow-md">
            <FairScoreFilters
                period={period}
                setPeriod={setPeriod}
                setParentPeriod={setParentPeriod}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                permaOptions={permaOptions}
                setPermaOptions={setPermaOptions}
                setParentSelectedOption={setParentSelectedOption}
            />

            {loading ? (
                <FairScoreLoader />
            ) : fairScoreData?.length ? (
                <FairScoreGraph fairScoreData={fairScoreData} period={period} selectedOptions={selectedOptions} />
            ) : (
                <FairScoreEmptyData />
            )}
        </div>
    );
};

export default FairScoreChart;
