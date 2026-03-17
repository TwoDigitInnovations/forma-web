import React, { useContext, useEffect, useState } from "react";
import {
  MapPin,
  FileCode2,
  Plus,
  Edit2,
  Trash,
  Calendar1,
  CircleDot,
  MoreVertical,
} from "lucide-react";
import { ProjectDetailsContext } from "../_app";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AddLogs from "../../../components/AddLogs";
import AddActionsPoints from "../../../components/AddActionsPoints";
import { ConfirmModal } from "../../../components/AllComponents";

function SiteLogs(props) {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);

  const [currentTab, setCurrentTab] = useState("dailylogs");
  const [projectId, setProjectId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState("");

  // Load Project ID from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
    }
  }, []);

  const getAllLogs = async () => {
    if (!projectId) return;
    props.loader(true);
    Api("get", `dailylogs/getAllLogs/${projectId}`)
      .then((res) => {
        if (res?.status === true) {
          setAllItems(res?.data?.data || []);
          props.loader(false);
        }
      })
      .catch(() => {
        props.loader(false);
        toast.error("Failed to fetch daily logs");
      });
  };

  const getAllActionPoints = async () => {
    if (!projectId) return;
    props.loader(true);
    Api("get", `action-Point/getAlllist/${projectId}`)
      .then((res) => {
        if (res?.status === true) {
          setAllItems(res?.data.data || []);
          props.loader(false);
        }
      })
      .catch(() => {
        props.loader(false);
        toast.error("Failed to fetch action points");
      });
  };

  const handleDeleteLogs = () => {
    props.loader(true);
    Api("delete", `dailylogs/delete/${deleteId}`)
      .then((res) => {
        if (res?.status === true) {
          toast.success("Daily logs deleted");
          getAllLogs();
        } else {
          toast.error("Failed to delete logs");
        }
        props.loader(false);
      })
      .catch(() => {
        props.loader(false);
        toast.error("Error deleting item");
      });
  };

  const handleDeleteActionPoints = () => {
    props.loader(true);
    Api("delete", `action-Point/delete/${deleteId}`)
      .then((res) => {
        if (res?.status === true) {
          toast.success("Actions points deleted");
          getAllActionPoints();
        } else {
          toast.error("Failed to delete item");
        }
        props.loader(false);
      })
      .catch(() => {
        props.loader(false);
        toast.error("Error deleting item");
      });
  };

  const updateStatus = (id, status) => {
    props.loader(true);
    const data = { status };
    Api("put", `action-Point/updateStatus/${id}`, data, router)
      .then((res) => {
        if (res?.status === true) {
          toast.success("update status successfully");
          getAllActionPoints();
        } else {
          toast.error("Failed to update status");
        }
        props.loader(false);
      })
      .catch(() => {
        props.loader(false);
        toast.error("Error update status");
      });
  };
  useEffect(() => {
    if (!projectId) return;

    if (currentTab === "dailylogs") getAllLogs();
    if (currentTab === "actionpoints") getAllActionPoints();
  }, [projectId, currentTab]);

  return (
    <div className="h-screen bg-[#f5f6fa] text-black">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 ">
        {/* HEADER */}
        <div className="bg-white border border-gray-200 shadow-md py-4 md:px-6 px-3 flex md:flex-row flex-col gap-4 rounded-[16px] justify-between md:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {projectDetails?.projectName}
              <span className="text-[11px] flex items-center gap-1">
                <MapPin size={15} /> {projectDetails?.location}
              </span>
            </h1>
          </div>

          <button
            onClick={() => {
              setEditItem(null);
              setIsOpen(true);
            }}
            className="w-fit bg-blue-500 py-1.5 px-4 rounded-[12px] flex items-center gap-1 text-white  cursor-pointer"
          >
            <Plus size={18} />
            {currentTab === "dailylogs" ? "Add Log" : "Add Action Point"}
          </button>
        </div>

        {/* TABS */}
        <div className="bg-white border border-gray-200 shadow-md md:py-5 py-3 mt-5 rounded-2xl px-3 md:px-5">
          <div className="max-w-2xl flex overflow-x-auto scrollbar-hide justify-between items-center gap-6 mb-4">
            {["dailylogs", "actionpoints"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className={`relative cursor-pointer flex-1 md:min-w-[200px] min-w-[150px] text-center py-2 text-lg font-semibold transition-all duration-300 ${
                  currentTab === tab
                    ? "text-blue-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:rounded-3xl after:bg-[#2563eb]"
                    : "text-gray-600 hover:text-[#2563eb]"
                }`}
              >
                {tab === "dailylogs" ? "Daily Logs" : "Action Points"}
              </button>
            ))}
          </div>

          {currentTab === "dailylogs" ? (
            <div>
              <p className="text-lg font-medium">Daily Site Logs</p>
              <p className="text-md text-gray-600 font-medium">
                Record daily activities, weather, and site observations
              </p>

              {allItems.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[450px] text-center">
                  <FileCode2 size={68} className="text-gray-500" />
                  <h3 className="text-xl font-medium mt-2">
                    No daily logs yet
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Start documenting your daily site activities
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {allItems.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-xl p-5 border border-gray-200 hover:border-custom-yellow transition-all duration-300 shadow-md"
                    >
                      {/* Top Row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Calendar1 size={18} text-blue-500 />
                          <p className="text-md font-semibold text-blue-500">
                            {item.date?.split("T")[0] || "--"}
                          </p>
                          <p className="text-md text-gray-600">
                            {item?.weather}
                          </p>
                        </div>
                      </div>

                      {/* Work Summary */}
                      <p className="mt-1 text-gray-600 text-sm leading-6">
                        {item.workSummary}
                      </p>

                      {/* Issues + Buttons */}
                      <div className="flex justify-between items-center mt-2 text-gray-400 text-sm">
                        <div className="flex gap-3 justify-between items-center">
                          <CircleDot size={18} className="text-red-400" />
                          <p className="italic text-gray-600">
                            {item.issues || ""}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setIsOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-500 cursor-pointer text-sm flex items-center gap-1"
                          >
                            <Edit2 size={18} /> Edit
                          </button>

                          <button
                            onClick={() => {
                              setIsConfirmOpen(true);
                              setDeleteId(item._id);
                            }}
                            className="text-red-400 hover:text-red-500 cursor-pointer text-sm flex items-center gap-1"
                          >
                            <Trash size={18} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">Action Points</p>
              <p className="text-md text-gray-600 font-medium">
                Track follow-up tasks and action items
              </p>

              {allItems.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[450px] text-center">
                  <FileCode2 size={68} className="text-gray-500" />
                  <h3 className="text-xl font-medium mt-2">
                    No action points yet
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Create action points to track tasks and follow-ups
                  </p>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto min-h-[400px]">
                  <table className="w-full border-collapse rounded-xl ">
                    <thead className="bg-blue-500 text-white border-b border-gray-800">
                      <tr className="text-left  text-sm">
                        <th className="px-4 py-3">REF ID</th>
                        <th className="px-4 py-3">TASK DESCRIPTION</th>
                        <th className="px-4 py-3">PRIORITY</th>
                        <th className="px-4 py-3">DUE DATE</th>
                        <th className="px-4 py-3">STATUS</th>
                        <th className="px-4 py-3 text-right">ACTION</th>
                      </tr>
                    </thead>

                    <tbody>
                      {allItems.map((item, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-800 hover:bg-gray-100 transition ${i % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
                        >
                          <td className="px-4 py-4 text-gray-600 text-sm">
                            AP-{i + 1}
                          </td>

                          <td className="px-4 py-4 text-gray-600 text-sm">
                            {item.description}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium
                              ${
                                item.priority === "High"
                                  ? "bg-red-500/10 text-red-400"
                                  : item.priority === "Medium"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-green-500 text-green-400"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-gray-600 text-sm">
                            {item.dueDate ? item.dueDate.split("T")[0] : "--"}
                          </td>

                          <td className="px-4 py-4">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateStatus(item._id, e.target.value)
                              }
                              className={`px-3 py-1 rounded-full text-xs font-medium
                                      border outline-none cursor-pointer
                                      ${
                                        item.status === "Open"
                                          ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                          : item.status === "In-Progress"
                                            ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                                            : "bg-green-500/10 text-green-400 border-green-500/30"
                                      }
                                    `}
                            >
                              <option value="Open">Open</option>
                              <option value="In-Progress">In-Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>

                          <td className="px-4 py-4 text-right relative">
                            <div className="relative group inline-block">
                              <button className="text-gray-400 hover:text-black cursor-pointer">
                                <MoreVertical size={18} />
                              </button>

                              <div
                                className="
                              absolute right-0 mt-2 w-32
                              bg-white border border-gray-300 
                              rounded-lg shadow-lg
                              opacity-0 group-hover:opacity-100
                              invisible group-hover:visible
                              transition-all
                              z-50"
                              >
                                <button
                                  onClick={() => {
                                    setIsOpen(true);
                                    setEditItem(item);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Edit2 size={14} /> Edit
                                </button>

                                <button
                                  onClick={() => {
                                    setOpen(true);
                                    setDeleteId(item._id);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Trash size={14} /> Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isOpen &&
        (currentTab === "dailylogs" ? (
          <AddLogs
            setIsOpen={setIsOpen}
            projectId={projectId}
            loader={props.loader}
            editData={editItem}
            refreshList={getAllLogs}
          />
        ) : (
          <AddActionsPoints
            setIsOpen={setIsOpen}
            projectId={projectId}
            loader={props.loader}
            editData={editItem}
            refreshList={getAllActionPoints}
          />
        ))}

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete logs"
        message={`Are you sure you want to delete this"?`}
        onConfirm={handleDeleteLogs}
        yesText="Delete"
        noText="Cancel"
      />

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Action points"
        message={`Are you sure you want to delete this"?`}
        onConfirm={handleDeleteActionPoints}
        yesText="Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default SiteLogs;
