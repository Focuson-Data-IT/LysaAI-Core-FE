'use client'

import React, {useEffect, useState} from "react";
import request from "@/utils/request";
import moment from "moment";
import {TTopRanking} from "@/app/pageClient/competitor/constants";
import OurLoading from "@/components/OurLoading";
import OurEmptyData from "@/components/OurEmptyData";

const TopRanking: React.FC<TTopRanking> = ({period}) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [fairRankingData, setFairRankingData] = useState(null);

	const getFairRanking = async (payload) => {
		setLoading(true);

		const response = await request.get(`/getFairRanking?customer_username=kemenkoinfra&start_date=${moment(payload?.startDate)?.format("YYYY-MM-DD")}&end_date=${moment(payload?.endDate || payload?.startDate)?.format("YYYY-MM-DD")}`)

		setFairRankingData(response.data?.data);
	}

	useEffect(() => {
		getFairRanking(period).then(() => {
			setLoading(false);
		})
	}, [period])

	return (
		<div
			className={`${loading ? 'bg-gray-200 animate-pulse' : ''} rounded-lg mb-12 bg-white dark:bg-darkblack-600 h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 shadow-[4px_0_8px_rgba(0,0,0,0.05)]`}>
			{
				loading
					?
					<div className={`flex items-center justify-center h-full`}>
						<OurLoading/>
					</div>
					:
					fairRankingData?.length
						?
						<>
							<div
								className="flex items-center justify-between border-b border-bgray-300 px-5 py-3 dark:border-darkblack-400">
								<h3 className="text-xl font-bold text-bgray-900 dark:text-white">Top Ranking</h3>
								<div className="date-filter relative">
									<button type="button" className="flex items-center space-x-1">
									<span
										className="text-base font-semibold text-bgray-900 dark:text-bgray-50">Score</span>
									</button>
								</div>
							</div>
							<div className="overflow-x-auto">
								<table className="table-auto w-full overflow-y-scroll">
									<tbody>
									{fairRankingData?.map((v, key) => {
										return (
											<tr
												key={key}
												className="h-[20px] bg-white dark:bg-darkblack-600 cursor-pointer hover:bg-gray-300 dark:hover:bg-bgray-800"

											>
												<td className="whitespace-nowrap px-4 text-sm font-medium w-auto">
						<span>
						<svg
							style={{transform: key < 3 ? 'scale(1.5)' : 'none'}}
							width={24}
							height={24}
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12.0001 17.75L5.82808 20.995L7.00708 14.122L2.00708 9.25495L8.90708 8.25495L11.9931 2.00195L15.0791 8.25495L21.9791 9.25495L16.9791 14.122L18.1581 20.995L12.0001 17.75Z"
								fill={key < 3 ? `#F6A723` : '#FFFF'}
								stroke={key < 3 ? `#F6A723` : '#FFFF'}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							</svg>
						</span>
												</td>
												<td className="whitespace-nowrap text-sm text-gray-500 lg:w-auto flex-end">
													<div className="flex items-center gap-5">
														{/*<div className="h-[35px] w-[35px]">*/}
														{/*	<img*/}
														{/*		className="w-full rounded-lg object-cover"*/}
														{/*		src="assets/images/avatar/user-1.png"*/}
														{/*		alt=""*/}
														{/*	/>*/}
														{/*</div>*/}
														<div className="flex-1">
															<h4 className="text-sm font-bold text-bgray-900 dark:text-white">{v?.username}</h4>
															<div>
																{/*<span className="text-sm font-medium text-bgray-700 dark:text-bgray-50">Finance managers • </span>*/}
																<span
																	className="text-gray-500 text-sm">https://www.instagram.com/{v?.username}</span>
															</div>
														</div>
													</div>
												</td>
												<td className="whitespace-nowrap pr-5 text-sm text-white text-end">
													{v.max_value}
												</td>
											</tr>
										);
									})}
									</tbody>
								</table>
							</div>
						</>
						:
						<div className={`flex items-center justify-center h-full`}>
							<OurEmptyData width={150}/>
						</div>
			}
		</div>
	)
}

export default TopRanking;
