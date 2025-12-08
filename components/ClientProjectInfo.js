import React, { useRef, useState } from 'react'
import InputField from './UI/InputField'
import { Plus, Trash, Upload } from 'lucide-react'
import TextAreaField from './UI/TextAreaField';
import { toast } from 'react-toastify';
import Compressor from 'compressorjs';
import { ApiFormData } from '@/services/service';
import { useRouter } from 'next/router';

function ClientProjectInfo({ clientDetails, setClientDetails }) {
    const fileInputRef = useRef(null);
    const [currentTab, setCurrentTab] = useState("clientDetails");
    const router = useRouter();
    const [newMember, setNewMember] = useState({
        name: "",
        qualification: "",
        designation: "",
    });

    console.log("ClientProjectInfo", clientDetails)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

     const handleFileChange = (event, i) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileSizeInMb = file.size / (1024 * 1024);
    if (fileSizeInMb > 1) {
      toast.error("Too large file Please upload a smaller image")
      return;
    } else {
      new Compressor(file, {
        quality: 0.6,
        success: (compressedResult) => {
          
          const data = new FormData();
          data.append("file", compressedResult);

          ApiFormData("post", "user/fileUpload", data, router).then(
            (res) => {
             
              const fileURL = res.data.fileUrl;
              console.log("res================>", res.data.fileUrl);
              if (res.status) {
                setClientDetails((prev) => ({
                ...prev,
                ClientLogo: fileURL
            }));
              toast.success("file uploaded")
              }
            },
            (err) => {
              
              console.log(err);
             
            }
          );
        },
      });
    }
    const reader = new FileReader();
     };
console.log(clientDetails);

    // ✅ Handle member input
    const handleMemberChange = (e) => {
        const { name, value } = e.target;
        setNewMember((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Add new member
    const handleAddMember = () => {
        if (!newMember.name || !newMember.qualification || !newMember.designation) return;

        setClientDetails((prev) => ({
            ...prev,
            teamMembers: [...prev.teamMembers, newMember],
        }));

        setNewMember({ name: "", qualification: "", designation: "" });
    };

    // ✅ Delete member
    const handleDeleteMember = (index) => {
        setClientDetails((prev) => ({
            ...prev,
            teamMembers: prev.teamMembers.filter((_, i) => i !== index)
        }));
    };


    return (
        <div>
            {/* Tabs */}
            <div className="max-w-[280px] flex justify-between items-center gap-4">
                {["clientDetails", "personal"].map((tab) => (
                    <p
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`relative cursor-pointer flex-1 text-center py-2 text-md font-medium transition-all duration-300 
                            ${currentTab === tab
                                ? "text-custom-yellow after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#e0f349]"
                                : "text-gray-300 hover:text-[#e0f349]"
                            }`}
                    >
                        {tab === "clientDetails" ? "Client Details" : "Personal"}
                    </p>
                ))}
            </div>


            {currentTab === "clientDetails" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8">
                    <InputField
                        label="Client Name*"
                        name="ClientName"
                        value={clientDetails.ClientName}
                        onChange={handleInputChange}
                        placeholder="Enter client name"
                    />
                    <InputField
                        label="Contact Person"
                        name="contactPerson"
                        value={clientDetails.contactPerson}
                        onChange={handleInputChange}
                        placeholder="Enter Contact Person"
                    />
                    <InputField
                        label="Email"
                        name="Email"
                        value={clientDetails.Email}
                        onChange={handleInputChange}
                        placeholder="client@example.com"
                    />
                    <InputField
                        label="Phone"
                        name="phone"
                        value={clientDetails.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-5869"
                    />

                    <TextAreaField
                        label="Address"
                        name="Address"
                        value={clientDetails.Address}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Enter client Address"
                    />

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Client Logo</label>
                        <div className="flex items-center gap-8">
                            {clientDetails.ClientLogo ? (
                                <img
                                    src={clientDetails.ClientLogo}
                                    alt="Client Logo"
                                    className="w-28 h-28 rounded-lg object-cover border"
                                />
                            ) : (
                                <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                                    No Logo
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="flex items-center gap-2 bg-gray-500 border border-gray-300 text-gray-100 px-4 py-2 rounded-lg cursor-pointer transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                Change Logo
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>
            ) : (

                <div>
                    <div className="mt-8 bg-[#5F5F5F] rounded-2xl shadow-md overflow-hidden border border-gray-600">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-gray-200 border-collapse">
                                {/* Header */}
                                <thead className="bg-[#4E4E4E] border-b border-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                                            Qualification
                                        </th>
                                        <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                                            Designation
                                        </th>
                                        <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                {/* Body */}
                                <tbody>
                                    {clientDetails.teamMembers.map((member, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-600 transition-all border-b border-gray-600 last:border-b-0"
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-100 whitespace-nowrap">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                                                {member.qualification}
                                            </td>
                                            <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                                                {member.designation}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDeleteMember(index)}
                                                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-all flex items-center gap-2"
                                                >
                                                    <Trash size={18} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Empty State */}
                                    {clientDetails.teamMembers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-gray-400 py-6 text-sm">
                                                No members found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>



                    {/* Add Member Form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-8">
                        <InputField
                            name="name"
                            value={newMember.name}
                            onChange={handleMemberChange}
                            placeholder="Full Name"
                        />
                        <InputField
                            name="qualification"
                            value={newMember.qualification}
                            onChange={handleMemberChange}
                            placeholder="e.g., B.Eng Civil"
                        />
                        <InputField
                            name="designation"
                            value={newMember.designation}
                            onChange={handleMemberChange}
                            placeholder="e.g., Site Engineer"
                        />
                        <button
                            onClick={handleAddMember}
                            className="flex justify-center items-center gap-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 text-[14px] px-4 py-2 cursor-pointer transition-all"
                        >
                            <Plus size={18} /> Add Personnel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientProjectInfo;
