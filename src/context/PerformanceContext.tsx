import React, {createContext, useContext, useState, ReactNode} from "react";
import {TPerformanceContext, TPeriod, TSingleMonthPeriod} from "@/types/PerformanceTypes";
import moment from "moment";
import {performanceContextInitialValue, periodInitialValue} from "@/constant/PerfomanceContants";



const PerformanceContext = createContext<TPerformanceContext>(performanceContextInitialValue);

const PerformanceContextProvider= ({children}) => {
    const [period, setPeriod] = useState<TPeriod | null>(periodInitialValue);
    const [platform, setPlatform] = useState<string>("Instagram");
    const [selectedCompetitor, setSelectedCompetitor] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    return (
        <PerformanceContext.Provider value={{period, platform, selectedCompetitor, selectedAccount, setPeriod, setPlatform, setSelectedCompetitor, setSelectedAccount}}>
            {children}
        </PerformanceContext.Provider>
    );
};
export const usePerformanceContext = () => useContext(PerformanceContext);
export default PerformanceContextProvider;