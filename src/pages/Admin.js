import React, { useState } from 'react';
import { ChevronLeft, Shield, FileText, BarChart3, Settings } from 'lucide-react';
import isAuth from '../../components/isAuth';
import CreateTemplateForm from '../../components/createTemplate';

const Admin = (props) => {
    const [selectedOption, setSelectedOption] = useState("boqTable");
    const [AllData, setAllData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);



    return (
        <div className="h-screen bg-black to-black text-white">
            <div className="w-full max-w-7xl mx-auto px-4 py-6 md:p-6">
                {/* Header Section */}
                <div className="bg-custom-green py-6 px-6 flex flex-col rounded-2xl mb-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-white" size={40} />
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                    </div>
                    <p className="text-white text-opacity-80 max-w-3xl">
                        Manage BOQ templates and report templates for the entire organization with powerful tools and insights.
                    </p>
                </div>


                <div className="bg-custom-black rounded-xl mb-8 shadow-md">
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

                <div className="bg-custom-black rounded-2xl p-6 shadow-lg">
                    {selectedOption === "boqTable" ? (
                        AllData?.length === 0 ? (
                            <div className="flex flex-col justify-center items-center md:h-[370px] h-[470px]">
                                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                                <h2 className="text-xl font-semibold mb-2">BOQ Templates Management</h2>
                                <p className="text-gray-400 text-center max-w-md mx-auto">
                                    Create, edit, and manage your Bill of Quantity templates for projects.
                                </p>
                                <button className="mt-6 bg-custom-yellow text-black font-medium py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"
                                    onClick={() => setIsOpen(true)}
                                >
                                    Create Templates
                                </button>
                            </div>
                        ) : (
                            <div>
                                <button className="mt-6 bg-custom-yellow text-black font-medium py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
                                    onClick={() => setIsOpen(true)}
                                >
                                    Create Templates
                                </button>
                            </div>
                        )

                    ) : (
                        <div className="flex flex-col justify-center items-center md:h-[370px] h-[470px]">
                            <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
                            <h2 className="text-xl font-semibold mb-2">Report Templates Management</h2>
                            <p className="text-gray-400 text-center max-w-md mx-auto">
                                Customize and organize your reporting templates for better insights.
                            </p>
                            <button className="mt-6 bg-custom-yellow text-black font-medium py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
                                Manage Reports
                            </button>
                        </div>
                    )}
                </div>

                <CreateTemplateForm
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    loader={props.loader}
                />

            </div>
        </div>
    );
};

export default isAuth(Admin);