"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Layers, Save } from "lucide-react";
import { toast } from "react-toastify";
import moment from "moment";
import { Api } from "@/services/service";

const EditableTable = ({ planId, loader }) => {
    const [activities, setActivities] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [plan, setPlan] = useState(null);

    // ✅ Fetch plan with activities
    useEffect(() => {
        if (planId) fetchPlan();
    }, [planId]);

    const fetchPlan = async () => {
        loader(true);
        try {
            const res = await Api("get", `workplan/getPlanById/${planId}`);
            if (res?.status) {
                setPlan(res?.data);
                setActivities(res?.data?.workActivities || []);
            } else toast.error(res?.message || "Failed to fetch plan");
        } catch (err) {
            toast.error("Error fetching plan");
        } finally {
            loader(false);
        }
    };


    const handleAddRow = (type = "activity") => {
        const newRow = {
            _id: Date.now().toString(),
            description: type === "section" ? "New Section" : "New Activity",
            duration: "1",
            startDate: "",
            endDate: "",
            rowType: type,
        };
        setActivities((prev) => [...prev, newRow]);
    };

    // ✅ Delete (local only)
    const handleDelete = () => {
        setActivities((prev) => prev.filter((_, i) => i !== deleteIndex));
        setShowDeleteModal(false);
        toast.info("Row removed (not saved yet)");
    };

    // ✅ Update local field
    const handleChange = (index, field, value) => {
        setActivities((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
        );
    };

    const handleSave = async () => {
        loader(true);
        try {
            const payload = { workActivities: activities };
            const res = await Api("put", `workplan/updatePlan/${planId}`, payload);
            if (res?.status) {
                toast.success("Work Plan updated successfully");
                fetchPlan();
            } else toast.error(res?.message || "Failed to save");
        } catch (err) {
            toast.error(err?.message || "Save failed");
        } finally {
            loader(false);
        }
    };


    let sectionCount = 0;
    const getNumbering = (idx, type) => {
        if (type === "section") {
            sectionCount++;
            return `${sectionCount}`;
        }
        let secIndex = 0;
        for (let i = idx - 1; i >= 0; i--) {
            if (activities[i].rowType === "section") {
                secIndex = sectionCount;
                break;
            }
        }
        const subIndex =
            activities
                .slice(0, idx)
                .filter((a) => a.rowType === "activity" && a._id !== activities[idx]._id)
                .length - activities.filter((a) => a.rowType === "section").length;
        return `${secIndex}.${subIndex + 1}`;
    };

    return (
        <div className="bg-white pb-6 rounded-lg shadow-md mt-4 overflow-x-auto">

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-custom-yellow text-gray-700">
                        <th className="py-3 px-3 text-left w-[100px]">Item No </th>
                        <th className="py-3 px-3 text-left min-w-[250px]">Description</th>
                        <th className="py-3 px-3 text-center w-[120px]">Duration</th>
                        <th className="py-3 px-3 text-center w-[150px]">Start Date</th>
                        <th className="py-3 px-3 text-center w-[150px]">End Date</th>
                        <th className="py-3 px-3 text-center w-[150px]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((row, i) => {
                        const num = getNumbering(i, row.rowType);
                        return (
                            <tr
                                key={row._id}
                                className={`border-b ${row.rowType === "section"
                                    ? "bg-gray-100 text-black font-semibold"
                                    : "bg-white text-black"
                                    }`}
                            >
                                <td className="text-center py-2 text-black">{num}</td>
                                <td className="py-2 px-3">
                                    <input
                                        value={row.description || ""}
                                        onChange={(e) =>
                                            handleChange(i, "description", e.target.value)
                                        }
                                        className="w-full bg-transparent border-none outline-none text-gray-800"
                                    />
                                </td>
                                <td className="text-center">
                                    <input
                                        value={row.duration || "__"}
                                        onChange={(e) => handleChange(i, "duration", e.target.value)}
                                        className="w-full text-center bg-transparent outline-none"
                                    />
                                </td>
                                <td className="text-center">
                                    <input
                                        type="date"
                                        value={
                                            row.startDate
                                                ? moment(row.startDate).format("YYYY-MM-DD")
                                                : moment().format("YYYY-MM-DD") 
                                        }
                                        onChange={(e) => handleChange(i, "startDate", e.target.value)}
                                        className="bg-transparent outline-none text-center"
                                    />
                                </td>

                                <td className="text-center">
                                    <input
                                        type="date"
                                        value={
                                            row.endDate ? moment(row.endDate).format("YYYY-MM-DD") : ""
                                        }
                                        onChange={(e) => handleChange(i, "endDate", e.target.value)}
                                        className="bg-transparent outline-none text-center"
                                    />
                                </td>

                                <td className="text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleAddRow("activity")}
                                            className="p-1.5 hover:bg-blue-50 rounded"
                                        >
                                            <Plus size={16} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleAddRow("section")}
                                            className="p-1.5 hover:bg-yellow-50 rounded"
                                        >
                                            <Layers size={16} className="text-yellow-600" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteIndex(i);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-1.5 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Bottom Buttons */}
            <div className="flex justify-end mt-4 gap-3">
                <button
                    onClick={() => handleAddRow("section")}
                    className="px-4 py-2 bg-custom-yellow text-black rounded-lg "
                >
                    + Add Section
                </button>
                <button
                    onClick={() => handleAddRow("activity")}
                    className="px-4 py-2 bg-custom-yellow text-black rounded-lg hover:bg-blue-700"
                >
                    + Add Activity
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-custom-yellow text-black rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <Save size={16} /> Save Plan
                </button>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[320px] text-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                            Delete this item?
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This action will only remove locally until saved.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 cursor-pointer text-black bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableTable;
