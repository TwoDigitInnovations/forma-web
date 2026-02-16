import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import program from "@/pages/program";

const CreateProjectForm = ({
  setIsOpen,
  loader,
  getAllProject,
  AllProgramData,
}) => {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [formData, setFormData] = useState({
    programType: "",
    programId: "",
    projectName: "",
    description: "",
    location: "",
    projectType: " ",
    contractAmount: "",
  });

  const handleChange = (e, nested = null, field = null) => {
    const { name, value } = e.target;
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const projectTypes = [
    "Road",
    "Bridge",
    "Building",
    "Infrastructure",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProgram = AllProgramData.find(
      (p) => p._id === formData.programId,
    );

    const data = {
      ...formData,
      userId: user._id,
      programType: selectedProgram?.name || "",
    };

    loader(true);

    Api("post", "project/createProject", data, router)
      .then((res) => {
        loader(false);
        if (res?.status === true) {
          toast.success("Project Creation successfully");
          getAllProject();
          setIsOpen(false);
        } else {
          toast.error(res?.message || "Failed to created status");
        }
      })
      .catch((err) => {
        loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-2xl ">
        <h2 className="text-xl font-bold mb-1">Create New Project</h2>
        <p className="text-sm text-gray-300 mb-4">
          Fill in the details below to create a new construction project.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-white text-sm">Program Type</label>

          <select
            name="programId"
            value={formData.programId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
          >
            <option value="">Select Program Type</option>
            {AllProgramData.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
          <label className="text-white text-sm "> Project Name</label>
          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={handleChange}
            className="pt-2 w-full px-4 py-2 bg-[#5F5F5F] focus:outline-none text-sm border-gray-600 rounded-lg border"
            required
          />
          <label className="text-white text-sm"> Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
            required
          />
          <label className="text-white text-sm">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
            required
          />

          <label className="text-white text-sm">Project Type</label>

          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
          >
            <option value="">Select Project Type</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label className="text-white text-sm"> Contract Amount</label>
          <input
            type="number"
            name="contractAmount"
            placeholder="Contract Amount"
            value={formData.contractAmount}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 cursor-pointer text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400 cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
