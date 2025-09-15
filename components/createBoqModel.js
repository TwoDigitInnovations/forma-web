import React, { useState } from "react";

const CreateBOQModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("template");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#1E1E1E] text-white rounded-[24px] md:w-[550px] w-[380px] p-6 shadow-lg">
        {/* Title */}
        <h2 className="text-xl font-semibold">Create New BOQ</h2>
        <p className="text-sm text-gray-300 mt-1">
          Creating new BOQ for proposed construction of Daynille road
        </p>

        {/* Radio Options */}
        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              value="template"
              checked={selectedOption === "template"}
              onChange={() => setSelectedOption("template")}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === "template"
                  ? "border-[#D6FF00]"
                  : "border-gray-400"
              }`}
            >
              {selectedOption === "template" && (
                <span className="w-2.5 h-2.5 bg-[#D6FF00] rounded-full" />
              )}
            </span>
            From Template / Library
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              value="scratch"
              checked={selectedOption === "scratch"}
              onChange={() => setSelectedOption("scratch")}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === "scratch"
                  ? "border-[#D6FF00]"
                  : "border-gray-400"
              }`}
            >
              {selectedOption === "scratch" && (
                <span className="w-2.5 h-2.5 bg-[#D6FF00] rounded-full" />
              )}
            </span>
            From Scratch
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => alert(`Proceed with: ${selectedOption}`)}
            className="px-6 py-2 rounded-lg bg-custom-yellow text-black font-normal hover:bg-[#c2f000]"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBOQModal;
