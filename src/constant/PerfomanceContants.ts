import {TOption, TPerformanceContext, TPeriod, TSingleMonthPeriod} from "@/types/PerformanceTypes";
import moment from "moment/moment";

export const primaryColors = [
    "#8A2BE2", // Blue Violet (Ungu tua)
    "#1E90FF", // Dodger Blue (Biru terang)
    "#32CD32", // Lime Green (Hijau terang)
    "#FFD700", // Gold (Kuning keemasan)
    "#FF4500", // Orange Red (Merah-oranye cerah)
    "#1E90FF", // Dodger Blue (Biru terang)
    "#00CED1", // Dark Turquoise (Biru toska cerah)
    "#DC143C"  // Crimson (Merah tua mencolok)
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
    activeTab: "FAIR",
    selectedCompetitor: [],
    selectedAccount: null,
    setPeriod: () => {},
    setActiveTab:() => {},
    setPlatform: () => {},
    setSelectedCompetitor: () => {},
    setSelectedAccount: () => {}
};

export const optionInitialValue: TOption = {
    label: "label init",
    value: "value init"
}