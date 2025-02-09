import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customDatePickerStyles = {
	input: () =>
		`rounded-md flex items-center justify-between rounded-2xl h-[42px] block w-full border border-gray-300 dark:border-gray-600 outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-4 text-sm transition-all`,
	calendar: () =>
		`rounded-2xl border border-gray-300 dark:border-gray-600 mt-2 shadow-lg dark:bg-gray-800 bg-white`,
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
				<DatePicker
					selected={selectedDate}
					onChange={(date: Date) => {
						setSelectedDate(date);
						applyCallback(date); // Kirim tanggal yang dipilih ke fungsi callback
					}}
					dateFormat="MM/yyyy" // Format tampilan bulan dan tahun
					showMonthYearPicker // Hanya menampilkan pemilihan bulan dan tahun
					placeholderText="Pilih bulan dan tahun"
					// className={customDatePickerStyles.input()}
					className={"focus:border-0 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]"}
					calendarClassName={customDatePickerStyles.calendar()}
					dayClassName={customDatePickerStyles.month}
					popperPlacement="bottom-start"
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;

