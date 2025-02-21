// import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";
// import { usePerformanceContext } from "@/context/PerformanceContext";
// import styled from "styled-components";

// const DateRangePicker = ({ onClick, disabled }) => {
//     const { period, setPeriod } = usePerformanceContext();
//     const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

//     useEffect(() => {
//         if (period?.start) {
//             setSelectedMonth(moment(period.start).toDate());
//         } else {
//             setSelectedMonth(null);
//         }
//     }, [period]);

//     const handleMonthChange = (date: Date) => {
//         if (date) {
//             const startOfMonth = moment(date).startOf("month").format("YYYY-MM-DD");
//             const endOfMonth = moment(date).endOf("month").format("YYYY-MM-DD");

//             setPeriod({
//                 start: startOfMonth,
//                 end: endOfMonth,
//             });
//             setSelectedMonth(date);
//         }
//     };

//     const customDatePickerStyles = {
//         container: {
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '8px',
//         },
//         calendar: {
//             backgroundColor: '#1e1e2f',
//             color: 'white',
//             borderRadius: '8px',
//             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
//             padding: '10px',
//         },
//         popper: {
//             zIndex: 9999,
//         },
//     };

//     const StyledDatePicker = styled(DatePicker)`
//         width: 100%;
//         max-width: 220px;
//         height: 40px;
//         border-radius: 8px;
//         font-size: 14px;
//         padding: 0 12px;
//         background-color: #1f2937;
//         color: white;
//         outline: none;
//         transition: all 0.2s ease-in-out;
//         border: 1px solid #4b5563;
//         text-align: left;
//         cursor: pointer;

//         &:hover {
//             border-color: #60a5fa;
//         }

//         &.custom-datepicker-input {
//             &.datepicker-disabled {
//                 cursor: not-allowed;
//                 opacity: 0.5;
//             }
//         }
//     `;

//     return (
//         <div style={customDatePickerStyles.container}>
//             <StyledDatePicker
//                 disabled={disabled}
//                 selected={selectedMonth}
//                 onChange={handleMonthChange}
//                 dateFormat="MMMM yyyy"
//                 showMonthYearPicker
//                 className={`custom-datepicker-input ${disabled ? "datepicker-disabled cursor-not-allowed opacity-50" : ""}`}
//                 calendarClassName="custom-datepicker-calendar"
//                 popperClassName="custom-datepicker-popper"
//                 placeholderText={disabled ? "Please fill account" : "Select Month"}
//                 onKeyDown={(e) => e.preventDefault()}
//                 onFocus={(e) => e.target.blur()}
//             />
//         </div>
//     );
// };

// export default DateRangePicker;


import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import { usePerformanceContext } from "@/context/PerformanceContext";

const months = moment.months().map((month, index) => ({
    label: month,
    value: index,
}));

const years = Array.from({ length: 10 }, (_, i) => {
    const year = moment().year() - i;
    return { label: year.toString(), value: year };
});

const customSelectStyles = {
    control: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        height: "40px",
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "#1f2937",
        fontSize: "14px",
        padding: "0 12px",
        transition: "all 0.2s ease-in-out",
        color: "#ffffff",
        minWidth: "220px",
        "&:hover": {
            borderColor: "#60a5fa",
        },
    }),

    menu: (provided) => ({
        ...provided,
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#1f2937",
        zIndex: 10,
        color: "#ffffff",
    }),

    option: (provided, state) => ({
        ...provided,
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "14px",
        padding: "8px 12px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#374151",
        },
    }),

    placeholder: (provided) => ({
        ...provided,
        color: "#ffffff",
        fontSize: "14px",
        textAlign: "left",
    }),

    input: (provided) => ({
        ...provided,
        fontSize: "14px",
        color: "#ffffff",
        textAlign: "left",
        minWidth: "120px",
    }),

    singleValue: (provided) => ({
        ...provided,
        color: "#ffffff",
    }),
};

const MonthYearPicker = ({ onClick, disabled }) => {
    const { period, setPeriod } = usePerformanceContext();
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (period?.start) {
            const startDate = moment(period.start);
            setSelectedDate({
                label: `${months[startDate.month()].label} ${startDate.year()}`,
                value: { month: startDate.month(), year: startDate.year() }
            });
        } else {
            setSelectedDate(null);
        }
    }, [period]);

    const handleDateChange = (selectedOption) => {
        setSelectedDate(selectedOption);
        const { month, year } = selectedOption.value;
        const startOfMonth = moment().year(year).month(month).startOf("month").format("YYYY-MM-DD");
        const endOfMonth = moment().year(year).month(month).endOf("month").format("YYYY-MM-DD");

        setPeriod({
            start: startOfMonth,
            end: endOfMonth,
        });
    };

    const dateOptions = [];
    years.forEach(year => {
        months.forEach(month => {
            dateOptions.push({
                label: `${month.label} ${year.label}`,
                value: { month: month.value, year: year.value }
            });
        });
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Select
                styles={customSelectStyles}
                options={dateOptions}
                value={selectedDate}
                onChange={handleDateChange}
                placeholder="Select Month and Year"
                isDisabled={disabled}
            />
        </div>
    );
};

export default MonthYearPicker;