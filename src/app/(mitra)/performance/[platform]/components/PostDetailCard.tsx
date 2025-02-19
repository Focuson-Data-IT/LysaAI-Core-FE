"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import OurEmptyData from "@/components/OurEmptyData";
import OurLoading from "@/components/OurLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import request from "@/utils/request";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { useAuth } from "@/hooks/useAuth";
import { performanceBuilder } from "@/resolver";
import { FaUserCircle, FaHeart, FaCommentDots, FaPlayCircle, FaShareSquare, FaSave, FaDownload, FaChartBar, FaRegCalendarAlt, FaQuoteLeft } from "react-icons/fa"

interface Post {
    username: string;
    caption: string;
    platform: string;
    post_code: string;
    unique_id_post: string;
    created_at: string;
    thumbnail_url: string;
    likes: number;
    comments: number;
    playCount: number;
    shareCount: number;
    collectCount: number;
    downloadCount: number;
    performa_konten: number;
    performa_color: string;
}

const PostsTable = ({ platform = null }) => {
    const { authUser } = useAuth();
    const { period, selectedAccount, selectedCompetitor } = usePerformanceContext();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "performa_konten",
        direction: "desc"
    });

    const [perPage] = useState(5); // Default 5 per load
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [avatars, setAvatars] = useState<{ [key: string]: string | null }>({});

    // Fetch data function
    const getPosts = async () => {
        if (!hasMore) return;
    
        setLoading(true);
        try {
            const response = await request.get(`/getAllPost?perPage=${perPage}&page=${currentPage}&platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}&orderBy=${sortConfig.key}&direction=${sortConfig.direction}`);
    
            let newPosts = performanceBuilder(response.data?.data);
    
            // Hindari duplikasi dengan menyaring data yang sudah ada
            setPosts((prev) => {
                const existingIds = new Set(prev.map((post) => post.post_code)); // Gunakan unique key
                return [...prev, ...newPosts.filter((post) => !existingIds.has(post.post_code))];
            });
    
            setHasMore(response.data?.hasMore);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };    

    useEffect(() => {
        const fetchAvatars = async () => {
            const newAvatars = { ...avatars };

            for (const post of posts) {
                if (!newAvatars[post.username]) {
                    try {
                        console.log(`Fetching avatar for: ${post.username}`);

                        const response = await request.get(
                            `/getPictureData?kategori=${authUser?.username}&platform=${platform}&username=${post.username}`
                        );

                        console.log("Avatar response:", response.data);

                        if (response.data?.data[0]?.profile_pic_url) {
                            // newAvatars[post.username] = `${process.env.NEXT_PUBLIC_HOST}/proxy-image?url=${encodeURIComponent(response.data.data[0].profile_pic_url)}`;
                            newAvatars[post.username] = `${response.data.data[0].profile_pic_url}`;
                            console.log(`Avatar URL for ${post.username}:`, response.data.data[0].profile_pic_url);
                        } else {
                            console.warn(`No avatar found for ${post.username}`);
                            newAvatars[post.username] = null;
                        }
                    } catch (error) {
                        console.error("Error fetching avatar:", error);
                        newAvatars[post.username] = null;
                    }
                }
            }

            setAvatars((prevAvatars) => ({ ...prevAvatars, ...newAvatars }));
        };

        if (posts.length > 0) {
            console.log("Fetching avatars...");
            fetchAvatars();
        }
    }, [posts]);

    // Handle sorting
    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setPosts([]); // Reset posts ketika sorting berubah
        setCurrentPage(1); // Reset ke halaman pertama
        setHasMore(true); // Reset load more state
    };

    useEffect(() => {
        getPosts().then((v) => {
            setLoading(false);
        });
    }, [authUser, platform, period, selectedCompetitor, sortConfig]);

    return (
        <div className="box box-sizing overflow-x-hidden py-5 h-auto flex flex-col space-y-5 rounded-lg w-full bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
            <div className="info flex justify-end space-x-2 mr-5">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Best</p>
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <p className="text-sm">Mediocre</p>
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <p className="text-sm">Worst</p>
            </div>
            <div className="table-content flex-grow overflow-y-auto">
                <table className="w-full table-fixed border-collapse border-gray-300 dark:border-gray-700">
                    <thead className="h-[50px] bg-gray-100 dark:bg-gray-700 text-black dark:text-white sticky top-0 z-10">
                        <tr className="text-center">
                            {[
                                // { key: "username", label: <FaUser className="text-[#07d1d6] text-lg" />, width: "w-[200px]", tooltip: "Username" },
                                { key: "caption", label: <FaQuoteLeft className="text-[#07d1d6] text-lg" />, width: "w-[250px]", tooltip: "Caption" },
                                { key: "created_at", label: <FaRegCalendarAlt className="text-[#07d1d6] text-lg" />, width: "w-[150px]", tooltip: "Date" },
                                { key: "likes", label: <FaHeart className="text-[#07d1d6] text-lg" />, width: "w-[100px]", tooltip: "Likes" },
                                { key: "comments", label: <FaCommentDots className="text-[#07d1d6] text-lg" />, width: "w-[100px]", tooltip: "Comments" },
                                { key: "playCount", label: <FaPlayCircle className="text-[#07d1d6] text-lg" />, width: "w-[120px]", tooltip: "Play Count" },
                                { key: "shareCount", label: <FaShareSquare className="text-[#07d1d6] text-lg" />, width: "w-[120px]", tooltip: "Shares" },
                                { key: "collectCount", label: <FaSave className="text-[#07d1d6] text-lg" />, width: "w-[120px]", tooltip: "Saves" },
                                { key: "downloadCount", label: <FaDownload className="text-[#07d1d6] text-lg" />, width: "w-[120px]", tooltip: "Downloads" },
                                { key: "performa_konten", label: <FaChartBar className="text-[#07d1d6] text-lg" />, width: "w-[100px]", tooltip: "Performance" },
                            ].map(({ key, label, width, tooltip }) => (
                                <th key={key} className={`px-4 py-2 text-sm font-bold dark:border-gray-600 cursor-pointer ${width}`} onClick={() => requestSort(key)}>
                                    <div className="relative group flex justify-center items-center gap-2">
                                        {label}
                                        <span className="ml-1 flex">
                                            <FontAwesomeIcon icon={faSortUp} className={`${sortConfig.key === key && sortConfig.direction === "asc" ? "text-red-500" : "text-gray-500"} text-xs`} />
                                            <FontAwesomeIcon icon={faSortDown} className={`${sortConfig.key === key && sortConfig.direction === "desc" ? "text-red-500" : "text-gray-500"} text-xs`} />
                                        </span>
                                        {tooltip && (
                                            <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:flex bg-gray-700 text-white text-xs rounded-md px-2 py-1">
                                                {tooltip}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
                        {
                            loading ? (
                                <div className="flex items-center justify-center h-full items-center">
                                    <OurLoading />
                                </div>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center p-5">
                                        <OurEmptyData width={100} />
                                    </td>
                                </tr>
                            ) : selectedAccount == null ? (
                                    <tr>
                                        <td colSpan={9} className="text-center justify-center items-center w-full p-5 text-white rounded-lg">
                                            <p className={"text-sm w-full"}>Please fill your account first</p>
                                        </td>
                                    </tr>
                            ) : (
                            posts.map((post, key) => (
                                <tr key={key} className="h-[30px] border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">

                                    {/* Kolom gabungan Username + Caption */}
                                    <td className="px-4 py-4 text-left text-sm w-[300px]">
                                        <div className="flex items-start gap-2">
                                            {/* Avatar / Ikon User */}
                                            <div className="flex-shrink-0 w-10 h-10">
                                                {avatars[post.username] ? (
                                                    <>
                                                        <img
                                                            src={avatars[post.username]}
                                                            // alt={post.username}
                                                            className="w-full h-full object-cover rounded-full"
                                                            alt={"avatar_user"}/>
                                                    </>
                                                ) : (
                                                    <FaUserCircle className="text-gray-500 w-10 h-10" />
                                                )}
                                            </div>

                                            {/* Info Username + Caption */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-black dark:text-white">{post.username}</span>
                                                    {/* {post.platform === "Instagram" ? (
                                                        <FaInstagram className="text-[#bc2a8d] text-sm" />
                                                    ) : (
                                                        <FaTiktok className="text-black dark:text-white text-sm" />
                                                    )} */}
                                                </div>

                                                {/* Caption */}
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-tight mt-1">
                                                    {post.caption.length > 50 ? `${post.caption.substring(0, 50)}...` : post.caption}
                                                </p>

                                                {/* Link ke Original Post dengan Thumbnail Tooltip */}
                                                <div className="relative group inline-block">
                                                    <a
                                                        href={
                                                            post.platform === "Instagram"
                                                                ? `https://www.instagram.com/p/${post.post_code}`
                                                                : `https://www.tiktok.com/@${post.username}/video/${post.unique_id_post}`
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 dark:text-blue-300 text-sm font-semibold mt-1 block"
                                                    >
                                                        Original Post
                                                    </a>

                                                    {/* Tooltip untuk Thumbnail */}
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex w-40 h-40 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 z-50">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_HOST}/proxy-image?url=${encodeURIComponent(post.thumbnail_url)}`}
                                                            // src={`${post.thumbnail_url}`}
                                                            alt="Thumbnail"
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom Lainnya */}
                                    <td className="px-2 py-4 text-center">{moment(post.created_at).format("DD MMM YYYY")}</td>
                                    <td className="px-2 py-4 text-center">{post.likes ? new Intl.NumberFormat('id-ID').format(post.likes) : 0}</td>
                                    <td className="px-2 py-4 text-center">{post.comments ? new Intl.NumberFormat('id-ID').format(post.comments) : 0}</td>
                                    <td className="px-2 py-4 text-center">{post.playCount ? new Intl.NumberFormat('id-ID').format(post.playCount) : 0}</td>
                                    <td className="px-2 py-4 text-center">{post.shareCount ? new Intl.NumberFormat('id-ID').format(post.shareCount) : 0}</td>
                                    <td className="px-2 py-4 text-center">{post.collectCount ? new Intl.NumberFormat('id-ID').format(post.collectCount) : 0}</td>
                                    <td className="px-2 py-4 text-center">{post.downloadCount ? new Intl.NumberFormat('id-ID').format(post.downloadCount) : 0}</td>

                                    {/* Indikator Performa */}
                                    <td className="px-2 py-4 items-center justify-center h-full w-full">
                                        <div className={`w-4 h-4 mx-auto rounded-full bg-${post.performa_color}-500`}></div>
                                    </td>


                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Load More Button */}
            {hasMore && selectedAccount != null && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => {
                            setCurrentPage((prev) => prev + 1);
                            getPosts();
                        }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostsTable;
