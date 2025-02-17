"use client";

import { useParams } from "next/navigation";
import FairDetailBar from "./components/FairDetailBar";
import FairDetailCard from "./components/FairDetailCard";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/PostDetailCard";
import PerformanceContextProvider from "@/context/PerformanceContext";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Competitor = () => {
    const { platform } = useParams();

    interface IconComponents {
            [key: string]: React.ComponentType;
        }
    
        const getIconComponent = (platform: string): React.ComponentType | null => {
            const icons: IconComponents = {
                Instagram: FaInstagram,
                TikTok: FaTiktok
            };
    
            return icons[platform] || null;
        };
    
        const IconComponent = getIconComponent(Array.isArray(platform) ? platform[0] : platform);

    return (
        <PerformanceContextProvider>
            <div className="min-h-screen justify-self-auto overflow-auto mb-5 overflow-x-hidden">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="">
                        <h1 className="text-xl text-black dark:text-white font-bold">Competitor Analysis</h1>
                        <p className="text-black dark:text-white">Monitor your competitors every single day</p>
                    </div>
                </div>


                {/* FAIR Score & Top Ranking */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-8 rounded-lg">
                        <FairScoreCard platform={platform} description="Jumlah orang yang mengikuti akun."/>
                    </div>
                    <div className="lg:col-span-4 rounded-lg">
                        <TopRankingCard platform={platform} description="Jumlah orang yang mengikuti akun."/>
                    </div>
                </div>

                {/* FAIR Section */}
                <div className="flex w-full items-center my-4">
                {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
                    <div className="mx-3 w-auto text-lg font-bold">Fair</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Followers" description="Jumlah orang yang mengikuti akun." />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Activities" description="Tingkat produktivitas dalam membuat dan mengunggah konten setiap hari." unit="Posts/Day" />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Interactions" description="Jumlah warganet yang berinteraksi dengan akun pada setiap konten yang diunggah." unit="Likes/Post" />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <FairDetailBar platform={platform} label="Responsiveness" description="Persentase respons dari tim pengelola terhadap warganet yang berkomentar." unit="%" />
                    </div>


                    <div className="lg:col-span-12 rounded-lg flex w-full items-center my-4">
                    {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
                        <div className="mx-3 w-auto text-lg font-bold">Analytic Chart</div>
                        <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                    </div>

                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Followers" description="Jumlah orang yang mengikuti akun."/>
                    </div>
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Activities" description="Jumlah orang yang mengikuti akun."/>
                    </div>
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Interactions" description="Jumlah orang yang mengikuti akun."/>
                    </div>
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Responsiveness" description="Jumlah orang yang mengikuti akun."/>
                    </div>
                </div>

                {/* POST DETAIL Section */}
                <div className="flex w-full items-center my-4">
                {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
                    <div className="mx-3 w-auto text-lg font-bold">Post Detail</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* Detail Post */}
                <div className="grid grid-cols-12 gap-4 mt-4 h-[800px]">
                    <div className="lg:col-span-12 rounded-lg">
                        <PostsTable platform={platform} />
                    </div>
                </div>
            </div>
        </PerformanceContextProvider>
    );
};

export default Competitor;
