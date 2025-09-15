import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";

const CreateProjectForm = ({ setIsOpen, loader, getAllProject }) => {
    const router = useRouter()
    const [user] = useContext(userContext)
    const [formData, setFormData] = useState({
        projectName: "",
        description: "",
        location: "",
        projectType: "Commercial",
        projectBudget: "",
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

    const handleSubmit = async (e) => {
        loader(true);
        e.preventDefault();
        const data = {
            ...formData,
            userId: user._id
        }
        Api("post", "project/createProject", data, router)
            .then((res) => {
                loader(false);
                if (res?.status === true) {
                    toast.success("Project Creation successfully")
                    getAllProject()
                    setIsOpen(false)
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                loader(false);
                toast.error(err?.message || "An error occurred")
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

                    <label className="text-white text-sm"> Project Type</label>
                    <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
                    >
                        <option>Commercial</option>
                        <option>Residential</option>
                        <option>Industrial</option>
                        <option>Infrastructure</option>
                    </select>


                    <label className="text-white text-sm"> Project budget</label>
                    <input
                        type="number"
                        name="projectBudget"
                        placeholder="Project Budget"
                        value={formData.projectBudget}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
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
