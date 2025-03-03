"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { primaryColors } from "@/constant/PerfomanceContants";

const HorizontalBarChart = ({ data, selectedCompetitor, selectedAccount }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || selectedCompetitor.length === 0) return;

        const chart = echarts.init(chartRef.current);
        const labels = selectedCompetitor.map(comp => comp.value);
        const datasetData = labels.map(label =>
            data.filter(d => d.username === label).reduce((sum, d) => sum + d.value, 0)
        );

        const options = {
            // title: { text: "Responsiveness Rate (Log Scale)" },
            tooltip: { 
                trigger: "item",
                formatter: (params) => `${params.name}: ${params.value.toFixed(2)}%` // Format angka dengan 2 desimal
            },
            grid: { left: 120, right: 50, bottom: 50, containLabel: true },
            toolbox: { 
                feature: { saveAsImage: {} } // 🔥 Tambahkan fitur save image langsung dari toolbox
            },
            xAxis: {
                type: "log", // 🔥 Skala logaritmik untuk responsivitas
                min: value => Math.max(1, Math.floor(value.min * 0.9)), // Pastikan tidak kurang dari 1%
                max: value => Math.ceil(value.max * 1.1),
                axisLabel: {
                    formatter: (value) => `${value.toFixed(1)}%` // ✅ Tetap dalam satuan persen
                }
            },
            yAxis: {
                type: "category",
                data: labels
            },
            series: [
                {
                    name: "Responsiveness",
                    type: "bar",
                    data: labels.map((label, index) => ({
                        value: datasetData[index],
                        name: label,
                        itemStyle: { 
                            color: label === selectedAccount 
                                ? primaryColors[0] 
                                : primaryColors[index + 1] || primaryColors[1]
                        }
                    })),
                    barWidth: 20
                }
            ]
        };

        chart.setOption(options);
        return () => chart.dispose();
    }, [data, selectedCompetitor, selectedAccount]);

    return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default HorizontalBarChart;
