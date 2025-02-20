import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerStyle.css";
import moment from "moment";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { TPeriod } from "@/types/PerformanceTypes";
import { periodInitialValue } from "@/constant/PerfomanceContants";

const DateRangePicker = ({ onClick, disabled }) => {
    const { period, setPeriod } = usePerformanceContext();
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

    useEffect(() => {
        // Saat period berubah, update selectedMonth agar sesuai dengan bulan yang dipilih
        if (period?.start) {
            setSelectedMonth(moment(period.start).toDate());
        } else {
            setSelectedMonth(null);
        }
    }, [period]);

    const handleMonthChange = (date: Date) => {
        if (date) {
            const startOfMonth = moment(date).startOf("month").format("YYYY-MM-DD");
            const endOfMonth = moment(date).endOf("month").format("YYYY-MM-DD");

            // Update periode di context
            setPeriod({
                start: startOfMonth,
                end: endOfMonth,
            });

            // Update selected month
            setSelectedMonth(date);
        }
    };

    return (
        <div className="datepicker-container">
            <DatePicker
                disabled={disabled}
                selected={selectedMonth}
                onChange={handleMonthChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className={`custom-datepicker-input ${disabled ? "datepicker-disabled cursor-not-allowed opacity-50" : ""}`}
                calendarClassName="custom-datepicker-calendar"
                popperClassName="custom-datepicker-popper"
                placeholderText={disabled ? "Please fill account" : "Select Month"}
                onKeyDown={(e) => e.preventDefault()} // Mencegah input dari keyboard
                onFocus={(e) => e.target.blur()}
            />
        </div>
    );
};

export default DateRangePicker;