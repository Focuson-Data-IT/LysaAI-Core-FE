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

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: "asc" | "desc" } | null>(null);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(1);


    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    }

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const getPosts = async () => {
        setLoading(true);
        const response = await request.get(`/getAllPost?perPage=${perPage}&page=${currentPage}&platform=${platform}&kategori=${authUser?.username}&start_date=${period?.start}&end_date=${period?.end}`);

        setTotalPages(response.data?.totalPages);
        setTotalRows(response.data?.totalRows);
        return response.data?.data;
    }

    // Simulasi fetching data dari JSON
    useEffect(() => {
        getPosts().then((v) => {
            let contentPerformance = performanceBuilder(v);
            setPosts(contentPerformance);

            if (selectedCompetitor && selectedCompetitor.length > 0) {
                const filteredData = contentPerformance.filter((item: any) => {
                    return selectedCompetitor.some((competitor: any) => competitor.value === item.username);
                });

                setPosts(filteredData);
            }

            setLoading(false);
        });
    }, [authUser, platform, period, selectedCompetitor, currentPage, perPage]);

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
        <div className="box box-sizing overflow-x-hidden py-5 h-[750px] flex flex-col space-y-5 rounded-lg w-full bg-gray-200 dark:bg-gray-900 text-black dark:text-white overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
            <div className="info flex justify-end space-x-2 mr-5">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Best</p>

                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <p className="text-sm">Mediocre</p>

                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <p className="text-sm">Worst</p>
            </div>

            <div className="table-content flex-grow overflow-y-auto
">
                <table className="w-full h-[200px] overflow-y-scroll flex-grow justify-center items-center border-collapse border-gray-300 dark:border-gray-700">
                    <thead
                        className="h-[50px] bg-gray-100 dark:bg-gray-700 text-black dark:text-white sticky top-0 z-10">
                        <tr className={""}>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("username")}>
                                Username {getSortIcon("username")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("caption")}>
                                Content {getSortIcon("caption")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("created_at")}>
                                Date {getSortIcon("created_at")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("likes")}>
                                Likes {getSortIcon("likes")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("comments")}>
                                Comments {getSortIcon("comments")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("playCount")}>
                                Views {getSortIcon("playCount")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("shareCount")}>
                                Shares {getSortIcon("shareCount")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("collectCount")}>
                                Save {getSortIcon("collectCount")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("downloadCount")}>
                                Downloads {getSortIcon("downloadCount")}
                            </th>
                            <th className="text-sm font-bold dark:border-gray-600 cursor-pointer"
                                onClick={() => requestSort("performaKonten")}>
                                Content<br/>Performance {getSortIcon("performaKonten")}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="h-[500px] bg-gray-200 dark:bg-gray-900 text-black dark:text-white overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700"
                    >
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center p-5">
                                    <OurLoading />
                                </td>
                            </tr>
                        ) : sortedPosts.length > 0 ? (
                            sortedPosts.map((post, key) => {
                                return (
                                    <tr key={key}
                                        className="h-[30px] border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                        <td className="px-2 py-4 break-words w-[100px]">{post.username}</td>
                                        <td className="px-2 py-4 text-sm break-words w-[100px]">
                                            {post.caption.split(" ").length > 20
                                                ? `${post.caption.split(" ").slice(0, 10).join(" ")}...`
                                                : post.caption} <br />
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
                                        <td className="px-2 py-4">{moment(post.created_at).format("DD MMM YYYY")}</td>
                                        <td className="px-2 py-4 text-end">{post.likes || 0}</td>
                                        <td className="px-2 py-4 text-end">{post.comments || 0}</td>
                                        <td className="px-2 py-4 text-end">{post.playCount || 0}</td>
                                        <td className="px-2 py-4 text-end">{post.shareCount || 0}</td>
                                        <td className="px-2 py-4 text-end">{post.collectCount || 0}</td>
                                        <td className="px-2 py-4 text-end">{post.downloadCount || 0}</td>
                                        <td className="px-2 py-4 flex items-center justify-end me-6 h-full">{
                                            post?.level === 'Best'
                                                ?
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                :
                                                post?.level === 'Medioker'
                                                    ?
                                                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                                                    :
                                                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                        }</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center p-5">
                                    <OurEmptyData width={100} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                    <div className="pagination-content w-full p-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                        <div className="flex w-full items-center justify-center lg:justify-between">
                            <div className="hidden items-center space-x-4 lg:flex">
      <span className="text-sm font-semibold text-bgray-600 dark:text-white">
        Show result:
      </span>
                                <div className="relative dark:bg-darkblack-500">
                                    <select
                                        value={perPage}
                                        onChange={(e) => setPerPage(parseInt(e?.target?.value))}
                                        className="rounded-lg border border-bgray-300 p-2 dark:border-darkblack-400 text-bgray-900 dark:text-bgray-50 bg-black dark:bg-gray-800 focus:outline-none focus:border-bgray-500 focus:ring-0"
                                    >
                                        { [5, 10, 20, 50].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        )) }
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-5 sm:space-x-[35px]">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={handlePreviousPage}
                                    className={`px-2 disabled:opacity-50`}
                                >
        <span>
          <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M12.7217 5.03271L7.72168 10.0327L12.7217 15.0327"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </svg>
        </span>
                                </button>

                                {/* Nomor Halaman */}
                                <div className="flex items-center space-x-2">
                                    {Array(Math.min(5, totalPages)) // Set maximum number of pages displayed to 5 or totalPages, whichever is smaller
                                        .fill(null)
                                        .map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageClick(index + 1)}
                                                className={`rounded-lg px-1 py-1.5 text-xs font-bold ${
                                                    currentPage === index + 1
                                                        ? "bg-success-50 text-success-300"
                                                        : "text-bgray-500 hover:bg-success-50 hover:text-success-300"
                                                } lg:px-6 lg:py-2.5 lg:text-sm`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                            </div>

                                {/* Tombol Next */}
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={handleNextPage}
                                    className={`px-2 disabled:opacity-50`}
                                >
        <span>
          <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M7.72168 5.03271L12.7217 10.0327L7.72168 15.0327"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </svg>
        </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        // <section className="h-[700px] mb-6 2xl:mb-0 2xl:flex-1 shadow-md rounded-lg bg-gray-200 dark:bg-gray-800 p-5">
        // </section>
    );
};

export default PostsTable;