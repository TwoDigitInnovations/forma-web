import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import InputField from "./UI/InputField";
import TextAreaField from "./UI/TextAreaField";

const CreateTracker = ({ allPlanData = [], setIsOpen, loader, getAllTracker, projectId }) => {
    const router = useRouter();
    const [user] = useContext(userContext);

    const [formData, setFormData] = useState({
        trackerName: "",
        description: "",
        WorkplanId: "",
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
            ProjectId:projectId, // link to project
        };
        try {
            const res = await Api("post", "tracker/create", data, router);
            loader(false);
            if (res?.status) {
                toast.success("Tracker created successfully!");
                setIsOpen(false);
                getAllTracker(projectId)
            } else {
                toast.error(res?.message || "Failed to create tracker");
            }
        } catch (err) {
            loader(false);
            toast.error(err?.message || "An error occurred");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-1">Create New Progress Tracker</h2>
                <p className="text-sm text-gray-300 mb-4">
                    Fill in the details below to start a new Progress Tracker.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Tracker Name"
                        name="trackerName"
                        value={formData.trackerName}
                        onChange={handleChange}
                        placeholder="e.g., Phase 1 Progress"
                        required
                    />

                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter a brief description"
                        required
                    />

                    {/* Work Plan Dropdown */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Work Plan</label>
                        <select
                            name="WorkplanId"
                            value={formData.WorkplanId}
                            onChange={handleChange}
                            className="w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border border-gray-600 focus:outline-none focus:border-green-400"
                            required
                        >
                            <option value="">-- Select Work Plan --</option>
                            {allPlanData.map((opt, i) => (
                                <option key={i} value={opt._id}>
                                    {opt.planName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm cursor-pointer rounded-lg bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm cursor-pointer rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
                        >
                            Create Tracker
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTracker;
