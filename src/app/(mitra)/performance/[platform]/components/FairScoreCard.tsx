"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from "chart.js/auto";
import moment from "moment";
import request from "@/utils/request";
import { buildDatasets, buildLabels, createGradient, groupDataByUsername } from "@/utils/chart";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useParams } from "next/navigation";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import {FaInstagram, FaTiktok} from "react-icons/fa";


const FairScoreCard = ({ platform, description }) => {
    const { authUser } = useAuth();
    const { period, selectedCompetitor } = usePerformanceContext();


    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fairScoreChart, setFairScoreChart] = useState<Chart | null>(null);
    const [fairScoreData, setFairScoreData] = useState<any>(null);
    const [isShowDatepicker, setIsShowDatepicker] = useState<boolean>(false);
    const [options, setOptions] = useState<any>(null);

    const getFairScoreChartData = async () => {
        setIsLoading(true);

        const response = await request.get(
            `/getFairScores?kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}&platform=${platform}`,
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
                    plugins: [
                        // {
                        //     id: "medianLine",
                        //     afterDraw(chart) {
                        //         const {
                        //             ctx,
                        //             chartArea: { left, right },
                        //             scales: { y },
                        //         } = chart;

                        //         const yPos = y.getPixelForValue(median);

                        //         ctx.save();
                        //         ctx.beginPath();
                        //         ctx.moveTo(left, yPos);
                        //         ctx.lineTo(right, yPos);
                        //         ctx.lineWidth = 2;
                        //         ctx.setLineDash([5, 5]);
                        //         ctx.strokeStyle = "#FF0000";
                        //         ctx.stroke();
                        //         ctx.restore();

                        //         ctx.fillStyle = "#FFFFFF";
                        //         ctx.fillRect(left + 5, yPos - 15, 80, 15);

                        //         ctx.fillStyle = "#FF0000";
                        //         ctx.font = "bold 12px Arial";
                        //         ctx.fillText(`Median: ${median?.toFixed(2)}`, left + 10, yPos - 3);
                        //     },
                        // },
                        // {
                        //     id: "averageLine",
                        //     afterDraw(chart) {
                        //         const {
                        //             ctx,
                        //             chartArea: { left, right },
                        //             scales: { y },
                        //         } = chart;

                        //         const yPos = y.getPixelForValue(average);

                        //         ctx.save();
                        //         ctx.beginPath();
                        //         ctx.moveTo(left, yPos);
                        //         ctx.lineTo(right, yPos);
                        //         ctx.lineWidth = 2;
                        //         ctx.setLineDash([5, 5]);
                        //         ctx.strokeStyle = "#008000";
                        //         ctx.stroke();
                        //         ctx.restore();

                        //         const labelWidth = 100;
                        //         ctx.fillStyle = "#FFFFFF";
                        //         ctx.fillRect(right - labelWidth - 5, yPos - 15, labelWidth, 15);

                        //         ctx.fillStyle = "#008000";
                        //         ctx.font = "bold 12px Arial";
                        //         ctx.fillText(`Average: ${average?.toFixed(2)}`, right - labelWidth, yPos - 3);
                        //     },
                        // },
                    ],
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

        const generateColors = (index) => {
            const primaryColors = [
                "#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
            ];

            return index < primaryColors.length ? primaryColors[index] : "#BDC3C7";
        };

        const datasetsWithColor = datasetsBuilded?.map((v: any, index: number) => {
            return {
                ...v,
                backgroundColor: createGradient(chartRef),
                borderColor: generateColors(index),
                pointBackgroundColor: generateColors(index),
            };
        });

        // untuk pertama kali load fairscoredata tampilkan hanya 5, tetapi tidak membatasi
        //ketika selectedCompetitor bertambah lebih dari 5 akan tetap ditampilkan sesuai jumlah
        //selectedCompetitornya
        const limitDatasets = datasetsWithColor.slice(0, 5);

        // Render chart
        drawChart(labels, selectedCompetitor.length > 5 ? datasetsWithColor : limitDatasets);

        // drawChart(labels, datasetsWithColor);
    }, [fairScoreData, selectedCompetitor]);

    interface IconComponents {
        [key: string]: React.ComponentType;
    }

    const getIconComponent = (platform: string): React.ComponentType | null => {
        const icons: IconComponents = {
            Instagram: FaInstagram,
            TikTok: FaTiktok
        };

        return icons[platform] || null;
    };

    const IconComponent = getIconComponent(platform);

    return (
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3 transition-colors h-full">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
                    <div className="font-bold mx-3 ">
                        FAIR Score
                    </div>
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

                {/* Buttons */}
                {/* <div className="datepicker-container">

                    <div className="datepicker-wrapper">
                        <OurDatePicker
                            onClick={() => setIsShowDatepicker(!isShowDatepicker)}
                        />
                    </div>
                    <div className="select-wrapper">
                        <OurSelect options={options} disabled={isLoading}
                        />
                    </div>
                </div> */}
            </div>


            {/* Data Section */}
            <div className="h-[650px] pt-3 flex items-center justify-center">
                <div className="my-3 w-full text-center text-muted-foreground">
                    <canvas
                        id="fairScoreCanvas"
                        ref={chartRef}
                        height="600"
                    ></canvas>
                </div>
            </div>
        </div >
    );
};

export default FairScoreCard;
