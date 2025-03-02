"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { primaryColors } from "@/constant/PerfomanceContants";

const BarChart = ({ data, selectedCompetitor, selectedAccount }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || selectedCompetitor.length === 0) return;

        if (chartInstanceRef.current) chartInstanceRef.current.dispose();

        const chart = echarts.init(chartRef.current);
        chartInstanceRef.current = chart;

        const labels = selectedCompetitor.map(comp => comp.value);
        const datasetData = labels.map(label =>
            data.filter(d => d.username === label).reduce((sum, d) => sum + d.value, 0)
        );

        const options = {
            title: { text: "Interaction Rate (Log Scale)" },
            tooltip: { 
                trigger: "item",
                formatter: (params) => `${params.name}: ${params.value}`
            },
            grid: { left: 50, right: 30, bottom: 50, containLabel: true },
            toolbox: { 
                feature: { saveAsImage: {} } // 🔥 Tambahkan fitur save image langsung dari toolbox
            },
            xAxis: { 
                type: "category", 
                data: labels,
                axisLabel: { rotate: 0 } 
            },
            yAxis: { 
                type: "log",
                min: value => Math.max(1, Math.floor(value.min * 0.9)),
                max: value => Math.ceil(value.max * 1.1),  
                axisLabel: {
                    formatter: (value) => {
                        if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
                        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                        if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                        return value;
                    }
                }
            },
            series: [
                {
                    name: "Interactions",
                    type: "bar",
                    barWidth: 30,
                    data: labels.map((label, index) => ({
                        value: datasetData[index],
                        name: label,
                        itemStyle: { 
                            color: label === selectedAccount 
                                ? primaryColors[0] 
                                : primaryColors[index + 1] || primaryColors[1] 
                        }
                    }))
                }
            ]
        };

        chart.setOption(options);
        return () => chart.dispose();
    }, [data, selectedCompetitor, selectedAccount]);

    return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default BarChart;
