import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const customDatePickerStyles = {
	input: () =>
		`dark:text-white focus:border-0 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]`,
	calendar: () =>
		`dark:text-white rounded-2xl border border-gray-900 dark:border-gray-600 mt-2 shadow-lg dark:bg-gray-900 bg-white`,
	day: (state: { isSelected: boolean; isToday: boolean }) =>
		`cursor-pointer px-2 py-1 rounded-md ${
			state.isSelected
				? "bg-blue-500 text-white"
				: state.isToday
					? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
					: "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
		} hover:bg-gray-300 dark:hover:bg-gray-500`,
	popper: () => `absolute z-[10]`,
	month: () => `cursor-pointer px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500`,
};

type OurDatePickerProps = {
	applyCallback: (date: Date | null) => void;
	onClick: () => void;
	type?: "calendar" | "range";
};

const DateRangePicker = ({applyCallback, onClick, type = "calendar"}) => {
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
	const [startDate, endDate] = dateRange;
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);


	return (
		<div className="flex flex-col">
			<div className="relative" style={{zIndex: 10}}>
				{/*<DatePicker*/}
				{/*	selected={selectedDate}*/}
				{/*	onChange={(date: Date) => {*/}
				{/*		setSelectedDate(date);*/}
				{/*		applyCallback(date); // Kirim tanggal yang dipilih ke fungsi callback*/}
				{/*	}}*/}
				{/*	dateFormat="MM/yyyy" // Format tampilan bulan dan tahun*/}
				{/*	showMonthYearPicker // Hanya menampilkan pemilihan bulan dan tahun*/}
				{/*	placeholderText="Pilih bulan dan tahun"*/}
				{/*	// className={customDatePickerStyles.input()}*/}
				{/*	className={"focus:border-0 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]"}*/}
				{/*	calendarClassName={customDatePickerStyles.calendar()}*/}
				{/*	dayClassName={customDatePickerStyles.month}*/}
				{/*	popperPlacement="bottom-start"*/}
				{/*/>*/}

				<DatePicker
					selected={startDate}
					onChange={(dates) => {
						const [start, end] = dates as [Date | null, Date | null];
						setDateRange([start, end]);

						if (start && end) {
							applyCallback({
								start: moment(start).format("YYYY-MM-DD"),
								end: moment(end).format("YYYY-MM-DD"),
							});
						}
					}}
					startDate={startDate}
					endDate={endDate}
					selectsRange
					isClearable
					placeholderText="Select period"
					className={customDatePickerStyles.input()}
					calendarClassName={customDatePickerStyles.calendar()}
					popperPlacement="bottom-start"
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;