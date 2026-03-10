import React, { useState, useEffect, useContext, act } from "react";
import { FileText, List, Plus } from "lucide-react";
import { Api } from "@/services/service";
import isAuth from "../../components/isAuth";
import MeetingHistory from "../../components/MeetingHistory";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import AddAttendeeGroupForm from "../../components/AddAttendeeGroupForm";
import { ConfirmModal } from "../../components/AllComponents";
import Meetingmintues from "../../components/meetingmintues";
import AttendeeGroupHistory from "../../components/AttendeeGroupHistory";

const MeetingDocumentation = (props) => {
  const [activeTab, setActiveTab] = useState("meetings");
  const [meetings, setMeetings] = useState([]);
  const [user] = useContext(userContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editData, setEditData] = useState({});
  const router = useRouter();
  const [allGroups, setAllGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAllMeetings();
    getAllGroups();
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

  const handleDeleteConfirm2 = async () => {
    props.loader(true);
    Api("delete", `attendee/delete/${editId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(
            res?.data?.message || "Attendee group deleted successfully",
          );
          getAllGroups();
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

  const getAllGroups = async () => {
    props.loader(true);
    try {
      const res = await Api("get", `attendee/getAll`, {}, router);
      if (res?.status === true) {
        setAllGroups(res?.data?.data || []);
      }
    } catch (err) {
      console.error("Failed to load meetings");
    } finally {
      props.loader(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--custom-lightGray)] text-white">
      <div className="md:px-6 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            
            <h1 className="text-3xl text-black font-bold">Meeting Documentation</h1>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 flex md:flex-row flex-col justify-between gap-4 md:gap-8 border-b-1 border-gray-200 pb-2">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab("meetings");
            }}
            className={`flex items-center gap-2 py-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === "meetings"
                ? "border-blue-500 text-blue-500 cursor-pointer"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <FileText size={18} />
            Meetings
          </button>
          <button
            onClick={() => {
              setActiveTab("attendee");
            }}
            className={`flex items-center gap-2 py-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === "attendee"
                ? "border-blue-500 text-blue-500 cursor-pointer"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <List size={18} />
            Attendee Groups
          </button>
        </div>
        <div className="flex flex-row  gap-2 md:gap-4">
          <button
            onClick={() => {
              setOpen(true);
            }}
            className={`flex border-transparent rounded-md bg-[var(--custom-blue)] text-sm md:text-md py-3 md:px-4 px-2 text-white items-center gap-2 cursor-pointer transition-colors
            `}
          >
            <Plus size={18} />
            New Meeting Mintues
          </button>
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className={`flex border-transparent rounded-md bg-[var(--custom-blue)]  text-sm md:text-md py-3 md:px-4 px-2 text-white items-center gap-2 cursor-pointer transition-colors
            `}
          >
            <Plus size={18} />
            New Attendee Group
          </button>
        </div>
      </div>

      <div className="p-4 md:py-6 md:p-6">
        {activeTab === "meetings" ? (
          <>
            <MeetingHistory
              meetings={meetings}
              setActiveTab={setActiveTab}
              setEditId={setEditId}
              setIsConfirmOpen={setIsConfirmOpen}
              setEditData={setEditData}
              setOpen={setOpen}
            />
          </>
        ) : (
          <>
            <AttendeeGroupHistory
              groups={allGroups}
              setActiveTab={setActiveTab}
              setEditId={setEditId}
              setIsConfirmOpen={setConfirmOpen}
              setEditData={setEditData}
              setOpen={setIsOpen}
            />
          </>
        )}
      </div>

      {open && (
        <Meetingmintues
          setEditData={setEditData}
          editData={editData}
          allGroups={allGroups}
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
        message={`Are you sure you want to delete this Meeting Minutes History?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />

      <ConfirmModal
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        title="Delete History"
        message={`Are you sure you want to delete this Attendee Group History?`}
        onConfirm={handleDeleteConfirm2}
        yesText="Yes, Delete"
        noText="Cancel"
      />

      {isOpen && (
        <AddAttendeeGroupForm
          loader={props.loader}
          editId={editId}
          getAllGroups={getAllGroups}
          editItem={editData}
          setIsOpen={setIsOpen}
          setEditItem={setEditData}
          setEditId={setEditId}
        />
      )}
    </div>
  );
};

export default isAuth(MeetingDocumentation, [
  "Organization",
  "User",
  "TeamsMember",
]);
