"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import FairDetailCard from "./components/FairDetailCard";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/PostDetailCard";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";
import request from "@/utils/request";
import { useAuth } from "@/hooks/useAuth";
import { usePerformanceContext } from "@/context/PerformanceContext";
import OurLoading from "@/components/OurLoading";
import InstagramChart from "./components/charts/GrowthChart";

const Competitor = () => {
    const { platform } = useParams();
    const { authUser } = useAuth();

    const [accountOptions, setAccountOptions] = useState([]);
    const [competitorOptions, setCompetitorOptions] = useState([]);
    const [isShowDatepicker, setIsShowDatepicker] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const {
        period,
        selectedCompetitor,
        selectedAccount,
        setPeriod,
        setSelectedCompetitor,
        setSelectedAccount,
    } = usePerformanceContext();

    useEffect(() => {
        const fetchUsernames = async () => {
            if (authUser?.username) {
                try {
                    const response = await request.get(
                        `/getAllUsername?kategori=${authUser.username}&platform=${platform}`
                    );
                    const usernames = response.data?.data || [];
                    const formattedOptions = usernames.map((user: { username: string }) => ({
                        label: user.username,
                        value: user.username,
                    }));

                    setAccountOptions(formattedOptions);
                    setCompetitorOptions(formattedOptions);
                } catch (error) {
                    console.error("Error fetching usernames:", error);
                }
            }
        };

        fetchUsernames();
    }, [authUser, platform]);

    const getIconComponent = (platform: string) => {
        const icons = {
            Instagram: FaInstagram,
            TikTok: FaTiktok,
        };
        return icons[platform] || null;
    };

    const IconComponent = getIconComponent(Array.isArray(platform) ? platform[0] : platform);

    if (!authUser || !period || !platform ) {
        return <OurLoading />;
    }

    return (
        <div className="relative min-h-screen">
            {/* HEADER - FOKUS DAN TIDAK BLUR */}
            <div className="flex justify-between items-center relative z-20 bg-transparent">
                <div>
                    <h1 className="text-xl text-black dark:text-white font-bold">Competitor Analysis</h1>
                    <p className="text-black dark:text-white">Monitor your competitors every single day</p>
                </div>

                {/* SELECTIONS */}
                <div className="flex justify-between gap-5 items-center">
                    <div>
                        <OurSelect
                            options={accountOptions}
                            value={accountOptions.find((option) => option.value === selectedAccount)}
                            onChange={(selected) => setSelectedAccount(selected?.value)}
                            isMulti={false}
                            placeholder="Type / Select Username"
                        />
                    </div>

                    <div>
                        <OurDatePicker
                            disabled={!selectedAccount}
                            onClick={() => setIsShowDatepicker(!isShowDatepicker)}
                        />
                    </div>

                    {/* <div>
                        <OurSelect
                            disabled={!selectedAccount || !period}
                            options={competitorOptions}
                            value={
                                selectedAccount && period
                                    ? competitorOptions.filter((option) =>
                                        selectedCompetitor.includes(option.value)
                                    )
                                    : []
                            }
                            onChange={(selected) => setSelectedCompetitor(selected.map((item) => item.value))}
                            isMulti={true}
                            placeholder="Hide / Show Competitors"
                        />
                    </div> */}
                </div>
            </div>

            {/* KONTEN LAINNYA YANG TERBLUR */}
            <div
                className={`mt-4 min-h-screen transition-all duration-300 ease-in-out relative ${!selectedAccount || (!period.start && !period.end) ? "blur-sm pointer-events-none" : ""
                    }`}
                >
                {/* FAIR Score & Top Ranking */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-9 rounded-lg">
                        <FairScoreCard platform={platform} description="A measurement for assessing account performance on social media." />
                    </div>
                    <div className="lg:col-span-3 rounded-lg">
                        <TopRankingCard platform={platform} description="Jumlah orang yang mengikuti akun." />
                    </div>
                </div>

                {/* Growth Chart Analysis */}
                <div className="lg:col-span-12 rounded-lg flex w-full items-center my-4">
                    {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" />}
                    <div className="mx-3 w-auto text-lg font-bold">Growth Metrics</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* FAIR Detail */}
                <div className="grid lg:col-span-12 gap-4 mt-4">
                    <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3 transition-colors">
                        <InstagramChart username={selectedAccount} startDate={period.start} endDate={period.end} platform="Instagram" />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                    {/* Instagram */}
                    {platform === "Instagram" && <FairDetailCard platform={platform} label="Followers" description="Number of Followers" />}
                    {platform === "Instagram" && <FairDetailCard platform={platform} label="Likes" description="Number of Likes" />}
                    {platform === "Instagram" && <FairDetailCard platform={platform} label="Views" description="Number of View Counts" />}
                    {platform === "Instagram" && <FairDetailCard platform={platform} label="Comments" description="Number of Comments" />}
                    {/* Tiktok */}
                    {platform === "TikTok" && <FairDetailCard platform={platform} label="Followers" description="Number of Followers" />}
                    {platform === "TikTok" && <FairDetailCard platform={platform} label="Views" description="Number of View Counts" />}
                    {platform === "TikTok" && <FairDetailCard platform={platform} label="Likes" description="Number of Likes" />}
                    {platform === "TikTok" && <FairDetailCard platform={platform} label="Saves" description="Number of Save Counts" />}
                    {platform === "TikTok" && <FairDetailCard platform={platform} label="Comments" description="Number of Comments" />}
                    {platform === "TikTok" && <FairDetailCard platform={platform} label="Shares" description="Number of Shares" />}
                </div>

                {/* POST DETAIL */}
                <div className="flex w-full items-center my-4">
                    {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" />}
                    <div className="mx-3 w-auto text-lg font-bold">Content Performance Report</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* Detail Post */}
                <div className="grid grid-cols-12 gap-4 mt-4 h-[800px]">
                    <div className="lg:col-span-12 rounded-lg">
                        <PostsTable platform={platform} />
                    </div>
                </div>
            </div>

            {/* OVERLAY TEKS SAAT BELUM PILIH USERNAME */}
            {!selectedAccount || !period && (
                <div className="h-screen absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/50 z-10">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Please select a username to continue...
                    </p>
                </div>
            )}
        </div>
    );
};

export default Competitor;
