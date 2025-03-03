"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const RadarChart = ({ data, selectedCompetitor }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || selectedCompetitor.length === 0) return;

        const chart = echarts.init(chartRef.current);
        const labels = selectedCompetitor.map(comp => comp.value);
        const datasetData = labels.map(label =>
            data.filter(d => d.username === label).reduce((sum, d) => sum + d.value, 0)
        );

        const maxValue = Math.max(...datasetData) || 0; // Jika kosong, set default max 10

        const options = {
            // title: { text: "Activity Score" },
            tooltip: { 
                trigger: "item",
                formatter: (params) => {
                    let dataValues = params.value.map((val, index) => {
                        let formattedVal = new Intl.NumberFormat('id-ID', { 
                            minimumFractionDigits: 1, 
                            maximumFractionDigits: 1 
                        }).format(val);
                        return `${labels[index]}: ${formattedVal}`;
                    }).join("<br/>"); 
            
                    return `<b>Activities</b><br/>${dataValues}`;
                },
            },                     
            toolbox: { 
                feature: { saveAsImage: {} }
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
                                color: "#FFFFFF"
                            },
                            lineStyle: {
                                width: 2,
                                color: "#FFFFFF"
                            },
                            areaStyle: {
                                opacity: 0.3,
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
