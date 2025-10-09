import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, Shield, FileText, BarChart3, Settings, Eye, Edit, Trash2 } from 'lucide-react';
import isAuth from '../../components/isAuth';
import CreateTemplateForm from '../../components/createTemplate';
import { Api } from '@/services/service';
import { useRouter } from 'next/router';
import Table from '../../components/table';
import TemplateDetails from '../../components/templatedetails';
import ConfirmModal from '../../components/confirmModel';

const Admin = (props) => {
    const [selectedOption, setSelectedOption] = useState("boqTable");
    const [AllData, setAllData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [templateId, setTemplateId] = useState("");
    const router = useRouter();

    const closeModal = () => {
        setShowModal(false);
        setSelectedTemplate(null);
    };
    useEffect(() => {
        getAllTemplates()
    }, [])

    const getAllTemplates = async () => {
        props.loader(true);
        Api("get", `template/getAllTemplates`, "", router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    setAllData(res.data?.data)
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                props.loader(false);
                toast.error(err?.message || "An error occurred")
            });
    };

    const deleteTemplate = async (id) => {
        props.loader(true);
        Api("delete", `template/deleteTemplate/${id}`, "", router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    toast.success(res?.data?.message || "Template Deleted")
                    getAllTemplates()
                } else {
                    toast.error(res?.message || "Failed to created status")
                }
            })
            .catch((err) => {
                props.loader(false);
                toast.error(err?.message || "An error occurred")
            });
    }

    const Category = ({ value }) => {
        return (
            <div className="flex items-center justify-center">
                {value}
            </div>
        );
    };

    const Description = ({ value }) => {
        return (
            <div className="flex items-center justify-center">
                {value}
            </div>
        );
    };

    const Name = ({ value }) => {
        return (
            <div className="flex items-center justify-center">
                {value}
            </div>
        );
    };

    const renderActions = ({ row }) => (
        <div className="flex items-center justify-center gap-1">
            <button
                className="flex items-center px-2 py-2 rounded-lg hover:bg-yellow-50 transition-all cursor-pointer hover:text-yellow-600"
            >
                <Edit size={18} />
            </button>
            <button
                className="flex items-center px-2 py-2 rounded-lg hover:bg-green-50 transition-all cursor-pointer hover:text-green-600"
                onClick={() => {
                    setSelectedTemplate(row.original);
                    setShowModal(true);
                }}
            >
                <Eye size={18} />
            </button>
            <button
                className="flex items-center px-2 py-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer hover:text-red-500"
                onClick={() => {
                    setTemplateId(row.original._id);
                    setIsConfirmModalOpen(true);
                }}
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: 'name',
                Cell: Name,
            },
            {
                Header: "Category",
                accessor: 'categoryName',
                Cell: Category
            },
            {
                Header: "Description",
                accessor: 'description',
                Cell: Description
            },

            {
                Header: "ACTIONS",
                Cell: renderActions,
                width: 120
            },
        ],
        []
    );
    return (
        <div className="h-screen bg-black to-black text-white">
            <div className="w-full max-w-7xl mx-auto p-3 py-6 md:p-6 h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-54 ">

                <div className="bg-custom-green py-6 md:px-6 px-3 flex flex-col rounded-2xl mb-8 shadow-lg">
                    <div className="flex md:flex-row flex-col md:justify-between justify-start md:items-center gap-3  mb-2">
                        <div className='flex gap-2 items-center'>
                            <Shield className="text-white" size={40} />
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                        </div>
                        <div className='flex md:gap-4 gap-2 items-center'>
                            <button className=" bg-custom-yellow text-black font-medium py-2 px-6 text-md rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"
                                onClick={() => setIsOpen(true)}
                            >
                                Create Templates
                            </button>
                            <button className=" bg-custom-yellow text-black font-medium py-2 px-6 text-md rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer">
                                Manage Reports
                            </button>
                        </div>
                    </div>
                    <p className="text-white text-opacity-80 max-w-3xl mt-2">
                        Manage BOQ templates and report templates for the entire organization with powerful tools and insights.
                    </p>
                </div>


                <div className="bg-custom-black rounded-xl shadow-md">
                    <div className="flex rounded-lg overflow-hidden">
                        <button
                            onClick={() => setSelectedOption("boqTable")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 cursor-pointer font-medium transition-all duration-300 ${selectedOption === "boqTable"
                                ? "bg-custom-yellow text-black shadow-md"
                                : "bg-transparent text-gray-300 hover:text-white hover:bg-gray-700"
                                }`}>
                            <FileText size={18} />
                            BOQ Templates
                        </button>
                        <button
                            onClick={() => setSelectedOption("Summary")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 cursor-pointer font-medium transition-all duration-300 ${selectedOption === "Summary"
                                ? "bg-custom-yellow text-black shadow-md"
                                : "bg-transparent text-gray-300 hover:text-white hover:bg-gray-700"
                                }`}>
                            <BarChart3 size={18} />
                            Report Templates
                        </button>
                    </div>
                </div>

                <div className=" rounded-2xl  shadow-lg">
                    {selectedOption === "boqTable" ? (
                        AllData?.length === 0 ? (
                            <div className=" bg-custom-black flex flex-col justify-center items-center md:h-[370px] h-[470px]">
                                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                                <h2 className="text-xl font-semibold mb-2">BOQ Templates Management</h2>
                                <p className="text-gray-400 text-center max-w-md mx-auto">
                                    Create, edit, and manage your Bill of Quantity templates for projects.
                                </p>

                            </div>
                        ) : (
                            <div className=''>
                                <Table
                                    columns={columns}
                                    data={AllData}
                                />
                            </div>
                        )

                    ) : (
                        <div className="mt-8 bg-custom-black rounded-xl flex flex-col justify-center items-center md:h-[370px] h-[470px]">
                            <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
                            <h2 className="text-xl font-semibold mb-2">Report Templates Management</h2>
                            <p className="text-gray-400 text-center max-w-md mx-auto">
                                Customize and organize your reporting templates for better insights.
                            </p>

                        </div>
                    )}
                </div>

                <CreateTemplateForm
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    loader={props.loader}
                />

                {showModal && selectedTemplate && (
                    <TemplateDetails selectedTemplate={selectedTemplate} onClose={closeModal} />
                )}
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
        </div>
    );
};

export default isAuth(Admin);