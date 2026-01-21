import React, { useContext, useEffect, useState } from "react";
import { MoreVertical, TrendingUp } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Api } from "@/services/service"; // apna path check kar lena
import { ProjectDetailsContext, userContext } from "@/pages/_app";
import { ConfirmModal } from "./AllComponents";
import moment from "moment";

export default function Listproject({ loader, allProjectData, getAllProject }) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [openMenu, setOpenMenu] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [editId, setEditId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteConfirm = () => {
    if (!editId) return;

    loader(true);
    Api("delete", `project/deleteProject/${editId}`, "", router)
      .then((res) => {
        loader(false);
        if (res?.status === true) {
          toast.success(res?.data?.message || "Project deleted successfully");
          getAllProject();
          setEditId("");
          setOpenMenu(null);
        } else {
          toast.error(res?.data?.message || "Failed to delete project");
        }
      })
      .catch((err) => {
        loader(false);
        toast.error(err?.data?.message || "An error occurred");
      });
  };

  const calculatefinancialProgress = (paidAmount, contractAmount) => {
    if (contractAmount > 0) {
      return Number(((paidAmount || 0) / contractAmount || 0) * 100).toFixed(2);
    }
    return 0;
  };

  const calculateTimeProgress = (startDate, endDate) => {
    const currentDate = moment();
    const start = moment(startDate);
    const end = moment(endDate);
    if (!startDate || !endDate || currentDate.isBefore(start)) return 0;
    if (currentDate.isAfter(end)) return 100;
    const totalDuration = end.diff(start);
    const elapsedDuration = currentDate.diff(start);
    return ((elapsedDuration / totalDuration) * 100).toFixed(2);
  };

  return (
    <div className="bg-custom-black min-h-[400px] rounded-2xl border border-[#1f1f1f] p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <button
          className="text-sm text-gray-400 hover:text-white underline text-custom-yellow cursor-pointer"
          onClick={() => router.push("/project")}
        >
          View All
        </button>
      </div>

      {allProjectData.length === 0 && !loader ? (
        <div className="flex flex-col items-center justify-center py-20">
          <TrendingUp className="w-10 h-10 text-gray-500 mb-4" />
          <p className="text-gray-400 mb-5">No active projects found</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium">
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b-[1px] border-gray-600 ">
                <th className="py-3 text-left min-w-[80px]">Project</th>
                <th className="py-3 text-left min-w-[100px]">Status</th>
                <th className="py-3 text-left min-w-[80px]">Financial</th>
                <th className="py-3 text-left min-w-[80px]">Time</th>
                <th className="py-3 text-left min-w-[80px]">Physical</th>
                <th className="py-3 text-left min-w-[80px]">Due Date</th>

                <th className="py-3 text-left min-w-[80px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {allProjectData.map((item, index) => (
                <tr key={item._id} className="border-b border-[#1f1f1f]  px-2">
                  <td
                    className="py-4 text-blue-400 font-medium hover:underline cursor-pointer"
                    onClick={() => {
                      router.push(`/ProjectDetails/overview?id=${item._id}`);
                      setProjectdetails(item);
                      localStorage.setItem(
                        "projectDetails",
                        JSON.stringify(item),
                      );
                    }}
                  >
                    {item.projectName || "Project Name"}
                  </td>

                  <td>
                    <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs">
                      {item?.status}
                    </span>
                  </td>

                  <td className="text-gray-400">
                    {calculatefinancialProgress(
                      item?.paidAmount,
                      item?.contractAmount,
                    )}
                    %
                  </td>
                  <td className="text-gray-400">{calculateTimeProgress(item?.startDate, item?.endDate)}%</td>
                  <td className="text-gray-400">{item?.actualProgress || 0}%</td>
                  <td className="text-gray-400">
                    {item?.endDate
                      ? moment(item.endDate).format("YYYY-MM-DD")
                      : "--"}
                  </td>

                  <td>
                    <div className="relative overflow-visible">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === item._id ? null : item._id,
                          )
                        }
                        className="p-2 rounded-full hover:bg-gray-200 cursor-pointer transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {openMenuId === item._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-100">
                          <button
                            onClick={() => {
                              router.push(
                                `/ProjectDetails/overview?id=${item._id}`,
                              );
                              setProjectdetails(item);
                              localStorage.setItem(
                                "projectDetails",
                                JSON.stringify(item),
                              );
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              setEditId(item._id);
                              setIsConfirmOpen(true);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to delete this Project"?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}
