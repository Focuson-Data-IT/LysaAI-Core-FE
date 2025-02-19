import {TOption, TPerformanceContext, TPeriod, TSingleMonthPeriod} from "@/types/PerformanceTypes";
import moment from "moment/moment";

export const periodInitialValue: TPeriod =  {
    start: moment().startOf('month').format("YYYY-MM-DD"),
    end: moment().endOf('month').format("YYYY-MM-DD")
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