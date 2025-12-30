import React, { useContext, useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";

const AddActionPoints = ({
  setIsOpen,
  loader,
  projectId,
  editData,
  refreshList,
}) => {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    priority: "Medium",
    status: "Open",
    assignedTo: "",
    dueDate: "",
  });

  console.log(editData);
  

  useEffect(() => {
    if (editData) {
      setFormData({
        description: editData?.description || "",
        priority: editData?.priority || "Medium",
        status: editData?.status || "Open",
        assignedTo: editData?.assignedTo || "",
        dueDate: editData?.dueDate?.split("T")[0] || "",
      });
      setEditId(editData._id);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.assignedTo || !formData.dueDate) {
      return toast.error("fill the requirement");
    }

    loader(true);

    try {
      let url = "";
      let method = "post";

      if (editId) {
        // UPDATE case
        url = `action-Point/update/${editId}`;
        method = "put";
      } else {
        // CREATE case
        url = `action-Point/create/${projectId}`;
      }

      const res = await Api(method, url, formData, router);

      loader(false);

      if (res?.status) {
        toast.success(
          editId ? "Action Point updated!" : "Action Point created!"
        );
        setIsOpen(false);
        refreshList(projectId); // refresh list in parent
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "Error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {editId ? "Edit Action Point" : "Add Action Point"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font medium mb-1">
              Description *
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the action points"
              className="w-full border rounded-lg p-2 focus:outline-orange-500"
            ></textarea>
          </div>

          {/* Priority + Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:outline-orange-500 text-white cursor-pointer"
              >
                <option value="Low" className="text-black">
                  Low
                </option>
                <option value="Medium" className="text-black">
                  Medium
                </option>
                <option value="High" className="text-black">
                  High
                </option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:outline-white cursor-pointer text-white"
              >
                <option value="Open" className="text-black">
                  Open
                </option>
                <option value="In-Progress" className="text-black">
                  In-Progress
                </option>
                <option value="Completed" className="text-black">
                  Completed
                </option>
              </select>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block mb-1">Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-orange-500"
              placeholder="Enter person name"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-white [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black cursor-pointer rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-custom-yellow text-black cursor-pointer rounded-lg hover:bg-orange-700"
            >
              {editId ? "Update Action Point" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActionPoints;
