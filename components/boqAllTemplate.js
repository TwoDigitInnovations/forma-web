import React, { useState } from "react";
import { Building2, X, PlusCircle, FileWarning } from "lucide-react";
import CreateTemplateForm from "./createTemplate";

const BOQTemplate = ({ selectedOption, onLoadTemplate, templatesData, loader, projectId,
    getAllTemplates }) => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isOpen, setIsOpen] = useState(false)

    const handleUse = (template) => {
        console.log("Using template", template);
        onLoadTemplate(template)
    };

    const handleSee = (template) => {
        setSelectedTemplate(template);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTemplate(null);
    };

    if (selectedOption === "boqTable") return null;

    return (
        <div className="min-h-screen bg-black text-white py-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex md:flex-row flex-col justify-start md:gap-0 gap-2 md:justify-between item-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Choose Templates</h1>
                        <p className="text-gray-400">
                            Choose your desired template from the library.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-[12px] cursor-pointer transition-all duration-200 hover:scale-105  w-[12rem]"
                        onClick={() => setIsOpen(true)}
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Template
                    </button>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templatesData?.length > 0 ? (
                        templatesData?.map((template, id) => (
                            <div
                                key={id}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                onMouseEnter={() => setHoveredCard(template.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent opacity-50"></div>

                                {/* Shine Effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent transform rotate-45 translate-x-8 -translate-y-8"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent transform rotate-45 translate-x-12 -translate-y-4"></div>
                                </div>

                                {/* Card Content */}
                                <div className="relative p-6 h-full flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gray-700/50 rounded-lg backdrop-blur-sm">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div
                                            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${template?.categoryColor || "bg-blue-500"
                                                }`}
                                        >
                                            Category: {template.categoryName}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors duration-200">
                                            {template?.name}
                                        </h3>
                                        <p className="text-gray-300 text-sm italic">
                                            {template?.description}
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-6 flex gap-2">
                                        <button
                                            onClick={() => handleUse(template)}
                                            className="flex-1 py-2 px-4 bg-lime-400 text-black font-semibold rounded-lg transition-all cursor-pointer duration-200"
                                        >
                                            Use
                                        </button>
                                        <button
                                            onClick={() => handleSee(template)}
                                            className="flex-1 py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg transition-all cursor-pointer duration-200"
                                        >
                                            See
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-lime-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <FileWarning className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-300 text-lg mb-4">No templates found</p>
                            {/* <button className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-[12px] cursor-pointer transition-all duration-200 hover:scale-105">
                                <PlusCircle className="w-5 h-5" />
                                Create Template
                            </button> */}
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        More templates will be added regularly. Contact support for custom
                        templates.
                    </p>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Template Details
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Template Sections ({selectedTemplate?.sections?.length || 0})
                            </h3>

                            {selectedTemplate?.sections?.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-8">
                                    {/* Section Header */}
                                    <h4 className="text-md font-bold text-gray-800 mb-2">
                                        {section.sectionName} ({section.items?.length || 0} items)
                                    </h4>

                                    {/* Items Table */}
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                            Item No.
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                            Description
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                            Unit
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                            Type
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white">
                                                    {section.items?.map((item, index) => (
                                                        <tr
                                                            key={index}
                                                            className={
                                                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                            }
                                                        >
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {item.itemNo}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {item.description}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {item.unit}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                                {item.itemType}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <CreateTemplateForm
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                loader={loader}
                getAllTemplates={getAllTemplates}
                projectId={projectId}
            />
        </div>
    );
};

export default BOQTemplate;
