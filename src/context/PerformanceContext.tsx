import React, {createContext, useContext, useState, ReactNode} from "react";
import {TPerformanceContext, TPeriod, TSingleMonthPeriod} from "@/types/PerformanceTypes";
import moment from "moment";
import {performanceContextInitialValue, periodInitialValue} from "@/constant/PerfomanceContants";



const PerformanceContext = createContext<TPerformanceContext>(performanceContextInitialValue);

const PerformanceContextProvider= ({children}) => {
    const [period, setPeriod] = useState<TPeriod>(periodInitialValue);
    const [platform, setPlatform] = useState<string>("Instagram");
    const [selectedCompetitor, setSelectedCompetitor] = useState([]);

    return (
        <PerformanceContext.Provider value={{period, platform, selectedCompetitor, setPeriod, setPlatform, setSelectedCompetitor}}>
            {children}
        </PerformanceContext.Provider>
    );
};
export const usePerformanceContext = () => useContext(PerformanceContext);
export default PerformanceContextProvider;