// "use client";

// import React from "react";
// import Select from "react-select";
// import { usePerformanceContext } from "@/context/PerformanceContext";

// const customSelectStyles = {
// 	control: (provided, state) => ({
// 		...provided,
// 		display: "flex",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		height: "40px",
// 		width: "100%",
// 		borderRadius: "8px",
// 		// border: "1px solid #d1d5db",
// 		backgroundColor: "#1f2937",
// 		boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
// 		fontSize: "14px",
// 		padding: "0 12px",
// 		transition: "all 0.2s ease-in-out",
// 		color: "#ffffff",
// 		minWidth: "120px", // **Menjaga ukuran minimal agar input tidak mengecil saat diketik**
// 		"&:hover": {
// 			borderColor: "#60a5fa",
// 		},
// 	}),

// 	menu: (provided) => ({
// 		...provided,
// 		borderRadius: "8px",
// 		// border: "1px solid #d1d5db",
// 		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
// 		backgroundColor: "#1f2937",
// 		zIndex: 10,
// 		color: "#ffffff",
// 	}),

// 	option: (provided, state) => ({
// 		...provided,
// 		backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#374151" : "#1f2937",
// 		color: state.isSelected ? "white" : "#d1d5db",
// 		cursor: "pointer",
// 		fontSize: "14px",
// 		padding: "8px 12px",
// 		transition: "all 0.2s ease-in-out",
// 		"&:hover": {
// 			backgroundColor: "#374151",
// 		},
// 	}),

// 	placeholder: (provided) => ({
// 		...provided,
// 		color: "#d1d5db",
// 		fontSize: "14px",
// 		textAlign: "center",
// 	}),

// 	input: (provided) => ({
// 		...provided,
// 		fontSize: "14px",
// 		color: "#ffffff",
// 		textAlign: "center",
// 		flex: "1 1 auto",
// 		width: "100%",
// 		minWidth: "120px", // **Menjaga agar input tidak mengecil saat diketik**
// 	}),
// };

// const OurSelect = ({ options, disabled = false }) => {
// 	const { selectedCompetitor, setSelectedCompetitor } = usePerformanceContext();

// 	const handleChange = (selected) => {
// 		setSelectedCompetitor(selected);
// 	};

// 	return (
// 		<div className="datepicker-container">
// 			<div className="datepicker-wrapper">
// 				<Select
// 					placeholder="Select Your Account"
// 					styles={customSelectStyles}
// 					options={options}
// 					isMulti
// 					value={selectedCompetitor}
// 					onChange={handleChange}
// 					closeMenuOnSelect={false}
// 					hideSelectedOptions={false}
// 					controlShouldRenderValue={false}
// 					isDisabled={disabled}
// 				/>
// 			</div>
// 		</div>
// 	);
// };

// export default OurSelect;

"use client";

import React from "react";
import Select from "react-select";

const customSelectStyles = {
	control: (provided, state) => ({
		...provided,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "40px",
		width: "100%",
		borderRadius: "8px",
		backgroundColor: "#1f2937",
		boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
		fontSize: "14px",
		padding: "0 12px",
		transition: "all 0.2s ease-in-out",
		color: "#ffffff",
		minWidth: "120px",
		"&:hover": {
			borderColor: "#60a5fa",
		},
	}),

	menu: (provided) => ({
		...provided,
		borderRadius: "8px",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#1f2937",
		zIndex: 10,
		color: "#ffffff",
	}),

	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#374151" : "#1f2937",
		color: state.isSelected ? "white" : "#d1d5db",
		cursor: "pointer",
		fontSize: "14px",
		padding: "8px 12px",
		transition: "all 0.2s ease-in-out",
		"&:hover": {
			backgroundColor: "#374151",
		},
	}),

	placeholder: (provided) => ({
		...provided,
		color: "#d1d5db",
		fontSize: "14px",
		textAlign: "center",
	}),

	input: (provided) => ({
		...provided,
		fontSize: "14px",
		color: "#ffffff",
		textAlign: "center",
		flex: "1 1 auto",
		width: "100%",
		minWidth: "120px",
	}),
};

const OurSelect = ({ options, value, onChange, isMulti = false, placeholder, disabled = false }) => {
	return (
		<div className="datepicker-container">
			<div className="datepicker-wrapper">
				<Select
					placeholder={placeholder}
					styles={customSelectStyles}
					options={options}
					isMulti={isMulti}
					value={value}
					onChange={onChange}
					closeMenuOnSelect={!isMulti}
					hideSelectedOptions={false}
					controlShouldRenderValue={true}
					isDisabled={disabled}
				/>
			</div>
		</div>
	);
};

export default OurSelect;
