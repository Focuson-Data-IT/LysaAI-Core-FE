"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TOurSelect } from "@/components/constants";
import {TOption} from "@/types/PerformanceTypes";
import {usePerformanceContext} from "@/context/PerformanceContext";

const customClassNames = {
	control: (state: any) =>
		`bg-gray-900 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border ${
			state.isDisabled ? "opacity-50 !important" : "border-[#41c2cb] !important"
		}`,
	input: (state: any) =>
		`bg-gray-900 text-gray-900 dark:text-[#41c2cb] flex-grow bg-transparent border-none outline-none px-0 !important`,
	menu: (state: any) =>
		`dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl mt-1 shadow-lg !important`,
	menuList: (state: any) =>
		`max-h-[200px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 !important`,
	option: (state: any) =>
		`cursor-pointer px-4 py-2 flex items-center justify-center ${
			state.isSelected
				? "bg-gray-100 text-[#41c2cb] !important"
				: state.isFocused
					? "bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-[#41c2cb] !important"
					: "bg-gray-500 dark:bg-gray-700 text-gray-900 dark:text-[#41c2cb] !important"
		} bg-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500`,
};

const OurSelect = ({
	options,
	disabled = false,
}) => {
	const { selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

	const handleChange = (selected: any) => {
		setSelectedCompetitor(selected);
	};

	return (
		<Select
			placeholder={"Hide/Show Competitor"}
			classNames={customClassNames}
			components={{
				IndicatorSeparator: () => null,
				ClearIndicator: () => null,
				MultiValueContainer: () => null,
			}}
			// className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs border border-[#41c2cb]"
			options={options}
			isMulti
			value={selectedCompetitor}
			onChange={handleChange}
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			controlShouldRenderValue={false}
		/>
	);
};

export default OurSelect;
