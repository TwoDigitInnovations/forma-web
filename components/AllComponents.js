import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import {
  CheckLine,
  CircleAlert,
  Clock,
  Clock1,
  Copy,
  Edit,
  MessageSquare,
  StickyNote,
  Trash,
  TriangleAlert,
  Users,
  X,
  User,
  Mail,
  Phone,
  Layers,
  FileText,
  Calendar,
  MapPin,
  ClipboardList,
  MoreVertical,
} from "lucide-react";

import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { CheckCircle } from "lucide-react";
import { userContext } from "@/pages/_app";
import moment from "moment";

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
            className="bg-gray-100 border border-[#000]/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_25px_rgba(224,243,73,0.3)]"
          >
            {/* Title */}
            <h2 className="text-2xl font-semibold mb-3 text-center text-blue-500">
              {title}
            </h2>

            {/* Message */}
            <p className="text-center text-gray-600 mb-6">{message}</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 cursor-pointer bg-gray-200 border border-gray-200 text-gray-700 rounded-lg text-md hover:bg-gray-300 transition-all duration-200"
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
                className="px-5 py-2 text-md cursor-pointer bg-[var(--custom-blue)] text-white font-semibold rounded-lg hover:shadow-[0_0_15px_#e0f349aa] transition-all duration-200"
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
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow">
        <p className="text-gray-800">Contract Amount</p>
        <h2 className="text-2xl font-bold text-gray-600">
          ${contractAmount?.toLocaleString()}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow">
        <p className="text-gray-800">Amount Paid</p>
        <h2 className="text-2xl font-bold text-gray-600">
          ${amountPaid?.toLocaleString()}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow">
        <p className="text-gray-800">Amount Left</p>
        <h2 className="text-2xl font-bold text-gray-600">
          ${amountLeft?.toLocaleString()}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow flex flex-col">
        <p className="text-gray-800">Financial Progress</p>
        <h2 className="text-2xl font-bold">{progress}%</h2>
        <div className="w-full bg-gray-200 h-2 mt-2 rounded">
          <div
            style={{ width: `${progress}%` }}
            className="h-2 bg-blue-500 rounded"
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
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [showAdvanceAmount, setShowAdvanceAmount] = useState("");
  const [certId, setCertId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState(null);

  const router = useRouter();

  const [cert, setCert] = useState({
    certNo: "",
    amount: "",
    date: "",
    status: "Submitted",
  });

  useEffect(() => {
    if (summary) {
      setShowAdvanceAmount(summary.advancePayment || 0);
    }
  }, [summary]);

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
        router,
      );
      if (cert?.status === "Paid") {
        await Api(
          "post",
          `project/update-payment-paid/${projectId}`,
          { paidAmount: Number(cert?.amount) },
          router,
        );
      }
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
        router,
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
      // 1️⃣ Pehle paid amount update hoga
      if (status === "Paid") {
        const paymentRes = await Api(
          "post",
          `project/update-payment-paid/${projectId}`,
          { paidAmount: Number(amount) || 0 },
          router,
        );

        if (paymentRes?.status !== true) {
          loader(false);
          return toast.error("Failed to update paid amount");
        }
      }

      const res = await Api(
        "post",
        `project/update-certificate-status/${id}/${projectId}`,
        { status },
        router,
      );

      if (res?.status !== true) {
        loader(false);
        return toast.error("Failed to update status");
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
        router,
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
        router,
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
      totalPaid = totalPaid + amt;
    }
  });

  console.log(totalPaid);

  return (
    <div className="mt-10 bg-transparent py-4 rounded-xl ">
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

      <h2 className="text-xl font-bold mb-3 text-black">Advance Payment (USD)</h2>

      <p className="text-gray-600 mb-2">
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
          className="px-5 py-3 bg-blue-500 text-white rounded-lg cursor-pointer font-medium"
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
          className={`border p-2 rounded-md `}
          // disabled={cert.status === "Paid"}
        />

        <select
          value={cert.status}
          disabled={cert.status === "Paid"}
          className={`border p-2 rounded text-black cursor-pointer 
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
          className="border p-2 rounded-md text-black bg-white
             [&::-webkit-calendar-picker-indicator]:invert
             [&::-webkit-calendar-picker-indicator]:brightness-0
             [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />

        <button
          className="px-5 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
          onClick={() => {
            certId ? handleUpdateCertificate() : handleAddCertificate();
          }}
        >
          {certId ? "Update" : "Add"} Certificate
        </button>
      </div>

      <h2 className="text-xl font-bold mt-8">Certificates</h2>
     
      <div className="w-full mt-4 overflow-x-auto rounded-t-xl border">
        <table className="w-full text-sm">
          <thead className="bg-blue-500 text-white sticky top-0">
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
              <th className="p-3 text-left whitespace-nowrap ">Actions</th>
            </tr>
          </thead>

          <tbody>
            {(advanceAmount > 0 || showAdvanceAmount > 0) && (
              <tr className="border-b transition bg-white">
                <td className="p-3">Advance Payment</td>

                <td className="p-3">-</td>

                <td className="p-3">-</td>

                <td className="p-3">${showAdvanceAmount}</td>

                <td className="p-3">
                  <p className="border p-2 rounded cursor-pointer text-black w-26">
                    Paid
                  </p>
                </td>

                <td className="p-3 flex gap-3 justify-center">
                  <button
                    className="text-gray-600 hover:text-gray-400 cursor-pointer text-xl"
                    onClick={() =>
                      setAdvanceAmount(summary.advancePayment || 0)
                    }
                  >
                    <Edit />
                  </button>
                </td>
              </tr>
            )}

            {certificates?.map((item,index) => (
              <tr key={item._id} className={`border-b transition ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
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

                <td className="p-3 z-0">
                  <select
                    value={item.status}
                    disabled={item.status === "Paid"}
                    className={`border p-2 rounded cursor-pointer text-black ${
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

                <td className="p-3 text-center relative">
                  <button
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={() =>
                      setOpenId(openId === item._id ? null : item._id)
                    }
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openId === item._id && (
                    <div className="absolute right-4 mt-2 w-32 bg-white border rounded shadow-lg z-20">
                      <button
                        className="flex items-center text-black gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          onEditData(item._id);
                          setOpenId(null);
                        }}
                      >
                        <Edit size={16} /> Edit
                      </button>

                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          onDeleteClick(item._id);
                          setOpenId(null);
                        }}
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            <tr className=" font-semibold">
              <td className="p-3 text-left">Total:</td>
              <td className="p-3">${totalSubmitted}</td>
              <td className="p-3">${totalInProcess}</td>
              <td className="p-3">${totalPaid + showAdvanceAmount}</td>
              <td className="p-3"></td>
              <td className="p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* )} */}
    </div>
  );
};

export const PlanSuccessPopup = ({ open, onDashboard }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[460px] rounded-2xl bg-white p-8 text-center shadow-2xl animate-scaleIn">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-blue-500" />
        </div>

        <h2 className="text-2xl font-semibold text-black">
          Plan Purchased Successfully 🎉
        </h2>

        <p className="mt-2 text-sm text-gray-800">
          Your subscription is now active. Enjoy all premium features.
        </p>

        {/* Action */}
        <button
          onClick={onDashboard}
          className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2.5 cursor-pointer text-sm font-medium text-white transition hover:bg-blue-600"
        >
          My Dashboard
        </button>
      </div>
    </div>
  );
};

export const InviteMemberModal = ({ onClose, onSuccess, loader }) => {
  const router = useRouter();
  const [user] = useContext(userContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    loader(true);

    try {
      const res = await Api(
        "post",
        "auth/createInviteLink",
        {
          email,
          organizationId: user._id,
        },
        router,
      );
      console.log(res);

      loader(false);

      if (res?.status) {
        onSuccess(res.data?.inviteLink, email); // 🔥 pass link + email
      } else {
        toast.error(res?.message || "Failed to send invite");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white text-black rounded-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-1">Invite Team Member</h2>
        <p className="text-sm text-gray-600 mb-4">
          Send an invitation to join your organization
        </p>

        {/* Seats info */}
        <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center mb-4">
          <span>Team Seats</span>
          <h3 className="text-xl font-semibold text-black">
            {user?.subscription?.usedTeamsSize + 1 || "0"}{" "}
            <span className="text-sm text-black">
              of {user?.subscription?.teamSize}{" "}
            </span>
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200">
              <option>Member</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 cursor-pointer rounded-lg bg-gray-200 text-black"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-6 py-2 cursor-pointer rounded-lg bg-[var(--custom-blue)] text-white font-medium"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const InviteSuccessModal = ({ link, email, onClose }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white text-white rounded-3xl p-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 cursor-pointer right-4 text-gray-600"
        >
          <X />
        </button>

        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 text-2xl">
          <CheckLine />
        </div>

        <h2 className="text-xl text-black font-semibold">Invitation Sent!</h2>
        <p className="text-sm text-gray-600 mb-4">
          Share this link with <span className="text-white">{email}</span>
        </p>

        <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 bg-transparent text-black text-sm outline-none"
          />
          <button
            onClick={copyLink}
            className="p-2 bg-black/70 rounded-lg cursor-pointer"
          >
            <Copy />
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-3">
          This link expires in 5 minutes. User must register with this email.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl cursor-pointer bg-[var(--custom-blue)] text-white font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export const AllIncident = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-blue-500" />
            <p className="text-lg font-semibold text-black">Open Incidents</p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-800 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-800">No open incidents</p>
        </div>
      </div>
    </div>
  );
};

export const ProjectBehind = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <p className="text-lg font-semibold text-black">
              Projects Behind Schedule
            </p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-800 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-800">No Projects Behind Schedule</p>
        </div>
      </div>
    </div>
  );
};

export const AllGrievances = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <p className="text-lg font-semibold text-black">Open grievances</p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-800 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-800">No open grievances</p>
        </div>
      </div>
    </div>
  );
};

export const ActionPoints = ({
  onclose,
  projectId,
  setProjectID,
  projects,
  AllActionPoints,
}) => {
  console.log(AllActionPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <p className="text-lg font-semibold text-black">
              Open Action Points
            </p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4">
          <label className="text-sm text-gray-600">Filter by project:</label>

          <select
            value={projectId}
            onChange={(e) => setProjectID(e.target.value)}
            className="bg-gray-200 text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-custom-yellow w-[200px]"
          >
            <option value="all">All Projects</option>

            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto md:h-[500px] h-[600px] rounded-xl border border-gray-200 bg-white m-4">
          <table className="min-w-full border-collapse border-gray-300 text-sm text-gray-300 ">
            <thead>
              <tr className=" text-left text-white bg-blue-500">
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3 w-28">Priority</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 w-30">Status</th>
              </tr>
            </thead>

            <tbody>
              {AllActionPoints.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-700 min-h-[220px] flex-col items-center justify-center"
                  >
                    No Open Action Points In Any Project
                  </td>
                </tr>
              ) : (
                AllActionPoints.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-800 hover:bg-gray-200 transition ${index % 2 === 0 ? "bg-white" : " bg-gray-200"}`}
                  >
                    <td className="px-4 py-3 text-black">{index + 1}</td>
                    <td className="px-4 py-3 text-black">
                      {item?.projectId?.projectName}
                    </td>
                    <td className="px-4 py-3 text-black">
                      {item?.description}
                    </td>
                    <td className="px-4 py-3 text-black">
                      {item?.assignedTo || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-blue-400  border-2 border-blue-400 rounded-full px-1 py-1 text-center">
                        {" "}
                        {item?.priority}{" "}
                      </p>{" "}
                    </td>
                    <td className="px-4 py-3 text-black">
                      {item?.dueDate
                        ? moment(item.dueDate).format("DD-MM-YYYY")
                        : "-"}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-blue-400 border-2 border-blue-400 rounded-full px-1 py-1 text-center">
                        {" "}
                        {item?.status}{" "}
                      </p>{" "}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Milestones = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2">
              <Clock1 className="h-5 w-5 text-custom-yellow" />
              <p className="text-lg font-semibold text-white">Milestones</p>
            </div>
            <p className="text-sm text-white">
              {" "}
              Upcoming and overdue milestones for this project
            </p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-100 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-500">No milestones to display</p>
        </div>
      </div>
    </div>
  );
};

export const OpenIncient = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-custom-yellow" />
              <p className="text-lg font-semibold text-white">Open incidents</p>
            </div>
            <p className="text-sm text-white">
              {" "}
              World Bank ESF compliance incident reports
            </p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-100 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-500">No open incidents</p>
        </div>
      </div>
    </div>
  );
};

export const ProjectGrievances = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-custom-yellow" />
              <p className="text-lg font-semibold text-white">
                Open grievances
              </p>
            </div>
            <p className="text-sm text-white">
              Click on a grievance to view full details
            </p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-100 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-500">No open grievances</p>
        </div>
      </div>
    </div>
  );
};

export const ProjectActionPoints = ({ onclose, loader }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-5 w-5 text-custom-yellow" />
              <p className="text-lg font-semibold text-white">
                Open Action Points by Project
              </p>
            </div>
            <p className="text-sm text-white">
              Action items that have passed their deadline
            </p>
          </div>

          <button
            onClick={onclose}
            className="rounded-full p-1 text-gray-100 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-500">
            No Open Action Points In Any Project
          </p>
        </div>
      </div>
    </div>
  );
};

export const ProjectInformation = ({ projectInfo, onClose }) => {
  if (!projectInfo) return null;

  const {
    projectName,
    projectType,
    projectNo,
    programType,
    status,
    defectsLiability,
    startDate,
    endDate,
    location,
    ProjectScope,
    ExcuetiveSummary,
    description,
  } = projectInfo;

  const formattedStartDate = startDate
    ? moment(startDate).format("DD MMM YYYY")
    : "-";

  const formattedEndDate = endDate
    ? moment(endDate).format("DD MMM YYYY")
    : "-";

  let duration = "-";

  if (startDate && endDate) {
    const start = moment(startDate);
    const end = moment(endDate);

    const days = end.diff(start, "days");

    duration = days >= 0 ? `${days} Days` : "-";
  }
  const hasNarrative = ProjectScope || ExcuetiveSummary || description;

  const Info1 = ({ label, value }) => (
    <div>
      <p className="mb-1 text-gray-700">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  );

  const Narrative = ({ title, value }) => {
    const isHTML =
      typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value); // simple HTML detection

    return (
      <div>
        <p className="mb-1 text-gray-600">{title}</p>

        {isHTML ? (
          <div
            className="text-gray-600 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p className="text-gray-600">{value || "Not specified"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-gray-800 bg-white p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold text-black">
              <ClipboardList size={20} />
              Project Information
            </div>
            <p className="mt-1 text-sm text-gray-600">{projectName}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border cursor-pointer border-gray-700 p-1 text-gray-400 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {/* Basic Details */}
        <section className="mb-8">
          <h4 className="mb-4 text-sm font-semibold text-black">
            Basic Details
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-sm">
            <Info1 label="Project Type" value={projectType} />
            <Info1 label="Project Number" value={projectNo || "Not assigned"} />
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <span className="inline-flex rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                {status}
              </span>
            </div>

            <Info1 label="Duration" value={duration} />
            <Info1 label="Program Type" value={programType} />
            <Info1
              label="Defects Liability"
              value={defectsLiability || "Not set"}
            />
            <Info1 label="Client" value={projectInfo?.clientInfo?.ClientName} />
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-8">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-black">
            <Calendar size={16} /> Timeline
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-sm">
            <Info1 label="Start Date" value={formattedStartDate} />
            <Info1 label="End Date" value={formattedEndDate} />
            <Info1 label="Duration" value={duration} />
          </div>
        </section>

        {/* Location */}
        <section className="mb-8">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
            <MapPin size={16} /> Location
          </h4>
          <p className="text-sm text-gray-600">{location}</p>
        </section>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800" />

        {/* Narrative Section */}
        {hasNarrative ? (
          <section className="space-y-4 text-sm text-gray-600">
            {ProjectScope && <Narrative title="Scope" value={ProjectScope} />}
            {ExcuetiveSummary && (
              <Narrative title="Summary" value={ExcuetiveSummary} />
            )}
            {description && (
              <Narrative title="Description" value={description} />
            )}
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 rounded-full border border-gray-700 p-3">
              <FileText className="h-5 w-5 text-gray-800" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              No additional narrative details
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Add scope, summary, or description in Edit Project
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ContractorDetails = ({ projectInfo, onClose }) => {
  const {
    contractorName,
    Email,
    phone,
    contactPerson,
    teamMembers = [],
    equipment = [],
  } = projectInfo?.contractorInfo || {};

  const Info = ({ label, value, icon }) => (
    <div>
      <p className="text-gray-700 text-xs mb-1">{label}</p>
      <p className="text-sm flex items-center gap-2 text-gray-600">
        {icon}
        {value || "Not specified"}
      </p>
    </div>
  );

  const Section = ({ title, data, columns, emptyMessage, emptyHint, icon }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>

      {data.length === 0 ? (
        <div className="border border-gray-300 shadow rounded-xl p-6 text-center text-gray-400 bg-white">
          <div className="mb-2 flex justify-center text-black">
            <User size={26} />
          </div>
          <p className="font-medium text-black">{emptyMessage}</p>
          <p className="text-xs mt-1 text-black">{emptyHint}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-custom-green text-gray-600">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-800 hover:bg-gray-900"
                >
                  {Object.values(item)
                    .slice(0, columns.length)
                    .map((val, i) => (
                      <td key={i} className="px-4 py-2 text-gray-600">
                        {val || "-"}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-800 max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 text-black">
              Contractor Details
            </h2>
            <p className="text-sm text-gray-600">
              Contractor information overview
            </p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-600 hover:text-black cursor-pointer" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <User size={16} /> Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Company Name" value={contractorName} />
            <Info label="Contact Person" value={contactPerson} />
            <Info label="Email" value={Email} icon={<Mail size={14} />} />
            <Info label="Phone" value={phone} icon={<Phone size={14} />} />
          </div>
        </div>

        <Section
          title={`Personnel (${teamMembers.length})`}
          emptyMessage="No personnel records"
          emptyHint="Add personnel in Edit Project"
          data={teamMembers}
          columns={["Name", "Role", "Designation"]}
          icon={<Users size={16} />}
        />

        <Section
          title={`Equipment (${equipment.length})`}
          emptyMessage="No equipment records"
          emptyHint="Add equipment in Edit Project"
          data={equipment}
          columns={["Equipment Name", "Type", "Quantity", "Condition"]}
          icon={<Layers size={16} />}
        />
      </div>
    </div>
  );
};
