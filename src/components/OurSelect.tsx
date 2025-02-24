import React, { useState } from "react";
import Select, { components } from "react-select";

const CheckboxOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
        <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isSelected} readOnly style={{ marginRight: '8px' }} />
            <span style={{ color: 'white' }}>{data.label}</span>
        </div>
    );
};

const SelectAllOption = ({ options, selectAllSelected, onSelectAllToggle }) => (
    <div 
        style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#374151', color: 'white' }} 
        onClick={onSelectAllToggle}
    >
        <input type="checkbox" checked={selectAllSelected} readOnly style={{ marginRight: '8px' }} />
        <span>{selectAllSelected ? "Unselect All" : "Select All"}</span>
    </div>
);

const customSelectStyles = {
    control: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        height: "40px",
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "#1f2937",
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
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "14px",
        padding: "8px 12px",
        transition: "all 0.2s ease-in-out",
        backgroundColor: state.isSelected
            ? "#60a5fa" // Ubah ini untuk mengatur warna biru muda saat dipilih
            : state.isFocused
            ? "#374151" // Warna saat opsi di-hover
            : "transparent",
        "&:hover": {
            backgroundColor: "#374151", // Tetap sama untuk hover
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
};

const CustomInput = (props) => {
    const { value } = props;
    return (
            <components.Input {...props} />
    );
};

const OurSelect = ({ options, value, onChange, isMulti = false, placeholder, disabled = false }) => {
    const allSelected = value && value.length === options.length;

    const handleSelectAllToggle = () => {
        if (allSelected) {
            onChange([]);
        } else {
            onChange(options);
        }
    };

    const customComponents = {
        Option: CheckboxOption,
        Input: CustomInput,
        MenuList: (props) => (
            <div>
                <SelectAllOption 
                    options={options} 
                    selectAllSelected={allSelected} 
                    onSelectAllToggle={handleSelectAllToggle} 
                />
                <components.MenuList {...props}>{props.children}</components.MenuList>
            </div>
        ),
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div>
                <Select
                    className={`custom-select-input ${disabled ? "datepicker-disabled cursor-not-allowed opacity-50" : ""}`}
                    placeholder={disabled ? "Please fill account" : placeholder}
                    styles={customSelectStyles}
                    options={options}
                    isMulti={isMulti}
                    value={value}
                    onChange={onChange}
                    closeMenuOnSelect={!isMulti}
                    hideSelectedOptions={false}
                    controlShouldRenderValue={!isMulti}
                    isDisabled={disabled}
                    components={isMulti ? customComponents : { Input: CustomInput }}
                />
            </div>
        </div>
    );
};

export default OurSelect;