"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { buildDatasets, buildLabels, createGradient, groupDataByUsername } from "@/utils/chart";

const FairScoreGraph: React.FC<{ fairScoreData: any; period: any; selectedOptions: any }> = ({
    fairScoreData,
    period,
    selectedOptions,
}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [fairScoreChart, setFairScoreChart] = useState<Chart | null>(null);

    useEffect(() => {
        const labels = buildLabels(period.startDate, period.endDate).map((date: any) => date.format("YYYY-MM-DD"));
        const filterByUsername = selectedOptions?.map((v: any) => v?.value);
        const datasetsBuilderOption = { filterByUsername };

        const dataGroupedByUsername = groupDataByUsername(fairScoreData);
        const datasetsBuilded = buildDatasets(dataGroupedByUsername, labels, datasetsBuilderOption);

        const generateColors = (index: number) => {
            const colors = ["#FFA500", "#FFD700", "#FF4500", "#DA70D6", "#BA55D3"];
            return colors[index % colors.length];
        };

        const datasetsWithColor = datasetsBuilded.map((v: any, index: number) => ({
            ...v,
            backgroundColor: createGradient(chartRef),
            borderColor: generateColors(index),
            pointBackgroundColor: generateColors(index),
        }));

        if (chartRef.current) {
            if (fairScoreChart) fairScoreChart.destroy();
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                const newChart = new Chart(ctx, {
                    type: "line",
                    data: { labels, datasets: datasetsWithColor },
                    options: { responsive: true, maintainAspectRatio: false },
                });
                setFairScoreChart(newChart);
            }
        }
    }, [fairScoreData, selectedOptions, period.startDate, period.endDate]);

    return <canvas ref={chartRef} height="280"></canvas>;
};

export default FairScoreGraph;
