"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import OurEmptyData from "@/components/OurEmptyData";
import OurLoading from "@/components/OurLoading";
import data from "@/app/pageClient/competitor/dummyData/detailPost.json"; // Import data dummy

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

const PostsTable = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulasi fetching data dari JSON
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPosts(data); // Langsung ambil data tanpa filtering
            setLoading(false);
        }, 1000); // Simulasi delay 1 detik
    }, []);

    return (
        <section className="mb-6 2xl:mb-0 2xl:flex-1 shadow-md rounded-lg bg-gray-200 dark:bg-gray-800 p-5">
            <div className="max-h-[500px] flex flex-col space-y-5">
                <div className="table-content w-full overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                        <thead className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                            <tr>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Username</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Content</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Date</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Likes</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Comments</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Views</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Shares</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Collections</th>
                                <th className="px-6 py-4 border border-gray-400 dark:border-gray-600">Downloads</th>
                            </tr>
                        </thead>

                        <tbody className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center p-5">
                                        <OurLoading />
                                    </td>
                                </tr>
                            ) : posts.length > 0 ? (
                                posts.map((post, key) => (
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
