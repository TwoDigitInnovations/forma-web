import React from "react";
import { motion, AnimatePresence } from "motion/react";

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  yesText = "Yes",
  noText = "No",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:px-0 px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#141414] border border-[#e0f349]/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_25px_rgba(224,243,73,0.3)]"
          >
            {/* Title */}
            <h2 className="text-2xl font-semibold mb-3 text-center text-custom-yellow">
              {title}
            </h2>

            {/* Message */}
            <p className="text-center text-gray-300 mb-6">{message}</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 cursor-pointer bg-gray-800 border border-gray-500 text-gray-200 rounded-lg text-md hover:bg-gray-700 transition-all duration-200"
              >
                {noText}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
                className="px-5 py-2 text-md cursor-pointer bg-custom-yellow text-black font-semibold rounded-lg hover:shadow-[0_0_15px_#e0f349aa] transition-all duration-200"
              >
                {yesText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
