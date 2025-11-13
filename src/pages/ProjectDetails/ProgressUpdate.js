import React, { useState, useEffect, useContext } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { ProjectDetailsContext } from "../_app";
import isAuth from "../../../components/isAuth";
import Financial from "../../../components/Financial";
import Milestones from "../../../components/Milestones";
import Updates from "../../../components/Updates";
import CreateTracker from "../../../components/CreateTracker";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/confirmModel";

const ProgressUpdate = (props) => {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [currentTab, setCurrentTab] = useState("progresstracking");
  const [projectId, setProjectId] = useState("");
  const [allTrackerData, setAllTrackerData] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [allPlanData, setAllPlanData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
      getAllPlanByProjectId(project._id);
      getAllTracker(project._id);
    }
  }, []);


  const getAllPlanByProjectId = async (id) => {
    props.loader(true);
    let url = `workplan/getAllPlans?projectId=${id}`;
    Api("get", url, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setAllPlanData(res?.data?.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch work plans");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  // ✅ Get all trackers
  const getAllTracker = async (id) => {
    props.loader(true);
    let url = `tracker/getAll?projectId=${id}`;
    Api("get", url, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setAllTrackerData(res?.data?.data || res?.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch trackers");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };


  const handleTrackerSelect = (e) => {
    const selected = allTrackerData.find((t) => t._id === e.target.value);
    setSelectedTracker(selected || null);
  };

  const handleDeleteClick = () => {
    if (!selectedTracker?._id) {
      toast.error("Please select a tracker first!");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    props.loader(true);
    try {
      const res = await Api("delete", `tracker/delete/${selectedTracker._id}`, "", router);
      props.loader(false);
      if (res?.status === true) {
        toast.success("Tracker deleted successfully!");
        getAllTracker(projectId);
        setSelectedTracker({});
      } else {
        toast.error(res?.message || "Failed to delete tracker");
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 md:px-8 mx-auto">
        {/* ===== Header Section ===== */}
        <div className="bg-[#DFF34940] py-4 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p className="md:text-[32px] text-[24px] text-white mt-1">Progress Update</p>
            <h1 className="md:text-[14px] text-[13px] font-bold text-white flex items-center gap-2">
              {projectDetails.projectName}
              <span className="ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1">
                <MapPin size={15} /> {projectDetails.location}
              </span>
            </h1>
          </div>
        </div>

        {/* ===== Tabs Section ===== */}
        <div className="mt-6 bg-custom-black rounded-[38px] md:px-6 px-3 pt-4 pb-6 min-h-[700px] md:min-h-[600px]">
          <div className="flex overflow-x-auto justify-between items-center gap-6">
            {["progresstracking", "milestones", "financial", "updates"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className={`relative cursor-pointer flex-1 md:min-w-[200px] min-w-[160px] text-center py-2 text-lg font-semibold transition-all duration-300 ${currentTab === tab
                  ? "text-custom-yellow after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:rounded-3xl after:bg-[#e0f349]"
                  : "text-gray-400 hover:text-[#e0f349]"
                  }`}
              >
                {tab === "progresstracking"
                  ? "Progress Tracking"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ===== Tab Content ===== */}
          <div className="py-5">
            {currentTab === "progresstracking" && (
              <>
                <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-2 py-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-md">BOQ Progress Tracking</h2>
                    <p className="text-gray-300 text-sm">
                      Track progress based on work plan activities
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="md:w-[160px] w-full justify-center bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
                  >
                    <Plus size={18} />
                    Create Tracker
                  </button>
                </div>

                {allTrackerData.length > 0 ? (
                 
                  <div className="mt-4 flex flex-row md:gap-3 gap-2 md:items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        Select Tracker
                      </label>
                      <select
                        name="tracker"
                        value={selectedTracker?._id || ""}
                        onChange={handleTrackerSelect}
                        className="w-full text-[14px] cursor-pointer px-2 py-2 bg-[#5F5F5F] rounded-lg border border-gray-600 focus:outline-none focus:border-green-400 "
                      >
                        <option value="">Select a Tracker to view</option>
                        {allTrackerData.map((opt) => (
                          <option className="mr-4" key={opt._id} value={opt._id}>
                            {opt.trackerName}
                          </option>
                        ))}
                      </select>
                    </div>


                    {selectedTracker && (
                      <button
                        onClick={handleDeleteClick}
                        className="flex items-center cursor-pointer justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm mt-7 md:self-end transition-all duration-200"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 mt-4">No trackers found. Create one to get started.</p>
                )}


                {selectedTracker && (
                  <div className="mt-4 p-4 cursor-pointer bg-[#1c1c1c] rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-custom-yellow mb-2">
                      {selectedTracker.trackerName}
                    </h3>
                    <p className="text-gray-300 text-sm mb-1">
                      <strong>Work Plan:</strong>{" "}
                      {selectedTracker.WorkplanId?.planName || "N/A"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedTracker.description || "No description available"}
                    </p>
                  </div>
                )}
              </>
            )}

            {currentTab === "milestones" && <Milestones />}
            {currentTab === "financial" && <Financial />}
            {currentTab === "updates" && <Updates />}
          </div>


          {isOpen && (
            <CreateTracker
              allPlanData={allPlanData}
              setIsOpen={setIsOpen}
              loader={props.loader}
              projectId={projectId}
              getAllTracker={getAllTracker}
            />
          )}

          <ConfirmModal
            isOpen={isConfirmOpen}
            setIsOpen={setIsConfirmOpen}
            title="Delete Tracker"
            message={`Are you sure you want to delete "${selectedTracker?.trackerName}"?`}
            onConfirm={handleDeleteConfirm}
            yesText="Delete"
            noText="Cancel"
          />

        </div>
      </div>
    </div >
  );
};

export default isAuth(ProgressUpdate);
