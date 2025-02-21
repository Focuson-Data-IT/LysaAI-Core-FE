// iconHelper.ts

import { IoMdPerson } from "react-icons/io";
import { 
        FaHeart, FaQuoteLeft, FaRegCalendar, FaChartBar,
        FaDownload, FaRegCommentDots, FaShareSquare,
        FaSortAmountDown, FaSortAmountUp
        } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { MdOutlinePermMedia, MdSort } from "react-icons/md";
import { IoBookmarkSharp } from "react-icons/io5";
import React, { JSX } from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

/**
 * Fungsi untuk mendapatkan ikon berdasarkan label.
 * @param label Nama label.
 * @returns Komponen ikon yang sesuai.
 */
export const getIconByLabel = (label: string) => {
  const iconMapping: { [key: string]: JSX.Element } = {
    Followers: React.createElement(IoMdPerson, { size: 24 }),
    Likes: React.createElement(FaHeart, { size: 24 }),
    Views: React.createElement(GrView, { size: 24 }),
    Comments: React.createElement(FaRegCommentDots, { size: 24 }),
    Saves: React.createElement(IoBookmarkSharp, { size: 24 }),
    Downloads: React.createElement(FaDownload, { size: 24 }),
    Shares: React.createElement(FaShareSquare, { size: 24 }),

    Captions: React.createElement(FaQuoteLeft, { size: 24 }),
    Dates: React.createElement(FaRegCalendar, { size: 24 }),
    Contents: React.createElement(MdOutlinePermMedia, { size: 24 }),
    Performances: React.createElement(FaChartBar, { size: 24 }),

    SortUp: React.createElement(GoSortAsc, { size: 16, color: "#41c2cb" }),
    SortDown: React.createElement(GoSortDesc, { size: 16, color: "#41c2cb" }),
    Sort: React.createElement(MdSort, { size: 13 }),
    
  };

  return iconMapping[label] ?? null; // Mengembalikan ikon jika ada, jika tidak null
};