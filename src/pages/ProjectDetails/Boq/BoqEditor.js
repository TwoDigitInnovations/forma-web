import React, { useState, useEffect, useRef } from 'react';
import { NotebookPen, MapPin, Search, Filter, FileCode2, X } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "@/pages/_app"
import BOQTemplate from '../../../../components/boqAllTemplate';
import BOQTemplateModal from '../../../../components/TemplateSelection';
import EditableTable from '../../../../components/EditableTable';
import ConfirmModal from '../../../../components/confirmModel';

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
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const dropdownRef = useRef(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [saveBoqOpen, setSaveBoqOpen] = useState(false)
    const [boqname, setBoqName] = useState("")
    const [isChanged, setIsChanged] = useState(false);

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

    const addSingleItem = () => {
        setData((prevData) => {
            let lastItem = prevData[prevData.length - 1]?.itemNo || "1.0";
            let [main, sub] = lastItem.split(".");
            sub = parseInt(sub) + 1;

            const newItem = {
                itemNo: `${main}.${sub}`,
                description: "",
                unit: "",
                quantity: 0,
                rate: 0,
                amount: 0,
            };
            console.log("newItem", newItem)
            return [...prevData, newItem];
        });

        setOpen(false);
    };


    const deleteData = () => {
        setData([]);
        toast.success("All Rows Deleted")
    };

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

        const newItems = template?.sections?.flatMap((section) =>
            section.items.map((item) => ({
                itemNo: item?.itemNo || "",
                description: item?.description || "",
                unit: item?.unit || "",
                quantity: item?.quantity || 0,
                rate: item?.rate || 0,
                amount: (parseFloat(item?.quantity) || 0) * (parseFloat(item?.rate) || 0),
            }))
        ) || [];

        setData(newItems);
        setOriginalData(newItems);

        toast.success("Template loaded successfully");
        setSelectedOption("boqTable");
        setIsChanged(false)
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

    const SaveBoq = async () => {
        props.loader(true);

        const Boqdata = {
            projectId: projectId,
            items: data,
            currency: "USD",
            quantity: 1,
            boqName: boqname

        }
        // return console.log(Boqdata)
        setSaveBoqOpen(false);
        Api("post", `boq/createBoq`, Boqdata, router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    toast.success(res?.data?.message)
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                props.loader(false);
                toast.error(err?.message || "An error occurred")
            });
    };

    // const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    // const isChanged = !isEqual(originalData, data);
    // console.log(originalData)
    // console.log(isChanged)
    useEffect(() => {
        const changed =
            JSON.stringify(data) !== JSON.stringify(originalData);
        setIsChanged(changed);
    }, [data, originalData]);

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
                            <button
                                className={`bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center transition-opacity ${data.length === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
                                    }`}
                                disabled={data.length === 0 }
                                onClick={() => setSaveBoqOpen(true)}
                            >
                                Save Boq
                            </button>


                            <button
                                className={`bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center transition-opacity ${data.length === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
                                    }`}
                                onClick={() => setIsConfirmModalOpen(true)}
                                disabled={data.length === 0}
                            >
                                <X />
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
                                            // setOpen(false);
                                        }}
                                    >
                                        Start with Section (Header + Specs + Item)
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-[#e0f349] hover:text-black transition-colors duration-300 cursor-pointer"
                                        onClick={addSingleItem}
                                    >
                                        Add Single Item
                                    </li>


                                    <li
                                        className="px-4 py-2 hover:bg-[#e0f349] hover:text-black transition-colors duration-300 cursor-pointer"
                                        onClick={() => {
                                            console.log("Import from Excel clicked");
                                            // setOpen(false);
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
                        <div className="  mt-6 ">
                            {data.length === 0 ? (
                                <div className="bg-custom-black rounded-xl shadow-sm  px-4 flex flex-col justify-center items-center min-h-[500px] text-center space-y-2">
                                    <FileCode2 size={68} />
                                    <h3 className="text-xl font-medium text-white ">
                                        Start Building Your BOQ
                                    </h3>
                                    <p className="text-gray-300">
                                        Import from ready-made templates or create items manually
                                    </p>
                                </div>

                            ) : (
                                <div className=" h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28 ">
                                    <EditableTable
                                        columnsConfig={columns}
                                        data={data}
                                        onChange={setData} />
                                </div>
                            )}
                        </div>
                    )}

                    <BOQTemplate
                        selectedOption={selectedOption}
                        templatesData={templatesData}
                        loader={props.loader}
                        getAllTemplates={getAllTemplates}
                        projectId={projectId}
                        onLoadTemplate={handleLoadTemplate}
                    />

                    <BOQTemplateModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onLoadTemplate={handleLoadTemplate}
                        templatesData={templatesData}
                    />

                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        setIsOpen={setIsConfirmModalOpen}
                        title="Delete Data"
                        message="Are you sure you want to delete all rows?"
                        onConfirm={deleteData}
                        yesText="Yes, Delete"
                        noText="Cancel"
                    />

                    {saveBoqOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                            <div
                                className="bg-custom-black rounded-xl p-6 md:w-full w-[23rem] max-w-lg 
                                        shadow-[6px_6px_0px_0px_rgba(255,255,0,1)]
                                  animate-slideUp"
                            >

                                <p className="text-gray-300 text-sm mb-3 ">
                                    Enter a name for your BOQ document to save it for later use.
                                </p>

                                {/* Input */}
                                <input
                                    value={boqname}
                                    onChange={(e) => setBoqName(e.target.value)}
                                    placeholder="Enter BOQ Name"
                                    className="w-full px-4 py-2 mb-6 text-black border-2 
                                                border-custom-yellow rounded-lg bg-gray-100 
                                                focus:outline-none focus:ring-2 focus:ring-yellow-400
                                                 hover:bg-gray-200 transition"
                                />

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4">
                                    <button
                                        className="px-5 py-2.5 text-sm cursor-pointer font-medium rounded-lg 
                     border-2 border-custom-yellow text-custom-yellow
                     hover:bg-custom-yellow hover:text-black 
                     transition-all shadow-md"
                                        onClick={() => setSaveBoqOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-5 py-2.5 cursor-pointer text-sm font-semibold rounded-lg 
                     bg-custom-yellow text-black 
                     hover:bg-yellow-400 transition-all 
                     shadow-lg hover:scale-105"
                                        onClick={SaveBoq}
                                    >
                                        Save BOQ
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default BOQ;


