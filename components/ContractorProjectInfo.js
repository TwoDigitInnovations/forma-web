import React, { useRef, useState } from "react";
import InputField from "./UI/InputField";
import { Plus, Trash, Upload } from "lucide-react";
import SelectField from "./UI/SelectField";
import { toast } from "react-toastify";
import Compressor from "compressorjs";
import { ApiFormData } from "@/services/service";
import { useRouter } from "next/router";

function ContractorProjectInfo({
  contractorDetails,
  setContractorDetails,
  loader,
}) {
  const fileInputRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("contractorDetails");
  const router = useRouter();
  const [editIndex, setEditIndex] = useState(null);

  const [newMember, setNewMember] = useState({
    name: "",
    qualification: "",
    designation: "",
  });

  const [equipment, setEquipment] = useState({
    name: "",
    type: "",
    quantity: 1,
    condition: "Good",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContractorDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditMember = (member, index) => {
    setNewMember({
      name: member.name,
      qualification: member.qualification,
      designation: member.designation,
    });
    setEditIndex(index);
  };

  const handleFileChange = (event, i) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileSizeInMb = file.size / (1024 * 1024);
    if (fileSizeInMb > 1) {
      toast.error("Too large file Please upload a smaller image");
      return;
    } else {
      new Compressor(file, {
        quality: 0.6,
        success: (compressedResult) => {
          const data = new FormData();
          data.append("file", compressedResult);
          loader(true);
          ApiFormData("post", "user/fileUpload", data, router).then(
            (res) => {
              const fileURL = res.data.fileUrl;
              console.log("res================>", res.data.fileUrl);
              if (res.status) {
                setContractorDetails((prev) => ({
                  ...prev,
                  contractorLogo: fileURL,
                }));
                toast.success("file uploaded");
                loader(false);
              }
            },
            (err) => {
              console.log(err);
              loader(false);
              toast.error(res?.data?.message || res?.message);
            },
          );
        },
      });
    }
    const reader = new FileReader();
  };

  // 🟡 Team Members
  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.qualification || !newMember.designation) {
      return;
    }

    let updatedMembers = [...(contractorDetails?.teamMembers || [])];

    if (editIndex !== null) {
      updatedMembers[editIndex] = newMember;
      setEditIndex(null);
    } else {
      updatedMembers.push(newMember);
    }

    setContractorDetails((prev) => ({
      ...prev,
      teamMembers: updatedMembers,
    }));

    setNewMember({
      name: "",
      qualification: "",
      designation: "",
    });
  };

  const handleDeleteMember = (index) => {
    setContractorDetails((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  // 🟡 Equipment
  const handleEquipmentChange = (e) => {
    const { name, value } = e.target;
    setEquipment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEquipment = () => {
    if (!equipment.name || !equipment.type) return;

    setContractorDetails((prev) => ({
      ...prev,
      equipment: [...(prev.equipment || []), equipment],
    }));

    setEquipment({ name: "", type: "", quantity: 1, condition: "Good" });
  };

  const handleDeleteEquipment = (index) => {
    setContractorDetails((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      {/* Tabs */}
      <div className="max-w-[450px] flex justify-between items-center gap-4">
        {["contractorDetails", "personal", "equipment"].map((tab) => (
          <p
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`relative cursor-pointer flex-1 text-center py-2 text-md font-medium transition-all duration-300 
              ${
                currentTab === tab
                  ? "text-custom-yellow after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#e0f349]"
                  : "text-gray-300 hover:text-[#e0f349]"
              }`}
          >
            {tab === "contractorDetails"
              ? "Contractor Details"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </p>
        ))}
      </div>

      {currentTab === "contractorDetails" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8">
          <InputField
            label="Contractor Name*"
            name="contractorName"
            value={contractorDetails.contractorName}
            onChange={handleInputChange}
            placeholder="Enter contractor name"
          />
          <InputField
            label="Contact Person"
            name="contactPerson"
            value={contractorDetails.contactPerson}
            onChange={handleInputChange}
            placeholder="Enter Contact Person"
          />
          <InputField
            label="Email"
            name="Email"
            value={contractorDetails.Email}
            onChange={handleInputChange}
            placeholder="contractor@example.com"
          />
          <InputField
            label="Phone"
            name="phone"
            value={contractorDetails.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-5869"
          />

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">
              Contractor Logo
            </label>
            <div className="flex items-center gap-8">
              {contractorDetails.contractorLogo ? (
                <img
                  src={contractorDetails.contractorLogo}
                  alt="Contractor Logo"
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
      )}

      {currentTab === "personal" && (
        <div>
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
              className="flex justify-center items-center gap-2 rounded-lg text-black bg-custom-yellow hover:bg-gray-600 text-[14px] px-4 py-2 cursor-pointer transition-all"
            >
              <Plus size={18} />
              {editIndex !== null ? "Update Personnel" : "Add Personnel"}
            </button>
          </div>

          <div className="mt-8 bg-[#5F5F5F] rounded-2xl shadow-md overflow-hidden border border-gray-600">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-200 border-collapse">
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
                <tbody>
                  {contractorDetails?.teamMembers?.map((member, index) => (
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
                        <td className="px-6 py-3 whitespace-nowrap flex gap-2">
                          <button
                            onClick={() => handleEditMember(member, index)}
                            className="bg-custom-yellow text-black cursor-pointer px-4 py-1.5 rounded-lg text-sm  transition-all"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteMember(index)}
                            className="bg-red-500 text-white cursor-pointer px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-all flex items-center gap-2"
                          >
                            <Trash size={18} /> Delete
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))}
                  {contractorDetails?.teamMembers?.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-gray-400 py-6 text-sm"
                      >
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentTab === "equipment" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 mt-8">
            <InputField
              name="name"
              value={equipment.name}
              onChange={handleEquipmentChange}
              placeholder="e.g., Excavator"
            />
            <InputField
              name="type"
              value={equipment.type}
              onChange={handleEquipmentChange}
              placeholder="e.g., Heavy machinery"
            />
            <InputField
              name="quantity"
              type="number"
              value={equipment.quantity}
              onChange={handleEquipmentChange}
              placeholder="1"
            />
            <SelectField
              name="condition"
              value={equipment.condition}
              onChange={handleEquipmentChange}
              options={["Excellent", "Good", "Fair", "Poor"]}
            />
            <button
              onClick={handleAddEquipment}
              className="flex justify-center items-center gap-2 rounded-lg text-black bg-custom-yellow hover:bg-gray-600 text-[14px] px-4 py-2 cursor-pointer transition-all"
            >
              <Plus size={18} /> Add Equipment
            </button>
          </div>

          <div className="mt-8 bg-[#5F5F5F] rounded-2xl shadow-md overflow-hidden border border-gray-600">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-200 border-collapse">
                <thead className="bg-[#4E4E4E] border-b border-gray-500">
                  <tr>
                    <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                      Equipment Name
                    </th>
                    <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                      Quantity
                    </th>
                    <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                      Condition
                    </th>
                    <th className="px-6 py-3 uppercase text-sm font-semibold whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contractorDetails?.equipment?.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-600 transition-all border-b border-gray-600 last:border-b-0"
                    >
                      <td className="px-6 py-3 font-medium text-gray-100 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                        {item.type}
                      </td>
                      <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                        {item.condition}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteEquipment(index)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-all flex items-center gap-2"
                        >
                          <Trash size={18} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {contractorDetails?.equipment?.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-gray-400 py-6 text-sm"
                      >
                        No equipment found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractorProjectInfo;
