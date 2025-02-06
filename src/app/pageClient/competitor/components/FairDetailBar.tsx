'use client';

import React, {useEffect, useState} from "react";
import {TFairDetailBar} from "@/app/pageClient/competitor/constants";
import request from "@/utils/request";
import moment from "moment";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";

const FairDetailBar: React.FC<TFairDetailBar> = ({label, unit, period}) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [fairChartData, setFairChartData] = useState<any>(null);

	const getFairChartData = async (payload) => {
		const url = `/get${label}?customer_username=kemenkoinfra&start_date=${moment(payload?.startDate)?.format("YYYY-MM-DD")}&end_date=${moment(payload?.endDate || payload?.startDate)?.format("YYYY-MM-DD")}`;
		const response = await request.get(url);

		const newResponse = response.data?.data?.map((v) => {
			return {
				...v,
				percentage: v.value / v.max_value * 100

			}
		})

		setFairChartData(newResponse)
	}

	useEffect(() => {
		if (period) {
			getFairChartData(period).then(() => {
				setLoading(false)
			})
		}
	}, [period]);

	return (
		<div
			className={`${loading ? 'bg-gray-200 animate-pulse' : ''} flex-1 xl:block shadow-[4px_0_8px_rgba(0,0,0,0.05)]`}>
			<div
				className="h-full w-full rounded-lg bg-white p-5 dark:bg-darkblack-600"
			>
				{
					loading
						?
						<div className={`flex items-center justify-center h-full`}>
							<OurLoading/>
						</div>
						:
						fairChartData?.length
							?
							<>
								<div className="flex items-center justify-between mb-3">
									<h3
										className="text-xl font-bold text-bgray-900 dark:text-white"
									>
										{label}
									</h3>
								</div>
								<div
									className="flex flex-col h-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
									{fairChartData?.map((v, key) => {
										return (
											<div className="flex items-center mb-2" key={key}>
												<div className="flex-1">
													<div className="mb-2 flex justify-between">
                              <span
								  className="text-sm font-medium text-bgray-900 dark:text-white"
							  >{v.username}</span
							  >
														<span className="text-sm font-medium dark:text-white"
														>{v.value} {unit}</span
														>
													</div>
													<div
														className="relative h-[14px] w-full overflow-hidden rounded bg-bgray-100"
													>
														<div
															style={{width: `${v?.percentage || 0}%`}}
															className={`absolute left-0 top-0 h-full rounded ${
																v?.percentage <= 30
																	? 'bg-danger-300'
																	: v?.percentage > 30 && v?.percentage <= 60
																		? 'bg-warning-300'
																		: 'bg-success-300'
															}`}
														></div>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</>
							:
							<div className={`flex items-center justify-center h-[300px]`}>
								<OurEmptyData width={100}/>
							</div>
				}

			</div>
		</div>
	)
}

export default FairDetailBar;
