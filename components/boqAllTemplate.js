import React, { useState } from "react";
import { Building2, X, PlusCircle, FileWarning, Eye, Trash2, CheckCircle } from "lucide-react";
import CreateTemplateForm from "./createTemplate";
import ConfirmModal from "./confirmModel";
import { toast } from "react-toastify";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import CreateTemplatebyExelsheet from "./createTemplatebyExelsheet";
import TemplateDetails from "./templatedetails";

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
                    toast.success(res?.data?.message || "Template Deleted Sucessfully")
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
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Choose Templates</h1>
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
                                <div className="relative md:p-6 px-3 py-4 h-full flex flex-col">
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

          
            {showModal && selectedTemplate && (
               <TemplateDetails selectedTemplate={selectedTemplate} onClose={closeModal} />
            )}

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
