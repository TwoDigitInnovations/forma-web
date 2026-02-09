import React, { useEffect, useState } from "react";
import AddRoad from "./AddRoad";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  Construction,
  EllipsisVertical,
  Plus,
  RotateCcw,
  SquarePen,
  TrafficCone,
  Trash,
} from "lucide-react";
import EditLayesDetails from "./EditLayesDetails";
import { ConfirmModal } from "./AllComponents";

function RoadLineTracker({ loader }) {
  const router = useRouter();
  const [roads, setRoads] = useState([]);
  const [isAddRoadOpen, setIsAddRoadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [layersDetails, setLayersDetails] = useState("");
  const [roadId, setRoadId] = useState("");
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [singleRoadData, setSingleRoadData] = useState("");
  const [roadData, setRoadData] = useState("");
  const [layerId, setLayerId] = useState("");
  const [completedKm, setCompleteKm] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectId(project._id);
      getAllRoads(project._id);
    }
  }, []);

  const getAllRoads = async (id) => {
    Api("get", `roads/getAll/${id}`, "", router)
      .then((res) => {
        if (res?.status === true) {
          setRoads(res.data?.data || []);
        }
      })
      .catch((err) => {
        toast.error("Failed to load roads");
      });
  };

  const handleDeleteConfirm = async () => {
    const roadID = roadId;
    Api("delete", `roads/delete/${roadID}`, null, router)
      .then((res) => {
        if (res?.status === true) {
          toast.success("Road deleted successfully");
          getAllRoads(projectId);
          setRoadId("");
          setIsConfirmOpen(false);
          setOpen(false);
        }
      })
      .catch((err) => {
        toast.error("Failed to delete road");
      });
  };
  const handleReset = async () => {
    await Api("put", `roads/refreshLayer/${roadId}/${layerId}`, {}, router)
      .then((res) => {
        if (res?.status === true) {
          toast.success("data deleted successfully");
          getAllRoads(projectId);
          setRoadId("");
          setIsOpen(false);
        }
      })
      .catch((err) => {
        toast.error("Failed to delete road");
      });
  };

  const getRoadInfoById = async (roadId) => {
    Api("get", `roads/getRoadById/${roadId}`, "", router)
      .then((res) => {
        if (res?.status === true) {
          setSingleRoadData(res.data?.data || []);
        }
      })
      .catch((err) => {
        toast.error("Failed to load roads");
      });
  };

  return (
    <div className="md:mt-0 mt-2">
      {/* <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <p>Planned Progress </p>
          <p className="text-custom-yellow font-semibold">{"45"}%</p>
        </div>
        <div className="w-full bg-gray-600/40 h-5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-custom-yellow rounded-full transition-all"
            style={{ width: `${25}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2.5 mb-2.5">
        <div className="flex justify-between items-center mb-1">
          <p className="text-md text-white">Actual Progress </p>
          <p className="text-custom-yellow font-semibold">{"45"}%</p>
        </div>
        <div className="w-full bg-gray-600/40 h-4 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-custom-green rounded-full transition-all"
            style={{ width: `${45}%` }}
          ></div>
        </div>
      </div> */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-White flex items-center justify-center gap-2">
          <Construction /> Roads ({roads.length})
        </h2>

        <button
          onClick={() => setIsAddRoadOpen(true)}
          className="bg-custom-yellow text-black px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          Add Road
        </button>
      </div>

      <div className="space-y-4">
        {roads?.map((road, index) => (
          <div key={index} className="shadow-md">
            <div className="relative flex justify-between items-center">
              <h3 className="font-semibold text-white text-xl flex items-center gap-2">
                <TrafficCone className="text-custom-yellow" />
                {road.roadName}
                <span className="text-custom-yellow font-normal">({5}%)</span>
              </h3>

              <EllipsisVertical
                className="text-white cursor-pointer hover:text-custom-yellow transition"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div
                  className="absolute right-0 top-8 w-[180px] bg-[#1f1f1f] border border-white/10 
              rounded-xl shadow-xl z-30 overflow-hidden animate-fadeIn"
                >
                  <button
                    onClick={() => {
                      getRoadInfoById(road._id);
                      setRoadId(road._id);
                      setIsAddRoadOpen(true);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2a2a2a] 
                transition border-b border-white/10 flex cursor-pointer items-center gap-2"
                  >
                    <SquarePen className="text-custom-yellow" size={16} />
                    Edit Road
                  </button>

                  <button
                    onClick={() => {
                      setIsConfirmOpen(true);
                      setRoadId(road._id);
                    }}
                    className="w-full text-left cursor-pointer px-4 py-3 text-sm text-red-500 hover:bg-red-900/20 
                transition flex items-center gap-2"
                  >
                    <Trash size={16} />
                    Delete Road
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              {road?.constructionLayers?.map((layer, layerIndex) => (
                <div
                  key={layerIndex}
                  className="bg-[#222] p-4 rounded-xl border border-white/10 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-gray-200 font-medium">{layer.name}</p>

                    <div className="flex items-center gap-4">
                      <RotateCcw
                        className="text-white cursor-pointer text-custom-yellow hover:text-yellow-400"
                        onClick={() => {
                          setIsOpen(true);
                          setRoadId(road._id);
                          setLayerId(layer._id);
                        }}
                      />

                      <Plus
                        className="text-custom-yellow cursor-pointer hover:text-white"
                        onClick={() => {
                          setIsEditOpen(true);
                          setLayersDetails(layer);
                          setRoadData(road);
                          setRoadId(road._id);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      road.carriageway?.toLowerCase() === "double carriageway"
                        ? "grid gap-4 md:grid-cols-2"
                        : "grid gap-4 grid-cols-1"
                    } `}
                  >
                    {layer?.sides?.map((sideObj, index) => {
                      const totalKm = Number(road?.lengthKm || 0);
                      const history = sideObj?.history || [];

                      // 🔹 Calculate completed KM from history
                      const calculatedCompletedKm = history.reduce(
                        (sum, item) => {
                          const start = Number(item.start || 0);
                          const end = Number(item.end || 0);

                          return sum + Math.max(0, end - start);
                        },
                        0
                      );

                      const safeCompletedKm =
                        totalKm > 0
                          ? Math.min(calculatedCompletedKm, totalKm)
                          : 0;

                      const percentage =
                        totalKm > 0
                          ? Number(
                              ((safeCompletedKm / totalKm) * 100).toFixed(2)
                            )
                          : 0;

                      return (
                        <div className="mt-3" key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-custom-yellow font-semibold">
                              {sideObj.side === "Left"
                                ? "LHS"
                                : sideObj.side === "Right"
                                ? "RHS"
                                : ""}{" "}
                              {percentage.toFixed(2)}%
                            </p>
                          </div>

                          <div className="w-full bg-gray-600/40 h-6 rounded-full overflow-hidden relative">
                            <div
                              className={`h-full rounded-full transition-all ${
                                sideObj.side === "Right"
                                  ? "bg-custom-yellow"
                                  : "bg-custom-yellow"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>

                            <p className="text-[12px] absolute bottom-[2px] left-2 text-white">
                              {calculatedCompletedKm} KM
                            </p>

                            <p className="text-[12px] absolute bottom-[1px] right-2 text-white">
                              {totalKm} KM
                            </p>
                          </div>
                          <div className="mt-2 mb-2 ms-2">
                            {sideObj?.history?.map((historyItem, histIndex) => (
                              <div
                                key={histIndex}
                                className="flex items-start gap-3 mb-2"
                              >
                                <div className="h-3 w-3 rounded-full bg-custom-yellow mt-1"></div>

                                <div className="flex flex-col">
                                  <p className="font-semibold text-sm">
                                    {historyItem.start} km → {historyItem.end}{" "}
                                    km
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="text-right text-sm text-gray-300 mt-1">
                            {calculatedCompletedKm?.toFixed(2)} km completed
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {isEditOpen && (
              <EditLayesDetails
                setIsOpen={setIsEditOpen}
                loader={loader}
                projectId={projectId}
                getAllRoads={getAllRoads}
                existingData={layersDetails}
                roadId={roadId}
                roadData={roadData}
                setRoadId={setRoadId}
              />
            )}
          </div>
        ))}
      </div>

      {isAddRoadOpen && (
        <AddRoad
          setIsOpen={setIsAddRoadOpen}
          loader={loader}
          projectId={projectId}
          getAllRoads={getAllRoads}
          singleRoadData={singleRoadData}
          roadId={roadId}
          setRoadId={setRoadId}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete Road"
        message={`Are you sure you want to delete this road"?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />

      <ConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete Data"
        message={`Are you sure you want to delete all the data for this Layer"?`}
        onConfirm={handleReset}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default RoadLineTracker;
