import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="md:col-span-1 col-span-2">
      {label && (
        <label className="block text-sm font-medium mb-2 text-white">{label}</label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full text-[14px] px-4 py-2 bg-[#5F5F5F] text-white
             [&::-webkit-calendar-picker-indicator]:invert
             [&::-webkit-calendar-picker-indicator]:brightness-0
             [&::-webkit-calendar-picker-indicator]:cursor-pointer rounded-lg border ${error ? "border-red-500" : "border-gray-600"
          } focus:outline-none `}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
