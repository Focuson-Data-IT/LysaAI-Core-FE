"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from "chart.js/auto";
import moment from "moment";
import request from "@/utils/request";
import {
    buildDatasets,
    buildDatasetsPie,
    buildLabels,
    createGradient,
    generateColors,
    groupDataByUsername
} from "@/utils/chart";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import { AxiosResponse } from 'axios';
import TooltipIcon from '@/components/TooltipIcon';
import { IoInformationCircle } from "react-icons/io5";
import { getIconByLabel } from "@/components/ui/iconHelper";
import AiModal from "@/components/AiModal";
import { primaryColors } from "@/constant/PerfomanceContants";

const FairScoreCard = ({ platform, description }) => {
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiData, setAiData] = useState(null);

    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fairScoreChart, setFairScoreChart] = useState<Chart | null>(null);
    const [fairScoreData, setFairScoreData] = useState<any>(null);
    const [options, setOptions] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>("FAIR");
    const [limitDatasets, setLimitDatasets] = useState<any>(null);


    const getFairScoreChartData = async (label: string) => {
        if (!authUser || !period || !platform || !description) return [];
        let response: AxiosResponse<any, any>;
        if (activeTab == "FAIR") {

            response = await request.get(
                `/getFairScores?kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}&platform=${platform}`,
            );
        } else {
            response = await request.get(
                `/get${label}?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`,
            );
        }
        return response.data?.data;
    };

    const fetchAISummary = async () => {
        setIsModalOpen(true); // Langsung tampilkan modal
        setIsLoading(true);   // Set loading saat mulai fetch
        try {
            const response = await request.get(
                `/getFairSummary?username=${selectedAccount}&month=${period.start?.slice(0, 7)}&kategori=disparbud&platform=${platform}`
            );
            setAiData(response.data);
        } catch (err) {
            console.error('Error fetching AI summary:', err);
            setAiData(null);
        } finally {
            setIsLoading(false); // Selesai loading
        }
    };

    const drawLineChart = (labels: any, datasets: any) => {
        if (chartRef && chartRef.current && datasets.data) {
            const ctx = chartRef.current?.getContext("2d");

            if (fairScoreChart) {
                fairScoreChart.destroy();
            }

            if (ctx) {
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
                                enabled: true,
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
                    plugins: [],
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
                const limitedPieDatasets = data.datasets[0].data.slice(0, 5);
                console.info(data)
                // console.info(limitDatasets)

                // limitedPieDatasets
                //     .map(([username, userData]) => {
                //         const totalValue = userData.reduce((sum, item) => sum + parseFloat(String(item.value || 0)), 0);
                //         return { username, totalValue };
                //     })
                //     .sort((a, b) => b.totalValue - a.totalValue)
                //     .slice(0, 10);

                const newChart: any = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: "Followers",
                                data: limitedPieDatasets,
                                backgroundColor: limitedPieDatasets.map((v, index) => {
                                    return limitDatasets[index].borderColor;
                                })
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
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
                            display: true,
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
                                display: true,
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
    };

    useEffect(() => {
        if (authUser && period && platform) {
            setIsLoading(true);
            getFairScoreChartData(activeTab).then((v) => {
                const groupedUsername = Object.entries(groupDataByUsername(v))?.map((e) => {
                    return { value: e[0], label: e[0] };
                });
                setFairScoreData(v);
                setOptions(groupedUsername);
                setIsLoading(false);
            });
        }
    }, [authUser, period, platform, activeTab]);

    useEffect(() => {
        if (fairScoreData && selectedAccount) {
            const groupedUsernames = Object.entries(groupDataByUsername(fairScoreData))?.map(([key]) => key);
    
            const validSelectedCompetitors = selectedCompetitor.filter(comp =>
                groupedUsernames.includes(comp.value)
            );
    
            if (validSelectedCompetitors.length === 0) {
                setSelectedCompetitor([{ label: selectedAccount, value: selectedAccount }]);
            } else if (JSON.stringify(validSelectedCompetitors) !== JSON.stringify(selectedCompetitor)) {
                setSelectedCompetitor(validSelectedCompetitors);
            }
        }
    }, [fairScoreData, selectedAccount]);    

    useEffect(() => {
        if (selectedAccount && fairScoreData) {
            if (activeTab === "FAIR") {
                const dateArray = buildLabels(period?.start, period?.end);
                const labels = dateArray.map((date: any) => date.format("YYYY-MM-DD"));
                const filterByUsername = selectedCompetitor.map((v) => v.value);
    
                let datasetsBuilderOption = { filterByUsername };
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
    
                let datasetsBuilded = buildDatasets(dataGroupedByUsername, labels, datasetsBuilderOption);
    
                const datasetsWithColor = datasetsBuilded.map((v) => {
                    const competitorIndex = selectedCompetitor.findIndex((competitor) => competitor.value === v.label);
                    
                    return {
                        ...v,
                        backgroundColor: createGradient(chartRef),
                        borderColor: v.label === selectedAccount 
                            ? primaryColors[0] 
                            : primaryColors[competitorIndex + 1] || primaryColors[1], // Fallback jika tidak ditemukan
                        pointBackgroundColor: primaryColors[competitorIndex + 1] || primaryColors[1],
                        borderWidth: v.label === selectedAccount ? 5 : 3,
                    };
                });                
    
                drawLineChart(
                    labels,
                    datasetsWithColor.filter((dataset) => 
                        selectedCompetitor.some((comp) => comp.value === dataset.label)
                    )
                );
            }

            if (activeTab === "Followers") {
                const filterByUsername = selectedCompetitor.map((v) => v.value);
                const datasetsBuilderOption = { filterByUsername };
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
            
                let datasetsBuilded = buildDatasetsPie(dataGroupedByUsername, datasetsBuilderOption);
            
                const sortedIndices = datasetsBuilded.labels.slice(0, 5).map(label =>
                    datasetsBuilded.labels.indexOf(label)
                );
            
                const limitDatasets = {
                    labels: sortedIndices.map(index => datasetsBuilded.labels[index]),
                    datasets: [{
                        backgroundColor: sortedIndices.map(index => {
                            const competitorIndex = selectedCompetitor.findIndex((comp) => comp.value === datasetsBuilded.labels[index]);
                            return datasetsBuilded.labels[index] === selectedAccount 
                                ? primaryColors[0] 
                                : primaryColors[competitorIndex + 1] || primaryColors[1];
                        }),
                        data: sortedIndices.map(index => datasetsBuilded.datasets[0].data[index])
                    }]
                };
            
                drawPieChart(selectedCompetitor.length > 5 ? datasetsBuilded : limitDatasets);
            }
            
            if (activeTab === "Activities") {
                const filterByUsername = selectedCompetitor.map((v) => v.value);
                const datasetsBuilderOption = { filterByUsername };
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
                let datasetsBuilded = buildDatasets(dataGroupedByUsername, filterByUsername, datasetsBuilderOption);
            
                const datasetsWithColor = datasetsBuilded.map((v) => {
                    const competitorIndex = selectedCompetitor.findIndex((comp) => comp.value === v.label);
                    return {
                        ...v,
                        backgroundColor: v.label === selectedAccount 
                            ? primaryColors[0] + "B3" 
                            : primaryColors[competitorIndex + 1] || primaryColors[1] + "20",
                        borderColor: v.label === selectedAccount 
                            ? primaryColors[0] + "B3" 
                            : primaryColors[competitorIndex + 1] || primaryColors[1] + "20",
                    };
                });
            
                const limitDatasets = datasetsWithColor.slice(0, 5);
                drawRadarChart(filterByUsername, selectedCompetitor.length > 5 ? datasetsWithColor : limitDatasets);
            }
            
            if (activeTab === "Interactions") {
                const filterByUsername = selectedCompetitor.map((v) => v.value);
                const datasetsBuilderOption = { filterByUsername };
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
                let datasetsBuilded = buildDatasets(dataGroupedByUsername, filterByUsername, datasetsBuilderOption);
            
                const datasetsWithColor = datasetsBuilded.map((v) => {
                    const competitorIndex = selectedCompetitor.findIndex((comp) => comp.value === v.label);
                    return {
                        ...v,
                        backgroundColor: createGradient(chartRef),
                        borderColor: v.label === selectedAccount 
                            ? primaryColors[0] 
                            : primaryColors[competitorIndex + 1] || primaryColors[1] + "33",
                        pointBackgroundColor: primaryColors[competitorIndex + 1] || primaryColors[1],
                    };
                });
            
                const limitDatasets = datasetsWithColor.slice(0, 5);
                drawBarChart(filterByUsername, selectedCompetitor.length > 5 ? datasetsWithColor : limitDatasets);
            }
            
            if (activeTab === "Responsiveness") {
                const filterByUsername = selectedCompetitor.map((v) => v.value);
                const datasetsBuilderOption = { filterByUsername };
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
                let datasetsBuilded = buildDatasetsPie(dataGroupedByUsername, datasetsBuilderOption);
            
                const limitDatasets = {
                    labels: datasetsBuilded.labels.slice(0, 5),
                    datasets: [{
                        backgroundColor: datasetsBuilded.labels.slice(0, 5).map((label) => {
                            const competitorIndex = selectedCompetitor.findIndex((comp) => comp.value === label);
                            return label === selectedAccount 
                                ? primaryColors[0] 
                                : primaryColors[competitorIndex + 1] || primaryColors[1] + "33";
                        }),
                        borderColor: "#00FF00",
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
            <div className="relative w-full">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {/* Kiri */}
                        <div className="flex items-center mb-3">
                            {IconComponent && (
                                <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />
                            )}
                            <div className="font-bold mx-3">
                                FAIR Score Performance
                            </div>
                            {description && (
                                <TooltipIcon description={description}>
                                    <IoInformationCircle size={18} className="cursor-pointer text-gray-500" />
                                </TooltipIcon>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-2 mb-4 border-b border-gray-300">
                            {["FAIR", "Followers", "Activities", "Interactions", "Responsiveness"].map((tab) => (
                                <TooltipIcon key={tab} description={tabDescriptions[tab]}>
                                    <button
                                        className={`px-4 py-2 rounded-t-md font-medium transition-all
                                                ${activeTab === tab
                                                ? "bg-gray-100 dark:bg-gray-800 text-blue-500 border-x border-t border-blue-500 border-b-transparent"
                                                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                        onClick={() => handleTabChange(tab)}
                                        >
                                        {tab === "FAIR" ? tab : tab.slice(0, 1)}
                                    </button>
                                </TooltipIcon>
                            ))}
                        </div>

                    </div>

                    {/* Kanan */}
                    <div className="absolute top-0 right-0">
                        <TooltipIcon description="Summarize the graphic ask Lysa">
                            <button
                                onClick={fetchAISummary}
                                className="flex items-center justify-center p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                disabled={isLoading}
                            >
                                {getIconByLabel("AiGenerate") ?? (
                                    <img src="/icon-circle.png" alt="default_icon" className="h-7" />
                                )}
                            </button>
                        </TooltipIcon>
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
                    {/* Modal untuk AI Summary */}
                    <AiModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        data={aiData}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default FairScoreCard;
