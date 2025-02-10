"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import OurEmptyData from "@/components/OurEmptyData";
import OurLoading from "@/components/OurLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import request from "@/utils/request";
import {usePerformanceContext} from "@/context/PerformanceContext";

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
}

const PostsTable = ({platform = null}) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;

    const { period, selectedCompetitor } = usePerformanceContext();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: "asc" | "desc" } | null>(null);

    const getPosts = async () => {
        setLoading(true);
        const response = await request.get(`/getAllPost?platform=${platform}&kategori=${user?.username}&start_date=${period}&end_date=${moment(period)?.endOf('month').format("YYYY-MM-DD")}`);
        // const response = await request.get(`/getAllPost?kategori=${user?.username}&start_date=2025-01-01&end_date=2025-01-09&platform=${platform}`);

        return response.data?.data;
    }

    // Simulasi fetching data dari JSON
    useEffect(() => {
        getPosts().then((v) => {
            setPosts(v);

            if (selectedCompetitor && selectedCompetitor.length > 0) {
                const filteredData = v.filter((item: any) => {
                    return selectedCompetitor.some((competitor: any) => competitor.value === item.username);
                });
                setPosts(filteredData);
            }

            setLoading(false);
        });
    }, [platform, period, selectedCompetitor]);

    const sortedPosts = React.useMemo(() => {
        const sortablePosts = [...posts];
        if (sortConfig !== null) {
            sortablePosts.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortablePosts;
    }, [posts, sortConfig]);

    const requestSort = (key: keyof Post) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Post) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === "asc" ? (
            <FontAwesomeIcon icon={faSortUp} className="ml-2" />
        ) : (
            <FontAwesomeIcon icon={faSortDown} className="ml-2" />
        );
    };

    return (
        <section className="mb-6 2xl:mb-0 2xl:flex-1 shadow-md rounded-lg bg-gray-200 dark:bg-gray-800 p-5">
            <div className="max-h-[500px] flex flex-col space-y-5">
                <div className="table-content w-full overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                        <thead className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                            <tr>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("username")}>
                                    Username {getSortIcon("username")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("caption")}>
                                    Content {getSortIcon("caption")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("created_at")}>
                                    Date {getSortIcon("created_at")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("likes")}>
                                    Likes {getSortIcon("likes")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("comments")}>
                                    Comments {getSortIcon("comments")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("playCount")}>
                                    Views {getSortIcon("playCount")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("shareCount")}>
                                    Shares {getSortIcon("shareCount")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("collectCount")}>
                                    Collections {getSortIcon("collectCount")}
                                </th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 cursor-pointer" onClick={() => requestSort("downloadCount")}>
                                    Downloads {getSortIcon("downloadCount")}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center p-5">
                                        <OurLoading />
                                    </td>
                                </tr>
                            ) : sortedPosts.length > 0 ? (
                                sortedPosts.map((post, key) => (
                                    <tr key={key} className="border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                        <td className="px-6 py-4">{post.username}</td>
                                        <td className="px-6 py-4">
                                            {post.caption} <br />
                                            <span
                                                onClick={() =>
                                                    window.open(
                                                        post.platform === "Instagram"
                                                            ? `https://www.instagram.com/p/${post.post_code}`
                                                            : `https://www.tiktok.com/@${post.username}/video/${post.unique_id_post}`,
                                                        "_blank"
                                                    )
                                                }
                                                className="text-blue-500 dark:text-blue-300 cursor-pointer"
                                            >
                                                Original Post
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{moment(post.created_at).format("DD MMM YYYY")}</td>
                                        <td className="px-6 py-4 text-end">{post.likes}</td>
                                        <td className="px-6 py-4 text-end">{post.comments}</td>
                                        <td className="px-6 py-4 text-end">{post.playCount}</td>
                                        <td className="px-6 py-4 text-end">{post.shareCount}</td>
                                        <td className="px-6 py-4 text-end">{post.collectCount}</td>
                                        <td className="px-6 py-4 text-end">{post.downloadCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center p-5">
                                        <OurEmptyData width={100} />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default PostsTable;