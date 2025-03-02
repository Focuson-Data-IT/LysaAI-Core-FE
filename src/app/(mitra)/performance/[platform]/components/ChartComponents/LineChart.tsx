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
                distance: 20,
                color: "WHITE"
                },
            lineStyle: { 
                width:4,
            },
            itemStyle: {
                width: name === selectedAccount ? 5 : 5,
                color: name === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
            },
            data: values
        }));

        const options = {
            title: { text: "Performance Trend (Daily Data)" },
            tooltip: { trigger: "axis" },
            toolbox: { 
                feature: { saveAsImage: {} } // 🔥 Tambahkan fitur save image langsung dari toolbox
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
