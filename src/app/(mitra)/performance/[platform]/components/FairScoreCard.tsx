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
        if (chartRef && chartRef.current) {
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
    
            if (!data.datasets || data.datasets.length === 0 || !data.datasets[0].data) {
                console.error("Invalid dataset in drawPieChart", data);
                return;
            }
    
            const limitedPieDatasets = data.datasets[0]?.data?.slice(0, 5) || [];
            console.info("Drawing chart with data:", data);
    
            const newChart: any = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: data.labels.slice(0, 5), // Batasi hanya 5 label teratas
                    datasets: [
                        {
                            label: "Followers",
                            data: limitedPieDatasets,
                            backgroundColor: data.datasets[0].backgroundColor.slice(0, 5), // Pastikan warna sesuai data yang terbatas
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
    };     

    const drawRadarChart = (indicators, datasets) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");
    
            if (fairScoreChart) {
                fairScoreChart.destroy();
            }
    
            if (!indicators || indicators.length === 0 || datasets.every(ds => ds.data.length === 0)) {
                console.error("Invalid data for Radar Chart", { indicators, datasets });
                return;
            }
    
            console.info("Drawing Radar Chart with Data:", { indicators, datasets });
    
            const newChart = new Chart(ctx, {
                type: "radar",
                data: {
                    labels: indicators.map(ind => ind.name), // Pakai username sebagai indikator
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            suggestedMax: Math.max(...datasets[0].data) || 10,
                            grid: {
                                color: "#666", // Warna grid lebih terang agar kontras di dark mode
                                lineWidth: 0.5, // Bisa diatur ketebalan grid
                            },
                            angleLines: {
                                color: "#666", // Garis sudut pada radar chart
                                lineWidth: 0.5,
                            },
                            ticks: {
                                color: "#AAA", // Warna angka pada sumbu agar lebih terlihat
                                backdropColor: "rgba(0,0,0,0)", // Hilangkan background angka
                            }
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                            position: 'bottom',
                            labels: {
                                color: "#FFF", // Warna teks legend agar cocok di dark mode
                            }
                        },
                    },
                }
            });
    
            setFairScoreChart(newChart);
        }
    };        

    const drawBarChart = (labels, datasets) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");
    
            if (fairScoreChart) {
                fairScoreChart.destroy();
            }
    
            if (!labels || labels.length === 0 || datasets.every(ds => ds.data.every(value => value === 0))) {
                console.error("Invalid data for Bar Chart", { labels, datasets });
                return;
            }
    
            if (ctx) {
                const newChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: labels, // ✅ Gunakan username sebagai label sumbu X
                        datasets: datasets.map((dataset, index) => ({
                            ...dataset,
                            backgroundColor: dataset.backgroundColor || primaryColors[index % primaryColors.length],
                            borderColor: dataset.borderColor || primaryColors[index % primaryColors.length],
                            borderWidth: 2,
                            barThickness: 30,
                        })),
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: "index",
                            intersect: false,
                        },
                        animation: {
                            duration: 800,
                            easing: "easeOutCubic",
                        },
                        elements: {
                            bar: {
                                borderRadius: 5,
                            },
                        },
                        plugins: {
                            legend: {
                                display: datasets.length > 0,
                                position: 'bottom',
                                labels: {
                                    color: "#FFF",
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        let value = tooltipItem.raw;
                                        if (typeof value === 'number' && value > 0) {
                                            return `${tooltipItem.label}: ${value}`;
                                        }
                                        return null; // Jika 0, tidak ditampilkan
                                    },
                                },
                                filter: function (tooltipItem) {
                                    return typeof tooltipItem.raw === 'number' && tooltipItem.raw > 0; // Hanya tampilkan yang nilainya > 0
                                },
                            },
                        },
                        scales: {
                            y: {
                                type: "logarithmic",
                                ticks: {
                                    callback(value) {
                                        const numericValue = Number(value);
                                        if (numericValue >= 1_000_000_000) return (numericValue / 1_000_000_000).toFixed(0) + "B";
                                        if (numericValue >= 1_000_000) return (numericValue / 1_000_000).toFixed(0) + "M";
                                        if (numericValue >= 1_000) return (numericValue / 1_000).toFixed(0) + "K";
                                        return value; // Nilai di bawah 1000 tampilkan angka aslinya
                                    },
                                    color: "#FFF",
                                },
                                grid: {
                                    color: "#666",
                                },
                            },
                            x: {
                                grid: {
                                    color: "transparent",
                                },
                                ticks: {
                                    color: "#FFF",
                                },
                            },
                        },
                    },
                });
    
                setFairScoreChart(newChart);
            }
        }
    };
    
    const drawBarChartHorizontal = (labels, datasets) => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current?.getContext("2d");
    
            if (fairScoreChart) {
                fairScoreChart.destroy();
            }
    
            if (!labels || labels.length === 0 || !datasets || datasets.length === 0) {
                console.error("❌ Invalid data for Horizontal Bar Chart", { labels, datasets });
                return;
            }
    
            console.log("✅ Rendering Horizontal Bar Chart with data:", { labels, datasets });
    
            if (ctx) {
                const newChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: labels, // ✅ Username di sumbu Y
                        datasets: datasets.map((dataset, index) => ({
                            ...dataset,
                            backgroundColor: dataset.backgroundColor || primaryColors[index % primaryColors.length],
                            borderColor: dataset.borderColor || primaryColors[index % primaryColors.length],
                            borderWidth: 2,
                            barThickness: 30,
                        })),
                    },
                    options: {
                        indexAxis: "y", // ✅ Horizontal Bar Chart
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: "index",
                            intersect: false,
                        },
                        animation: {
                            duration: 800,
                            easing: "easeOutCubic",
                        },
                        elements: {
                            bar: {
                                borderRadius: 5,
                            },
                        },
                        plugins: {
                            legend: {
                                display: datasets.length > 0,
                                position: 'bottom',
                                labels: {
                                    color: "#FFF",
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        let value = tooltipItem.raw;
                                        if (typeof value === 'number') {
                                            return `${tooltipItem.label}: ${value}`;
                                        }
                                        return null;
                                    },
                                },
                                filter: function (tooltipItem) {
                                    return typeof tooltipItem.raw === 'number' && tooltipItem.raw > 0; // Hanya tampilkan yang nilainya > 0
                                },
                            },
                        },
                        scales: {
                            y: {
                                grid: {
                                    color: "#666",
                                },
                                ticks: {
                                    color: "#FFF",
                                },
                            },
                            x: {
                                type: "logarithmic",
                                ticks: {
                                    callback(value) {
                                        const numericValue = Number(value);
                                        if (numericValue >= 1_000_000_000) return (numericValue / 1_000_000_000).toFixed(0) + "B";
                                        if (numericValue >= 1_000_000) return (numericValue / 1_000_000).toFixed(0) + "M";
                                        if (numericValue >= 1_000) return (numericValue / 1_000).toFixed(0) + "K";
                                        return value;
                                    },
                                    color: "#FFF",
                                },
                                grid: {
                                    color: "transparent",
                                },
                            },
                        },
                    },
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
                if (!fairScoreData || fairScoreData.length === 0) {
                    console.error("fairScoreData is empty or undefined", fairScoreData);
                    return;
                }
            
                console.log("Raw Fair Score Data:", fairScoreData);
            
                const filterByUsername = selectedCompetitor.map((v) => v.value);
            
                if (!filterByUsername || filterByUsername.length === 0) {
                    console.error("selectedCompetitor is empty", selectedCompetitor);
                    return;
                }
            
                let datasetsBuilderOption = { filterByUsername };
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
            
                console.log("Grouped Data:", dataGroupedByUsername);
            
                const datasetsBuilded = selectedCompetitor
                    .map((comp) => {
                        const username = comp.value;
                        return {
                            label: username,
                            data: [
                                Array.isArray(dataGroupedByUsername[username])
                                    ? dataGroupedByUsername[username].reduce((acc, val) => acc + (val.value || 0), 0)
                                    : 0
                            ],
                        };
                    })
                    .filter((dataset) => dataset.data[0] > 0); // Hapus dataset yang tidak memiliki data
            
                console.log("Updated Datasets Built:", datasetsBuilded);
            
                if (!datasetsBuilded || datasetsBuilded.length === 0) {
                    console.error("datasetsBuilded is empty or null", datasetsBuilded);
                    return;
                }
            
                console.log("Datasets Built:", datasetsBuilded);
            
                const datasetsWithColor = datasetsBuilded.map((v, index) => ({
                    ...v,
                    backgroundColor: v.label === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                    borderColor: v.label === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                    pointBackgroundColor: v.label === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                    borderWidth: v.label === selectedAccount ? 5 : 3,
                }));
            
                console.log("Datasets with Color:", datasetsWithColor);
            
                drawPieChart({
                    labels: datasetsWithColor.map((d) => d.label),
                    datasets: [{
                        data: datasetsWithColor.map((d) => d.data[0]), // Pastikan hanya data yang dipilih yang masuk ke Pie Chart
                        backgroundColor: datasetsWithColor.map((d) => d.backgroundColor),
                    }]
                });
            
                console.log("Final Data for Pie Chart:", {
                    labels: datasetsWithColor.map((d) => d.label),
                    datasets: [{
                        data: datasetsWithColor.map((d) => d.data[0]),
                        backgroundColor: datasetsWithColor.map((d) => d.backgroundColor),
                    }]
                });
            }                                                      
            
            if (activeTab === "Activities") {
                const filterByUsername = selectedCompetitor.map((v) => v.value);
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
            
                console.log("Grouped Data for Radar Chart:", dataGroupedByUsername);
            
                // **Gunakan username sebagai indikator dinamis**
                const indicators = selectedCompetitor.map((comp) => ({
                    name: comp.value, 
                    max: Math.max(...Object.values(dataGroupedByUsername).flatMap((user: any) => user.map((d: any) => d.value))) || 10 // Gunakan nilai maksimum untuk skala
                }));
            
                // **Buat datasets dengan nilai sesuai username**
                const datasetsBuilded = [
                    {
                        label: "Performance Score",
                        data: selectedCompetitor.map((comp) => {
                            return dataGroupedByUsername[comp.value] 
                                ? dataGroupedByUsername[comp.value].reduce((acc, val) => acc + (val.value || 0), 0) 
                                : 0;
                        }),
                        backgroundColor: primaryColors[0] + "20",
                        borderColor: primaryColors[0],
                        pointBackgroundColor: primaryColors[0],
                        pointBorderColor: "#ffffff",
                        pointHoverBackgroundColor: primaryColors[0],
                        pointHoverBorderColor: "#ffffff",
                        borderWidth: 2
                    }
                ];
            
                console.log("Datasets Built for Radar:", datasetsBuilded);
                console.log("Indicators:", indicators);
            
                if (!datasetsBuilded || datasetsBuilded.length === 0) {
                    console.error("datasetsBuilded is empty or null", datasetsBuilded);
                    return;
                }
            
                drawRadarChart(indicators, datasetsBuilded);
            }                        
            
            if (activeTab === "Interactions") {
                if (!fairScoreData || fairScoreData.length === 0) {
                    console.error("⚠️ fairScoreData is empty or undefined", fairScoreData);
                    return;
                }
            
                console.log("🔍 Raw Fair Score Data:", fairScoreData);
            
                const filterByUsername = selectedCompetitor.map((v) => v.value);
            
                if (!filterByUsername || filterByUsername.length === 0) {
                    console.error("⚠️ selectedCompetitor is empty", selectedCompetitor);
                    return;
                }
            
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
            
                console.log("🔍 Grouped Data for Bar Chart:", dataGroupedByUsername);
            
                // ✅ **Pastikan semua username terdaftar sebagai label di sumbu X**
                const labels = selectedCompetitor.map((comp) => comp.value);
            
                let datasetsBuilded = selectedCompetitor.map((comp, index) => {
                    const username = comp.value;
            
                    // ✅ **Setiap dataset harus memiliki data untuk setiap username yang dipilih**
                    const data = labels.map((label) =>
                        dataGroupedByUsername[username] && label === username
                            ? dataGroupedByUsername[username].reduce((acc, val) => acc + (val.value || 0), 0)
                            : 0
                    );
            
                    return {
                        label: username,
                        data: data, // ✅ Data harus mencakup semua username di sumbu X
                        backgroundColor: username === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                        borderColor: username === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                        pointBackgroundColor: username === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                        borderWidth: username === selectedAccount ? 5 : 3,
                        barThickness: 30,
                    };
                });
            
                console.log("✅ Updated Datasets Built:", datasetsBuilded);
            
                if (!datasetsBuilded || datasetsBuilded.length === 0) {
                    console.error("⚠️ datasetsBuilded is empty or null", datasetsBuilded);
                    return;
                }
            
                console.log("✅ Datasets Built:", datasetsBuilded);
            
                drawBarChart(labels, datasetsBuilded);
            }                                                                        
            
            if (activeTab === "Responsiveness") {
                if (!fairScoreData || fairScoreData.length === 0) {
                    console.error("⚠️ fairScoreData is empty or undefined", fairScoreData);
                    return;
                }
            
                console.log("🔍 Raw Fair Score Data:", fairScoreData);
            
                const filterByUsername = selectedCompetitor.map((v) => v.value);
            
                if (!filterByUsername || filterByUsername.length === 0) {
                    console.error("⚠️ selectedCompetitor is empty", selectedCompetitor);
                    return;
                }
            
                const dataGroupedByUsername = groupDataByUsername(fairScoreData);
            
                console.log("🔍 Grouped Data for Bar Chart:", dataGroupedByUsername);
            
                // ✅ **Pastikan semua username terdaftar sebagai label di sumbu Y (karena horizontal)**
                const labels = selectedCompetitor.map((comp) => comp.value);
            
                if (!labels || labels.length === 0) {
                    console.error("⚠️ Labels array is empty, cannot render chart.");
                    return;
                }
            
                let datasetsBuilded = selectedCompetitor.map((comp, index) => {
                    const username = comp.value;
            
                    // ✅ **Setiap dataset harus memiliki data untuk setiap username yang dipilih**
                    const data = labels.map((label) =>
                        label === username && dataGroupedByUsername[username]
                            ? dataGroupedByUsername[username].reduce((acc, val) => acc + (val.value || 0), 0)
                            : 0
                    );
            
                    return {
                        label: username,
                        data: data, // ✅ Data harus mencakup semua username di sumbu Y
                        backgroundColor: username === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                        borderColor: username === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                        pointBackgroundColor: username === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
                        borderWidth: username === selectedAccount ? 5 : 3,
                        barThickness: 30,
                    };
                });
            
                console.log("✅ Updated Datasets Built:", datasetsBuilded);
            
                if (!datasetsBuilded || datasetsBuilded.length === 0) {
                    console.error("⚠️ DatasetsBuilded is empty, skipping chart rendering.");
                    return;
                }
            
                const allZero = datasetsBuilded.every(ds => ds.data.every(value => value === 0));
                if (allZero) {
                    console.warn("⚠️ All dataset values are 0, but rendering chart anyway.");
                }
            
                console.log("✅ Final Datasets for Rendering:", datasetsBuilded);
            
                drawBarChartHorizontal(labels, datasetsBuilded);
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
