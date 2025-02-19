export type TPerformanceContext = {
    period: TPeriod;
    platform: string;
    selectedCompetitor: Array<TOption>;
    selectedAccount: string | null;
    setPeriod: (period: TPeriod) => void;
    setPlatform: (platform: string) => void;
    setSelectedCompetitor: (selectedCompetitor: Array<TOption>) => void;
    setSelectedAccount: (selectedAccount: string) => void;
};

export type TPeriod = {
    start: string;
    end: string;
}

export type TSingleMonthPeriod = string;

export type TOption = {
    label: string;
    value: string;
}