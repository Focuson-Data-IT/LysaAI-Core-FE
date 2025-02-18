import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerStyle.css";
import moment from "moment";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { TPeriod } from "@/types/PerformanceTypes";
import { periodInitialValue } from "@/constant/PerfomanceContants";

const DateRangePicker = ({ onClick }) => {
    const { period, setPeriod } = usePerformanceContext();
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(moment().startOf("month").toDate());

    useEffect(() => {
        // Saat period berubah, update selectedMonth agar sesuai dengan bulan yang dipilih
        setSelectedMonth(moment(period.start).toDate());
    }, [period]);

    useEffect(() => {
        // Set default period to the current month
        const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
        const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

        setPeriod({
            start: startOfMonth,
            end: endOfMonth,
        });
    }, [setPeriod]);

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
                selected={selectedMonth}
                onChange={handleMonthChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="custom-datepicker-input"
                calendarClassName="custom-datepicker-calendar"
                popperClassName="custom-datepicker-popper"
                placeholderText="Select month"
            />
        </div>
    );
};

export default DateRangePicker;