export type TPerformanceContext = {
    period: TPeriod;
    platform: string;
    selectedCompetitor: Array<TOption>;
    setPeriod: (period: TPeriod) => void;
    setPlatform: (platform: string) => void;
    setSelectedCompetitor: (selectedCompetitor: Array<TOption>) => void;
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