"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import FairDetailCard from "./components/FairDetailCard";
import FairScoreCard from "./components/FairScoreCard";
import TopRankingCard from "./components/TopRankingCard";
import PostsTable from "./components/PostDetailCard";
import PerformanceContextProvider, { usePerformanceContext } from "@/context/PerformanceContext";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";
import request from "@/utils/request";
import { useAuth } from "@/hooks/useAuth";

const Competitor = () => {
    const { platform } = useParams();
    const { authUser } = useAuth();

    // State untuk Select & DatePicker
    const [accountOptions, setAccountOptions] = useState([]);
    const [competitorOptions, setCompetitorOptions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState([]);
    const [selectedCompetitors, setSelectedCompetitors] = useState([]);
    const [isShowDatepicker, setIsShowDatepicker] = useState<boolean>(false);

    useEffect(() => {
        // Fetch daftar akun dari database hanya jika authUser sudah tersedia
        const fetchUsernames = async () => {
            if (authUser?.username) {
                try {
                    const response = await request.get(`/getAllUsername?kategori=${authUser.username}&platform=${platform}`);
                    const usernames = response.data?.data || [];

                    // Konversi ke format OurSelect
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
                    <div>
                        <h1 className="text-xl text-black dark:text-white font-bold">Competitor Analysis</h1>
                        <p className="text-black dark:text-white">Monitor your competitors every single day</p>
                    </div>

                    <div className="flex justify-between gap-5 items-center">
                        {/* Select Your Account */}
                        <div>
                            <OurSelect
                                options={accountOptions}
                                value={accountOptions.find(option => option.value === selectedAccount)} // **Pastikan sesuai format**
                                onChange={(selected) => setSelectedAccount(selected.value)} // **Ambil value dari object**
                                isMulti={false} // Hanya bisa pilih satu akun
                                placeholder="Select Your Account"
                            />
                        </div>

                        {/* Select Your Competitor */}
                        <div>
                            <OurSelect
                                options={competitorOptions}
                                value={competitorOptions.filter(option => selectedCompetitors.includes(option.value))} // **Cek array match**
                                onChange={(selected) => setSelectedCompetitors(selected.map(item => item.value))} // **Ambil array value**
                                isMulti={true} // Bisa memilih lebih dari satu akun
                                placeholder="Select Your Competitors"
                            />
                        </div>

                        {/* Select Period */}
                        <div>
                            <OurDatePicker
                                onClick={() => setIsShowDatepicker(!isShowDatepicker)}
                            />
                        </div>
                    </div>
                </div>

                {/* FAIR Score & Top Ranking */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-8 rounded-lg">
                        <FairScoreCard platform={platform} description="Jumlah orang yang mengikuti akun." />
                    </div>
                    <div className="lg:col-span-4 rounded-lg">
                        <TopRankingCard platform={platform} description="Jumlah orang yang mengikuti akun." />
                    </div>
                </div>

                {/* Growth Chart Analysis */}
                <div className="lg:col-span-12 rounded-lg flex w-full items-center my-4">
                    {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
                    <div className="mx-3 w-auto text-lg font-bold">Growth Chart Analysis</div>
                    <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
                </div>

                {/* FAIR Detail */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Followers" description="Jumlah orang yang mengikuti akun." />
                    </div>
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Activities" description="Tingkat produktivitas dalam membuat dan mengunggah konten setiap hari." />
                    </div>
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Interactions" description="Jumlah warganet yang berinteraksi dengan akun pada setiap konten yang diunggah." />
                    </div>
                    <div className="lg:col-span-6 rounded-lg h-[400px]">
                        <FairDetailCard platform={platform} label="Responsiveness" description="Persentase respons dari tim pengelola terhadap warganet yang berkomentar." />
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