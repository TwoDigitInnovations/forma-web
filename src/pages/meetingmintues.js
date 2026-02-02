import React, { useState, useEffect, useContext } from "react";
import { FileText, Plus } from "lucide-react";
import { Api } from "@/services/service";
import isAuth from "../../components/isAuth";
import MeetingHistory from "../../components/MeetingHistory";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import moment from "moment";
import { ConfirmModal } from "../../components/AllComponents";

import Meetingmintues from "../../components/meetingmintues";

const MeetingDocumentation = (props) => {
  const [activeTab, setActiveTab] = useState("new");
  const [meetings, setMeetings] = useState([]);
  const [user] = useContext(userContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [AllProjectData, setAllProjectData] = useState([]);
  const [editId, setEditId] = useState("");
  const [editData, setEditData] = useState({});
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllMeetings();
  }, []);

  const handleDeleteConfirm = async () => {
    const id = editId;
    props.loader(true);
    Api("delete", `meeting-minutes/deleteMeetingMinutes/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(
            res?.data?.message || "Meeting minutes deleted successfully",
          );
          getAllMeetings();
          setEditId("");
        } else {
          toast.error(res?.data?.message || "Failed to created status");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.data?.message || "An error occurred");
      });
  };

  const getAllMeetings = async () => {
    props.loader(true);
    try {
      const res = await Api(
        "get",
        `meeting-minutes/getMyMeetingMinutes`,
        {},
        router,
      );
      if (res?.status === true) {
        setMeetings(res?.data || []);
      }
    } catch (err) {
      console.error("Failed to load meetings");
    } finally {
      props.loader(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="md:px-0 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-2">
              <span
                className="text-custom-yellow cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                Forma
              </span>{" "}
              › OPERATIONS CENTER
            </div>
            <h1 className="text-3xl font-bold">Meeting Documentation</h1>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 flex justify-between gap-8 border-b-1 border-gray-800 pb-2">
        <button
          onClick={() => {
            setActiveTab("new");
          }}
          className={`flex items-center gap-2 py-2.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === "new"
              ? "border-custom-yellow text-custom-yellow cursor-pointer"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FileText size={18} />
          Meetings
        </button>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className={`flex border-transparent rounded-md bg-custom-yellow  py-3 px-4 text-black items-center gap-2 cursor-pointer transition-colors
            `}
        >
          <Plus size={18} />
          New Meeting Mintues
        </button>
      </div>

      <div className="p-4 md:py-6 md:p-0">
        <MeetingHistory
          meetings={meetings}
          setActiveTab={setActiveTab}
          setEditId={setEditId}
          setIsConfirmOpen={setIsConfirmOpen}
          setEditData={setEditData}
          setOpen={setOpen}
        />
      </div>
      {open && (
        <Meetingmintues
          setEditData={setEditData}
          editData={editData}
          setOpen={setOpen}
          close={() => setOpen(false)}
          editId={editId}
          setEditId={setEditId}
          getAllMeetings={getAllMeetings}
        />
      )}

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

export default isAuth(MeetingDocumentation, [
  "Organization",
  "User",
  "TeamsMember",
]);
