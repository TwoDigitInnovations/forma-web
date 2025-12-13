import React, { useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const AssignProject = ({ onclose, teamList, AllProjectData,getAllMembers }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
 
  const [formData, setFormData] = useState({
    projectId: "",
    memberId: "",
    actionType: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      projectId: formData.projectId,
      memberId: formData.memberId,
      actionType: formData.actionType, // "edit" | "view" | "both"
    };

    try {
      const res = await Api("post", "project/assignProjectToMember", payload, router);
      setLoading(false);

      if (res?.status) {
        toast.success("Project assigned successfully!");
        onclose();
        getAllMembers(); 
      } else {
        toast.error(res?.message || "Failed to assign project");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-2xl">

        <h2 className="text-xl font-bold mb-1 mt-4">Assign Project</h2>
        <p className="text-sm text-gray-300 mb-4">
          Choose project, team member and permission type.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Project Dropdown */}
          <div>
            <label className="block text-sm mb-1">Select Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-800 text-white"
              required
            >
              <option value="">-- Select Project --</option>
              {AllProjectData?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Team Member Dropdown */}
          <div>
            <label className="block text-sm mb-1">Select Team Member</label>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-800 text-white"
              required
            >
              <option value="">-- Select Member --</option>
              {teamList?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Dropdown */}
          <div>
            <label className="block text-sm mb-1">Permission Type</label>
            <select
              name="actionType"
              value={formData.actionType}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-800 text-white"
              required
            >
              <option value="">-- Select Action --</option>
              <option value="view">View</option>
              <option value="edit">Edit</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onclose}
              className="px-5 py-2 rounded-xl bg-gray-800 cursor-pointer hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-custom-yellow text-black cursor-pointer rounded-xl hover:scale-105 transition"
            >
              {loading ? "Assigning..." : "Assign Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignProject;
