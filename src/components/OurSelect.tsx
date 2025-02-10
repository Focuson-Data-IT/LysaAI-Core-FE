"use client";

import React from "react";
import Select from "react-select";
import { usePerformanceContext } from "@/context/PerformanceContext";

const customSelectStyles = {
	control: (provided, state) => ({
		...provided,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "42px", // Konsisten dengan DatePicker
		width: "100%",
		borderRadius: "8px",
		border: "1px solid #d1d5db",
		backgroundColor: "#f9fafb",
		boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
		fontSize: "14px", // Sama dengan input lain
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
		fontSize: "14px", // Konsisten dengan input
		padding: "8px 12px",
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
	input: (provided) => ({
		...provided,
		fontSize: "14px", // Sama dengan placeholder
		padding: "0px", // Pastikan tidak ada padding ekstra
		color: "#374151", // Sesuai dengan teks lain
	}),
};

const OurSelect = ({ options, disabled = false }) => {
	const { selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

	const handleChange = (selected) => {
		setSelectedCompetitor(selected);
	}


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
