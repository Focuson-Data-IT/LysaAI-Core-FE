import React from 'react';

const topRankingData = [
    { name: "surabaya", link: "https://instagram.com/surabaya", score: "87.50" },
    { name: "hukumdankerjasama.surabaya", link: "https://instagram.com/hukumdankerjasama.surabaya", score: "-" },
    { name: "disperinakersby", link: "https://instagram.com/disperinakersby", score: "-" },
    { name: "disperkim.surabaya", link: "https://instagram.com/disperkim.surabaya", score: "-" },
    { name: "dispusipkotasurabaya", link: "https://instagram.com/dispusipkotasurabaya", score: "-" },
    { name: "dkppsurabaya", link: "https://instagram.com/dkppsurabaya", score: "-" },
];

const TopRankingCard = () => {
    return (
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <div className="font-bold">Top Ranking</div>
                <div className="mr-1 font-bold">Score</div>
            </div>

            {/* Ranking List */}
            <div className="overflow-auto h-[250px]">
                {topRankingData.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <div className="flex items-center">
                            <img src="/bintang-d.svg" alt="icon" className="h-8" />
                            <div className="ml-3">
                                <div className="text-[12px]">{item.name}</div>
                                <div className="text-[10px] text-[#0ED1D6]">{item.link}</div>
                            </div>
                        </div>
                        <div className="font-bold">{item.score}</div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default TopRankingCard;
