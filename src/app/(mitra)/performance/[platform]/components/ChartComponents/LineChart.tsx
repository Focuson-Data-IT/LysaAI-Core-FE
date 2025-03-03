"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import moment from "moment";
import { primaryColors } from "@/constant/PerfomanceContants";

const LineChart = ({ data, selectedCompetitor, selectedAccount, period }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || !period) return;

        if (chartInstanceRef.current) chartInstanceRef.current.dispose();

        const chart = echarts.init(chartRef.current);
        chartInstanceRef.current = chart;

        const days = Array.from(new Set(data.map(d => moment(d.date).format("DD")))).sort();

        const rankingMap = new Map();
        selectedCompetitor.forEach(comp => {
            rankingMap.set(comp.value, days.map(day => {
                const dayData = data.find(d => d.username === comp.value && moment(d.date).format("DD") === day);
                return dayData ? dayData.value : null;
            }));
        });

        const seriesList = Array.from(rankingMap, ([name, values], index) => ({
            name,
            type: "line",
            smooth: true,
            emphasis: { focus: "series" },
            endLabel: { 
                show: true, 
                formatter: "{a}", 
                distance: 15,
                color: "#FFF", // Warna teks label di ujung garis
                fontWeight: "bold",
                fontSize: 12,
            },
            lineStyle: { 
                width: 3,
            },
            itemStyle: {
                width: 6, // Besar titik data
                color: name === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
            },
            data: values
        }));        

        const options = {
            // title: { text: "" },
            tooltip: { 
                trigger: "axis",
                backgroundColor: "#fff", // Warna latar belakang tooltip
                borderColor: "#ddd", // Warna border tooltip
                borderWidth: 1,
                textStyle: {
                    color: "#333" // Warna teks dalam tooltip
                },
                formatter: function (params) {
                    let content = `<div style="font-size:14px; font-weight: bold;">${params[0].axisValue}</div>`;
                    params.forEach(param => {
                        let formattedValue = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(param.value);
                        content += `
                            <div style="display: flex; align-items: center; gap: 8px; padding: 4px;">
                                <span style="width: 10px; height: 10px; background:${param.color}; display: inline-block; border-radius: 50%;"></span>
                                <span style="color:#666;">${param.seriesName}</span>
                                <span style="font-weight:bold; margin-left: auto;">${formattedValue}</span>
                            </div>
                        `;
                    });
                    return `<div style="padding:10px; border-radius:5px;">${content}</div>`;
                }
            },            
            toolbox: { 
                feature: { saveAsImage: {} }
            },
            xAxis: { type: "category", data: days },
            yAxis: { type: "value" },
            series: seriesList
        };

        chart.setOption(options);
        return () => chart.dispose();
    }, [data, selectedCompetitor, selectedAccount, period]);

    return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default LineChart;
