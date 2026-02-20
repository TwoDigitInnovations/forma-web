import React, { useState, useEffect } from "react";
import {
  Search,
  FolderPlus,
  CircleDashed,
  ClockArrowDown,
  FolderKanban,
  MapPin,
  CalendarClock,
  FileCode2,
  Trash2,
  Edit2,
  Eye,
} from "lucide-react";
import { useRouter } from "next/router";
import CreateProject from "../../components/CreateProject";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ProjectDetailsContext, userContext } from "./_app";
import isAuth from "../../components/isAuth";
import { ConfirmModal } from "../../components/AllComponents";

const Projects = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [AllProgramData, setAllProgramData] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [programId, setProgramId] = useState("");
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [AllProjectData, setAllProjectData] = useState([]);
  const [editId, setEditId] = useState("");
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState(null);

  const [user, setUser] = useContext(userContext);
  const isTeamsMember = user?.role === "TeamsMember";

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Planning":
        return `${baseClasses} text-[#e0f349] bg-[#e0f349]/20`;
      case "In Progress":
        return `${baseClasses} text-[#00bcd4] bg-[#00bcd4]/20`;
      case "Completed":
        return `${baseClasses} text-[#4caf50] bg-[#4caf50]/20`;
      default:
        return `${baseClasses} text-gray-400 bg-gray-700`;
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllProject();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, programId]);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) setProjectdetails(JSON.parse(stored));
  }, []);

  const getAllProject = async (e) => {
    props.loader(true);
    Api(
      "get",
      `project/getAllProjects?OrganizationId=${user._id}&search=${searchTerm}&programId=${programId}`,
      "",
      router,
    )
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setAllProjectData(res.data?.data);
        } else {
          toast.error(res?.message || "Failed to created status");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const handleDeleteConfirm = async () => {
    const id = editId;
    props.loader(true);
    Api("delete", `project/deleteProject/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(res?.data?.message || "Project deleted successfully");
          getAllProject();
          setEditId("");
        } else {
          toast.error(res?.data?.message || "Failed to deleted a project");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.data?.message || "An error occurred");
      });
  };
  const getAllProgram = async (projectId) => {
    props.loader(true);
    Api("get", `program/getAll/${projectId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setAllProgramData(res.data?.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch programs");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  useEffect(() => {
    getAllProgram(projectDetails?._id);
  }, [projectDetails?._id]);

  return (
    <div className="h-screen p-3 md:px-0 bg-black text-white z-0">
      <div className="max-w-7xl mx-auto w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#e0f349" }}>
            Projects
          </h1>
          <button
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
            onClick={() => setIsOpen(true)}
          >
            <FolderPlus size={28} />
            New Project
          </button>
        </div>

        {isOpen && (
          <CreateProject
            setIsOpen={setIsOpen}
            loader={props.loader}
            getAllProject={getAllProject}
            AllProgramData={AllProgramData}
          />
        )}

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex w-[31rem]">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-[26px] border border-gray-600 focus:border-gray-500 focus:outline-none"
              style={{ backgroundColor: "#FFFFFF75", color: "white" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-start items-center gap-2">
            <div className="md:col-span-1 col-span-2 mb-2">
              <select
                name="programId"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                required
                className="text-[14px] mt-2 px-4 py-2.5 cursor-pointer w-full bg-[#5F5F5F] rounded-lg"
              >
                <option value="">Select Program Type</option>
                {AllProgramData.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <button className=" w-[130px] flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 bg-custom-yellow text-black cursor-pointer transition-colors text-sm md:text-md">
              <CircleDashed size={26} />
              All Status
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">All Projects</h2>

        <div className="overflow-x-auto bg-custom-black rounded-xl min-h-[450px]">
          <table className="min-w-[800px] w-full text-sm text-left text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Status</th>
                <th className="p-3">Location</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            {AllProjectData.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="flex flex-col justify-center items-center text-center space-y-3 min-h-[450px] bg-custom-black">
                      <FileCode2 size={68} className="text-gray-400" />

                      <h3 className="text-xl font-medium text-white">
                        No Project Found
                      </h3>

                      <p className="text-gray-300">
                        Try creating a new Project or adjusting your filters.
                      </p>

                      <button
                        className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
                        style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
                        onClick={() => setIsOpen(true)}
                      >
                        <FolderPlus size={20} />
                        New Project
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {AllProjectData.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b border-gray-800 hover:bg-[#e0f34915] transition"
                  >
                    <td className="p-3">
                      <div
                        className="font-semibold text-white hover:underline cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/ProjectDetails/overview?id=${project._id}`,
                          );
                          setProjectdetails(project);
                          localStorage.setItem(
                            "projectDetails",
                            JSON.stringify(project),
                          );
                        }}
                      >
                        {project?.projectName}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={getStatusBadge(project?.status)}>
                        {project?.status}
                      </span>
                    </td>

                    <td className="p-3">{project?.location}</td>

                    <td className="p-3">
                      {new Date(project?.updatedAt).toLocaleString()}
                    </td>

                    <td className="p-3 min-w-[150px]">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${project?.actualProgress || 0}%`,
                            backgroundColor: "#e0f349",
                          }}
                        />
                      </div>
                      <div className="text-right text-xs mt-1 text-[#e0f349]">
                        {project?.actualProgress || 0}%
                      </div>
                    </td>

                    <td className="p-3 text-center relative">
                      <button
                        className="p-2 hover:bg-gray-700 rounded cursor-pointer"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === project._id ? null : project._id,
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {openMenuId === project._id && (
                        <div className="absolute right-2 mt-2 bg-white text-black rounded-lg shadow-lg w-36 z-30">
                          <button
                            className="block w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setOpenMenuId(null);
                              router.push(
                                `/ProjectDetails/overview?id=${project._id}`,
                              );
                              setProjectdetails(project);
                              localStorage.setItem(
                                "projectDetails",
                                JSON.stringify(project),
                              );
                            }}
                          >
                            View
                          </button>

                          <button
                            className="block w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setOpenMenuId(null);
                              setProjectdetails(project);
                              localStorage.setItem(
                                "projectDetails",
                                JSON.stringify(project),
                              );
                              setEditId(project?._id);
                              router.push("/ProjectDetails/EditProject");
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="block w-full cursor-pointer text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditId(project._id);
                              setIsConfirmOpen(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
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
};

export default isAuth(Projects, ["Organization", "User", "TeamsMember"]);
