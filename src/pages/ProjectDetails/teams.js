
import React, { useState,useEffect, useContext } from "react";
import {
  Users,
  Mail,
  UserPlus,
  Crown,
  Trash2,
  UserCircle2,
  MapPin,
} from "lucide-react";
import { ProjectDetailsContext } from "../_app";


function teams() {
  // Load Project ID from localStorage

  const [projectId,setProjectId] = useState("");
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project)
      setProjectId(project._id);
    }
  }, []);

    const [email, setEmail] = useState("");
  const [team, setTeam] = useState([
    {
      id: 1,
      name: "sebago08",
      email: "zewo13@gmail.com",
      role: "owner",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "member",
    },
  ]);

  const handleAddMember = () => {
    if (!email) return;

    const newMember = {
      id: Date.now(),
      name: email.split("@")[0],
      email,
      role: "member",
    };

    setTeam([...team, newMember]);
    setEmail("");
  };

  const removeMember = (id) => {
    setTeam(team.filter((m) => m.id !== id));
  };

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 md:px-8">
        <div className="bg-[#DFF34940] py-4 px-6 flex md:flex-row flex-col gap-4 rounded-[16px] justify-between items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[14px] font-bold flex items-center gap-2">
              {projectDetails?.projectName}
              <span className="text-[11px] flex items-center gap-1">
                <MapPin size={15} /> {projectDetails?.location}
              </span>
            </h1>
          </div>
        </div>

 

        {/* INVITE SECTION */}
        <div className="bg-[#DFF34940] rounded-xl md:p-5 p-3 shadow mb-6 mt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <UserPlus className="w-5 h-5 text-custom-yellow" /> Invite Collaborator
          </h2>
          <p className="text-sm text-gray-200 mb-4">
            Add team members by entering their email address below.
          </p>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center w-full border border-gray-300 rounded-lg px-3">
              <Mail className="text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter collaborator email"
                className="w-full px-3 py-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddMember}
              className="bg-custom-yellow text-black px-5 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* TEAM MEMBERS SECTION */}
        <div className="bg-[#DFF34940] rounded-xl md:p-5 p-3 shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-custom-yellow" /> Team Members
          </h2>
          <p className="text-sm text-gray-200 mb-4">
            All collaborators who have access to this project.
          </p>

          <div className="space-y-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {member.role === "owner" ? (
                    <span className="text-orange-600 font-semibold flex items-center gap-1">
                      <Crown className="w-4 h-4" /> Owner
                    </span>
                  ) : (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 flex items-center gap-1 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" /> Remove
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

export default teams;
