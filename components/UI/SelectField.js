import React from "react";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
}) => {
  return (
    <div className="md:col-span-1 col-span-2">
      {label && (
        <label className="block text-sm font-medium mb-2 text-black">{label}</label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
       
        className={`w-full text-[14px] px-4 py-2 bg-gray-200 text-black rounded-lg border ${error ? "border-red-500" : "border-gray-200"
          } focus:outline-none `}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
