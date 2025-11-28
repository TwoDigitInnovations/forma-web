import React, { useContext, useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import InputField from "./UI/InputField";
import { X } from "lucide-react";

const EditLayesDetails = ({
  setIsOpen,
  loader,
  projectId,
  getAllRoads,
  roadId,
  existingData,
  roadData,
  setRoadId,
}) => {
  const router = useRouter();

  console.log(existingData);

  const [formData, setFormData] = useState({
    name: "",
    QualityStatus: "Approved",
    carriageway: "LHS",
    StartChainageKM: "",
    EndChainageKM: "",
    CompletionDate: "",
    Notes: "",
  });

  useEffect(() => {
    if (existingData) {
      let startKm = "";
      let endKm = "";

      if (existingData.carriageway === "Left") {
        const left = existingData.sides?.find((s) => s.side === "Left");
        startKm = left?.StartChainageKM || "";
        endKm = left?.EndChainageKM || "";
      } else if (existingData.carriageway === "Right") {
        const right = existingData.sides?.find((s) => s.side === "Right");
        startKm = right?.StartChainageKM || "";
        endKm = right?.EndChainageKM || "";
      } else {
        const single = existingData.sides?.find((s) => s.side === "Single");
        startKm = single?.StartChainageKM || "";
        endKm = single?.EndChainageKM || "";
      }

      setFormData({
        name: existingData.name || "",
        QualityStatus: existingData.QualityStatus || "Approved",
        carriageway: existingData.carriageway || "Left",
        StartChainageKM: startKm,
        EndChainageKM: endKm,
        CompletionDate: existingData.CompletionDate
          ? existingData.CompletionDate.split("T")[0]
          : "",
        Notes: existingData.Notes || "",
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log("Data:", formData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    loader(true);
    let data;
   
    if (roadData?.carriageway === "Single Carriageway") {
      data = { ...formData, carriageway: "" };
    } else {
      data = { ...formData };
    }

    const layerId = existingData._id;

    try {
      const res = await Api(
        "put",
        `roads/updateLayer/${roadId}/${layerId}`,
        data,
        router
      );
      loader(false);

      if (res?.status) {
        toast.success("Layer updated successfully");
        setIsOpen(false);
        getAllRoads(projectId);
        setRoadId("");
      } else {
        toast.error(res?.message || "Failed to update layer");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "Something went wrong");
    }
  };
  console.log("roaddata 123", roadData);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-custom-black text-white rounded-2xl md:p-6 p-3 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Update Layer Details</h2>
          <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Layer Name */}
          <InputField
            label="Construction Layer"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter layer name"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start Chainage (KM)"
              name="StartChainageKM"
              value={formData.StartChainageKM}
              onChange={handleChange}
              type="number"
              placeholder="Enter start chainage"
            />

            <InputField
              label="End Chainage (KM)"
              name="EndChainageKM"
              value={formData.EndChainageKM}
              onChange={handleChange}
              type="number"
              placeholder="Enter end chainage"
            />
          </div>
          {roadData.carriageway === "Double Carriageway" && (
            <div>
              <label className="text-sm mb-2">Carriageway Side</label>

              <select
                name="carriageway"
                value={formData.carriageway}
                onChange={handleChange}
                className="w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border cursor-pointer"
              >
                <option value="Left">Left hand Side (LHS)</option>
                <option value="Right">Right hand Side (RHS)</option>
              </select>
            </div>
          )}

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <InputField
              label="Completion Date"
              name="CompletionDate"
              type="date"
              value={formData.CompletionDate}
              onChange={handleChange}
            />

            <div>
              <label className="block mb-2 text-sm">Quality Status</label>
              <select
                name="QualityStatus"
                value={formData.QualityStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#5F5F5F] border border-gray-600 text-white"
              >
                <option value="Approved">Approved</option>
                <option value="PendingReviews">Pending Review</option>
                <option value="RequiresRework">Requires Rework</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm">Notes</label>
            <textarea
              name="Notes"
              value={formData.Notes}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 rounded-lg bg-[#5F5F5F] border border-gray-600 text-white"
              placeholder="Write notes or comments..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg cursor-pointer text-black bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg cursor-pointer bg-custom-yellow text-black"
            >
              Update Layer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLayesDetails;
