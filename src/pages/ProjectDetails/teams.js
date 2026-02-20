import React, { useState, useEffect, useContext, useRef } from "react";
import { Users, Mail, UserPlus, Crown, Trash2, MapPin } from "lucide-react";
import { ProjectDetailsContext, userContext } from "../_app";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function Teams(props) {
  const [projectId, setProjectId] = useState("");
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [allUser, setAllUser] = useState([]);
  const [user] = useContext(userContext);

  const [team, setTeam] = useState([]);
const dropdownRef = useRef(null);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
    }
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    if (user?._id && projectDetails?.members?.length) {
      const member = projectDetails.members.find(
        (m) => m.userId?._id === user._id,
      );

      if (member) {
        setCurrentUserRole(member.role); // owner / editor
      } else {
        setCurrentUserRole(null);
      }
    }
  }, [user, projectDetails]);

  // useEffect(( ) =>{
  //   if(user._id){
  //     mujhe is project me member ki list me se userki id uthani hai find krna hai and role chahiye owner hai ya editor hai uske hisab se mujhe condition lagani hai ki agar userki id member list me hai aur role owner hai to remove button na dikhe aur owner likha aaye aur agar userki id member list me hai aur role editor hai to remove button dikhe aur agar userki id member list me nahi hai to remove button na dikhe
  //   }
  // })

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId);
    }
  }, [projectId]);

  const getProjectDetails = async (id) => {
    try {
      props.loader(true);

      const res = await Api("get", `project/getProjectById/${id}`, "", router);

      const members = res.data?.data?.members?.map((m) => ({
        id: m.userId._id,
        name: m.userId.name,
        email: m.userId.email,
        role: m.role,
      }));

      setTeam(members || []);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch members");
    } finally {
      props.loader(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // delay time

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      getAllUsers();
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const getAllUsers = async () => {
    try {
      props.loader(true);

      const res = await Api(
        "get",
        `auth/getAllUser?role=User&search=${encodeURIComponent(searchQuery)}`,
        "",
        router,
      );

      setAllUser(res.data?.data || []);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      props.loader(false);
    }
  };

  const filteredUsers = allUser.filter((u) =>
    u.email.toLowerCase().startsWith(searchQuery.toLowerCase()),
  );

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    try {
      props.loader(true);

      await Api(
        "post",
        `project/add-member/${projectId}`,
        {
          userId: selectedUserId,
          role: "editor",
        },
        router,
      );

      toast.success("Member added successfully");
      setSearchQuery("");
      setSelectedUserId("");
      getProjectDetails(projectId);
    } catch (err) {
      toast.error(err?.message || "Failed to add member");
    } finally {
      props.loader(false);
    }
  };

  const removeMember = async (userId) => {
    try {
      props.loader(true);

      await Api(
        "delete",
        `project/remove-member/${projectId}/${userId}`,
        "",
        router,
      );

      toast.success("Member removed successfully");
      getProjectDetails(projectId);
    } catch (err) {
      toast.error(err?.message || "Failed to remove");
    } finally {
      props.loader(false);
    }
  };

const isOwner = currentUserRole === "owner";
const isEditor = currentUserRole === "editor";

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 ">
        <div className="bg-[#DFF34940] p-4 md:px-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
         
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            
            <h1 className="text-sm md:text-base font-semibold text-gray-100 break-words">
              {projectDetails?.projectName}
            </h1>

            <div className="flex items-center gap-1 text-xs md:text-sm text-gray-300">
              <MapPin size={14} className="shrink-0" />
              <span className="break-words">{projectDetails?.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#DFF34940] rounded-xl md:p-5 p-3 shadow mb-6 mt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-custom-yellow" />
            Invite Collaborator
          </h2>

         
          {isEditor && (
            <p className="text-sm text-gray-400 mt-1">
              You have editor access. You can only view the member list and
              their roles. Adding or removing members is allowed for the project
              owner only.
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div ref={dropdownRef} className="relative w-full">
              <div className="flex items-center w-full border border-gray-300 rounded-lg px-3 bg-white">
                <Mail className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter collaborator email"
                  className="flex-1  px-3 py-2 outline-none text-black"
                  value={searchQuery}
                  onChange={(e) =>{
                    setSearchQuery(e.target.value)
                    setShowDropdown(false)
                  } }
                  onFocus={() => searchQuery && setShowDropdown(true)}
                />
              </div>

              {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto">
                  {filteredUsers.map((u) => (
                    <div
                      key={u._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(u.email);
                        setSelectedUserId(u._id);
                        setShowDropdown(false);
                      }}
                    >
                      <p className="text-sm font-medium text-black">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleAddMember}
              className="w-[200px] bg-custom-yellow text-black px-5 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        <div className="bg-[#DFF34940] rounded-xl md:p-5 p-3 shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-custom-yellow" />
            Team Members
          </h2>

          <div className="space-y-3 mt-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {member.role === "owner" && (
                    <span className="text-orange-600 font-semibold flex items-center gap-1">
                      <Crown className="w-4 h-4" /> Owner
                    </span>
                  )}

                  {isOwner && member.role !== "owner" && (
                    <button
                      onClick={() => removeMember(member.userId._id)}
                      className="text-red-600 flex items-center gap-1 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-8"></div>
      </div>
    </div>
  );
}

export default Teams;
