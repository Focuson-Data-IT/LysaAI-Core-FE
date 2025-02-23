"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from "chart.js/auto";
import moment from "moment";
import request from "@/utils/request";
import { buildDatasets, buildLabels, createGradient, generateColors, groupDataByUsername } from "@/utils/chart";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useParams } from "next/navigation";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import TooltipIcon from '@/components/TooltipIcon';
import { IoInformationCircle } from "react-icons/io5";
import { getIconByLabel } from "@/components/ui/iconHelper";



const FairDetailCard = ({ platform, label, description }) => {
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor } = usePerformanceContext();


    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fairScoreChart, setFairScoreChart] = useState<Chart | null>(null);
    const [fairScoreData, setFairScoreData] = useState<any>(null);
    const [options, setOptions] = useState<any>(null);

    const getFairScoreChartData = async () => {
        if (!authUser || !platform || !description) return [];

        const response = await request.get(
            `/getDaily${label}?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`,
        );

        return response.data?.data;
    };

    const drawChart = (labels: any, datasets: any) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");

            if (fairScoreChart) {
                fairScoreChart.destroy();
            }

            if (ctx) {
                const allDataPoints = datasets.flatMap((dataset) => dataset.data);

                const sortedData = [...allDataPoints].sort((a, b) => a - b);
                const median =
                    sortedData.length % 2 === 0
                        ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
                        : sortedData[Math.floor(sortedData.length / 2)];

                const totalSum = allDataPoints.reduce((sum, val) => sum + val, 0);
                const average = totalSum / allDataPoints.length;

                const newChart: any = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        interaction: {
                            mode: "index",
                            axis: "x",
                            intersect: false,
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback(value) {
                                        return `${value} `;
                                    },
                                },
                            },
                            x: {
                                ticks: {
                                    callback: function (value, index, ticks) {
                                        return `${moment(labels[index]).format("DD")}`;
                                    },
                                },
                            },
                        },
                        plugins: {
                            legend: { position: "top", display: false },
                        },
                        elements: {
                            point: {
                                radius: 0,
                                hoverRadius: 4,
                            },
                        },
                    },
                });

                setFairScoreChart(newChart);
            }
        }
    };

    useEffect(() => {
        if (authUser && period && platform) setIsLoading(true); {
            getFairScoreChartData().then((v) => {
                const groupedUsername = Object.entries(groupDataByUsername(v))?.map((e) => {
                    return {
                        label: e[0],
                        value: e[0]
                    }
                });
                setFairScoreData(v);
                setOptions(groupedUsername)
                setIsLoading(false);
            });
        }
    }, [authUser, period, platform]);

    useEffect(() => {
        const dateArray = buildLabels(period?.start, period?.end);
        const labels = dateArray.map((date: any) => date.format("YYYY-MM-DD"));


        const filterByUsername: any = selectedCompetitor?.map((v: any) => {
            return v?.value;
        });

        let datasetsBuilderOption = {
            filterByUsername: filterByUsername,
        };

        const dataGroupedByUsername = groupDataByUsername(fairScoreData)

        let datasetsBuilded = buildDatasets(
            dataGroupedByUsername,
            labels,
            datasetsBuilderOption,
        );

        const datasetsWithColor = datasetsBuilded?.filter((v: any)=>v.label == selectedAccount).map((v: any, index: number) => {
            return {
                ...v,
                backgroundColor: createGradient(chartRef),
                // HEX 33 equivalent to 0.2 opacity. src: https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba
                // TODO: Kalo ingin warnanya sama, harus sorting selectedCompetitor berdasarkan FAIR SCORE pada saat setSelectedCompetitor di context
                borderColor: v.label == selectedAccount ? generateColors(index) : generateColors(index, "33"),
                pointBackgroundColor: generateColors(index),
            };
        });

        drawChart(labels, datasetsWithColor);

    }, [fairScoreData, selectedAccount, selectedCompetitor]);

    if (!authUser || !period || !platform || !label || !description) {
        return <OurLoading />;
    }

    return (
        <div className="h-[300px] lg:col-span-6 rounded-lg bg-gray-100 dark:bg-gray-900 p-3 transition-colors">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {/* Panggil fungsi getIconByLabel untuk menampilkan ikon sesuai label */}
                    {getIconByLabel(label) ?? (
                        <img src="/icon-circle.png" alt="default_icon" className="h-7" />
                    )}
                    <div className="font-bold mx-3">
                        {label}
                    </div>
                    {description && (
                        <TooltipIcon description={description}>
                            <IoInformationCircle size={18} className="cursor-pointer text-gray-500" />
                        </TooltipIcon>
                    )}
                </div>
            </div>

            {/* Data Section */}
            <div className="h-[250px] flex items-center justify-center">
                <div className="my-3 w-full text-center text-muted-foreground">
                    {
                        isLoading ? (
                            <div className="flex items-center justify-center h-full items-center">
                                <OurLoading />
                            </div>
                        ) : fairScoreData.length === 0 ? (
                            <div className="flex items-center justify-center h-full items-center">
                                <OurEmptyData width={100} />
                            </div>
                        ) : selectedAccount == null ? (
                            <div className="flex items-center justify-center h-full items-center">
                                <p className={"text-sm"}>Please fill your account first</p>
                            </div>
                        ) :
                            <canvas
                                id="fairScoreCanvas"
                                ref={chartRef}
                                height="200"
                            ></canvas>
                    }
                </div>
            </div>
        </div>
    );
};

export default FairDetailCard;
