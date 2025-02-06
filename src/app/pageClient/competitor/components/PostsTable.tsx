const PostsTable = () => {
	return (
		<section className="mb-6 2xl:mb-0 2xl:flex-1 shadow-[4px_0_8px_rgba(0,0,0,0.05)]">
			<div
				className="w-full rounded-lg bg-white px-[24px] py-[20px] dark:bg-darkblack-600"
			>
				<div className="flex flex-col space-y-5">
					<div className="table-content w-full overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr
									className="border-b border-bgray-300 dark:border-darkblack-400"
								>
									<th className="inline-block w-[250px] px-6 py-5 lg:w-auto xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span
												className="text-base font-medium text-bgray-600 dark:text-bgray-50"
											>
												Username</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span
												className="text-base font-medium text-bgray-600 dark:text-bgray-50"
											>Content</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:px-0">
										<div className="flex items-center space-x-2.5">
											<span
												className="text-base font-medium text-bgray-600 dark:text-bgray-50"
											>
												Date</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span
												className="text-base font-medium text-bgray-600 dark:text-bgray-50"
											>Like</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span className="text-base font-medium text-bgray-600"
											>Comment</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span className="text-base font-medium text-bgray-600"
											>View</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span className="text-base font-medium text-bgray-600"
											>Reach</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span className="text-base font-medium text-bgray-600"
											>Impression</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span className="text-base font-medium text-bgray-600"
											>Engagement</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="px-6 py-5 xl:w-[165px] xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<span className="text-base font-medium text-bgray-600"
											>ER</span
											>
											<span>
												<svg
													width="14"
													height="15"
													viewBox="0 0 14 15"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.332 1.31567V13.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3.66602 13.3157V1.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
														stroke="#718096"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									</th>
									<th className="py-5"></th>
								</tr>
							</thead>
							<tbody>
								<tr
									className="border-b border-bgray-300 dark:border-darkblack-400"
								>
									<td className="px-6 py-5 xl:px-0">
										<div className="flex w-full items-center space-x-2.5">
											<div
												className="h-10 w-10 overflow-hidden rounded-full"
											>
												<img
													src="./assets/images/avatar/ha-1.png"
													alt="avatar"
													className="h-full w-full object-cover"
												/>
											</div>
											<p
												className="text-base font-semibold text-bgray-900 dark:text-white"
											>
												Devon Lane
											</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:px-0">
										<p
											className="text-base font-medium text-bgray-900 dark:text-white text-sm"
										>
											Alhamdulillah @kpu_dki telah menetapkan Gubernur dan Wakil Gubernur Jakarta
											terpilih. Acara hari ini dihadiri para saha...
											<span>Original Post</span>
										</p>
									</td>
									<td className="px-6 py-5 xl:px-0">
										<p
											className="text-base font-medium text-bgray-900 dark:text-white"
										>
											Thursday
											09 Jan 2025
											8:16 PM
										</p>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>0</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>110</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>110</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>110</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>110</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>110</p>
										</div>
									</td>
									<td className="px-6 py-5 xl:w-[165px] xl:px-0 text-end">
										<div className="flex w-full items-center">
											<p
												className="text-base font-medium text-bgray-900 dark:text-white"
											>110</p>
										</div>
									</td>
									<td className="py-5">
										<div className="flex justify-center">
											<button type="button">
												<svg
													width="18"
													height="4"
													viewBox="0 0 18 4"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M8 2.00024C8 2.55253 8.44772 3.00024 9 3.00024C9.55228 3.00024 10 2.55253 10 2.00024C10 1.44796 9.55228 1.00024 9 1.00024C8.44772 1.00024 8 1.44796 8 2.00024Z"
														stroke="#A0AEC0"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M1 2.00024C1 2.55253 1.44772 3.00024 2 3.00024C2.55228 3.00024 3 2.55253 3 2.00024C3 1.44796 2.55228 1.00024 2 1.00024C1.44772 1.00024 1 1.44796 1 2.00024Z"
														stroke="#A0AEC0"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M15 2.00024C15 2.55253 15.4477 3.00024 16 3.00024C16.5523 3.00024 17 2.55253 17 2.00024C17 1.44796 16.5523 1.00024 16 1.00024C15.4477 1.00024 15 1.44796 15 2.00024Z"
														stroke="#A0AEC0"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="pagination-content w-full">
						<div
							className="flex w-full items-center justify-center lg:justify-between"
						>
							<div className="hidden items-center space-x-4 lg:flex">
								<span
									className="text-sm font-semibold text-bgray-600 dark:text-bgray-50"
								>Show result:</span
								>
								<div className="relative">
									<button
										// onClick="dateFilterAction('#result-filter')"
										type="button"
										className="flex items-center space-x-6 rounded-lg border border-bgray-300 px-2.5 py-[14px] dark:border-darkblack-400"
									>
										<span
											className="text-sm font-semibold text-bgray-900 dark:text-bgray-50"
										>3</span
										>
										<span>
											<svg
												width="17"
												height="17"
												viewBox="0 0 17 17"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M4.03516 6.03271L8.03516 10.0327L12.0352 6.03271"
													stroke="#A0AEC0"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</span>
									</button>
									<div
										id="result-filter"
										className="absolute right-0 top-14 z-10 hidden w-full overflow-hidden rounded-lg bg-white shadow-lg"
									>
										<ul>
											<li
												// onClick="dateFilterAction('#result-filter')"
												className="text-bgray-90 cursor-pointer px-5 py-2 text-sm font-medium hover:bg-bgray-100"
											>
												1
											</li>
											<li
												// onClick="dateFilterAction('#result-filter')"
												className="cursor-pointer px-5 py-2 text-sm font-medium text-bgray-900 hover:bg-bgray-100"
											>
												2
											</li>

											<li
												// onClick="dateFilterAction('#result-filter')"
												className="cursor-pointer px-5 py-2 text-sm font-medium text-bgray-900 hover:bg-bgray-100"
											>
												3
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div
								className="flex items-center space-x-5 sm:space-x-[35px]"
							>
								<button type="button">
									<span>
										<svg
											width="21"
											height="21"
											viewBox="0 0 21 21"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12.7217 5.03271L7.72168 10.0327L12.7217 15.0327"
												stroke="#A0AEC0"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
								</button>
								<div className="flex items-center">
									<button
										type="button"
										className="rounded-lg bg-success-50 px-4 py-1.5 text-xs font-bold text-success-300 dark:bg-darkblack-500 dark:text-bgray-50 lg:px-6 lg:py-2.5 lg:text-sm"
									>
										1
									</button>
									<button
										type="button"
										className="rounded-lg px-4 py-1.5 text-xs font-bold text-bgray-500 transition duration-300 ease-in-out hover:bg-success-50 hover:text-success-300 dark:hover:bg-darkblack-500 lg:px-6 lg:py-2.5 lg:text-sm"
									>
										2
									</button>

									<span className="text-sm text-bgray-500">. . . .</span>
									<button
										type="button"
										className="rounded-lg px-4 py-1.5 text-xs font-bold text-bgray-500 transition duration-300 ease-in-out hover:bg-success-50 hover:text-success-300 dark:hover:bg-darkblack-500 lg:px-6 lg:py-2.5 lg:text-sm"
									>
										20
									</button>
								</div>
								<button type="button">
									<span>
										<svg
											width="21"
											height="21"
											viewBox="0 0 21 21"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M7.72168 5.03271L12.7217 10.0327L7.72168 15.0327"
												stroke="#A0AEC0"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default PostsTable;
