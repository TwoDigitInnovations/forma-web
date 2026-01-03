import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import InputField from "./UI/InputField";
import TextAreaField from "./UI/TextAreaField";

const CreateWorkPlan = ({ setIsOpen, loader, getAllProject, projectId }) => {
    const router = useRouter();
    const [user] = useContext(userContext);

    const [formData, setFormData] = useState({
        planName: "",
        description: "",
        startDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loader(true);

        const data = {
            ...formData,
            owner: user._id,
            projectId: projectId
        };

        Api("post", "workplan/createPlan", data, router)
            .then((res) => {
                loader(false);
                if (res?.status === true) {
                    toast.success("Work Plan created successfully!");
                    getAllProject(projectId);
                    setIsOpen(false);
                } else {
                    toast.error(res?.message || "Failed to create work plan");
                }
            })
            .catch((err) => {
                loader(false);
                toast.error(err?.message || "An error occurred");
            });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-1">Create New Work Plan</h2>
                <p className="text-sm text-gray-300 mb-4">
                    Fill in the details below to start a new work plan.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Plan Name"
                        name="planName"
                        value={formData.planName}
                        onChange={handleChange}
                        placeholder="Enter work plan name"
                        required
                    />
                    <InputField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter brief summary of work plan"
                        required
                    />



                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2.5 cursor-pointer text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2.5 cursor-pointer text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
                        >
                            Create Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkPlan;
