import React from "react";
import FollowerCard from "./components/FollowerCard";
import ActivityCard from "./components/ActivityCard";
import InteractionCard from "./components/InteractionCard";
import ResponsivenessCard from "./components/ResponsivenessCard";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/PostDetailCard";

const Competitor = () => {
    return (
        <div className="min-h-screen justify-self-auto overflow-auto mb-5">
            {/* Header */}
            <div className="">
                <h1 className="text-xl text-white font-bold">Competitor Daily</h1>
                <p className="text-white">Monitor your competitor every single day</p>
            </div>
            {/* FAIR Score & Top Ranking */}
            <div className="grid grid-cols-12 gap-4 mt-4">
                {/* FAIR Score */}
                <div className="lg:col-span-8 rounded-lg">
                    <FairScoreCard />
                </div>

                {/* Top Ranking */}
                <div className="lg:col-span-4 rounded-lg">
                    <TopRankingCard />
                </div>
            </div>

            <div className="flex w-full items-center my-4">
                <img src="/icon-circle.png" alt="widgets_separator_ticon" className="mx-3 h-7" />
                <div className="mr-3 w-auto text-lg font-bold">Fair</div>
                <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="lg:col-span-3 rounded-lg">
                    <FollowerCard />
                </div>
                <div className="lg:col-span-3 rounded-lg">
                    <ActivityCard />
                </div>
                <div className="lg:col-span-3 rounded-lg">
                    <InteractionCard />
                </div>
                <div className="lg:col-span-3 rounded-lg">
                    <ResponsivenessCard />
                </div>
            </div>

            <div className="flex w-full items-center my-4">
                <img src="/icon-circle.png" alt="widgets_separator_ticon" className="mx-3 h-7" />
                <div className="mr-3 w-auto text-lg font-bold">Post Detail</div>
                <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
            </div>

            {/* Detail Post */}
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="lg:col-span-12 rounded-lg">
                    <PostsTable/>
                </div>
            </div>

        </div>
    );
};

export default Competitor;