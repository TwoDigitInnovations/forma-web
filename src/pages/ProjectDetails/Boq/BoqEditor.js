import React, { useState, useEffect, useRef } from 'react';
import { NotebookPen, MapPin, Search, Filter, FileCode2 } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "@/pages/_app"
import BOQTemplate from '../../../../components/boqAllTemplate';
import BOQTemplateModal from '../../../../components/TemplateSelection';
import EditableTable from '../../../../components/EditableTable';

const BOQ = (props) => {
    const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
    const [user] = useContext(userContext)
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("boqTable");
    const [projectId, SetProjectId] = useState(null);
    const [allBoq, setAllBoq] = useState([]);
    const [templatesData, setTemplatesData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loadedTemplate, setLoadedTemplate] = useState(null);

    const dropdownRef = useRef(null);
    const columns = [
        { key: "itemNo", label: "Item No.", type: "readonly" },
        { key: "description", label: "Description", type: "text" },
        {
            key: "unit", label: "Unit", type: "select", options: [
                "No",
                "%",
                "Sq.M",
                "Cu.M",
                "R.M",
                "L.M",
                "Kg",
                "Ton",
                "L.S",
                "Set",
                "Piece",
                "Each",
                "Sq.Ft",
                "Cu.Ft",
                "Ltr",
                "Gal",
                "Bag",
                "Bundle",
                "Roll"
            ]
        },
        { key: "quantity", label: "Quantity", type: "number" },
        { key: "rate", label: "Rate ($)", type: "number" },
        { key: "amount", label: "Amount ($)", type: "readonly" },
    ];

    const initialData = [
        {
            itemNo: 1,
            description: "New Item",
            unit: "No",
            quantity: 5,
            rate: 5,
            amount: 0,
        },
        {
            itemNo: 2,
            description: "Item-2",
            unit: "No",
            quantity: 5,
            rate: 5,
            amount: 0,
        },
        {
            itemNo: 2,
            description: "Item-3",
            unit: "No",
            quantity: 6,
            rate: 5,
            amount: 0,
        },
    ];

    const handleTableChange = (updatedData) => {
        console.log("Updated Table Data:", updatedData);
    };
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("projectDetails")
        if (stored) {
            const project = JSON.parse(stored)
            setProjectdetails(project)
            SetProjectId(project._id)
            getAllBOQ(project._id)
            getAllTemplates(project._id)
        }
    }, [])


    const handleLoadTemplate = (template) => {
        setLoadedTemplate(template);
        console.log('Loaded Template:', template);
    };

    const getAllBOQ = async (projectId) => {
        props.loader(true);
        Api("get", `boq/getBoqsByProject/${projectId}`, "", router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    setAllBoq(res.data?.data)
                    console.log(res.data?.data)
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                props.loader(false);
                toast.error(err?.message || "An error occurred")
            });
    };

    const getAllTemplates = async (projectId) => {
        props.loader(true);
        Api("get", `template/getTemplatesByProjectId/${projectId}`, "", router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    setTemplatesData(res.data?.data)
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                props.loader(false);
                toast.error(err?.message || "An error occurred")
            });
    };



    return (
        <div className="h-screen bg-black text-white ">
            <div className=" w-full h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-8  mx-auto">
                <div className="bg-[#DFF34940] py-6 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="flex  justify-between items-center gap-4">
                        <div>
                            <h1 className="md:text-[14px] text-[13px] font-bold text-white  flex items-center gap-2">
                                {projectDetails.projectName}
                                <span className='ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1 '> <MapPin size={15} /> {projectDetails.location}</span>

                            </h1>
                            <div className='flex items-center-safe gap-3'>
                                <p className="md:text-[32px] text-[24px] text-white mt-1">Item Count</p>
                                <p className="md:text-[14px] text-[13px] text-white mt-1">Total Item: 3 Item</p>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col justify-center items-center  text-center space-y-2">
                        <div className='flex md:flex-row flex-wrap md:justify-center gap-3 md:items-center mt-4 ' >
                            <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center'
                            >
                                Save Boq
                            </button>
                            <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center'
                                onClick={() => setIsModalOpen(true)}
                            >
                                <NotebookPen size={18} />
                                From Template / Library
                            </button>
                            <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center '
                                ref={dropdownRef}
                                onClick={() => setOpen(true)}
                            >
                                <NotebookPen size={18} />
                                From Scratch
                            </button>
                        </div>
                        {open && (
                            <div className="absolute mt-2 w-72 bg-custom-black border border-gray-200 rounded-md shadow-lg z-10">
                                <ul className="py-1 text-sm text-white">
                                    <li
                                        className="px-4 py-2 hover:bg-[#e0f349] hover:text-black transition-colors duration-300 cursor-pointer"
                                        onClick={() => {
                                            console.log("Start with Section clicked");
                                            setOpen(false);
                                        }}
                                    >
                                        Start with Section (Header + Specs + Item)
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-[#e0f349] hover:text-black transition-colors duration-300 cursor-pointer"
                                        onClick={() => {
                                            console.log("Add Single Item clicked");
                                            setOpen(false);
                                        }}
                                    >
                                        Add Single Item
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-[#e0f349] hover:text-black transition-colors duration-300 cursor-pointer"
                                        onClick={() => {
                                            console.log("Import from Excel clicked");
                                            setOpen(false);
                                        }}
                                    >
                                        Import from Excel
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>


                <div className="w-full flex rounded-lg bg-gray-700 ">
                    {/* Boq Table */}
                    <button
                        onClick={() => setSelectedOption("boqTable")}
                        className={`w-1/2 px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200
          ${selectedOption === "boqTable"
                                ? "bg-custom-yellow text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                    >
                        Boq Table
                    </button>

                    {/* Template */}
                    <button
                        onClick={() => setSelectedOption("template")}
                        className={`w-1/2 px-4 py-2  cursor-pointer rounded-lg font-medium transition-colors duration-200
          ${selectedOption === "template"
                                ? "bg-custom-yellow text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                    >
                        Template
                    </button>
                </div>
                <div>
                    {selectedOption === "boqTable" && (
                        <div className="bg-custom-black rounded-xl shadow-sm  mt-6 ">
                            {/* {allBoq.length === 0 ? (
                                <div className="px-4 flex flex-col justify-center items-center min-h-[500px] text-center space-y-2">
                                    <FileCode2 size={68} />
                                    <h3 className="text-xl font-medium text-white ">
                                        Start Building Your BOQ
                                    </h3>
                                    <p className="text-gray-300">
                                        Import from ready-made templates or create items manually
                                    </p>
                                </div>

                            ) : ( */}
                            <div className="overflow-x-auto ">
                                <EditableTable
                                    columnsConfig={columns}
                                    data={initialData}
                                    onChange={handleTableChange} />
                            </div>
                            {/* )} */}
                        </div>
                    )}

                    <BOQTemplate
                        selectedOption={selectedOption}
                        templatesData={templatesData}
                        loader={props.loader}
                        getAllTemplates={getAllTemplates}
                        projectId={projectId}
                    />

                    <BOQTemplateModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onLoadTemplate={handleLoadTemplate}
                        templatesData={templatesData}
                    />



                </div>
            </div>
        </div >
    );
};

export default BOQ;


