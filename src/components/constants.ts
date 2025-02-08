/* eslint-disable @typescript-eslint/no-explicit-any */
export type TPeriodInput = {
	startDate: Date | string | null;
	endDate: Date | string | null;
};

export type TOurSelect = {
	options: { label: string, value: string } | null;
	disabled: boolean;
	permaOptions: any;
	setParentSelectedOption: any;
}

export type TOurDatePicker = {
	doubleInput?: boolean;
	inputWidth?: string;
	singleDatePick?: boolean;
	minDate?: any;
	maxDate?: any;
	onChange?: any;
	style?: React.CSSProperties;
	placeholder?: string;
	value?: any;
	disabled?: boolean;
	applyCb?: any;
	type?: string;
	resetWhenOutside?: boolean;
	validationStyle?: object;
	validations?: ValidateResultType<any, any>;
	validationName?: string;
	cancelDefaultValue?: any;
};

export type ValidateResultType<TData, TErrors> = {
	valid: boolean,
	data: TData,
	errors: TErrors
}
