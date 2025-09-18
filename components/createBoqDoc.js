import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import { X } from "lucide-react";

const CreateBOQForm = ({ setIsOpen, loader, isOpen, getAllBOQ, projectId, selectedOption }) => {
    const router = useRouter();
    const [user] = useContext(userContext);
    const [formData, setFormData] = useState({
        items: [
            {
                itemName: "",
                unit: "",
                quantity: 0,
                rate: 0,
                amount: 0
            }
        ]
    });

    // Handle basic form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle item changes
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;

        // Auto-calculate amount when quantity or rate changes
        if (field === "quantity" || field === "rate") {
            const quantity = parseFloat(updatedItems[index].quantity) || 0;
            const rate = parseFloat(updatedItems[index].rate) || 0;
            updatedItems[index].amount = quantity * rate;
        }

        setFormData((prev) => ({ ...prev, items: updatedItems }));
    };

    // Add new item
    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    itemName: "",
                    unit: "",
                    quantity: 0,
                    rate: 0,
                    amount: 0
                }
            ]
        }));
    };

    // Remove item
    const removeItem = (index) => {
        if (formData.items.length > 1) {
            const updatedItems = formData.items.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, items: updatedItems }));
        }
    };

    // Calculate total amount
    const getTotalAmount = () => {
        return formData.items.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
    };

    const handleSubmit = async (e) => {
        loader(true);
        e.preventDefault();

        // Validate items
        const validItems = formData.items.filter(item => item.itemName.trim() !== "");
        if (validItems.length === 0) {
            loader(false);
            toast.error("Please add at least one item");
            return;
        }

        const data = {
            ...formData,
            createdBy: user._id,
            items: validItems,
            projectId:projectId,
            source:selectedOption,
        };
        console.log(data)
        Api("post", "boq/createBOQ", data, router)
            .then((res) => {
                loader(false);
                if (res?.status === true) {
                    toast.success("BOQ created successfully");
                    getAllBOQ();
                    setIsOpen(false);
                } else {
                    toast.error(res?.message || "Failed to create BOQ");
                }
            })
            .catch((err) => {
                loader(false);
                toast.error(err?.message || "An error occurred");
            });
    };

    if (!isOpen || !selectedOption === "scratch") return;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-1">Create New BOQ</h2>
                    <X onClick={()=> setIsOpen(false)}/>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                    Create a Bill of Quantities for your construction project.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project ID (if not passed as prop) */}
                    {!projectId && (
                        <>
                            <label className="text-white text-sm">Project ID</label>
                            <input
                                type="text"
                                name="projectId"
                                placeholder="Project ID"
                                value={formData.projectId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#5F5F5F] focus:outline-none text-sm border-gray-600 rounded-lg border"
                                required
                            />
                        </>
                    )}

                    {/* Source Selection */}
                    <label className="text-white text-sm">Source</label>
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg focus:outline-none"
                        required
                    >
                        <option value="scratch">From Scratch</option>
                        <option value="template">From Template</option>
                    </select>

                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-white text-sm font-medium">BOQ Items</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-3 py-1 text-xs rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
                            >
                                + Add Item
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {formData.items.map((item, index) => (
                                <div key={index} className="p-4 bg-[#404040] rounded-lg space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-300">
                                            Item {index + 1}
                                        </span>
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                        {/* Item Name */}
                                        <div className="lg:col-span-2">
                                            <label className="text-xs text-gray-400 mb-1 block">
                                                Item Name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Item Name"
                                                value={item.itemName}
                                                onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                required
                                            />
                                        </div>

                                        {/* Unit */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Unit (e.g., sq ft, nos)"
                                                value={item.unit}
                                                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                            />
                                        </div>

                                        {/* Quantity */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                required
                                            />
                                        </div>

                                        {/* Rate */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">
                                                Rate *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={item.rate}
                                                onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Amount (Auto-calculated) */}
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400">Amount: </span>
                                        <span className="text-custom-yellow font-medium">
                                            ₹{item.amount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Amount */}
                        <div className="p-4 bg-[#2A2A2A] rounded-lg border border-custom-yellow/20">
                            <div className="flex justify-between items-center">
                                <span className="text-white font-medium">Total Amount:</span>
                                <span className="text-custom-yellow font-bold text-lg">
                                    ₹{getTotalAmount().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-6">
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
                            Create BOQ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBOQForm;