"use client";

import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import request from "@/utils/request";
import moment from "moment";

interface TikTokData {
    date: string;
    followers: number;
    posts: number;
    likes: number;
    views: number;
    saves: number;
    shares: number;
    comments: number;
}

interface ApiResponse {
    username: string;
    platform: string;
    start_date: string;
    end_date: string;
    data: TikTokData[];
}

interface TikTokChartProps {
    username: string;
    startDate: string;
    endDate: string;
    platform: string;
}

const TikTokChart: React.FC<TikTokChartProps> = ({
    username,
    startDate,
    endDate,
    platform,
}) => {
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

    const fetchData = async (): Promise<ApiResponse | null> => {
        try {
            const response = await request.get(
                `/getGrowthData?username=${username}&start_date=${startDate}&end_date=${endDate}&platform=${platform}`
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return null;
        }
    };

    const initializeChart = (data: TikTokData[]) => {
        const dates = data.map((item) => moment(item.date).format("MM-DD"));
        const followers = data.map((item) => item.followers);
        const posts = data.map((item) => item.posts);
        const likes = data.map((item) => item.likes);
        const views = data.map((item) => item.views);
        const saves = data.map((item) => item.saves);
        const shares = data.map((item) => item.shares);
        const comments = data.map((item) => item.comments);

        const option: echarts.EChartsOption = {
            title: {
                text: `Growth Metrics - ${username}`,
                subtext: `Periode: ${startDate} - ${endDate}`,
                left: "center",
                textStyle: { color: "#ffffff" },
            },
            tooltip: { trigger: "axis" },
            legend: {
                left: "center",
                bottom: 10,
                data: ["Followers", "Posts", "Likes", "Views", "Saves", "Shares", "Comments"],
                textStyle: { color: "#ffffff" },
            },
            grid: { left: "5%", right: "8%", bottom: "15%", containLabel: true },
            toolbox: { feature: { saveAsImage: {} } },
            xAxis: {
                type: "category",
                data: dates,
                axisLabel: { rotate: 45 },
            },
            yAxis: [
                {
                    type: "value",
                    name: "Followers, Likes, Views, Saves, Shares, Comments",
                    axisLabel: { 
                        formatter: function (value) {
                        const numericValue = Number(value);
                        if (numericValue >= 1_000_000_000) return (numericValue / 1_000_000_000).toFixed(0) + "B";
                        if (numericValue >= 1_000_000) return (numericValue / 1_000_000).toFixed(0) + "M";
                        if (numericValue >= 1_000) return (numericValue / 1_000).toFixed(0) + "K";
                        return value.toString(); // Nilai di bawah 1000 tetap ditampilkan utuh
                        }
                    },
                    splitLine: { show: false },
                },
                {
                    type: "value",
                    name: "Posts",
                    axisLabel: { formatter: "{value}" },
                    position: "right",
                },
            ],
            series: [
                { name: "Followers", type: "line", data: followers, smooth: true, yAxisIndex: 0 },
                { name: "Likes", type: "bar", data: likes, yAxisIndex: 0 },
                { name: "Views", type: "bar", data: views, yAxisIndex: 0 },
                { name: "Comments", type: "bar", data: comments, yAxisIndex: 0 },
                { name: "Saves", type: "bar", data: saves, yAxisIndex: 0 },
                { name: "Shares", type: "bar", data: shares, yAxisIndex: 0 },
                { name: "Posts", type: "bar", data: posts, yAxisIndex: 1, barWidth: 10 },
            ],
        };

        const chartDom = document.getElementById("TikTokChart")!;
        const newChart = echarts.init(chartDom);
        newChart.setOption(option);
        setChartInstance(newChart);
    };

    useEffect(() => {
        fetchData().then((data) => {
            if (data) initializeChart(data.data);
        });
    }, [username, startDate, endDate]);

    return <div id="TikTokChart" style={{ width: "100%", height: "600px" }}></div>;
};

export default TikTokChart;
