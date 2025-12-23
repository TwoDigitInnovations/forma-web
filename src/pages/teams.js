import React, { useContext, useEffect, useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Plus,
  FileCode2,
  Trash2,
  Crown,
  CreditCard,
  User2,
  Sheet,
} from "lucide-react";
import isAuth from "../../components/isAuth";
import CreateTeamMember from "../../components/Createteams";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/AllComponents";

const TeamMembers = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [teamMembersData, SetTeamMembersData] = useState([]);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllMembers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const getAllMembers = async () => {
    props.loader(true);
    Api("get", `auth/getAllTeamMembers?search=${searchTerm}`, "", router)
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
    try {
      const res = await Api(
        "delete",
        `auth/deleteTeamMember/${deleteId}`,
        {},
        router
      );

      if (res?.status) {
        toast.success("Team member deleted successfully!");
        getAllMembers();
      } else {
        toast.error(res?.message || "Failed to delete member");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-black text-white">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1
              className="md:text-3xl text-2xl font-bold"
              style={{ color: "#e0f349" }}
            >
              {user.name}'s Organization
            </h1>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setOpen(true)}
                className="min-w-[180px] w-full bg-custom-yellow py-2.5 px-3 text-black 
          rounded-[12px] flex cursor-pointer items-center justify-center gap-2 hover:bg-yellow-400"
              >
                <Plus size={18} />
                Invite Member
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-custom-black border border-gray-700 md:p-6 px-3 py-6 mb-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              {<CreditCard />} Plan & Seats
            </h2>
            <p className="text-sm text-gray-400">
              Manage your organization's subscription and seats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div className="rounded-xl bg-black p-5 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-custom-yellow">{<CreditCard />}</span>
                <span>Current Plan</span>
              </div>
              <h3 className="text-2xl font-semibold text-white capitalize">
                {user?.subscription?.planName || "Free Plan"}
              </h3>
            </div>

            {/* Seats Used */}
            <div className="rounded-xl bg-black p-5 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-custom-yellow">{<User2 />}</span>
                <span>Seats Used</span>
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {user?.subscription?.usedTeamsSize || "0"}{" "}
                <span className="text-sm text-gray-400">
                  of {user?.subscription?.teamSize}{" "}
                </span>
              </h3>

              <div className="mt-3 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "0%" }} />
              </div>
            </div>

            {/* Available Seats */}
            <div className="rounded-xl bg-black p-5 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-custom-yellow">{<Sheet />}</span>
                <span>Available Seats</span>
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {user?.subscription?.teamSize -
                  (user?.subscription?.usedTeamsSize || 0)}
              </h3>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-white">
              You can invite{" "}
              <span className="text-white font-medium">
                {" "}
                {user?.subscription?.teamSize -
                  (user?.subscription?.usedTeamsSize || 0)}
              </span>{" "}
              more team members
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-custom-black overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Team Members</h2>
            <p className="text-sm text-gray-400">
              Manage your organization's team members and their roles
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tr className="border-b border-gray-700 hover:bg-white/5 transition">
                {/* Member */}
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E293B]">
                    <Crown size={20} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-yellow-400 bg-yellow-400/10">
                    Owner
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/10">
                    Active
                  </span>
                </td>

                <td className="px-6 py-4 text-right"></td>
              </tr>

              <tbody>
                {teamMembersData?.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b border-gray-700 hover:bg-white/5 transition"
                  >
                    <td className="md:px-6 px-4 md:py-4 py-2 flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E293B]">
                        <User2 />
                      </div>

                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-400/10">
                        Member
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/10">
                        Active
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditData(member);
                            setOpen(true);
                          }}
                          className="p-3 rounded-lg cursor-pointer bg-[#1E293B] hover:bg-[#334155]"
                        >
                          <Edit size={20} />
                        </button>

                        <button
                          onClick={() => {
                            setIsConfirmOpen(true);
                            setDeleteId(member._id);
                          }}
                          className="p-2.5 cursor-pointer rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

export default isAuth(TeamMembers, ["Organization"]);
