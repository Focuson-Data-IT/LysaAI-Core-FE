import React from "react";
import FollowerCard from "./components/FollowerCard";
import ActivityCard from "./components/ActivityCard";
import InteractionCard from "./components/InteractionCard";
import ResponsivenessCard from "./components/ResponsivenessCard";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";

const Competitor = () => {
    return (
        <div className="h-screen justify-self-auto">
            {/* Header */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h1 className="text-xl font-bold">Competitor Daily</h1>
                <p className="text-gray-600">Monitor your competitor every single day</p>
            </div>
            {/* FAIR Score & Top Ranking */}
			<div className="grid grid-cols-12 gap-4 mt-4">
                    {/* FAIR Score */}
                    <div className="lg:col-span-8 bg-white shadow-md rounded-lg p-4">
                        <FairScoreCard />
                    </div>

                    {/* Top Ranking */}
                    <div className="lg:col-span-4 bg-white shadow-md rounded-lg p-4">
                        <TopRankingCard />
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-3 bg-white shadow-md rounded-lg p-4">
                        <FollowerCard />
                    </div>
                    <div className="lg:col-span-3 bg-white shadow-md rounded-lg p-4">
                        <ActivityCard />
                    </div>
                    <div className="lg:col-span-3 bg-white shadow-md rounded-lg p-4">
                        <InteractionCard />
                    </div>
                    <div className="lg:col-span-3 bg-white shadow-md rounded-lg p-4">
                        <ResponsivenessCard />
                    </div>
                </div>
        </div>
    );
};

export default Competitor;