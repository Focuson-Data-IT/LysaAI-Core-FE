import React, {createContext, useContext, useState, ReactNode} from "react";
import {TPerformanceContext, TPeriod} from "@/types/PerformanceTypes";
import moment from "moment";
import {performanceContextInitialValue} from "@/constant/PerfomanceContants";



const PerformanceContext = createContext<TPerformanceContext | null>(performanceContextInitialValue);

const PerformanceContextProvider= ({children}) => {
    const [period, setPeriod] = useState<TPeriod>();
    const [platform, setPlatform] = useState<string>();

    return (
        <PerformanceContext.Provider value={{period, platform, setPeriod, setPlatform}}>
            {children}
        </PerformanceContext.Provider>
    );
};
export const usePerformanceContext = () => useContext(PerformanceContext);
export default PerformanceContextProvider;