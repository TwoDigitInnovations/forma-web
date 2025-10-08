import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import { Api } from "@/services/service";
const CreateTemplatebyExelsheet = ({ setIsOpen, loader, getAllTemplates, isOpen, projectId }) => {
    const router = useRouter();
    const [user] = useContext(userContext);
    const [formData, setFormData] = useState({
        name: "",
        categoryName: "",
        description: "",
        sections: []
    });
    const [excelFile, setExcelFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        setExcelFile(file);

        // Parse Excel file
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const XLSX = await import('xlsx');
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    toast.error("Excel file is empty");
                    return;
                }

                // Parse and structure the data
                const structuredData = parseExcelData(jsonData);
                setPreviewData(structuredData);
                setFormData(prev => ({
                    ...prev,
                    sections: structuredData.sections
                }));

                toast.success(`Parsed ${structuredData.sections.length} sections from Excel`);
            } catch (error) {
                console.error("Error parsing Excel:", error);
                toast.error("Failed to parse Excel file");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const parseExcelData = (rows) => {
        const sections = [];
        let currentSection = null;
        let currentSubSection = null;

        rows.forEach(row => {
            const type = row['Type']?.trim().toLowerCase();

            if (type === 'section') {
                if (currentSection) {
                    sections.push(currentSection);
                }

                currentSection = {
                    sectionName: row['Section Name'] || '',
                    sectionId: formatSectionName(row['Section Name'] || ''),
                    description: row['Description'] || '',
                    items: [],
                    subSections: []
                };
                currentSubSection = null;

            } else if (type === 'subsection') {
                if (!currentSection) {
                    toast.warning("Subsection found without a section. Creating default section.");
                    currentSection = {
                        sectionName: 'Default Section',
                        sectionId: 'default-section-01',
                        description: '',
                        items: [],
                        subSections: []
                    };
                }
                currentSubSection = {
                    subSectionName: row['SubSection Name'] || '',
                    subSectionId: formatSectionName(row['SubSection Name'] || ''),
                    items: []
                };
                currentSection.subSections.push(currentSubSection);

            } else if (type === 'item') {
                const item = {
                    itemNo: row['Item No'] || '',
                    description: row['Description'] || '',
                    quantity: row['Quantity']?.toString() || '',
                    unit: row['Unit'] || '',
                    rate: row['Rate']?.toString() || '',
                    rowType: row['Row Type'] || 'normal'
                };

                if (currentSubSection) {
                    currentSubSection.items.push(item);
                } else if (currentSection) {
                    currentSection.items.push(item);
                } else {
                    toast.warning("Item found without section. Creating default section.");
                    currentSection = {
                        sectionName: 'Default Section',
                        sectionId: 'default-section-01',
                        description: '',
                        items: [item],
                        subSections: []
                    };
                }
            }
        });
        if (currentSection) {
            sections.push(currentSection);
        }

        return { sections };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loader(true);


        if (!formData.name || !formData.categoryName) {
            loader(false);
            toast.error("Please fill in template name and category");
            return;
        }

        if (formData.sections.length === 0) {
            loader(false);
            toast.error("Please import an Excel file with sections and items");
            return;
        }

        let hasValidItems = false;
        for (const section of formData.sections) {
            if (section.items.length > 0) {
                hasValidItems = true;
                break;
            }
            for (const subSection of section.subSections || []) {
                if (subSection.items.length > 0) {
                    hasValidItems = true;
                    break;
                }
            }
            if (hasValidItems) break;
        }

        if (!hasValidItems) {
            loader(false);
            toast.error("Excel file must contain at least one item");
            return;
        }

        const data = {
            ...formData,
            projectId: projectId,
            categoryId: formatSectionName(formData.categoryName),
            createdBy: user._id
        };
        console.log(data);


        Api("post", "template/createTemplate", data, router)
            .then((res) => {
                loader(false);
                if (res?.status === true) {
                    setIsOpen(false);
                    toast.success("BOQ Template created successfully");
                    getAllTemplates(projectId);
                    setFormData({
                        name: "",
                        categoryName: "",
                        description: "",
                        sections: []
                    })
                    setPreviewData(null)
                } else {
                    toast.error(res?.message || "Failed to create template");
                }
            })
            .catch((err) => {
                loader(false);
                toast.error(err?.message || "An error occurred");
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-1">Create BOQ Template from Excel</h2>
                <p className="text-sm text-gray-300 mb-4">
                    Import BOQ template data from an Excel file with sections, subsections, and items.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Template Info */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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

                    {/* Excel File Upload */}
                    <div>
                        <label className="text-white text-sm block mb-1">Import from Excel Sheet *</label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg focus:outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-custom-yellow file:text-black file:bg-[#e0f349] cursor-pointer"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            Upload an Excel file (.xlsx or .xls) with columns: Type, Section Name, SubSection Name, Item No, Description, Quantity, Unit, Rate, Row Type
                        </p>
                    </div>

                    {previewData && (
                        <div className="bg-[#3F3F3F] rounded-lg p-4">
                            <h3 className="text-sm font-semibold mb-2">Preview</h3>
                            <div className="text-xs space-y-2">
                                <p>Total Sections: <span className="text-custom-yellow">{previewData.sections.length}</span></p>
                                {previewData.sections.slice(0, 3).map((section, idx) => (
                                    <div key={idx} className="pl-4 border-l-2 border-gray-600">
                                        <p className="font-semibold">{section.sectionName}</p>
                                        <p className="text-gray-400">
                                            Items: {section.items.length} |
                                            SubSections: {section.subSections?.length || 0}
                                        </p>
                                    </div>
                                ))}
                                {previewData.sections.length > 3 && (
                                    <p className="text-gray-400">... and {previewData.sections.length - 3} more sections</p>
                                )}
                            </div>
                        </div>
                    )}

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

export default CreateTemplatebyExelsheet;