import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerStyle.css";
import moment from "moment";
import { usePerformanceContext } from "@/context/PerformanceContext";
import styled from "styled-components";

const DateRangePicker = ({ onClick, disabled }) => {
    const { period, setPeriod } = usePerformanceContext();
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

    useEffect(() => {
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

            setPeriod({
                start: startOfMonth,
                end: endOfMonth,
            });
            setSelectedMonth(date);
        }
    };

    const customDatePickerStyles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
        },
        calendar: {
            backgroundColor: '#1e1e2f',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            padding: '10px',
        },
        // popper: {
        //     zIndex: 9999,
        // },
    };

    const StyledDatePicker = styled(DatePicker)`
        width: 100%;
        max-width: 220px;
        height: 40px;
        border-radius: 8px;
        font-size: 14px;
        padding: 0 12px;
        background-color: #1f2937;
        color: white;
        outline: none;
        transition: all 0.2s ease-in-out;
        border: 1px solid #4b5563;
        text-align: left;
        cursor: pointer;

        &:hover {
            border-color: #60a5fa;
        }

        &.custom-datepicker-input {
            &.datepicker-disabled {
                cursor: not-allowed;
            }
        }
    `;

    return (
        <div style={customDatePickerStyles.container}>
            <StyledDatePicker
                disabled={disabled}
                selected={selectedMonth}
                onChange={handleMonthChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className={`custom-datepicker-input ${disabled ? "datepicker-disabled cursor-not-allowed opacity-50" : ""}`}
                calendarClassName="custom-datepicker-calendar"
                popperClassName="custom-datepicker-popper"
                placeholderText={disabled ? "Please fill account" : "Select Month"}
                onKeyDown={(e) => e.preventDefault()}
                onFocus={(e) => e.target.blur()}
            />
        </div>
    );
};

export default DateRangePicker;