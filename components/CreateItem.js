import React, { useContext, useEffect, useState } from "react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userContext } from "@/pages/_app";

const AddChecklistForm = ({
  setIsOpen,
  loader,
  projectId,
  getAllChecklist,
  editItem,
}) => {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    status: "Pending",
    responsibleParty: "",
    deadline: "",
    notes: "",
  });

  useEffect(() => {
    if (!editItem) return;

    setFormData({
      itemName: editItem.itemName || "",
      status: editItem.status || "Pending",
      responsibleParty: editItem.responsibleParty || "",
      deadline: editItem.deadline
        ? editItem.deadline.split("T")[0] // <-- FIX HERE
        : "",
      notes: editItem.notes || "",
    });

    setEditId(editItem._id);
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loader(true);

    const data = {
      ...formData,
      createdBy: user._id,
    };
    const url = editId ? `update/${editId}` : `create/${projectId}`;
    Api("post", `checklist/${url}`, data, router)
      .then((res) => {
        loader(false);

        if (res?.status === true) {
          toast.success(
            `Checklist item ${editId ? "Updated" : "created"} successfully`
          );
          getAllChecklist();
          setIsOpen(false);
        } else {
          toast.error(res?.message || "Failed to create checklist item");
        }
      })
      .catch((err) => {
        loader(false);
        toast.error(err?.message || "Something went wrong");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-gray-200 text-white rounded-[38px] p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-1 text-black">
          {" "}
          {editId ? "Update" : "Add"} Checklist Item
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Add a new item to the pre-commencement checklist.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <label className="text-black text-sm">Item Name</label>
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-lg"
            required
          />

          {/* Status */}
          <label className="text-black text-sm">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-lg"
          >
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Responsible Party */}
          <label className="text-black text-sm">Responsible Party</label>
          <input
            type="text"
            name="responsibleParty"
            placeholder="e.g., Contractor"
            value={formData.responsibleParty}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-lg"
          />

          {/* Deadline */}
          <label className="text-black text-sm">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-lg"
          />

          {/* Notes */}
          <label className="text-black text-sm">Notes</label>
          <textarea
            name="notes"
            placeholder="Additional notes or comments..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-lg"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 cursor-pointer hover:bg-gray-300 text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-500"
            >
              {editId ? "Update" : "Add"} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChecklistForm;
