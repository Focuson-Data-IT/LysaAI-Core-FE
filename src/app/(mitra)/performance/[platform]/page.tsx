// "use client";

// import { useParams } from "next/navigation";
// import FairDetailBar from "./components/FairDetailBar";
// import FairDetailCard from "./components/FairDetailCard";
// import FairScoreCard from "./components/FairScoreCard";
// import TopRankingCard from "./components/TopRankingCard";
// import PostsTable from "./components/PostDetailCard";
// import PerformanceContextProvider from "@/context/PerformanceContext";
// import { FaInstagram, FaTiktok } from "react-icons/fa";

// const Competitor = () => {
//     const { platform } = useParams();

//     interface IconComponents {
//         [key: string]: React.ComponentType;
//     }

//     const getIconComponent = (platform: string): React.ComponentType | null => {
//         const icons: IconComponents = {
//             Instagram: FaInstagram,
//             TikTok: FaTiktok
//         };

//         return icons[platform] || null;
//     };

//     const IconComponent = getIconComponent(Array.isArray(platform) ? platform[0] : platform);

//     return (
//         <PerformanceContextProvider>
//             <div className="min-h-screen justify-self-auto overflow-auto mb-5 overflow-x-hidden">
//                 {/* Header */}
//                 <div className="flex justify-between items-center">
//                     <div className="">
//                         <h1 className="text-xl text-black dark:text-white font-bold">Competitor Analysis</h1>
//                         <p className="text-black dark:text-white">Monitor your competitors every single day</p>
//                     </div>

//                     <div className="flex justify-between gap-5 items-center">
//                         <div className="">
//                             <h1 className="text-xl text-black dark:text-white font-bold">Select Your Account</h1>
//                             <p className="text-black dark:text-white">Selection Here</p>
//                         </div>
//                         <div className="">
//                             <h1 className="text-xl text-black dark:text-white font-bold">Select Your Competitor</h1>
//                             <p className="text-black dark:text-white">Selection Here</p>
//                         </div>
//                         <div className="">
//                             <h1 className="text-xl text-black dark:text-white font-bold">Select Period</h1>
//                             <p className="text-black dark:text-white">Selection Here</p>
//                         </div>
//                     </div>

//                 </div>

//                 {/* FAIR Score & Top Ranking */}
//                 <div className="grid grid-cols-12 gap-4 mt-4">
//                     <div className="lg:col-span-8 rounded-lg">
//                         <FairScoreCard platform={platform} description="Jumlah orang yang mengikuti akun." />
//                     </div>
//                     <div className="lg:col-span-4 rounded-lg">
//                         <TopRankingCard platform={platform} description="Jumlah orang yang mengikuti akun." />
//                     </div>
//                 </div>

//                 {/* FAIR Section */}
//                 {/* <div className="flex w-full items-center my-4">
//                 {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
//                     <div className="mx-3 w-auto text-lg font-bold">Fair</div>
//                     <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
//                 </div> */}

//                 {/* Metrics Grid */}
//                 <div className="grid grid-cols-12 gap-4 mt-4">
//                     {/* <div className="lg:col-span-3 rounded-lg">
//                         <FairDetailBar platform={platform} label="Followers" description="Jumlah orang yang mengikuti akun." />
//                     </div>
//                     <div className="lg:col-span-3 rounded-lg">
//                         <FairDetailBar platform={platform} label="Activities" description="Tingkat produktivitas dalam membuat dan mengunggah konten setiap hari." unit="Posts/Day" />
//                     </div>
//                     <div className="lg:col-span-3 rounded-lg">
//                         <FairDetailBar platform={platform} label="Interactions" description="Jumlah warganet yang berinteraksi dengan akun pada setiap konten yang diunggah." unit="Likes/Post" />
//                     </div>
//                     <div className="lg:col-span-3 rounded-lg">
//                         <FairDetailBar platform={platform} label="Responsiveness" description="Persentase respons dari tim pengelola terhadap warganet yang berkomentar." unit="%" />
//                     </div> */}


//                     <div className="lg:col-span-12 rounded-lg flex w-full items-center my-4">
//                         {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
//                         <div className="mx-3 w-auto text-lg font-bold">Growth Chart Analysis</div>
//                         <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
//                     </div>

//                     <div className="lg:col-span-6 rounded-lg h-[400px]">
//                         <FairDetailCard platform={platform} label="Followers" description="Jumlah orang yang mengikuti akun." />
//                     </div>
//                     <div className="lg:col-span-6 rounded-lg h-[400px]">
//                         <FairDetailCard platform={platform} label="Activities" description="Tingkat produktivitas dalam membuat dan mengunggah konten setiap hari." />
//                     </div>
//                     <div className="lg:col-span-6 rounded-lg h-[400px]">
//                         <FairDetailCard platform={platform} label="Interactions" description="Jumlah warganet yang berinteraksi dengan akun pada setiap konten yang diunggah." />
//                     </div>
//                     <div className="lg:col-span-6 rounded-lg h-[400px]">
//                         <FairDetailCard platform={platform} label="Responsiveness" description="Persentase respons dari tim pengelola terhadap warganet yang berkomentar." />
//                     </div>
//                 </div>

//                 {/* POST DETAIL Section */}
//                 <div className="flex w-full items-center my-4">
//                     {IconComponent && <IconComponent className="h-7 w-7 text-[#41c2cb]" {...(IconComponent as any)} />}
//                     <div className="mx-3 w-auto text-lg font-bold">Post Detail</div>
//                     <hr className="flex-1 border-t-2 border-t-[#41c2cb] h-[1px]" />
//                 </div>

//                 {/* Detail Post */}
//                 <div className="grid grid-cols-12 gap-4 mt-4 h-[800px]">
//                     <div className="lg:col-span-12 rounded-lg">
//                         <PostsTable platform={platform} />
//                     </div>
//                 </div>
//             </div>
//         </PerformanceContextProvider>
//     );
// };

// export default Competitor;

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

const Competitor = () => {
    const { platform } = useParams();
    const { period, selectedCompetitor } = usePerformanceContext();

    // State untuk Select & DatePicker
    const [accountOptions, setAccountOptions] = useState([]);
    const [competitorOptions, setCompetitorOptions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedCompetitors, setSelectedCompetitors] = useState([]);
    const [isShowDatepicker, setIsShowDatepicker] = useState<boolean>(false);

    useEffect(() => {
        // Fetch daftar akun dari database
        const fetchUsernames = async () => {
            try {
                const response = await request.get("/getDistinctUsernames");
                const usernames = response.data?.data || [];

                // Konversi ke format OurSelect
                const formattedOptions = usernames.map((username: string) => ({
                    label: username,
                    value: username,
                }));

                setAccountOptions(formattedOptions);
                setCompetitorOptions(formattedOptions);
            } catch (error) {
                console.error("Error fetching usernames:", error);
            }
        };

        fetchUsernames();
    }, []);

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
                            {/* <h1 className="text-xl text-black dark:text-white font-bold">Select Your Account</h1> */}
                            <OurSelect
                                options={accountOptions}
                                value={selectedAccount}
                                onChange={setSelectedAccount}
                                isMulti={false} // Hanya bisa pilih satu akun
                                placeholder="Select Your Account"
                            />
                        </div>

                        {/* Select Your Competitor */}
                        <div>
                            {/* <h1 className="text-xl text-black dark:text-white font-bold">Select Your Competitor</h1> */}
                            <OurSelect
                                options={competitorOptions}
                                value={selectedCompetitors}
                                onChange={setSelectedCompetitors}
                                isMulti={true} // Bisa memilih lebih dari satu akun
                                placeholder="Select Your Competitor"
                            />
                        </div>

                        {/* Select Period */}
                        <div>
                            {/* <h1 className="text-xl text-black dark:text-white font-bold">Select Period</h1> */}
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
