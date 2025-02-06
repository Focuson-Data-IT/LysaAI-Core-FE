import React from 'react';
import FairScoreGraph from './mainComponents/fairScore/FairScoreGraph';

const FairScoreCard = () => {
    return (
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900 transition-colors">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/icon-circle.png" alt="widgets_separator_ticon" className="h-7" />
                    <div className="font-bold mx-3 ">
                        FAIR Score
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]">
                        Data Record
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon lucide lucide-chevron-down ml-2 h-4 w-4">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </button>

                    <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]">
                        Hide/Show Competitor
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon lucide lucide-chevron-down ml-2 h-4 w-4">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Data Section */}
            <div className="h-[250px] pt-3 flex items-center justify-center">
                <div className="my-3 w-full text-center text-muted-foreground">

                        no. data....

                </div>
            </div>
        </div>
    );
};

export default FairScoreCard;
