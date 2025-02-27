import {TOption, TPerformanceContext, TPeriod, TSingleMonthPeriod} from "@/types/PerformanceTypes";
import moment from "moment/moment";

export const primaryColors = [
    "#6A5ACD", // Untuk selectedAccount
    "#FFB347",
    "#20B2AA",
    "#FF6347",
    "#FFD700",
    "#8A2BE2"  // Warna tambahan untuk kompetitor ke-5
];

export const periodInitialValue: TPeriod =  {
    // start: moment().startOf('month').format("YYYY-MM-DD"),
    // end: moment().endOf('month').format("YYYY-MM-DD")
    start: null,
    end: null
}

export const singleMonthPeriodInitialValue: TSingleMonthPeriod = moment().format("YYYY-MM-DD");

export const performanceContextInitialValue: TPerformanceContext = {
    period: periodInitialValue,
    platform: "Instagram",
    selectedCompetitor: [],
    selectedAccount: null,
    setPeriod: () => {},
    setPlatform: () => {},
    setSelectedCompetitor: () => {},
    setSelectedAccount: () => {}
};

export const optionInitialValue: TOption = {
    label: "label init",
    value: "value init"
}