import React from "react";

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  yesText = "Yes",
  noText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn md:px-0 px-4">
      <div
        className="bg-custom-black rounded-lg p-6 w-lg 
                   shadow-[5px_5px_0px_0px_rgba(255,255,0,1)]
                   animate-slideUp max-w-2xl"
      >
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        <p className="mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 text-black border-2 cursor-pointer border-custom-yellow py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all shadow-yellow-500/20 hover:scale-103"
            onClick={() => setIsOpen(false)}
          >
            {noText}
          </button>
          <button
            className="px-4 py-2 cursor-pointer bg-custom-yellow text-black font-semibold rounded transition shadow-2xl shadow-yellow-500/20 hover:scale-103"
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
          >
            {yesText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
