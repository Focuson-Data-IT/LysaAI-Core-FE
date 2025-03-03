"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import moment from "moment";
import { primaryColors } from "@/constant/PerfomanceContants";

const ChartComponent = ({ type, data, selectedCompetitor, selectedAccount, period, title }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data || !period) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.dispose();
        }

        const chart = echarts.init(chartRef.current);
        chartInstanceRef.current = chart;

        const labels = Array.from(new Set(data.map(d => moment(d.date).format("YYYY-MM-DD")))).sort();

        const datasetMap = new Map();
        selectedCompetitor.forEach(comp => {
            datasetMap.set(comp.value, labels.map(day => {
                const dayData = data.find(d => d.username === comp.value && moment(d.date).format("YYYY-MM-DD") === day);
                return dayData ? dayData.value : null;
            }));
        });

        const seriesList = Array.from(datasetMap, ([name, values], index) => ({
            name,
            type,
            smooth: true,
            emphasis: { focus: "series" },
            endLabel: { show: true, formatter: "{a}", distance: 20 },
            lineStyle: { 
                width: name === selectedAccount ? 5 : 3,
                color: name === selectedAccount ? primaryColors[0] : primaryColors[index + 1] || primaryColors[1],
            },
            itemStyle: {
                color: primaryColors[index + 1] || primaryColors[1],
            },
            data: values
        }));

        const options = {
            title: { text: title },
            tooltip: { trigger: "axis" },
            grid: { left: 50, right: 80, bottom: 50, containLabel: true },
            toolbox: { feature: { saveAsImage: {} } },
            xAxis: {
                type: "category",
                data: labels,
                axisLabel: { formatter: value => moment(value).format("DD"), rotate: 0 }
            },
            yAxis: {
                type: "value",
                min: value => Math.floor(value.min * 0.9),
                max: value => Math.ceil(value.max * 1.1),
                axisLabel: { formatter: "{value}" }
            },
            series: seriesList
        };

        chart.setOption(options);

        return () => chart.dispose();
    }, [data, selectedCompetitor, selectedAccount, period]);

    return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default ChartComponent;
