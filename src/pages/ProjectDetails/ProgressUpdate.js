import React, { useState, useEffect, useContext } from "react";
import { MapPin, Plus, Save, Trash2 } from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { ProjectDetailsContext } from "../_app";
import isAuth from "../../../components/isAuth";
import Milestones from "../../../components/Milestones";
import CreateTracker from "../../../components/CreateTracker";
import { toast } from "react-toastify";
import {
  Certificates,
  ConfirmModal,
  SummaryCards,
} from "../../../components/AllComponents";
import WorkplanProgress from "../../../components/activites";
import RoadLineTracker from "../../../components/RoadLineTracker";

const ProgressUpdate = (props) => {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [currentTab, setCurrentTab] = useState("progresstracking");
  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState("");
  const [allTrackerData, setAllTrackerData] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [allPlanData, setAllPlanData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [activities, setActivities] = useState("");
  const [certificates, setCertificates] = useState([]);
  
  const [summary, setSummary] = useState({
    contractAmount: 0,
    amountPaid: 0,
    amountLeft: 0,
    progress: 0,
    advancePayment: 0,
  });

  useEffect(() => {
    if (!projectData) return;

    const contractAmount = Number(projectData.contractAmount || 0);
    const paidAmount = Number(projectData.paidAmount || 0);
    const advancePayment = Number(projectData.advancePayment || 0);

    const amountLeft = contractAmount - paidAmount;

    const progress =
      contractAmount > 0
        ? Number(((paidAmount / contractAmount) * 100).toFixed(2))
        : 0;

    setSummary({
      contractAmount: contractAmount,
      amountPaid: paidAmount,
      amountLeft: amountLeft,
      progress: progress,
      advancePayment: advancePayment,
    });
  }, [projectData]);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
      getAllPlanByProjectId(project._id);
      getAllTracker(project._id);
      getProjectbyId(project._id);
    }
  }, []);

  const getProjectbyId = async (id) => {
    props.loader(true);
    Api("get", `project/getProjectById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const data = res.data?.data;
          setProjectData(data);
          setCertificates(data?.certificates);
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

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
      const res = await Api(
        "delete",
        `tracker/delete/${selectedTracker._id}`,
        "",
        router
      );
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

  const updateTracker = async () => {
    props.loader(true);
    const data = {
      trackerActivityProgress: activities,
    };
    try {
      const res = await Api(
        "put",
        `tracker/update/${selectedTracker._id}`,
        data,
        router
      );
      props.loader(false);
      if (res?.status === true) {
        toast.success("Tracker updated successfully!");
        getAllTracker(projectId)
      } else {
        toast.error(res?.message || "Failed to updated tracker");
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "An updated occurred");
    }
  };

 useEffect(() => {
  if (!selectedTracker) return;

  const raw = selectedTracker?.WorkplanId?.workActivities || [];
  const saved = selectedTracker?.trackerActivityProgress || [];

  const allSavedActivities = saved.flatMap(sec => sec.activities || []);

  const sections = [];
  let currentSection = null;
  let sectionCounter = 1;
  let activityCounter = 1;

  raw.forEach((item) => {
    if (item.rowType === "section") {
      currentSection = {
        id: sectionCounter++,
        sectionId: item._id,
        rowType: "section",
        name: item.description,
        activities: [],
      };

      sections.push(currentSection);
      activityCounter = 1;
    }

    if (item.rowType === "activity") {
      if (!currentSection) return;

      const savedActivity = allSavedActivities.find(
        (s) => s.activityId?.toString() === item._id?.toString()
      );

      console.log("==== MATCH CHECK ====");
      console.log("RAW:", item._id?.toString());
      console.log(
        "ALL SAVED IDS:",
        allSavedActivities.map((x) => x.activityId)
      );

      currentSection.activities.push({
        id: Number(`${currentSection.id}${activityCounter++}`),
        activityId: item._id,
        name: item.description,
        rowType: "activity",
        qtyInBOQ: savedActivity?.qtyInBOQ || "0.00",
        qtyDone: savedActivity?.qtyDone || "0.00",
        Rate: savedActivity?.Rate || "0.00",
        Amount: savedActivity?.Amount || "0.00",
        amountDone: savedActivity?.amountDone || "0.00",
      });
    }
  });

  setActivities(sections);
}, [selectedTracker]);

  console.log("all", activities);

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-3 md:px-8 mx-auto">
        <div className="bg-[#DFF34940] py-4 md:px-6 px-3 flex flex-col rounded-[16px] md:flex-row gap-4 md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 gap-1">
            <p className="md:text-[32px] text-[24px] text-white mt-1">
              {currentTab === "progresstracking"
                ? "Progress Tracking"
                : currentTab === "roadLineTracker"
                ? "Road Line Tracker"
                : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
            </p>
            <h1 className="md:text-[14px] text-[13px] font-bold text-white flex items-center gap-2">
              {projectDetails.projectName}
              <span className="ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1">
                <MapPin size={15} /> {projectDetails.location}
              </span>
            </h1>
          </div>
        </div>

        <div className="mt-6 bg-custom-black rounded-[18px] md:px-6 px-3 pt-4 pb-6 min-h-[700px] md:min-h-[600px]">
          <div className="flex overflow-x-auto scrollbar-hide overflow-scroll justify-between items-center gap-6">
            {[
              "progresstracking",
              "milestones",
              "financial",
              ...(projectData.projectType === "Road"
                ? ["roadLineTracker"]
                : []),
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className={`relative cursor-pointer flex-1 md:min-w-[200px] min-w-[160px] text-center py-2 text-lg font-semibold transition-all duration-300 ${
                  currentTab === tab
                    ? "text-custom-yellow after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:rounded-3xl after:bg-[#e0f349]"
                    : "text-gray-400 hover:text-[#e0f349]"
                }`}
              >
                {tab === "progresstracking"
                  ? "Progress Tracking"
                  : tab === "roadLineTracker"
                  ? "Road Line Tracker"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="py-5">
            {currentTab === "progresstracking" && (
              <>
                <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-2 py-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-md">
                      BOQ Progress Tracking
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Track progress based on work plan activities
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="md:w-[160px] w-[160px] justify-center bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
                    >
                      <Plus size={18} />
                      Create Tracker
                    </button>
                    {selectedTracker && (
                      <button
                        onClick={updateTracker}
                        className="md:w-[160px] w-[150px] justify-center bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
                      >
                        <Save size={18} />
                        Save Tracker
                      </button>
                    )}
                  </div>
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
                          <option
                            className="mr-4"
                            key={opt._id}
                            value={opt._id}
                          >
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
                  <p className="text-gray-400 mt-4">
                    No trackers found. Create one to get started.
                  </p>
                )}
                {selectedTracker && (
                  <WorkplanProgress
                    activities={activities}
                    setActivities={setActivities}
                  />
                )}
              </>
            )}

            {currentTab === "milestones" && <Milestones />}

            {currentTab === "financial" && (
              <>
                <SummaryCards
                  contractAmount={summary?.contractAmount}
                  amountPaid={summary?.amountPaid}
                  amountLeft={summary?.amountLeft}
                  progress={summary?.progress}
                />
                <Certificates
                  certificates={certificates}
                  summary={summary}
                  getAllCertificate={getProjectbyId}
                  projectId={projectId}
                  loader={props.loader}
                />
              </>
            )}

            {currentTab === "roadLineTracker" && (
              <RoadLineTracker loader={props.loader} />
            )}
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
    </div>
  );
};

export default isAuth(ProgressUpdate);
