/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
//
// import React, {useEffect, useState} from "react";
// import Select from 'react-select';
// import {TOurSelect} from "@/components/constants";
//
// const customClassNames = {
// 	control: (state: any) =>
// 		`${state} flex items-center justify-between rounded-2xl h-[42px] block w-full border ${
// 			state.isFocused
// 				? "border-gray-400 dark:border-gray-400"
// 				: "border-gray-300 dark:border-gray-600"
// 		} outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-4 text-sm`,
// 	input: (state: any) =>
// 		`${state} text-gray-900 dark:text-white flex-grow`,
// 	menu: (state: any) =>
// 		`${state} dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl mt-1 shadow-lg`,
// 	menuList: (state: any) =>
// 		`${state} max-h-[200px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700`,
// 	option: (state: any) =>
// 		`${state} cursor-pointer px-4 py-2 flex items-center justify-center ${
// 			state.isSelected
// 				? "bg-blue-500 text-white"
// 				: state.isFocused
// 					? "bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-white"
// 					: "bg-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white"
// 		} hover:bg-gray-300 dark:hover:bg-gray-500`,
// };
//
// const OurSelect: React.FC<TOurSelect> = ({options}) => {
// 	const [selectedOptions, setSelectedOptions] = useState<any[]>(options || []);
//
// 	const handleChange = (selected) => {
// 		setSelectedOptions(selected);
// 	};
//
// 	useEffect(() => {
// 		setSelectedOptions(options);
// 	}, [options]);
//
// 	return (
// 		<Select
// 			classNames={customClassNames}
// 			components={{
// 				IndicatorSeparator: () => null,
// 				ClearIndicator: () => null,
// 				MultiValueContainer: () => null
// 			}}
// 			className="z-10"
// 			options={options}
// 			isMulti
// 			value={selectedOptions}
// 			onChange={handleChange}
// 			closeMenuOnSelect={false}
// 			hideSelectedOptions={false}
// 		/>
// 	);
// };
//
// export default OurSelect;

"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TOurSelect } from "@/components/constants";

const customClassNames = {
	control: (state: any) =>
		`${state} flex items-center justify-between rounded-2xl h-[42px] block w-full border ${state.isFocused
			? "border-gray-400 dark:border-gray-400"
			: "border-gray-300 dark:border-gray-600"
		} outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-4 text-sm`,
	input: (state: any) => `${state} text-gray-900 dark:text-white flex-grow`,
	menu: (state: any) =>
		`${state} dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl mt-1 shadow-lg`,
	menuList: (state: any) =>
		`${state}  max-h-[200px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700`,
	option: (state: any) =>
		`${state} cursor-pointer px-4 py-2 flex items-center justify-center ${state.isSelected
			? "bg-gray-100 text-white"
			: state.isFocused
				? "bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-white"
				: "bg-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white"
		} bg-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500`,
};

const OurSelect: React.FC<TOurSelect> = ({
	permaOptions = null,
	options,
	disabled,
	setParentSelectedOption = null,
}) => {
	const [selectedOptions, setSelectedOptions] = useState<any>(
		options || [""],
	);

	const handleChange = (selected: any) => {
		setParentSelectedOption(selected);
		setSelectedOptions(selected);
	};

	// useEffect(() => {
	// 	setParentSelectedOption(options);
	// 	setSelectedOptions(options);
	// }, [selectedOptions]);

	useEffect(() => {
		if (JSON.stringify(selectedOptions) !== JSON.stringify(options)) {
			setParentSelectedOption(options);
			setSelectedOptions(options);
		}
	}, [options, selectedOptions, setParentSelectedOption]);

	return (
		<Select
			placeholder={"Select target"}
			classNames={customClassNames}
			components={{
				IndicatorSeparator: () => null,
				ClearIndicator: () => null,
				MultiValueContainer: () => null,
			}}
			className="z-10 text-sm"
			options={permaOptions}
			isMulti
			value={selectedOptions}
			onChange={handleChange}
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
		/>
	);
};

export default OurSelect;
