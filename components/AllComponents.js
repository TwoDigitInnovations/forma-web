import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import { Edit, Trash } from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

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

export const SummaryCards = ({
  contractAmount,
  amountPaid,
  amountLeft,
  progress,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-custom-green p-5 rounded-xl shadow">
        <p className="text-gray-100">Contract Amount</p>
        <h2 className="text-2xl font-bold text-gray-100">
          ${contractAmount?.toLocaleString()}
        </h2>
      </div>

      <div className="bg-custom-green p-5 rounded-xl shadow">
        <p className="text-gray-100">Amount Paid</p>
        <h2 className="text-2xl font-bold text-white">
          ${amountPaid?.toLocaleString()}
        </h2>
      </div>

      <div className="bg-custom-green p-5 rounded-xl shadow">
        <p className="text-gray-100">Amount Left</p>
        <h2 className="text-2xl font-bold text-white">
          ${amountLeft?.toLocaleString()}
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
  projectId,
  getAllCertificate,
  loader,
  summary,
}) => {
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [certId, setCertId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const router = useRouter();

  const [cert, setCert] = useState({
    certNo: "",
    amount: "",
    date: "",
    status: "Submitted",
  });

  // useEffect(() => {
  //   if (summary) {
  //     setAdvanceAmount(summary.advancePayment || 0);
  //   }
  // }, [summary]);

  const handleAddCertificate = async () => {
    if (!cert.certNo || !cert.amount || !cert.date) {
      return toast.error("Please fill certificate details");
    }

    loader(true);
    try {
      const res = await Api(
        "post",
        `project/addCertificate/${projectId}`,
        {
          certificateNo: cert.certNo,
          amount: Number(cert.amount),
          date: cert.date,
          status: cert.status,
        },
        router
      );

      loader(false);

      if (res?.status) {
        toast.success("Certificate added successfully!");
        getAllCertificate(projectId);
        setCert({ certNo: "", amount: "", date: "", status: "Submitted" });
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      loader(false);
      toast.error("Error adding certificate");
    }
  };

  const onEditData = async (id) => {
    loader(true);
    try {
      const url = `project/getCertificate/${projectId}/${id}`;
      const res = await Api("get", url, "", router);

      loader(false);

      if (res?.status) {
        const data = res.data.data || res.data;

        setCert({
          certNo: data.certificateNo,
          amount: data.amount,
          date: data?.date?.split("T")[0],
          status: data.status,
        });

        setCertId(id);
      } else {
        toast.error("Failed to fetch certificate");
      }
    } catch (err) {
      loader(false);
      toast.error("Error fetching data");
    }
  };

  const handleUpdateCertificate = async () => {
    loader(true);
    const certificateId = certId;
    try {
      const res = await Api(
        "post",
        `project/updateCertificates/${projectId}/${certificateId}`,
        {
          certificateNo: cert.certNo,
          amount: Number(cert.amount),
          date: cert.date,
          status: cert.status,
        },
        router
      );

      loader(false);

      if (res?.status) {
        toast.success("Certificate updated!");
        getAllCertificate(projectId);
        setCertId(null);
        setCert({ certNo: "", amount: "", date: "", status: "Submitted" });
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      loader(false);
      toast.error("Error updating certificate");
    }
  };

  const handleStatusChange = async (id, status, amount) => {
    loader(true);
    try {
      const res = await Api(
        "post",
        `project/update-certificate-status/${id}/${projectId}`,
        { status },
        router
      );

      if (res?.status !== true) {
        loader(false);
        return toast.error("Failed to update status");
      }

      if (status === "Paid") {
        await Api(
          "post",
          `project/update-payment-paid/${projectId}`,
          { paidAmount: Number(amount) },
          router
        );
      }

      loader(false);
      toast.success("Status updated!");
      getAllCertificate(projectId);
    } catch (err) {
      loader(false);
      toast.error("Error updating status");
    }
  };

  const handleStatusConfirm = async () => {
    if (!pendingId || !pendingStatus) return;

    await handleStatusChange(pendingId, pendingStatus, pendingAmount);
    setIsOpen(false);
    setPendingId(null);
    setPendingStatus(null);
    setPendingAmount(null);
  };

  const onDeleteClick = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsConfirmOpen(false);
    loader(true);

    try {
      const res = await Api(
        "delete",
        `project/deleteCertificate/${projectId}/${deleteId}`,
        "",
        router
      );

      loader(false);

      if (res?.status) {
        toast.success("Certificate deleted successfully");
        getAllCertificate(projectId);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      loader(false);
      toast.error("Error deleting certificate");
    }
  };

  const handleAddAdvance = async (amount) => {
    loader(true);

    try {
      const res = await Api(
        "post",
        `project/update-advance-payment/${projectId}`,
        { advanceAmount: amount },
        router
      );

      loader(false);

      if (res?.status === true) {
        toast.success("Advance payment added successfully!");
        getAllCertificate(projectId);
      } else {
        toast.error(res?.message || "Failed to add advance payment");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  let totalSubmitted = 0;
  let totalInProcess = 0;
  let totalPaid = 0;

  certificates?.forEach((certificate) => {
    const amt = Number(certificate.amount || 0);

    if (certificate.status === "Submitted") {
      totalSubmitted += amt;
    } else if (certificate.status === "In-Process") {
      totalInProcess += amt;
    } else if (certificate.status === "Paid") {
      totalPaid += amt;
    }
  });

  return (
    <div className="mt-10 bg-transparent py-4 rounded-xl shadow">
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate?"
        onConfirm={handleDeleteConfirm}
        yesText="Delete"
        noText="Cancel"
      />

      <ConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Change Status"
        message="Are you sure you want to change this certificate status?"
        onConfirm={handleStatusConfirm}
        yesText="Yes, Change"
        noText="Cancel"
      />

      <h2 className="text-xl font-bold mb-3">Advance Payment (USD)</h2>

      <p className="text-gray-200 mb-2">
        Add or update the advance payment amount for this project.
      </p>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="number"
          value={advanceAmount}
          onChange={(e) => setAdvanceAmount(e.target.value)}
          placeholder="Enter advance amount"
          className="border p-3 rounded-md flex-1"
          min="0"
        />

        <button
          className="px-5 py-3 bg-custom-yellow text-black rounded-lg cursor-pointer font-medium"
          onClick={() => {
            handleAddAdvance(Number(advanceAmount));
            setAdvanceAmount("");
          }}
        >
          {Number(advanceAmount) > 0
            ? "Update Advance Payment"
            : "Add Advance Payment"}
        </button>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">
        {certId ? "Update" : "Add"} Certificate
      </h2>

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
          className={`border p-2 rounded-md  ${
            cert.status === "Paid" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={cert.status === "Paid"}
        />

        <select
          value={cert.status}
          disabled={cert.status === "Paid"}
          className={`border p-2 rounded text-white cursor-pointer 
          ${cert.status === "Paid" ? "opacity-50 cursor-not-allowed" : ""}`}
          onChange={(e) => setCert({ ...cert, status: e.target.value })}
        >
          <option value="Submitted" className="text-black">
            Submitted
          </option>
          <option value="In-Process" className="text-black">
            In-Process
          </option>
          <option value="Paid" className="text-black">
            Paid
          </option>
        </select>

        <input
          type="date"
          value={cert.date}
          onChange={(e) => setCert({ ...cert, date: e.target.value })}
          className="border p-2 rounded-md cursor-pointer"
        />

        <button
          className="px-5 py-2 bg-custom-yellow text-black rounded-lg cursor-pointer"
          onClick={() => {
            certId ? handleUpdateCertificate() : handleAddCertificate();
          }}
        >
          {certId ? "Update" : "Add"} Certificate
        </button>
      </div>

      <h2 className="text-xl font-bold mt-8">Certificates</h2>
      {certificates.length === 0 ? (
        <p className="min-h-[200px] flex justify-center items-center text-white">
          No Certificate Added
        </p>
      ) : (
        <div className="w-full mt-4 overflow-x-auto rounded-t-xl border">
          <table className="w-full text-sm">
            <thead className="bg-custom-yellow text-black sticky top-0">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">
                  Certificate No.
                </th>
                <th className="p-3 text-left whitespace-nowrap">
                  Submitted Amount
                </th>
                <th className="p-3 text-left whitespace-nowrap">
                  In Process Amount
                </th>
                <th className="p-3 text-left whitespace-nowrap">Amount Paid</th>
                <th className="p-3 text-left whitespace-nowrap">
                  Payment Status
                </th>
                <th className="p-3 text-left whitespace-nowrap text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b transition">
                <td className="p-3">{"Advance Payment"}</td>

                <td className="p-3">{"-"}</td>

                <td className="p-3">{"-"}</td>

                <td className="p-3 ">{advanceAmount || "-"}</td>

                <td className="p-3 ">
                  <p className="border p-2 rounded cursor-pointer text-white w-26">
                    {" "}
                    {"Paid"}
                  </p>
                </td>

                <td className="p-3 flex gap-3 justify-center">
                  <button
                    className="text-gray-300 hover:text-gray-400 cursor-pointer text-xl"
                    onClick={() => setAdvanceAmount(summary.advancePayment || 0)}
                  >
                    <Edit />
                  </button>
                </td>
              </tr>

              {certificates?.map((item) => (
                <tr key={item._id} className="border-b transition">
                  <td className="p-3">{item.certificateNo}</td>

                  <td className="p-3">
                    {item.status === "Submitted"
                      ? `$${item.amount.toLocaleString()}`
                      : "-"}
                  </td>

                  <td className="p-3">
                    {item.status === "In-Process"
                      ? `$${item.amount.toLocaleString()}`
                      : "-"}
                  </td>

                  <td className="p-3 ">
                    {item.status === "Paid"
                      ? `$${item.amount.toLocaleString()}`
                      : "-"}
                  </td>

                  <td className="p-3">
                    <select
                      value={item.status}
                      disabled={item.status === "Paid"}
                      className={`border p-2 rounded cursor-pointer text-white ${
                        item.status === "Paid"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onChange={(e) => {
                        setPendingId(item._id);
                        setPendingStatus(e.target.value);
                        setPendingAmount(item.amount);
                        setIsOpen(true);
                      }}
                    >
                      <option value="Submitted" className="text-black">
                        Submitted
                      </option>
                      <option value="In-Process" className="text-black">
                        In-Process
                      </option>
                      <option value="Paid" className="text-black">
                        Paid
                      </option>
                    </select>
                  </td>

                  <td className="p-3 flex gap-3 justify-center">
                    {item.status !== "Paid" && (
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer text-xl"
                        onClick={() => onDeleteClick(item._id)}
                      >
                        <Trash />
                      </button>
                    )}

                    <button
                      className="text-gray-300 hover:text-gray-400 cursor-pointer text-xl"
                      onClick={() => onEditData(item._id)}
                    >
                      <Edit />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className=" font-semibold">
                <td className="p-3 text-left">Total:</td>
                <td className="p-3">${totalSubmitted}</td>
                <td className="p-3">${totalInProcess}</td>
                <td className="p-3">${totalPaid + advanceAmount}</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
        
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
