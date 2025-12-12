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
} from "lucide-react";
import { useRouter } from "next/router";
import CreateProject from "../../components/CreateProject";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ProjectDetailsContext, userContext } from "./_app";
import isAuth from "../../components/isAuth";

const Projects = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Projects");
  const [isOpen, setIsOpen] = useState(false);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [AllProjectData, setAllProjectData] = useState([]);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);

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
    getAllProject();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) setProjectdetails(JSON.parse(stored));
  }, []);

  const getAllProject = async (e) => {
    props.loader(true);
    Api("get", `project/getAllProjects?OrganizationId=${user._id}`, "", router)
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

  return (
    <div className="h-screen p-3 md:p-6 bg-black text-white">
      <div className="max-w-7xl mx-auto w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#e0f349" }}>
            Projects
          </h1>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
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
              className="rounded-[16px] border border-gray-700 p-4 hover:border-gray-600 transition-colors hover:bg-[#dff34940] cursor-pointer bg-[#2a2a2a]"
              // onClick
              onClick={() => {
                router.push(`/ProjectDetails/overview?id=${project._id}`);
                setProjectdetails(project);
                localStorage.setItem("projectDetails", JSON.stringify(project));
              }}
            >
              <div className="flex md:flex-row flex-col md:items-center md:justify-between justify-start">
                {/* Project Info */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {project?.projectName}
                    </h3>
                    <span className={getStatusBadge(project?.status)}>
                      {project?.status}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-2 text-sm text-white">
                    <div className="flex  items-center gap-1">
                      <MapPin size={20} />
                      <span>{project?.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarClock size={20} />
                      <span>
                        Last Updated:{" "}
                        <span>
                          {new Date(project?.updatedAt).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-4 min-w-48">
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${project?.progress || 80}%`,
                          backgroundColor: "#e0f349",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#e0f349" }}
                    >
                      {project?.progress || 80}%
                    </span>
                  </div>
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
              onClick={() => setIsOpen(true)}
            >
              <FolderPlus size={28} />
              New Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default isAuth(Projects);
