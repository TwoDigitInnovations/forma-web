import { FileText, Users, Briefcase, Edit2, Trash2 } from "lucide-react";
import React from "react";

function MeetingHistory({
  meetings = [],
  setActiveTab,
  setIsConfirmOpen,
  setEditId,
  setEditData,
  setOpen,
}) {
  if (!meetings.length) {
    return (
      <div className="bg-custom-black rounded-lg border border-gray-800 flex items-center justify-center md:h-[500px] h-[650px]">
        <div className="text-center">
          <FileText size={64} className="mx-auto text-custom-yellow mb-4" />
          <p className="text-gray-400 mb-4">No meeting minutes recorded yet.</p>
          <button
            onClick={() => setActiveTab("new")}
            className="text-black bg-custom-yellow px-4 py-2 rounded-lg"
          >
            Record your first meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {meetings.map((meeting) => (
        <div
          key={meeting._id}
          className="bg-custom-black rounded-xl border border-gray-800 p-3 md:p-4 hover:border-custom-blue transition "
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-custom-black bg-custom-yellow px-3 py-1 rounded-full">
              MINUTE REGISTRY
            </span>
            <span className="text-xs text-gray-400">
              {new Date(meeting.meetingDate).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-white text-lg font-semibold mb-4">
            {meeting.meetingTitle}
          </h3>

          <div className="border-t border-gray-800 pt-4 mt-4 flex items-center justify-between text-sm">
            <div className="flex gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-custom-yellow" />
                <span>
                  <span className="text-white font-medium">
                    {meeting.membersPresent?.length || 0}
                  </span>{" "}
                  Attendees
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-custom-yellow" />
                <span>
                  <span className="text-white font-medium">
                    {meeting?.projectActionRegistry?.length || 0}
                  </span>{" "}
                  Projects
                </span>
              </div>
            </div>
            <p> </p>
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
                title="Edit"
                onClick={() => {
                  setEditId(meeting?._id);
                  setEditData(meeting);
                  setOpen(true)
                }}
              >
                <Edit2 size={16} />
              </button>

              <button
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                title="Delete"
                onClick={() => {
                  setEditId(meeting._id);
                  setIsConfirmOpen(true);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeetingHistory;
