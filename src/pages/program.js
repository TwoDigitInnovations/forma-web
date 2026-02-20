import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  FolderPlus,
  FolderKanban,
  MapPin,
  CalendarClock,
  FileCode2,
  Trash2,
  Edit2,
  Eye,
} from "lucide-react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { ProjectDetailsContext, userContext } from "./_app";
import isAuth from "../../components/isAuth";
import { ConfirmModal } from "../../components/AllComponents";
import CreateProgram from "../../components/CreateProgram";

const Program = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [AllProgramData, setAllProgramData] = useState([]);
  const [editId, setEditId] = useState("");
  const [programDetails, setProgramDetails] = useState({});
  const [user] = useContext(userContext);
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
    }
  }, []);

  const getAllProgram = async () => {
    props.loader(true);
    Api("get", `program/getAll?projectId=${projectId}`, "", router)
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
    getAllProgram();
  }, []);

  const filteredPrograms = AllProgramData.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteConfirm = async () => {
    props.loader(true);
    Api("delete", `program/delete/${editId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success("Program deleted successfully");
          getAllProgram();
          setEditId("");
        } else {
          toast.error("Failed to delete program");
        }
      })
      .catch(() => {
        props.loader(false);
        toast.error("An error occurred");
      });
  };

  return (
    <div className="h-screen p-3 md:px-0 bg-black text-white">
      <div className="max-w-7xl mx-auto w-full h-full overflow-y-scroll scrollbar-hide pb-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start gap-3 justify-between mb-8 mt-4">
          <div className="">
            <h1 className="text-3xl font-bold" style={{ color: "#e0f349" }}>
              Program
            </h1>
            <p className="text-sm text-gray-300 mt-2">
              Create multiple programs to organize your projects. Each project
              is managed under a specific program.
            </p>
          </div>
          <button
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
            onClick={() => setIsOpen(true)}
          >
            <FolderPlus size={22} />
            New Program
          </button>
        </div>

        {isOpen && (
          <CreateProgram
            setIsOpen={setIsOpen}
            refreshList={getAllProgram}
            loader={props.loader}
            editId={editId}
            programDetails={programDetails}
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
              className="w-full pl-10 pr-4 py-2 rounded-[26px] border border-gray-600 focus:outline-none"
              style={{ backgroundColor: "#FFFFFF75", color: "white" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">All Program</h2>

        <div className="space-y-4 grid-cols-1 md:grid-cols-3 grid gap-4 ">
          {filteredPrograms.map((Program) => (
            <div
              key={Program._id}
              className="rounded-[16px] border border-gray-700 p-4 bg-[#2a2a2a] hover:bg-[#dff34940]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {Program?.name}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-white">
                      <div className="flex items-center gap-1">
                        <CalendarClock size={16} />
                        <span>
                          Created:{" "}
                          {new Date(Program?.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-row sm:justify-end gap-2">
                  <button
                    className="w-1/2 p-2 rounded-lg cursor-pointer bg-gray-800 text-gray-300 flex items-center justify-center gap-2"
                    onClick={() => {
                      setEditId(Program._id);
                      setIsOpen(true);
                      setProgramDetails(Program);
                      console.log(Program);
                    }}
                  >
                    Edit <Edit2 size={16} />
                  </button>

                  <button
                    className="w-1/2 p-2 rounded-lg cursor-pointer bg-red-500/10 text-red-400 flex items-center justify-center gap-2"
                    onClick={() => {
                      setEditId(Program._id);
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

        {filteredPrograms.length === 0 && (
          <div className="flex flex-col justify-center items-center min-h-[450px] text-center space-y-3">
            <FileCode2 size={68} />
            <h3 className="text-xl font-medium">No Program Found</h3>
            <p className="text-white"> Try to add any program</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete Program"
        message="Are you sure you want to delete this Program?"
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
};

export default isAuth(Program, ["Organization", "User", "TeamsMember"]);
