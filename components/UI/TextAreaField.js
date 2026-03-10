import React from "react";

const TextAreaField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    rows = "4"
}) => {
    return (
        <div className="col-span-2 mb-2">
            {label && (
                <label className="block text-sm font-medium mb-2 text-black">{label}</label>
            )}
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className={`w-full text-[14px] px-4 py-2 bg-gray-200 text-black rounded-lg border ${error ? "border-red-500" : "border-gray-300"
                    } focus:outline-none`}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TextAreaField;
