import React, { useState } from "react";
import { Building2, X, PlusCircle, FileWarning, Eye, Trash2, CheckCircle } from "lucide-react";
import CreateTemplateForm from "./createTemplate";
import ConfirmModal from "./confirmModel";
import { toast } from "react-toastify";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import CreateTemplatebyExelsheet from "./createTemplatebyExelsheet";


const BOQTemplate = ({ selectedOption, onLoadTemplate, templatesData, loader, projectId,
    getAllTemplates }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [templateId, setTemplateId] = useState("");
    const router = useRouter();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleUse = (template) => {
        console.log("Using template", template);
        onLoadTemplate(template)
    };

    const handleSee = (template) => {
        console.log("Seeing template", template);
        setSelectedTemplate(template);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTemplate(null);
    };

    const deleteTemplate = async (id) => {
        loader(true);
        Api("delete", `template/deleteTemplate/${id}`, "", router)
            .then((res) => {
                loader(false);
                if (res?.status === true) {
                    toast.success(res?.data?.message || "Boq Deleted Sucessfully")
                    getAllTemplates(projectId)
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                loader(false);
                toast.error(err?.message || "An error occurred")
            });
    }

    if (selectedOption === "boqTable" || selectedOption === "Summary") return null;

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



                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={() => handleUse(template)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4  bg-lime-400 text-black font-semibold rounded-lg transition-all duration-200 hover:bg-lime-500 cursor-pointer"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Use
                                        </button>

                                        <button
                                            onClick={() => handleSee(template)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4  bg-gray-600 text-white font-semibold rounded-lg  transition-all duration-200 hover:bg-gray-700 cursor-pointer"
                                        >
                                            <Eye className="w-5 h-5" />
                                            See
                                        </button>

                                        <button
                                            onClick={() => {
                                                setTemplateId(template?._id)
                                                console.log(template?._id);
                                                setIsConfirmModalOpen(true)
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-red-600 cursor-pointer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            Delete
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
                            <h2 className="text-2xl font-bold text-gray-900">Template Details</h2>
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

                            {/* ✅ FIX: Now properly mapping over sections */}
                            {selectedTemplate?.sections?.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-8">
                                    {/* Section Header */}
                                    <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800">
                                                {section.sectionName}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {section.items?.length || 0} items
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg px-3 py-1 shadow-sm">
                                            <span className="text-xs font-medium text-blue-600">
                                                Section {sectionIndex + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {section.items?.length > 0 && (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Item No.
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Description
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Unit
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {section.items.map((item, index) => (
                                                            <tr
                                                                key={index}
                                                                className="transition-colors hover:bg-gray-50"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {item.itemNo}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                                    {item.description}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {item.unit}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {section.subSections?.length > 0 && (
                                        <div className="mt-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-5 w-1 bg-blue-500 rounded-full"></div>
                                                <h5 className="text-base font-semibold text-gray-800">
                                                    Subsections ({section.subSections.length})
                                                </h5>
                                            </div>

                                            <div className="space-y-6">
                                                {section.subSections.map((sub, subIndex) => (
                                                    <div
                                                        key={subIndex}
                                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                                    >
                                                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                                            <div className="flex items-center justify-between">
                                                                <h6 className="text-sm font-semibold text-gray-700">
                                                                    {sub.subSectionName}
                                                                </h6>
                                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                    {sub.items?.length || 0} items
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {sub.items?.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Item No.
                                                                            </th>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Description
                                                                            </th>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Unit
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {sub.items.map((subItem, subItemIndex) => (
                                                                            <tr
                                                                                key={subItemIndex}
                                                                                className="transition-colors hover:bg-gray-50"
                                                                            >
                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                    {subItem.itemNo}
                                                                                </td>
                                                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                                                    {subItem.description}
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                    {subItem.unit}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <div className="px-6 py-8 text-center">
                                                                <div className="text-gray-400 mb-2">
                                                                    <svg
                                                                        className="w-12 h-12 mx-auto"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={1.5}
                                                                            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-sm text-gray-500">
                                                                    No items in this subsection.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* <CreateTemplateForm
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                loader={loader}
                getAllTemplates={getAllTemplates}
                projectId={projectId}
            /> */}
            
            <CreateTemplatebyExelsheet
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                loader={loader}
                getAllTemplates={getAllTemplates}
                projectId={projectId} />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                setIsOpen={setIsConfirmModalOpen}
                title="Delete This Template"
                message="Are you sure you want to delete ?"
                onConfirm={() => deleteTemplate(templateId)}
                yesText="Yes, Delete"
                noText="Cancel"
            />
        </div>
    );
};

export default BOQTemplate;
