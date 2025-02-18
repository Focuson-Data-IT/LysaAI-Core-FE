import React from "react";
import Select, { components } from "react-select";

const CheckboxOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
        <div ref={innerRef} {...innerProps} className="flex items-center px-3 py-2 cursor-pointer">
            <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
            <span className="text-white">{data.label}</span>
        </div>
    );
};

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        height: "40px",
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "#1f2937",
        // boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
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
		color: state.isSelected ? "#ffffff" : "#ffffff", // Pastikan teks tetap putih
		cursor: "pointer",
		fontSize: "14px",
		padding: "8px 12px",
		transition: "all 0.2s ease-in-out",
	
		"&:hover": {
			backgroundColor: "#374151", // Hover tetap sama
		},
	}),	

    placeholder: (provided) => ({
        ...provided,
        color: "#ffffff",
        fontSize: "14px",
        textAlign: "left",
    }),

    input: (provided) => ({
        ...provided,
        fontSize: "14px",
        color: "#ffffff",
        textAlign: "left",
        minWidth: "120px",
    }),

	singleValue: (provided) => ({
		...provided,
		color: "#ffffff",
	}),

    multiValue: (provided) => ({
        ...provided,
        // backgroundColor: "#374151",
        color: "#ffffff",
        borderRadius: "4px",
        padding: "4px 8px",
        maxWidth: "150px",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
                    controlShouldRenderValue={!isMulti}
                    isDisabled={disabled}
                    components={isMulti ? { Option: CheckboxOption } : {}}
                />
            </div>
        </div>
    );
};

export default OurSelect;
