'use client'

import React, {useEffect, useMemo, useRef, useState} from "react";
import Chart from "chart.js/auto";
import moment from "moment";
import request from "@/utils/request";
import {buildDatasets, buildLabels, createGradient, groupDataByUsername} from "@/utils/chart";
import OurDatePicker from "@/components/OurDatePicker";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";
import OurSelect from "@/components/OurSelect";


const FairScoreChart: React.FC<{ setParentPeriod: void }> = ({setParentPeriod = null}) => {
	const chartRef = useRef<HTMLCanvasElement | null>(null);


	const [period, setPeriod] = useState<{ startDate: Date | string | null, endDate: Date | string | null }>({
		startDate: moment().toDate(),
		endDate: moment().toDate()
	})

	const [loading, setLoading] = useState<boolean>(true);
	const [fairScoreData, setFairScoreData] = useState<any>(null);
	const [datasets, setDatasets] = useState<any>(null);

	const [fairScoreChart, setFairScoreChart] = useState<Chart | null>(null);

	const options = useMemo(() => {
		return datasets?.map((v) => ({
			label: v.label,
			value: v.label,
		})) || [];
	}, [datasets]);

	// const [permaOptions, setPermaOptions] = useState([]);

	const [parentSelectedOption, setParentSelectedOption] = useState<Array<{
		label: string,
		value: string
	} | null>>(null)

	const [permaOptions, setPermaOptions] = useState<Array<{
		label: string,
		value: string
	} | null>>([])


	const getFairScoreChartData = async (payload) => {
		setLoading(true)
		const response = await request.get(`/getFairScores?customer_username=bapendabdg@focuson.com&start_date=${moment(payload?.startDate)?.format("YYYY-MM-DD")}&end_date=${moment(payload?.endDate || payload?.startDate)?.format("YYYY-MM-DD")}`)
		setFairScoreData(response.data?.data);
	}

	const drawChart = (labels, datasets) => {
		if (chartRef && chartRef.current) {
			const ctx = chartRef.current?.getContext("2d");

			if (fairScoreChart) {
				fairScoreChart.destroy();
			}

			const newChart = new Chart(ctx, {
				type: "line",
				plugins: [
					{
						id: "fairScoreCanvas",
						beforeDatasetsDraw(chart) {
							chart.ctx.shadowColor = "rgba(37, 99, 235, 0.14)";
							chart.ctx.shadowBlur = 8;
						},
						afterDatasetsDraw(chart) {
							chart.ctx.shadowColor = "rgba(0, 0, 0, 0)";
							chart.ctx.shadowBlur = 0;
						},
					},
				],
				data: {
					labels: labels,
					datasets: datasets,
				},
				options: {
					interaction: {
						mode: "index",
						axis: "x",
						intersect: false,
					},
					maintainAspectRatio: false,
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								callback(value) {
									return `${value}K `;
								},
							},
						},
						x: {
							ticks: {
								callback: function (value, index, ticks) {
									return `${moment(labels[index]).format("DD")}`
									//\n${moment(labels[index]).format("MMM YYYY")}
								},
							},
						},
					},
					plugins: {
						legend: {position: "top", display: false},
					},
					elements: {
						point: {
							radius: 0,
							hoverRadius: 4,
						},
					},
				},
			});

			setFairScoreChart(newChart);
		}
	};

	useEffect(() => {
		getFairScoreChartData(period).then((v) => {
			setLoading(false);
		})
	}, [period]);

	useEffect(() => {
		const dateArray = buildLabels(period.startDate, period.endDate);
		const labels = dateArray.map((date) => date.format("YYYY-MM-DD"));

		const filterByUsername = parentSelectedOption?.map((v) => {
			return v?.value;
		})

		let datasetsBuilderOption = {
			filterByUsername: filterByUsername
		}

		const dataGroupedByUsername = groupDataByUsername(fairScoreData);

		let datasetsBuilded = buildDatasets(dataGroupedByUsername, labels, datasetsBuilderOption)

		const datasetsWithColor = datasetsBuilded?.map((v) => {
			return {
				...v,
				backgroundColor: createGradient(chartRef),
			}
		})

		setDatasets(datasetsBuilded)
		drawChart(labels, datasetsWithColor);
		// setPermaOptions(options);
		// setParentSelectedOption(options);
	}, [fairScoreData, parentSelectedOption]);

	useEffect(() => {
		if (options?.length > 0) {
			setPermaOptions(options);
			setParentSelectedOption(options);
		}
	}, []);

	return (
		<div
			className={`flex w-full flex-col justify-between rounded-lg bg-white p-1 dark:bg-darkblack-600 lg:px-8 lg:py-7 h-[400px] shadow-[4px_0_8px_rgba(0,0,0,0.05)]`}
		>
			<div className={`mb-2 flex items-center justify-between gap-5 p-3`}>
				<div>
						  <span
							  className="text-sm font-medium text-bgray-600 dark:text-white"
						  >FAIR Score</span
						  >
					<div className="flex items-center space-x-2">
						<h3
							className="text-xl font-bold leading-[36px] text-bgray-900 dark:text-white sm:text-2xl"
						>
							{
								period.startDate != null && period.endDate != null
									?
									<span>{moment(period.startDate).format("DD MMM YYYY")} {period.endDate ? ` - ${moment(period.endDate).format("DD MMM YYYY")}` : ''}</span>
									:
									''
							}
						</h3>
						{/*<span className="text-sm font-medium text-success-300">+20%</span>*/}
					</div>
				</div>
				<div className="date-filter relative flex flex-row gap-5">
					<OurDatePicker applyCallback={(v) => {
						setPeriod({
							startDate: v[0],
							endDate: v[1],
						});
						setParentPeriod({
							startDate: v[0],
							endDate: v[1],
						});
					}}/>
					<OurSelect permaOptions={permaOptions} options={options} disabled={false}
							   setParentSelectedOption={setParentSelectedOption}/>
				</div>
			</div>
			{
				loading
					?
					<div className={`flex items-center justify-center h-full`}>
						<OurLoading/>
					</div>
					:
					fairScoreData?.length
						?
						<div className={`w-full`}>
							<canvas id="fairScoreCanvas" ref={chartRef} height="280"></canvas>
						</div>
						:
						<div className={`flex items-center justify-center h-full`}>
							<OurEmptyData width={150}/>
						</div>
			}
		</div>
	)
}

export default FairScoreChart;
