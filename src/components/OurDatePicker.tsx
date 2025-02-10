"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customDatePickerStyles = {
	control: (provided, state) => ({
		...provided,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "42px", // Sama dengan OurSelect
		width: "100%",
		borderRadius: "8px", // Sesuai dengan input OurSelect
		border: "1px solid #d1d5db",
		backgroundColor: "#f9fafb",
		boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
		transition: "all 0.2s",
		"&:hover": {
			backgroundColor: "#e5e7eb",
		},
	}),
	calendar: (provided) => ({
		...provided,
		borderRadius: "8px",
		border: "1px solid #d1d5db",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		backgroundColor: "white",
		zIndex: 10,
	}),
	day: (state) => ({
		cursor: "pointer",
		padding: "4px 8px",
		borderRadius: "4px",
		backgroundColor: state.isSelected ? "#3b82f6" : state.isToday ? "#e5e7eb" : "white",
		color: state.isSelected ? "white" : "black",
		transition: "all 0.2s",
		"&:hover": {
			backgroundColor: "#d1d5db",
		},
	}),
};

const DateRangePicker = ({ applyCallback, onClick }) => {
	const [dateRange, setDateRange] = useState([null, null]);
	const [startDate, endDate] = dateRange;

	return (
		<div className="w-full">
			<div className="relative" style={{ zIndex: 10 }}>
				<DatePicker
					onClick={onClick}
					selected={startDate}
					onChange={(dates) => {
						const [start, end] = dates;
						setDateRange([start, end]);
						if (start && end) {
							applyCallback([start, end]);
						}
					}}
					startDate={startDate}
					endDate={endDate}
					selectsRange
					isClearable
					placeholderText="Select Date Range"
					className="w-full h-[42px] rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 px-4 text-sm transition-all"
					calendarClassName="rounded-md border border-gray-300 shadow-lg bg-white"
					popperPlacement="bottom-start"
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;
