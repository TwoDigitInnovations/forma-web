import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";

const CreateTemplateForm = ({ setIsOpen, loader, getAllTemplates, isOpen, projectId }) => {
    const router = useRouter();
    const [user] = useContext(userContext);
    const [formData, setFormData] = useState({ // You'll need to get this from context/props
        categoryName: "",
        categoryId: "",
        name: "",
        description: "",
        isPublic: false,
        sections: [
            {
                sectionName: "General Items",
                sectionId: "",
                items: [
                    {
                        itemNo: "1.0",
                        itemType: "item",
                        description: "",
                        quantity: "",
                        unit: "",
                        rate: "",
                        sortOrder: 1
                    }
                ]
            }
        ]
    });

    // Handle basic form changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle section changes
    const handleSectionChange = (sectionIndex, field, value) => {
        const updatedSections = [...formData.sections];
        updatedSections[sectionIndex][field] = value;
        setFormData((prev) => ({ ...prev, sections: updatedSections }));
    };

    // Handle item changes
    const handleItemChange = (sectionIndex, itemIndex, field, value) => {
        const updatedSections = [...formData.sections];
        updatedSections[sectionIndex].items[itemIndex][field] = value;
        setFormData((prev) => ({ ...prev, sections: updatedSections }));
    };

    // Add new section
    const addSection = () => {
        const newSection = {
            sectionName: `Section ${formData.sections.length + 1}`,
            sectionId: "",
            items: [
                {
                    itemNo: `${formData.sections.length + 1}.0`,
                    itemType: "item",
                    description: "",
                    quantity: "",
                    unit: "",
                    rate: "",
                    sortOrder: 1
                }
            ]
        };
        setFormData((prev) => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };

    // Remove section
    const removeSection = (sectionIndex) => {
        if (formData.sections.length > 1) {
            const updatedSections = formData.sections.filter((_, i) => i !== sectionIndex);
            setFormData((prev) => ({ ...prev, sections: updatedSections }));
        }
    };

    // Add new item to section
    const addItem = (sectionIndex) => {
        const section = formData.sections[sectionIndex];
        const itemCount = section.items.length;
        const sectionNumber = sectionIndex + 1;

        const newItem = {
            itemNo: `${sectionNumber}.${itemCount}`,
            itemType: "item",
            description: "",
            quantity: "",
            unit: "",
            rate: "",
            sortOrder: itemCount + 1
        };

        const updatedSections = [...formData.sections];
        updatedSections[sectionIndex].items.push(newItem);
        setFormData((prev) => ({ ...prev, sections: updatedSections }));
    };

    const removeItem = (sectionIndex, itemIndex) => {
        const section = formData.sections[sectionIndex];
        if (section.items.length > 1) {
            const updatedSections = [...formData.sections];
            updatedSections[sectionIndex].items.splice(itemIndex, 1);
            setFormData((prev) => ({ ...prev, sections: updatedSections }));
        }
    };

    function formatSectionName(name) {
        if (!name) return "";
        let baseName = name.trim().toLowerCase().replace(/\s+/g, "-");
        const match = baseName.match(/(.*?)-(\d+)$/);
        if (match) {
            const text = match[1];
            const num = parseInt(match[2], 10);
            return `${text}-${num.toString().padStart(2, "0")}`;
        }
        return `${baseName}-01`;
    }

    const handleSubmit = async (e) => {
        loader(true);
        e.preventDefault();

        let hasValidItems = false;

        for (const section of formData.sections) {
            const validItems = section.items.filter(item => item.description.trim() !== "");
            if (validItems.length > 0) {
                hasValidItems = true;
                break;
            }
        }

        if (!hasValidItems) {
            loader(false);
            toast.error("Please add at least one item with description to the template");
            return;
        }

        const cleanedSections = formData.sections
            .map(section => ({
                ...section,
                sectionId: formatSectionName(section?.sectionName),
                items: section.items.filter(item => item.description.trim() !== "")
            }))
            .filter(section => section.items.length > 0);

        const data = {
            ...formData,
            projectId: projectId,
            categoryId: formatSectionName(formData?.categoryName),
            createdBy: user._id,
            sections: cleanedSections
        };
        console.log("data", data)

        Api("post", "template/createTemplate", data, router)
            .then((res) => {
                loader(false);
                if (res?.status === true) {
                    toast.success("BOQ Template created successfully");
                    getAllTemplates(projectId);
                    // setIsOpen(false);
                } else {
                    toast.error(res?.message || "Failed to create template");
                }
            })
            .catch((err) => {
                loader(false);
                toast.error(err?.message || "An error occurred");
            });
    };

    if (!isOpen) return

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-1">Create New BOQ Template</h2>
                <p className="text-sm text-gray-300 mb-4">
                    Create a reusable BOQ template with sections and items.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Template Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Template Name */}
                        <div>
                            <label className="text-white text-sm block mb-1">Template Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="BOQ Template Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#5F5F5F] focus:outline-none text-sm border-gray-600 rounded-lg border"
                                required
                            />
                        </div>

                        {/* Category Name */}
                        <div>
                            <label className="text-white text-sm block mb-1">Category Name *</label>
                            <select
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg focus:outline-none text-sm"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="General Construction">General Construction</option>
                                <option value="Buildings">Buildings</option>
                                <option value="Solar Installation">Solar Installation</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="HVAC">HVAC</option>
                                <option value="Structural">Structural</option>
                                <option value="Civil Works">Civil Works</option>
                                <option value="Road Construction">Road Construction</option>
                                <option value="Interior Design">Interior Design</option>
                                <option value="Landscaping">Landscaping</option>
                                <option value="Renovation">Renovation</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Residential">Residential</option>
                                <option value="Infrastructure">Infrastructure</option>
                            </select>

                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-white text-sm block mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Template Description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg focus:outline-none text-sm"
                        />
                    </div>

                    {/* Public Template Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label className="text-white text-sm">Make this template public</label>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="text-white text-lg font-medium">BOQ Sections</label>
                            <button
                                type="button"
                                onClick={addSection}
                                className="px-4 py-2 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
                            >
                                + Add Section
                            </button>
                        </div>

                        {/* Sections List */}
                        <div className="space-y-6">
                            {formData.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="md:p-6 p-3 bg-[#2A2A2A] rounded-lg border border-gray-600">
                                    {/* Section Header */}
                                    <div className="flex md:flex-row flex-col justify-start items-start mb-4">
                                        <div className="flex-1  mr-4">
                                            <label className="text-white text-sm block mb-1">Section Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Section Name"
                                                value={section.sectionName}
                                                onChange={(e) => handleSectionChange(sectionIndex, "sectionName", e.target.value)}
                                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-center items-center mt-5 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addItem(sectionIndex)}
                                                className="px-3 py-2.5 text-xs rounded-lg bg-green-600 hover:bg-green-500"
                                            >
                                                + Add Item
                                            </button>
                                            {formData.sections.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(sectionIndex)}
                                                    className="px-3 py-2.5 text-xs rounded-lg bg-red-600 hover:bg-red-500"
                                                >
                                                    Remove Section
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-white font-medium">Items</h4>
                                        {section.items.map((item, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className={`p-4 rounded-lg ${item.itemType === 'subitem' ? 'bg-[#404040] ml-6' : 'bg-[#353535]'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-300">
                                                            {item.itemNo} - {'Item'}
                                                        </span>

                                                    </div>
                                                    <div className="flex gap-2">

                                                        {section.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(sectionIndex, itemIndex)}
                                                                className="text-red-400 hover:text-red-300 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                                    {/* Description */}
                                                    <div className="lg:col-span-2">
                                                        <label className="text-xs text-gray-400 mb-1 block">
                                                            Description *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Item Description"
                                                            value={item.description}
                                                            onChange={(e) => handleItemChange(sectionIndex, itemIndex, "description", e.target.value)}
                                                            className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Quantity */}
                                                    <div>
                                                        <label className="text-xs text-gray-400 mb-1 block">
                                                            Quantity
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="0"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(sectionIndex, itemIndex, "quantity", e.target.value)}
                                                            className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Unit */}
                                                    <div>
                                                        <label className="text-xs text-gray-400 mb-1 block">
                                                            Unit
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Unit"
                                                            value={item.unit}
                                                            onChange={(e) => handleItemChange(sectionIndex, itemIndex, "unit", e.target.value)}
                                                            className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Rate */}
                                                    <div>
                                                        <label className="text-xs text-gray-400 mb-1 block">
                                                            Rate
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="0.00"
                                                            value={item.rate}
                                                            onChange={(e) => handleItemChange(sectionIndex, itemIndex, "rate", e.target.value)}
                                                            className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Estimated Amount (Info only) */}
                                                {(item.quantity && item.rate && !isNaN(parseFloat(item.quantity)) && !isNaN(parseFloat(item.rate))) && (
                                                    <div className="text-right mt-2">
                                                        <span className="text-xs text-gray-400">Estimated Amount: </span>
                                                        <span className="text-custom-yellow font-medium">
                                                            ₹{(parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-600">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
                        >
                            Create BOQ Template
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTemplateForm;