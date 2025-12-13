import React, { useContext, useEffect, useState } from "react";
import { Search, Eye, Edit, Plus, FileCode2, Trash2 } from "lucide-react";
import isAuth from "../../components/isAuth";
import CreateTeamMember from "../../components/Createteams";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/AllComponents";
import AssignProject from "../../components/AssignProject";

const TeamMembers = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [teamMembersData, SetTeamMembersData] = useState([]);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [AllProjectData, setAllProjectData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const generateAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const colors = [
      "#4ade80",
      "#06b6d4",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
    ];
    const color = colors[name.length % colors.length];

    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
    );
  };

  useEffect(() => {
    getAllMembers();
    getAllProject();
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

  const getAllMembers = async (e) => {
    props.loader(true);
    Api("get", `auth/getAllTeamMembers`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          SetTeamMembersData(res.data?.data || []);
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
    e.preventDefault();
    setLoading(true);

    try {
      const res = await Api(
        "post",
        `auth/deleteTeamMember/${deleteId}`,
        router
      );
      setLoading(false);

      if (res?.status) {
        toast.success("Team member deleted successfully!");
        getAllMembers();
      } else {
        toast.error(res?.message || "Failed to delete member");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-black text-white">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold" style={{ color: "#e0f349" }}>
              Team Management
            </h1>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsOpen(true)}
                className="min-w-[180px] w-full bg-custom-yellow py-2.5 px-3 text-black 
          rounded-[12px] flex items-center cursor-pointer justify-center gap-2 hover:bg-yellow-400"
              >
                <Plus size={18} />
                Assign Project
              </button>

              <button
                onClick={() => setOpen(true)}
                className="min-w-[180px] w-full bg-custom-yellow py-2.5 px-3 text-black 
          rounded-[12px] flex cursor-pointer items-center justify-center gap-2 hover:bg-yellow-400"
              >
                <Plus size={18} />
                Add Teams
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-lg mt-3 md:mt-0">
            Manage your construction team and roles.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md w-full">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search team members"
            className="w-full pl-12 pr-4 py-2 rounded-[30px] border border-gray-600 focus:border-gray-500 focus:outline-none"
            style={{ backgroundColor: "#2a2a2a", color: "white" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {teamMembersData?.map((member) => (
            <div
              key={member._id}
              className="group rounded-2xl border border-gray-700 bg-[#1B1B1B] p-5 
                 hover:border-gray-500 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2A2A2A]">
                  {generateAvatar(member.name)}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium text-[#5AC6AE] bg-[#5AC6AE1F]">
                  Team Member
                </span>
              </div>

              {/* Assigned Projects */}
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Assigned Projects
                </p>

                {member.assignedProjects?.length > 0 ? (
                  <div className="space-y-2">
                    {member.assignedProjects.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-[#262626] px-3 py-2"
                      >
                        <span className="text-sm text-white truncate">
                          {item.projectId?.projectName || "Unnamed Project"}
                        </span>

                        <span className="text-xs px-2 py-1 rounded-full bg-[#333333] text-gray-300">
                          {item.actionType === "both"
                            ? "View & Edit"
                            : item.actionType}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No project assigned
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-700">
                <button
                  onClick={() => {
                    setEditData(member);
                    setOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                     bg-[#2A2A2A] hover:bg-[#333333] transition"
                >
                  <Edit size={16} />
                  <span className="text-sm">Edit</span>
                </button>

                <button
                  onClick={() => {
                    setIsConfirmOpen(true);
                    setDeleteId(member._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                     bg-[#2A2A2A] hover:bg-red-500/10 text-red-400 transition"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {teamMembersData?.length === 0 && (
          <div
            className="flex flex-col rounded-3xl justify-center items-center 
    min-h-[450px] text-center space-y-3 bg-custom-black mt-10 p-6"
          >
            <FileCode2 size={68} />
            <h3 className="text-xl font-medium text-white">No Member Found</h3>
            <p className="text-gray-300">
              Try creating a new Member or adjusting your filters.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="w-[200px] justify-center bg-custom-yellow py-2.5 px-3 text-black 
        gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
            >
              <Plus size={18} />
              Add Team Member
            </button>
          </div>
        )}
      </div>

      {open && (
        <CreateTeamMember
          editData={editData}
          onclose={() => {
            setOpen(false);
            setEditData({});
          }}
          getAllMembers={getAllMembers}
        />
      )}

      {isOpen && (
        <AssignProject
          onclose={() => {
            setIsOpen(false);
          }}
          teamList={teamMembersData}
          getAllMembers={getAllMembers}
          AllProjectData={AllProjectData}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete teams Member"
        message={`Are you sure you want to delete this Member"?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
};

export default isAuth(TeamMembers);
