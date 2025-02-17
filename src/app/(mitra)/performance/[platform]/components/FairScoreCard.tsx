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
                    data: {
                        labels: labels,
                        datasets: datasets,
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: "x",
                            axis: "x",
                            intersect: false,
                        },
                        animation: {
                            duration: 1000,
                            easing: "easeOutCubic",
                        },
                        elements: {
                            line: {
                                tension: 0.4,
                                borderWidth: 2,
                            },
                            point: {
                                radius: 0,
                            },
                        },
                        plugins: {
                            legend: {
                                display: false, // Sembunyikan legenda
                            },
                            tooltip: {
                                enabled: false, // Nonaktifkan tooltip
                            },
                        },
                        layout: {
                            padding: {
                                top: 20, // Tambahan ruang di atas grafik
                                right: 20, // Tambahan ruang ke kanan
                            },
                        },
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
                                    callback: function (value, index) {
                                        return `${moment(labels[index]).format("DD")}`;
                                    },
                                },
                            },
                        },
                    },
                    plugins: [
                        {
                            id: "customLabels", // Plugin kustom untuk menambahkan label
                            afterDatasetsDraw(chart) {
                                const { ctx } = chart;
                                ctx.save();
                                const datasets = chart.data.datasets;
                                const chartArea = chart.chartArea; // Area grafik tanpa padding

                                datasets.forEach((dataset, datasetIndex) => {
                                    const lastPoint = dataset.data[dataset.data.length - 1]; // Ambil data terakhir
                                    const meta = chart.getDatasetMeta(datasetIndex);

                                    if (meta.data.length) {
                                        const lastElement = meta.data[meta.data.length - 1]; // Ambil titik/elemen poin data terakhir
                                        const x = lastElement.x; // Koordinat horizontal titik terakhir
                                        const y = lastElement.y - 10; // Posisikan label sedikit di atas garis (-10 px)

                                        ctx.font = "12px Arial"; // Font untuk label
                                        ctx.fillStyle = dataset.borderColor.toString() || "black"; // Warna label sesuai garis
                                        ctx.textAlign = "center"; // Posisi teks di tengah
                                        ctx.textBaseline = "bottom"; // Tampilan teks di atas titik terakhir

                                        // Gambar label tepat di atas grafik
                                        ctx.fillText(
                                            dataset.label || `Data ${datasetIndex + 1}`, // Label yang akan ditampilkan
                                            x,
                                            y
                                        );
                                    }
                                });

                                ctx.restore();
                            },
                        },
                    ],
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
