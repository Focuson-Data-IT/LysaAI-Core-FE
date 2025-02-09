export type TPerformanceContext = {
    period: TPeriod;
    platform: string;
    selectedCompetitor: Array<>;
    setPeriod: (period: TPeriod) => void;
    setPlatform: (platform: string) => void;
};

export type TPeriod = {
    start: string;
    end: string;
}

export type TOption = {
    label: string;
    value: string;
}