"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { primaryColors } from "@/constant/PerfomanceContants";

const RadarChart = ({ data, selectedCompetitor }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || selectedCompetitor.length === 0) return;

        const chart = echarts.init(chartRef.current);
        const labels = selectedCompetitor.map(comp => comp.value);
        const datasetData = labels.map(label =>
            data.filter(d => d.username === label).reduce((sum, d) => sum + d.value, 0)
        );

        const maxValue = Math.max(...datasetData) || 10; // Jika kosong, set default max 10

        const options = {
            title: { text: "Activity Score" },
            tooltip: { trigger: "item" },
            toolbox: { 
                feature: { saveAsImage: {} } // 🔥 Tambahkan fitur save image langsung dari toolbox
            },
            radar: {
                indicator: labels.map(label => ({ name: label, max: maxValue })),
                shape: "polygon"
            },
            series: [
                {
                    name: "Activities",
                    type: "radar",
                    data: [
                        {
                            value: datasetData,
                            itemStyle: { 
                                color: "#FFFFFF" // Ambil warna peach terang atau fallback
                            },
                            lineStyle: {
                                width: 2,
                                color: "#FFFFFF" // Garis juga menggunakan warna peach
                            },
                            areaStyle: {
                                opacity: 0.3, // Area lebih transparan untuk efek lebih halus
                                color: "#FFFFFF"
                            }
                        }
                    ]
                }
            ]
        };

        chart.setOption(options);
        return () => chart.dispose();
    }, [data, selectedCompetitor]);

    return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default RadarChart;
