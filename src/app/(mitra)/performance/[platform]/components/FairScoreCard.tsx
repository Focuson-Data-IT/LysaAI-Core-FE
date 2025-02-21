"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from "chart.js/auto";
import moment from "moment";
import request from "@/utils/request";
import { buildDatasets, buildDatasetsPie, buildLabels, createGradient, groupDataByUsername } from "@/utils/chart";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useParams } from "next/navigation";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import { AxiosResponse } from 'axios';
import TooltipIcon from '@/components/TooltipIcon';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoInformationCircle } from "react-icons/io5";

const FairScoreCard = ({ platform, description }) => {
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor } = usePerformanceContext();


    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fairScoreChart, setFairScoreChart] = useState<Chart | null>(null);
    const [fairScoreData, setFairScoreData] = useState<any>(null);
    const [options, setOptions] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>("FAIR");


    const getFairScoreChartData = async (label: string) => {
        if (!authUser || !period || !platform || !description) return [];
        let response: AxiosResponse<any, any>;
        if (activeTab == "FAIR") {

            response = await request.get(
                `/getFairScores?kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}&platform=${platform}`,
            );
        } else {
            response = await request.get(
                `/getDaily${label}?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`,
            );
        }


        return response.data?.data;
    };

    const drawLineChart = (labels: any, datasets: any) => {
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
                                display: false,
                            },
                            tooltip: {
                                enabled: false,
                            },
                        },
                        layout: {
                            padding: {
                                top: 20,
                                right: 20,
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
                            id: "customLabels",
                            afterDatasetsDraw(chart) {
                                const { ctx } = chart;
                                ctx.save();
                                const datasets = chart.data.datasets;
                                const chartArea = chart.chartArea;

                                datasets.forEach((dataset, datasetIndex) => {
                                    const lastPoint = dataset.data[dataset.data.length - 1];
                                    const meta = chart.getDatasetMeta(datasetIndex);

                                    if (meta.data.length) {
                                        const lastElement = meta.data[meta.data.length - 1];
                                        const x = lastElement.x;
                                        const y = lastElement.y - 10;

                                        ctx.font = "12px Arial";
                                        ctx.fillStyle = dataset.borderColor.toString() || "black";
                                        ctx.textAlign = "center";
                                        ctx.textBaseline = "bottom";

                                        ctx.fillText(
                                            dataset.label || `Data ${datasetIndex + 1}`,
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

    const drawPieChart = (
        data: {
            labels: any;
            datasets: {
                data: any;
                backgroundColor: string[];
            }[],
        },
    ) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");

            if (fairScoreChart) {
                fairScoreChart.destroy();
            }

            if (ctx) {
                const newChart: any = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: "Followers",
                                data: data.datasets[0].data,
                                backgroundColor: data.datasets[0].backgroundColor,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                                position: 'bottom',
                            },
                        }
                    }
                });
                setFairScoreChart(newChart);
            }
        }
    };

    const drawRadarChart = (
        labels: any,
        datasets: {
            data: any;
            backgroundColor: string;
            borderColor: string;
            pointBackgroundColor: string;
            pointBorderColor: string;
            pointHoverBackgroundColor: string;
            pointHoverBorderColor: string;
        }[],

    ) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");
            if (fairScoreChart) {
                fairScoreChart.destroy();
            }
            console.log('data radar', datasets)
            const newChart = new Chart(ctx, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                            position: 'bottom',
                        },
                    },
                },
            });
            setFairScoreChart(newChart);
        }
    };

    const drawBarChart = (labels: any, datasets: any) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");

            if (fairScoreChart) {
                fairScoreChart.destroy();
            }

            if (ctx) {
                const newChart: any = new Chart(ctx, {
                    type: "bar",
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
                                display: false,
                                position: 'bottom',
                            },
                        },
                        layout: {
                            padding: {
                                top: 20,
                                right: 20,
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
                });
                setFairScoreChart(newChart);
            }
        }
    };


    const drawPolarChart = (
        data: {
            labels: any;
            datasets: {
                data: any;
                backgroundColor: string[];
            }[],
        },
    ) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");

            if (fairScoreChart) {
                fairScoreChart.destroy();
            }

            if (ctx) {
                const newChart: any = new Chart(ctx, {
                    type: "polarArea",
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: "Responsiveness",
                                data: data.datasets[0].data,
                                backgroundColor: data.datasets[0].backgroundColor,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                                position: 'bottom',
                            },
                        }
                    }
                });
                setFairScoreChart(newChart);
            }
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        console.log(`Tab switched to: ${tab}`);
    };

    useEffect(() => {
        // I = Interactions
        // R = Responsiveness

        if (authUser && period && platform) setIsLoading(true); {
            getFairScoreChartData(activeTab).then((v) => {
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
    }, [authUser, period, platform, activeTab]);

    useEffect(() => {
        if (selectedAccount) {
            if (activeTab == "FAIR") {
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

                const generateColors = (index, opacity?) => {
                    const primaryColors = [
                        "#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
                    ];

                    return index < primaryColors.length ? primaryColors[index] + (opacity ? opacity : "") : "#BDC3C7" + (opacity ? opacity : "");
                };

                const datasetsWithColor = datasetsBuilded?.map((v: any, index: number) => {
                    return {
                        ...v,
                        backgroundColor: createGradient(chartRef),
                        // HEX 33 equivalent to 0.2 opacity. src: https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba
                        borderColor: v.label == selectedAccount ? generateColors(index) : generateColors(index, "33"),
                        pointBackgroundColor: generateColors(index),
                    };
                });

                const limitDatasets = datasetsWithColor.slice(0, 5);

                drawLineChart(labels, selectedCompetitor.length > 5 ? datasetsWithColor : limitDatasets);
            }

            if (activeTab == "Followers") {
                const filterByUsername: any = selectedCompetitor?.map((v: any) => {
                    return v?.value;
                });

                let datasetsBuilderOption = {
                    filterByUsername: filterByUsername,
                };

                const dataGroupedByUsername = groupDataByUsername(fairScoreData)

                let datasetsBuilded = buildDatasetsPie(
                    dataGroupedByUsername,
                    datasetsBuilderOption,
                );
                const generateColors = (index, opacity?) => {
                    const primaryColors = [
                        "#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
                    ];

                    return index < primaryColors.length ? primaryColors[index] + (opacity ? opacity : "") : "#BDC3C7" + (opacity ? opacity : "");
                };

                const limitDatasets = {
                    labels: datasetsBuilded.labels.slice(0, 5),
                    datasets: [{
                        backgroundColor: datasetsBuilded.datasets[0].backgroundColor.map((_, index) => {
                            return datasetsBuilded.labels[index] == selectedAccount ? generateColors(index) : generateColors(index, "33")
                        }
                        ),
                        data: datasetsBuilded.datasets[0].data.slice(0, 5)
                    }]
                };

                drawPieChart(selectedCompetitor.length > 5 ? datasetsBuilded : limitDatasets);
            }

            if (activeTab == "Activities") {
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

                const generateColors = (index, opacity?) => {
                    const primaryColors = [
                        "#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
                    ];

                    return index < primaryColors.length ? primaryColors[index] + (opacity ? opacity : "") : "#BDC3C7" + (opacity ? opacity : "");
                };

                const datasetsWithColor = datasetsBuilded?.map((v: any, index: number) => {
                    return {
                        label: v.label,
                        data: v.data,
                        fill: true,
                        backgroundColor: v.label == selectedAccount ? generateColors(index, "B3") : generateColors(index, "20"),
                        borderColor: v.label == selectedAccount ? generateColors(index, "B3") : generateColors(index, "20"),
                    };
                });
                const limitDatasets = datasetsWithColor.slice(0, 5);
                drawRadarChart(labels, selectedCompetitor.length > 5 ? datasetsBuilded : limitDatasets);
            }

            if (activeTab == "Interactions") {
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

                const generateColors = (index, opacity?) => {
                    const primaryColors = [
                        "#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
                    ];

                    return index < primaryColors.length ? primaryColors[index] + (opacity ? opacity : "") : "#BDC3C7" + (opacity ? opacity : "");
                };

                const datasetsWithColor = datasetsBuilded?.map((v: any, index: number) => {
                    return {
                        ...v,
                        backgroundColor: createGradient(chartRef),
                        // HEX 33 equivalent to 0.2 opacity. src: https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba
                        borderColor: v.label == selectedAccount ? generateColors(index) : generateColors(index, "33"),
                        pointBackgroundColor: generateColors(index),
                    };
                });

                const limitDatasets = datasetsWithColor.slice(0, 5);

                drawBarChart(labels, selectedCompetitor.length > 5 ? datasetsWithColor : limitDatasets);
            }

            if (activeTab == "Responsiveness") {
                const filterByUsername: any = selectedCompetitor?.map((v: any) => {
                    return v?.value;
                });

                let datasetsBuilderOption = {
                    filterByUsername: filterByUsername,
                };

                const dataGroupedByUsername = groupDataByUsername(fairScoreData)

                let datasetsBuilded = buildDatasetsPie(
                    dataGroupedByUsername,
                    datasetsBuilderOption,
                );
                const generateColors = (index, opacity?) => {
                    const primaryColors = [
                        "#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
                    ];

                    return index < primaryColors.length ? primaryColors[index] + (opacity ? opacity : "") : "#BDC3C7" + (opacity ? opacity : "");
                };

                const limitDatasets = {
                    labels: datasetsBuilded.labels.slice(0, 5),
                    datasets: [{
                        backgroundColor: datasetsBuilded.datasets[0].backgroundColor.map((_, index) => {
                            return datasetsBuilded.labels[index] == selectedAccount ? generateColors(index) : generateColors(index, "33")
                        }
                        ),
                        borderColor: '#00FF00',
                        data: datasetsBuilded.datasets[0].data.slice(0, 5)
                    }]
                };

                drawPolarChart(selectedCompetitor.length > 5 ? datasetsBuilded : limitDatasets);
            }
        }
    }, [fairScoreData, selectedAccount, selectedCompetitor, activeTab]);

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

    const tabDescriptions: { [key: string]: string } = {
        FAIR: "Total weights of the indicators that are used to measure the performance of an account",
        Followers: "Number of followers",
        Activities: "The average post per day",
        Interactions: "The average number of likes per post",
        Responsiveness: "The percentage of netizen comments that are replied to",
    };

    if (!authUser || !period || !platform || !description) {
        return <OurLoading />;
    }

    return (
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3 transition-colors h-full">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    {/* Header dengan Icon & Label */}
                    <div className="flex items-center mb-3">
                        {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
                        <div className="font-bold mx-3">
                            FAIR Score Performance
                        </div>
                        {description && (
                            <TooltipIcon description={description}>
                                <IoInformationCircle size={18} className="cursor-pointer text-gray-500" />
                            </TooltipIcon>
                        )}

                    </div>

                    {/* Tabs di bawah teks FAIR Score */}
                    <div className="flex space-x-4 mb-4">
                        {["FAIR", "Followers", "Activities", "Interactions", "Responsiveness"].map((tab) => (
                            <TooltipIcon key={tab} description={tabDescriptions[tab]}>
                                <button
                                    className={`px-4 py-2 ${activeTab === tab
                                        ? "text-blue-500 border-b-2 border-blue-500"
                                        : "text-gray-500"
                                        }`}
                                    onClick={() => handleTabChange(tab)}
                                >
                                    {tab === "FAIR" ? tab : tab.slice(0, 1)}
                                </button>
                            </TooltipIcon>
                        ))}
                    </div>


                </div>
            </div>


            {/* Data Section */}
            <div className="h-[650px] pt-3 flex items-center justify-center">
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
                                height='600'
                            ></canvas>
                    }
                </div>
            </div>
        </div>
    );
};

export default FairScoreCard;
