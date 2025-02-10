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

interface Post {
    username: string;
    caption: string;
    platform: string;
    post_code: string;
    unique_id_post: string;
    created_at: string;
    likes: number;
    comments: number;
    playCount: number;
    shareCount: number;
    collectCount: number;
    downloadCount: number;
    performaKonten: number;
}

const PostsTable = ({ platform = null }) => {
    const { authUser } = useAuth();
    const { period, selectedCompetitor } = usePerformanceContext();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: "asc" | "desc" } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const getPosts = async () => {
        setLoading(true);
        try {
            const response = await request.get(
                `/getAllPost?platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`
            );
            console.info("API Response:", response.data); // Debugging
            return response.data?.data || [];
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPosts().then((data) => {
            let contentPerformance = performanceBuilder(data);
            
            if (selectedCompetitor?.length > 0) {
                contentPerformance = contentPerformance.filter((item) =>
                    selectedCompetitor.some((competitor) => competitor.value === item.username)
                );
            }
            
            setPosts(contentPerformance);
        });
    }, [authUser, platform, period, selectedCompetitor]);

    const sortedPosts = React.useMemo(() => {
        const sortablePosts = [...posts];
        if (sortConfig !== null) {
            sortablePosts.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortablePosts;
    }, [posts, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(sortedPosts.length / itemsPerPage));
    const paginatedPosts = sortedPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="box py-5 h-[750px] flex flex-col space-y-5 rounded-lg w-full bg-gray-200 dark:bg-gray-900 text-black dark:text-white overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
            {loading ? <OurLoading /> : paginatedPosts.length === 0 ? <OurEmptyData width={20} /> : (
                <div className="w-full flex flex-col">
                    {paginatedPosts.map((post) => (
                        <div key={post.unique_id_post} className="p-4 border-b border-gray-300 dark:border-gray-700">
                            <p><strong>{post.username}</strong>: {post.caption}</p>
                            <p>{moment(post.created_at).format("DD MMM YYYY HH:mm")}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination-content w-full p-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                <div className="flex w-full items-center justify-center lg:justify-between">
                    <div className="hidden items-center space-x-4 lg:flex">
                        <span className="text-sm font-semibold"> Show result: </span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="rounded-lg border px-2.5 py-2 text-black bg-white dark:border-darkblack-400 dark:text-white dark:bg-darkblack-500"
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex items-center space-x-5">
                        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-2 disabled:opacity-50">◀</button>
                        <div className="flex items-center space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`rounded-lg px-4 py-1.5 text-xs font-bold ${currentPage === index + 1 ? "bg-success-50 text-success-300" : "text-gray-500 hover:bg-success-50 hover:text-success-300"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-2 disabled:opacity-50">▶</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsTable;
