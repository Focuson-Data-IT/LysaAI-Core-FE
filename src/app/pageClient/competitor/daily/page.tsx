'use client';

import React, {useState} from "react";
import FairScoreChart from "@/app/pageClient/competitor/components/FairScoreChart";
import FairDetailBar from "@/app/pageClient/competitor/components/FairDetailBar";
import TopRanking from "@/app/pageClient/competitor/components/TopRanking";
import PostsTable from "@/app/pageClient/competitor/components/PostsTable";
import moment from "moment/moment";
import {TPeriodInput} from "@/components/constants";

const Perform = () => {
	const [parentPeriod, setParentPeriod] = useState<TPeriodInput>({
		startDate: moment().toDate(),
		endDate: moment().toDate()
	})

	return (
		<>
			<h1 className="text-xl font-bold text-bgray-900 dark:text-bgray-50 lg:text-3xl lg:leading-[36.4px] mb-5">Competitor</h1>
			<div className="flex flex-col lg:flex-row lg:space-x-6 w-full">
				{/* FairScoreChart - 70% pada lg */}
				<div className="mb-6 w-full lg:mb-0 lg:flex-[7]">
					<FairScoreChart setParentPeriod={setParentPeriod}/>
				</div>

				{/* TopRanking - 30% pada lg */}
				<div className="w-full lg:flex-[3]">
					<TopRanking period={parentPeriod}/>
				</div>
			</div>

			<h1 className="text-xl font-bold text-bgray-900 dark:text-bgray-50 lg:text-3xl lg:leading-[36.4px] mb-5">Fair</h1>
			<div className="2xl:flex 2xl:space-x-[48px] mb-5">
				<div className="w-full 2xl:flex-1 mb-5">
					<FairDetailBar label={"Followers"} unit={"K"} period={parentPeriod}/>
				</div>
				<div className="w-full 2xl:flex-1 mb-5">
					<FairDetailBar label={"Activities"} unit={"/day"} period={parentPeriod}/>
				</div>
				<div className="w-full 2xl:flex-1 mb-5">
					<FairDetailBar label={"Interactions"} unit={"Likes /post"} period={parentPeriod}/>
				</div>
				<div className="w-full 2xl:flex-1 mb-5">
					<FairDetailBar label={"Responsiveness"} unit={"%"} period={parentPeriod}/>
				</div>
			</div>

			<div className="2xl:flex 2xl:space-x-[48px] mb-5">
				<PostsTable/>
			</div>
		</>
	)
}

export default Perform;
