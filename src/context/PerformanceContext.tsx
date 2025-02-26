import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TPerformanceContext, TPeriod, TOption } from "@/types/PerformanceTypes";
import { performanceContextInitialValue, periodInitialValue } from "@/constant/PerfomanceContants";

const PerformanceContext = createContext<TPerformanceContext>(performanceContextInitialValue);

const PerformanceContextProvider = ({ children }) => {
    const [period, setPeriod] = useState<TPeriod | null>(periodInitialValue);
    const [platform, setPlatform] = useState<string>("Instagram");
    const [selectedCompetitor, setSelectedCompetitor] = useState<TOption[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    useEffect(() => {
        if (selectedAccount) {
            setSelectedCompetitor([{ label: selectedAccount, value: selectedAccount }]);
        }
    }, [selectedAccount]);

    return (
        <PerformanceContext.Provider value={{ period, platform, selectedCompetitor, selectedAccount, setPeriod, setPlatform, setSelectedCompetitor, setSelectedAccount }}>
            {children}
        </PerformanceContext.Provider>
    );
};

export const usePerformanceContext = () => useContext(PerformanceContext);
export default PerformanceContextProvider;