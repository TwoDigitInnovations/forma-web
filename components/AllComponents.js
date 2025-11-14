
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";

export const ConfirmModal = ({
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

export const SummaryCards = ({ contractAmount, amountPaid, amountLeft, progress }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <div className="bg-custom-green p-5 rounded-xl shadow">
        <p className="text-gray-100">Contract Amount</p>
        <h2 className="text-2xl font-bold text-gray-100">${contractAmount.toLocaleString()}</h2>
      </div>

      <div className="bg-custom-green p-5 rounded-xl shadow">
        <p className="text-gray-100">Amount Paid</p>
        <h2 className="text-2xl font-bold text-white">${amountPaid.toLocaleString()}</h2>
      </div>

      <div className="bg-custom-green p-5 rounded-xl shadow">
        <p className="text-gray-100">Amount Left</p>
        <h2 className="text-2xl font-bold text-white">
          ${amountLeft.toLocaleString()}
        </h2>
      </div>

      <div className="bg-custom-green p-5 rounded-xl shadow flex flex-col">
        <p className="text-gray-100">Financial Progress</p>
        <h2 className="text-2xl font-bold">{progress}%</h2>
        <div className="w-full bg-gray-200 h-2 mt-2 rounded">
          <div
            style={{ width: `${progress}%` }}
            className="h-2 bg-custom-yellow rounded"
          ></div>
        </div>
      </div>
    </div>
  );
};

export const Certificates = ({
  certificates,
  onAddAdvance,
  onAddCertificate,
  onUpdateStatus,
}) => {
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [cert, setCert] = useState({
    certNo: "",
    amount: "",
    date: "",
    status: "Submitted",
  });


  const addCertificate = (cert) => {
    if (!cert.certNo || !cert.amount || !cert.date || !cert.status) {
      return toast.error("Please fill the Certificate Information")
    }
    onAddCertificate(cert);
  }
  return (
    <div className="mt-10 bg-transparent py-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-3">Advance Payment (USD)</h2>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="number"
          value={advanceAmount}
          onChange={(e) => setAdvanceAmount(e.target.value)}
          placeholder="0.00"
          className="border p-3 rounded-md flex-1"
        />
        <button
          className="px-5 py-3 bg-custom-yellow text-black rounded-lg cursor-pointer"
          onClick={() => {
            onAddAdvance(Number(advanceAmount));
            setAdvanceAmount("");
          }}
        >
          Add as Certificate
        </button>
      </div>


      <h2 className="text-xl font-bold mt-8 mb-3">Add Certificate</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          placeholder="Certificate No."
          value={cert.certNo}
          onChange={(e) => setCert({ ...cert, certNo: e.target.value })}
          className="border p-2 rounded-md"
        />

        <input
          type="number"
          placeholder="Amount"
          value={cert.amount}
          onChange={(e) => setCert({ ...cert, amount: e.target.value })}
          className="border p-2 rounded-md"
        />

        <select
          value={cert.status}
          className="border p-2 rounded text-white"
          onChange={(e) =>
            setCert({
              ...cert,
              status: e.target.value
            })
          }
        >
          <option value="Submitted" className="text-black">Submitted</option>
          <option value="In-Process" className="text-black">In-Process</option>
          <option value="Paid" className="text-black">Paid</option>
        </select>


        <input
          type="date"
          value={cert.date}
          onChange={(e) => setCert({ ...cert, date: e.target.value })}
          className="border p-2 rounded-md"
        />

        <button
          className="px-5 py-2 bg-custom-yellow text-black rounded-lg cursor-pointer"
          onClick={() => {
            addCertificate(cert);
            setCert({ certNo: "", amount: "", date: "", status: "Submitted" });
          }}
        >
          Add Certificate
        </button>
      </div>


      <h2 className="text-xl font-bold mt-8">Certificates</h2>

      <div className="w-full mt-4 overflow-x-auto rounded-t-xl border">
        <table className="w-full text-sm">
          <thead className="bg-custom-yellow text-black sticky top-0">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">Certificate No.</th>
              <th className="p-3 text-left whitespace-nowrap">Submitted Amount (USD)</th>
              <th className="p-3 text-left whitespace-nowrap">In Process Amount (USD)</th>
              <th className="p-3 text-left whitespace-nowrap">Amount Paid (USD)</th>
              <th className="p-3 text-left whitespace-nowrap">Payment Status</th>
              <th className="p-3 text-left whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {certificates?.map((item) => (
              <tr
                key={item._id}
                className="border-b  transition"
              >
                <td className="p-3 whitespace-nowrap">{item.certificateNo}</td>

                <td className="p-3 whitespace-nowrap">
                  ${item.amount?.toLocaleString()}
                </td>

                <td className="p-3 whitespace-nowrap">
                  ${item.paidAmount?.toLocaleString() || 0}
                </td>
                <td className="p-3 whitespace-nowrap">
                  ${item.ProcessAmount?.toLocaleString() || 0}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <select
                    value={item.status}
                    className="border p-2 rounded w-full md:w-auto cursor-pointer"
                    onChange={(e) =>
                      onUpdateStatus(item._id, e.target.value, item.amount)
                    }
                  >
                    <option value="Submitted" className="text-black">Submitted</option>
                    <option value="In-Process" className="text-black">In-Process</option>
                    <option value="Paid" className="text-black">Paid</option>
                  </select>
                </td>

                <td className="p-3 text-center whitespace-nowrap flex gap-3 justify-center">
                  <button
                    className="text-red-600 hover:text-red-800 text-xl"
                    onClick={() => onDelete(item._id)}
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div >
  );
};



