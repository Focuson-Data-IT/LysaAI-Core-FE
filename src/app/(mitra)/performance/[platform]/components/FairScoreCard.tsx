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


const FairScoreCard = ({ platform }) => {
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
                        {
                            id: "medianLine",
                            afterDraw(chart) {
                                const {
                                    ctx,
                                    chartArea: { left, right },
                                    scales: { y },
                                } = chart;

                                const yPos = y.getPixelForValue(median);

                                ctx.save();
                                ctx.beginPath();
                                ctx.moveTo(left, yPos);
                                ctx.lineTo(right, yPos);
                                ctx.lineWidth = 2;
                                ctx.setLineDash([5, 5]);
                                ctx.strokeStyle = "#FF0000";
                                ctx.stroke();
                                ctx.restore();

                                ctx.fillStyle = "#FFFFFF";
                                ctx.fillRect(left + 5, yPos - 15, 80, 15);

                                ctx.fillStyle = "#FF0000";
                                ctx.font = "bold 12px Arial";
                                ctx.fillText(`Median: ${median?.toFixed(2)}`, left + 10, yPos - 3);
                            },
                        },
                        {
                            id: "averageLine",
                            afterDraw(chart) {
                                const {
                                    ctx,
                                    chartArea: { left, right },
                                    scales: { y },
                                } = chart;

                                const yPos = y.getPixelForValue(average);

                                ctx.save();
                                ctx.beginPath();
                                ctx.moveTo(left, yPos);
                                ctx.lineTo(right, yPos);
                                ctx.lineWidth = 2;
                                ctx.setLineDash([5, 5]);
                                ctx.strokeStyle = "#008000";
                                ctx.stroke();
                                ctx.restore();

                                const labelWidth = 100;
                                ctx.fillStyle = "#FFFFFF";
                                ctx.fillRect(right - labelWidth - 5, yPos - 15, labelWidth, 15);

                                ctx.fillStyle = "#008000";
                                ctx.font = "bold 12px Arial";
                                ctx.fillText(`Average: ${average?.toFixed(2)}`, right - labelWidth, yPos - 3);
                            },
                        },
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

    return (
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3 transition-colors h-full">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/icon-circle.png" alt="widgets_separator_ticon" className="h-7" />
                    <div className="font-bold mx-3 ">
                        FAIR Score
                    </div>
                </div>

                {/* Buttons */}
                <div className="datepicker-container">

                    <div className="datepicker-wrapper">
                        <OurDatePicker
                            onClick={() => setIsShowDatepicker(!isShowDatepicker)}
                        />
                    </div>
                    <div className="select-wrapper">
                        <OurSelect options={options} disabled={isLoading}
                        />
                    </div>
                </div>
            </div>


            {/* Data Section */}
            <div className="h-[250px] pt-3 flex items-center justify-center">
                <div className="my-3 w-full text-center text-muted-foreground pt-[90px]">
                    <canvas
                        id="fairScoreCanvas"
                        ref={chartRef}
                        height="300"
                    ></canvas>
                </div>
            </div>
        </div >
    );
};

export default FairScoreCard;
