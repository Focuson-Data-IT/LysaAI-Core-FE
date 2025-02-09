import React, {createContext, useContext, useState, ReactNode} from "react";
import {TPerformanceContext, TPeriod, TSingleMonthPeriod} from "@/types/PerformanceTypes";
import moment from "moment";
import {performanceContextInitialValue, singleMonthPeriodInitialValue} from "@/constant/PerfomanceContants";



const PerformanceContext = createContext<TPerformanceContext | null>(performanceContextInitialValue);

const PerformanceContextProvider= ({children}) => {
    const [period, setPeriod] = useState<TSingleMonthPeriod>(singleMonthPeriodInitialValue);
    const [platform, setPlatform] = useState<string>("instagram");
    const [selectedCompetitor, setSelectedCompetitor] = useState([]);

    return (
        <PerformanceContext.Provider value={{period, platform, selectedCompetitor, setPeriod, setPlatform, setSelectedCompetitor}}>
            {children}
        </PerformanceContext.Provider>
    );
};
export const usePerformanceContext = () => useContext(PerformanceContext);
export default PerformanceContextProvider;