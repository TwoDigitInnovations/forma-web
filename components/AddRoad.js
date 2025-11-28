import React, { useContext, useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import InputField from "./UI/InputField";
import { Trash2, X } from "lucide-react";

const defaultLayers = [
  { name: "Excavation & Earthwork", isActive: true },
  { name: "Bottom Sub Grade", isActive: true },
  { name: "Top Sub Grade", isActive: true },
  { name: "Bottom Sub Base", isActive: true },
  { name: "Top Sub Base", isActive: true },
  { name: "Base", isActive: true },
  { name: "Asphalt Concrete", isActive: true },
];

const AddRoad = ({
  setIsOpen,
  loader,
  setRoadId,
  projectId,
  getAllRoads,
  singleRoadData,
  roadId,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roadName: "",
    lengthKm: "",
    roadType: "",
    carriageway: "Single Carriageway",
    constructionLayers: defaultLayers,
  });

  console.log(roadId);

  useEffect(() => {
    if (singleRoadData) {
      setFormData({
        roadName: singleRoadData?.roadName,
        lengthKm: singleRoadData?.lengthKm,
        roadType: singleRoadData?.roadType,
        carriageway: singleRoadData?.carriageway,
        constructionLayers: singleRoadData?.constructionLayers,
      });
    }
  }, [singleRoadData]);

  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleLayer = (index) => {
    const updated = [...formData.constructionLayers];
    updated[index].isActive = !updated[index].isActive;
    setFormData({ ...formData, constructionLayers: updated });
  };

  const editLayerName = (index, newName) => {
    const updated = [...formData.constructionLayers];
    updated[index].name = newName;
    setFormData({ ...formData, constructionLayers: updated });
  };

  const deleteLayer = (index) => {
    const updated = [...formData.constructionLayers];
    updated.splice(index, 1);
    setFormData({ ...formData, constructionLayers: updated });
  };

  const addNewLayer = () => {
    if (!newLayerName.trim()) return;

    setFormData({
      ...formData,
      constructionLayers: [
        ...formData.constructionLayers,
        { name: newLayerName.trim(), isActive: true },
      ],
    });

    setNewLayerName("");
    setIsAddingLayer(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loader(true);
    const data = { ...formData, projectId };
    try {
      let res;
      if (roadId) {
        res = await Api("post", `roads/update/${roadId}`, data, router);
      } else {
        res = await Api("post", "roads/add", data, router);
      }
      loader(false);
      if (res?.status) {
        toast.success(
          roadId ? "Road updated successfully" : "Road added successfully"
        );
        setIsOpen(false);
        getAllRoads(projectId);
        setRoadId("");
        setFormData({
          roadName: "",
          lengthKm: "",
          roadType: "",
          carriageway: "Single Carriageway",
          constructionLayers: defaultLayers,
        });
      } else {
        toast.error(res?.message || "Operation failed");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-custom-black text-white rounded-2xl md:p-6 p-3 w-full max-w-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-2">
            {" "}
            {roadId ? "Upadate Road" : "Add Road to Project"}
          </h2>
          <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Road Name"
            name="roadName"
            value={formData.roadName}
            onChange={handleChange}
            placeholder="Enter road name"
          />

          <InputField
            label="Length (km)"
            name="lengthKm"
            value={formData.lengthKm}
            onChange={handleChange}
            placeholder="Enter road length"
            type="number"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Road Type</label>
              <select
                name="roadType"
                value={formData.roadType}
                onChange={handleChange}
                className="w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border focus:outline-none"
              >
                <option value="">Select road type</option>
                <option value="Highway">Highway</option>
                <option value="Arterial Road">Arterial Road</option>
                <option value="Collector Road">Collector Road</option>
                <option value="Local Road">Local Road</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Carriageway</label>
              <select
                name="carriageway"
                value={formData.carriageway}
                onChange={handleChange}
                className="w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border focus:outline-none cursor-pointer"
              >
                <option>Single Carriageway</option>
                <option>Double Carriageway</option>
              </select>
            </div>
          </div>

          {/* Construction Layers */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Construction Layers</label>

              {!isAddingLayer ? (
                <button
                  type="button"
                  onClick={() => setIsAddingLayer(true)}
                  className="text-yellow-400 text-sm"
                >
                  + Add Layer
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="px-2 py-1 text-sm rounded bg-[#4A4A4A] border border-gray-600"
                    placeholder="Enter layer name"
                    value={newLayerName}
                    onChange={(e) => setNewLayerName(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addNewLayer}
                    className="px-2 py-1 text-sm bg-custom-yellow text-black rounded"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingLayer(false);
                      setNewLayerName("");
                    }}
                    className="px-2 py-1 text-sm bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1 max-h-[260px] overflow-y-auto">
              {formData.constructionLayers.map((layer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1 rounded"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={layer.isActive}
                      onChange={() => toggleLayer(index)}
                    />

                    <input
                      type="text"
                      value={layer.name}
                      onChange={(e) => editLayerName(index, e.target.value)}
                      className="bg-transparent border-b border-gray-400 text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteLayer(index)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
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
              {roadId ? "Update" : "Add"} Road
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoad;
