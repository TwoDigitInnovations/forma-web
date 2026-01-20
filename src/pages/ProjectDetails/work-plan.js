import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  NotebookPen,
  MapPin,
  Edit,
  Eye,
  Trash2,
  FileCode2,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import isAuth from "../../../components/isAuth";
import CreateWorkPlan from "../../../components/CreateWorkPlan";
import { Api } from "@/services/service";
import Table from "../../../components/table";
import moment from "moment";
import { ProjectDetailsContext } from "../_app";

const WorkPlan = (props) => {
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useContext(ProjectDetailsContext);
  const [projectId, setProjectId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [allPlanData, setAllPlanData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planId, setPlanId] = useState("");
  const [workPlan, setWorkPlan] = useState({});
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 5,
  });

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectId(project._id);
      setProjectDetails(project);
      getAllPlanByProjectId(project._id);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (projectId) getAllPlanByProjectId(projectId, searchTerm);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const getAllPlanByProjectId = async (id, searchTerm = "") => {
    props.loader(true);

    let url = `workplan/getAllPlans?projectId=${id}`;

    if (searchTerm && searchTerm.trim() !== "") {
      url += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
    }

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

  const columns = useMemo(
    () => [
      {
        Header: "Work Plan Name",
        accessor: "planName",
        width: "220px",
        Cell: ({ value }) => (
          <p
            className="text-black text-[15px] font-semibold text-center truncate min-w-[180px]"
            title={value}
          >
            {value || "—"}
          </p>
        ),
      },
      {
        Header: "Last Updated",
        accessor: "updatedAt",
        Cell: ({ value }) => (
          <p className="text-gray-700 text-center text-[14px] font-medium min-w-[180px]">
            {value ? moment(value).format("DD MMM YYYY, hh:mm A") : "—"}
          </p>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`min-w-[120px] px-4 py-1 rounded-full text-sm font-semibold text-center inline-block ${
              value === "Active"
                ? "bg-green-100 text-green-700 border border-green-300"
                : value === "Completed"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-200 text-gray-600 border border-gray-300"
            }`}
          >
            {value || "Pending"}
          </span>
        ),
      },
      {
        Header: "Total Activities",
        accessor: "workActivities",
        Cell: ({ value }) => (
          <p className="min-w-[140px] text-center text-[15px] font-medium text-gray-800">
            {value?.length || 0}
          </p>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2 min-w-[150px]">
            <button
              className="p-2 rounded-md cursor-pointer hover:bg-green-100 hover:text-green-700 transition-all"
              title="View Details"
              onClick={() => {
                setWorkPlan(row.original);
                setOpen(true);
              }}
            >
              <Eye size={18} />
            </button>
            <button
              className="p-2 rounded-md cursor-pointer hover:bg-yellow-100 hover:text-yellow-700 transition-all"
              title="Edit Plan"
              onClick={() =>
                router.push(
                  `/ProjectDetails/EditActivity?PlanId=${row.original._id}`
                )
              }
            >
              <Edit size={18} />
            </button>
            <button
              className="p-2 rounded-md cursor-pointer hover:bg-red-100 hover:text-red-600 transition-all"
              title="Delete Plan"
              onClick={() => {
                setShowDeleteModal(true);
                setPlanId(row.original._id);
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleDeletePlan = (id) => {
    props.loader(true);
    Api("delete", `workplan/deletePlan/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success("Plan deleted successfully!");
          setShowDeleteModal(false);
          getAllPlanByProjectId(projectId);
        } else {
          toast.error(res?.message || "Failed to delete plan");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-3 md:px-0 mx-auto">
        <div className="bg-custom-green py-6 md:px-6 px-3 flex flex-col md:flex-row gap-4 md:items-center justify-between rounded-[16px]">
          <div>
            <h1 className="text-white flex items-center md:gap-2 gap-16 text-sm md:text-base font-bold">
              {projectDetails?.projectName}
              <span className="ms-4 text-[11px] flex items-center gap-1">
                <MapPin size={14} /> {projectDetails?.location}
              </span>
            </h1>
            <p className="md:text-[28px] text-[22px] text-white mt-1 font-semibold">
              Work Plan
            </p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer w-fit"
          >
            <NotebookPen size={18} />
            Create New Work Plan
          </button>
        </div>

        <div className="bg-custom-black py-5 mt-5 rounded-2xl md:px-5 px-2 overflow-y-auto">
          <div className="">
            <input
              className="bg-gray-100 text-black border border-gray-200 outline-none h-[40px] md:w-[400px] w-full px-5 rounded-[10px] text-base"
              type="text"
              placeholder="Search Work Plans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {allPlanData.length === 0 ? (
            <div className="flex flex-col justify-center items-center md:min-h-[450px] min-h-[700px] text-center space-y-2">
              <FileCode2 size={68} />
              <h3 className="text-xl font-medium text-white">
                No Work Plans Found
              </h3>
              <p className="text-gray-300">
                Try creating a new plan or adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={allPlanData}
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {isOpen && (
          <CreateWorkPlan
            setIsOpen={setIsOpen}
            loader={props.loader}
            getAllProject={getAllPlanByProjectId}
            projectId={projectId}
          />
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-semibold text-black mb-3">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-5">
                Are you sure you want to delete this plan?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePlan(planId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {open && (
          <div className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="w-[95%] max-w-6xl bg-[#111] rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#1a1a1a]">
                <h2 className="text-lg font-semibold text-white">
                  Work Plan Details
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X />
                </button>
              </div>

              <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#141414]">
                {/* Plan Name */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-400">Plan Name</p>
                  <p className="text-white font-semibold mt-1">
                    {workPlan?.planName || "-"}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium
              ${
                workPlan?.status === "Completed"
                  ? "bg-green-500/20 text-green-400"
                  : workPlan?.status === "In Progress"
                  ? "bg-blue-500/20 text-blue-400"
                  : workPlan?.status === "On Hold"
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-gray-500/20 text-gray-300"
              }`}
                  >
                    {workPlan?.status || "Not Started"}
                  </span>
                </div>

                {/* Start Date */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-400">Start Date</p>
                  <p className="text-white mt-1">
                    {workPlan?.startDate
                      ? new Date(workPlan.startDate).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-400">Total Activities</p>
                  <p className="text-white font-semibold mt-1">
                    {workPlan?.workActivities?.length || 0}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-custom-yellow text-black">
                    <tr>
                      <th className="px-4 py-3">Item No</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-center">Duration (M)</th>
                      <th className="px-4 py-3">Start Date</th>
                      <th className="px-4 py-3">End Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {workPlan?.workActivities?.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          row.rowType === "section"
                            ? "bg-[#1f1f1f] font-semibold text-white"
                            : "text-gray-300 hover:bg-[#1a1a1a]"
                        }
                      >
                        <td className="px-4 py-3">{row.itemNo || "-"}</td>
                        <td className="px-4 py-3">{row.description}</td>
                        <td className="px-4 py-3 text-center">
                          {row.duration || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {row.startDate
                            ? new Date(row.startDate).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {row.endDate
                            ? new Date(row.endDate).toLocaleDateString("en-GB")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-[#1a1a1a]">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-lg cursor-pointer bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default isAuth(WorkPlan);
