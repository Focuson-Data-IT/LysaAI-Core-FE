"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import FairDetailBar from "./components/FairDetailBar";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/PostDetailCard";
import PerformanceContextProvider from "@/context/PerformanceContext";


const Competitor = () => {
    const {platform} = useParams();

    return (
        <PerformanceContextProvider>
            <div className="min-h-screen justify-self-auto overflow-auto mb-5 overflow-x-hidden">
                {/* Header */}
                <div className="">
                    <h1 className="text-xl text-black dark:text-white font-bold">Competitor Analysis</h1>
                    <p className="text-black dark:text-white">Monitor your competitor every single day</p>
                </div>

                {/* FAIR Score & Top Ranking */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-8 rounded-lg">
                        <FairScoreCard platform={platform}/>
                    </div>
                    <div className="lg:col-span-4 rounded-lg">
                        <TopRankingCard platform={platform}/>
                    </div>
                </div>

                {/* FAIR Section */}
                <div className="flex w-full items-center my-4">
                    <Image src="/icon-circle.png" alt="widgets_separator_ticon" className="mx-3 h-7" width={28} height={28} />
                    <div className="mr-3 w-auto text-lg font-bold">Fair</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Followers" description="banyaknya orang yang mengikuti akun" unit="followers" />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Activities" description="produktifitas konten yang dibuat dan diunggah setiap hari" unit="posts" />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Interactions" description="banyaknya warganet yang berinteraksi dengan akun pada setiap konten yang diunggah" unit="likes/post" />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Responsiveness" description="presentase respon dari team pengelola kepada warganet yang berkomentar" unit="%" />
                    </div>
                </div>

                {/* POST DETAIL Section */}
                <div className="flex w-full items-center my-4">
                    <img src="/icon-circle.png" alt="widgets_separator_ticon" className="mx-3 h-7" />
                    <div className="mr-3 w-auto text-lg font-bold">Post Detail</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* Detail Post */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-12 rounded-lg">
                        <PostsTable platform={platform}/>
                    </div>
                </div>
            </div>
        </PerformanceContextProvider>
    );
};

export default Competitor;
