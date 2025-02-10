import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {usePerformanceContext} from "@/context/PerformanceContext";
import {TPeriod} from "@/types/PerformanceTypes";
import {periodInitialValue} from "@/constant/PerfomanceContants";

const customDatePickerStyles = {
	input: () =>
		`dark:text-white focus:border-0 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]`,
	calendar: () =>
		`text-white dark:text-white rounded-2xl border border-gray-300 dark:border-[#41c2cb] mt-2 shadow-lg dark:bg-gray-900 bg-white`,
	day: (state: { isSelected: boolean; isToday: boolean }) =>
		`cursor-pointer px-2 py-1 rounded-md ${
			state.isSelected
				? "bg-blue-500 text-white"
				: state.isToday
					? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
					: "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
		} hover:bg-gray-300 dark:hover:bg-gray-500`,
	popper: () => `absolute z-[10]`,
	month: () => `dark:bg-gray-900 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500`,
};

type OurDatePickerProps = {
	applyCallback: (date: Date | null) => void;
	onClick: () => void;
	type?: "calendar" | "range";
};

const DateRangePicker = ({applyCallback = null, onClick, type = "calendar"}) => {
	const { period, setPeriod } = usePerformanceContext();

	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([moment().toDate(), moment().toDate()]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	useEffect(() => {
		// Update `dateRange` saat `period` berubah
		setDateRange([moment(period.start).toDate(), moment(period.end).toDate()]);
	}, [period]);


	return (
		<div className="flex flex-col">
			<div className="relative" style={{zIndex: 10}}>
				<DatePicker
					selected={moment(period.start).toDate()}
					onChange={(dates) => {
						const [start, end] = dates as [Date | null, Date | null];
						setDateRange([start, end]);

						if (start && end) {
							setPeriod({
								start: moment(start).format("YYYY-MM-DD"),
								end: moment(end).format("YYYY-MM-DD"),
							})
						}
					}}
					startDate={dateRange[0]}
					endDate={dateRange[1]}
					selectsRange
					isClearable
					placeholderText="Select period"
					className={customDatePickerStyles.input()}
					calendarClassName={customDatePickerStyles.calendar()}
					// monthClassName={customDatePickerStyles.month()}
					popperPlacement="bottom-start"
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;