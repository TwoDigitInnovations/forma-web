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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [AllProjectData, setAllProjectData] = useState([]);
  const [editId, setEditId] = useState("");
  const router = useRouter();
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
  }, [searchTerm]);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) setProjectdetails(JSON.parse(stored));
  }, []);

  const getAllProject = async (e) => {
    props.loader(true);
    Api(
      "get",
      `project/getAllProjects?OrganizationId=${user._id}&search=${searchTerm}`,
      "",
      router
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

  return (
    <div className="h-screen p-3 md:p-6 bg-black text-white">
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
            <button
              className=" w-[140px] flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors text-sm md:text-md"
              style={{ backgroundColor: "#FFFFFF75" }}
            >
              <FolderKanban size={26} />
              All Projects
            </button>
            <button
              className=" w-[130px] flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors text-sm md:text-md"
              style={{ backgroundColor: "#FFFFFF75" }}
            >
              <CircleDashed size={26} />
              All Status
            </button>
            <button
              className=" w-[160px] flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors text-sm md:text-md"
              style={{ backgroundColor: "#FFFFFF75" }}
            >
              <ClockArrowDown size={26} />
              Last Updated
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">All Projects</h2>

        <div className="space-y-4">
          {AllProjectData.map((project, key) => (
            <div
              key={key}
              className="rounded-[16px] border border-gray-700 p-4 bg-[#2a2a2a] hover:border-gray-600 transition-colors hover:bg-[#dff34940]"
            >
              <div className="flex flex-col gap-4">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {project?.projectName}
                      </h3>
                      <span className={getStatusBadge(project?.status)}>
                        {project?.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-white">
                      <div className="flex items-center gap-1">
                        <MapPin size={18} />
                        <span>{project?.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarClock size={18} />
                        <span>
                          Last Updated:{" "}
                          {new Date(project?.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="w-full md:w-48">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${project?.progress || 80}%`,
                          backgroundColor: "#e0f349",
                        }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-lg font-bold text-[#e0f349]">
                        {project?.progress || 80}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  <button
                    className="w-full sm:w-auto p-2 rounded-lg bg-custom-yellow text-black flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => {
                      router.push(`/ProjectDetails/overview?id=${project._id}`);
                      setProjectdetails(project);
                      localStorage.setItem(
                        "projectDetails",
                        JSON.stringify(project)
                      );
                    }}
                  >
                    See Details <Eye size={16} />
                  </button>

                  <button
                    className="w-full sm:w-auto p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => {
                      setProjectdetails(project);
                      localStorage.setItem(
                        "projectDetails",
                        JSON.stringify(project)
                      );
                      setEditId(project?._id);
                      router.push("/ProjectDetails/EditProject");
                    }}
                  >
                    Edit <Edit2 size={16} />
                  </button>

                  <button
                    className="w-full sm:w-auto p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => {
                      setEditId(project._id);
                      setIsConfirmOpen(true);
                    }}
                  >
                    Delete <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {AllProjectData.length === 0 && (
          <div className="flex bg-custom-black flex-col rounded-3xl justify-center items-center md:min-h-[450px] min-h-[700px] text-center space-y-3">
            <FileCode2 size={68} />
            <h3 className="text-xl font-medium text-white">No Project Found</h3>
            <p className="text-gray-300">
              Try creating a new Project or adjusting your filters.
            </p>

            <button
              className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
              onClick={() => setIsOpen(true)}
            >
              <FolderPlus size={28} />
              New Project
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete History"
        message={`Are you sure you want to delete this Meeting mintues History"?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
};

export default isAuth(Projects, ["Organization", "User", "TeamsMember"]);
