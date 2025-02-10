"use client";

import React from "react";
import React from "react";
import Select from "react-select";
import { usePerformanceContext } from "@/context/PerformanceContext";
import { usePerformanceContext } from "@/context/PerformanceContext";

const customSelectStyles = {
	control: (provided, state) => ({
		...provided,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "42px", // Sama dengan DatePicker
		width: "100%",
		borderRadius: "8px", // Sesuai dengan input DatePicker
		border: "1px solid #d1d5db",
		backgroundColor: "#f9fafb",
		boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
		transition: "all 0.2s",
		"&:hover": {
			backgroundColor: "#e5e7eb",
		},
	}),
	menu: (provided) => ({
		...provided,
		borderRadius: "8px",
		border: "1px solid #d1d5db",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		backgroundColor: "white",
		zIndex: 10,
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e5e7eb" : "white",
		color: state.isSelected ? "white" : "black",
		cursor: "pointer",
		transition: "all 0.2s",
		"&:hover": {
			backgroundColor: "#d1d5db",
		},
	}),
	placeholder: (provided) => ({
		...provided,
		color: "#6b7280",
		fontSize: "14px",
	}),
};

const OurSelect = ({ options, disabled = false }) => {
const OurSelect = ({ options, disabled = false }) => {
	const { selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

	const handleChange = (selected) => {
	const handleChange = (selected) => {
		setSelectedCompetitor(selected);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="relative" style={{ zIndex: 10 }}>
				<Select
					placeholder="Hide/Show Competitor"
					styles={customSelectStyles}
					options={options}
					isMulti
					value={selectedCompetitor}
					onChange={handleChange}
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
					controlShouldRenderValue={false}
					isDisabled={disabled}
				/>
			</div>
		</div>
	);
};

export default OurSelect;
