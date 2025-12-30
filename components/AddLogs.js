import React, { useContext, useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import InputField from "./UI/InputField";
import TextAreaField from "./UI/TextAreaField";

const AddLogs = ({ setIsOpen, loader, refreshList, projectId, editData }) => {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    weather: "",
    workSummary: "",
    issues: "",
    notes: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        weather: editData?.weather || "",
        notes: editData?.notes || "",
        workSummary: editData?.workSummary || "",
        issues: editData?.issues || "",
        notes: editData?.notes || "",
        date: editData?.date?.split("T")[0] || "",
      });
      setEditId(editData._id);
    }
  }, [editData]);

    console.log(editData?.notes);
  
  console.log(formData?.notes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.weather) {
      return toast.error("fill the requirement");
    }

    loader(true);
    let url = "";
    let method = "post";

    if (editId) {
      url = `dailylogs/update/${editId}`;
      method = "put";
    } else {
      url = `dailylogs/create/${projectId}`;
    }

    try {
      const res = await Api(method, url, formData, router);

      loader(false);

      if (res?.status) {
        toast.success(
          `Daily Log ${editId ? "updated" : "created"} successfully!`
        );
        setIsOpen(false);
        refreshList(projectId);
      } else {
        toast.error(res?.message || "Failed to create log");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "An error occurred");
    }
  };



  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-3xl  h-[90vh] overflow-y-scroll scrollbar-hide overflow-scroll">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          {editId ? "Edit Daily Log" : "Add Daily Log"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            name="date"
            type="date"
            label="Date *"
            placeholder="01-12-2025"
            value={formData.date}
            onChange={handleChange}
          />

          <InputField
            name="weather"
            type="text"
            label="Weather"
            placeholder="e.g., Sunny, Rainy, Cloudy"
            value={formData.weather}
            onChange={handleChange}
          />

          <TextAreaField
            name="workSummary"
            label="Work Summary"
            value={formData.workSummary}
            onChange={handleChange}
            rows={5}
          />

          <TextAreaField
            name="issues"
            label="Issues / Challenges"
            value={formData.issues}
            onChange={handleChange}
            rows={5}
          />

          <TextAreaField
            name="notes"
            label="Additional Notes"
            value={formData?.notes}
            onChange={handleChange}
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg border cursor-pointer border-gray-400 text-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-custom-yellow cursor-pointer text-black font-semibold "
            >
              {editId ? "Update Daily logs" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLogs;
