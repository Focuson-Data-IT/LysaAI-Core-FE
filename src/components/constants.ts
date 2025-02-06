export type TPeriodInput = {
    startDate: Date | string | null;
    endDate: Date | string | null;
};

export type SelectOption = {
    label: string;
    value: string;
};

export type TOurSelect = {
    options: SelectOption[]; // Ensuring it's always an array
    disabled?: boolean; // Optional
    permaOptions?: SelectOption[]; // Ensuring it's always an array
    setParentSelectedOption: (option: SelectOption[]) => void;
};

export type TOurDatePicker = {
    doubleInput?: boolean;
    inputWidth?: string;
    singleDatePick?: boolean;
    minDate?: Date;
    maxDate?: Date;
    onChange?: (date: Date | null) => void;
    style?: React.CSSProperties;
    placeholder?: string;
    value?: Date | null;
    disabled?: boolean;
    applyCb?: (date: Date | null) => void;
    type?: string;
    resetWhenOutside?: boolean;
    validationStyle?: React.CSSProperties;
    validations?: ValidateResultType<any, any>;
    validationName?: string;
    cancelDefaultValue?: Date | null;
};

export type ValidateResultType<TData, TErrors> = {
    valid: boolean;
    data: TData;
    errors: TErrors;
};
