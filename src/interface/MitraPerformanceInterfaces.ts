export interface FairData {
    [key: string]: {
        [key: string]: {
            username: string;
            value: number;
            max_value: number;
        }[];
    };
}

export interface FairDetailBarProps {
    label: string;
    description: string;
    unit: string;
    category: string;
}

export interface FairChartData {
    username: string;
    value: number;
    max_value: number;
    percentage?: number;
}