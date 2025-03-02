"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { primaryColors } from "@/constant/PerfomanceContants";

const PieChart = ({ data, selectedCompetitor, selectedAccount }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || selectedCompetitor.length === 0) return;

        const chart = echarts.init(chartRef.current);
        const labels = selectedCompetitor.map(comp => comp.value);
        const datasetData = labels.map(label =>
            data.filter(d => d.username === label).reduce((sum, d) => sum + d.value, 0)
        );

        const options = {
            title: { text: "Followers Distribution" },
            tooltip: { trigger: "item" },
            series: [
                {
                    name: "Followers",
                    type: "pie",
                    radius: ["40%", "60%"],
                    selectedMode: "single",
                    data: labels.map((label, index) => ({
                        value: datasetData[index],
                        name: label,
                        selected: label === selectedAccount,
                        itemStyle: { 
                            color: label === selectedAccount 
                                ? primaryColors[0] 
                                : primaryColors[index + 1] || primaryColors[1],
                            shadowBlur: label === selectedAccount ? 20 : 10,
                            shadowOffsetX: 0,
                            shadowColor: label === selectedAccount ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                        },
                        label: {
                            show: true,
                            color:"WHITE"
                        },
                        labelLine: {
                            show: true,
                            color: "WHITE"
                        },
                        emphasis: {
                            scale: 1,
                            label: {
                                show: true, // ✅ **Label muncul saat di-hover**
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FFF"
                            },
                            labelLine: {
                                show: true, // ✅ **Garis label hanya muncul saat di-hover**
                                length: 20,
                                lineStyle: {
                                    width: 1,
                                    color: "#FFF"
                                }
                            }
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

export default PieChart;
