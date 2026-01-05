import React, { useContext, useEffect, useState } from "react";
import { MoreVertical, TrendingUp } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Api } from "@/services/service"; // apna path check kar lena
import { ProjectDetailsContext, userContext } from "@/pages/_app";
import { ConfirmModal } from "./AllComponents";

export default function Listproject({ loader, allProjectData,getAllProject }) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [openMenu, setOpenMenu] = useState(null);
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
                <th className="py-3 text-left min-w-[100px]">Grievances</th>
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
                        JSON.stringify(item)
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

                  <td className="text-gray-400">0%</td>
                  <td className="text-gray-400">0%</td>
                  <td className="text-gray-400">0%</td>
                  <td className="text-gray-400">
                    {item.dueDate || "Sep 06, 2026"}
                  </td>
                  <td className="text-gray-400">0</td>

                  <td className="">
                    <div className="flex justify-start items-center gap-4">
                      <button
                        className="px-4 py-2 rounded-md cursor-pointer bg-custom-yellow text-black "
                        onClick={() => {
                          router.push(
                            `/ProjectDetails/overview?id=${item._id}`
                          );
                          setProjectdetails(item);
                          localStorage.setItem(
                            "projectDetails",
                            JSON.stringify(item)
                          );
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditId(item._id);
                          setIsConfirmOpen(true);
                        }}
                        className=" px-4 py-2 cursor-pointer text-black bg-red-500 rounded-md"
                      >
                        Delete
                      </button>
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
