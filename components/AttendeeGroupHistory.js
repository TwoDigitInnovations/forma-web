import { Users, Edit2, Trash2 } from "lucide-react";
import React from "react";

function AttendeeGroupHistory({
  groups = [],
  setActiveTab,
  setIsConfirmOpen,
  setEditId,
  setEditData,
  setOpen,
}) {
  if (!groups.length) {
    return (
      <div className="bg-[#f5f6fa] rounded-lg border border-gray-200 shadow-2xl flex items-center justify-center md:h-[500px] h-[650px]">
        <div className="text-center">
          <Users size={64} className="mx-auto text-blue-500 mb-4" />
          <p className="text-gray-800 mb-4">No attendee groups created yet.</p>
          <button
            onClick={() => setActiveTab("attendee-group")}
            className="text-white bg-blue-500 px-4 py-2 rounded-lg"
          >
            Create your first group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups.map((group) => (
        <div
          key={group._id}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:border-custom-blue hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-wider text-white bg-blue-500 px-3 py-1 rounded-full font-semibold">
              ATTENDEE GROUP
            </span>

            <span className="text-xs text-black">
              {new Date(group.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-black text-lg font-semibold mb-1 line-clamp-1">
            {group.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 min-h-[20px]">
            {group.attendees?.length > 0 ? (
              <>
                {group.attendees.slice(0, 3).map((a, index) => (
                  <span key={index}>
                    {a.name}
                    {index < group.attendees.slice(0, 3).length - 1 && ", "}
                  </span>
                ))}
                {group.attendees.length > 3 && " ..."}
              </>
            ) : (
              "No members added"
            )}
          </p>

          <div className="border-t border-gray-800 pt-3 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-5 text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                <span>
                  <span className="text-gray-800 font-medium">
                    {group.attendees?.length || 0}
                  </span>{" "}
                  Members
                </span>
              </div>

              {group.createdBy && (
                <div className="hidden sm:block">
                  <span className="text-gray-800">By </span>
                  <span className="text-gray-800 font-medium">
                    {group.createdBy?.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg bg-gray-800 cursor-pointer hover:bg-gray-700 text-gray-300 hover:text-white transition"
                title="Edit"
                onClick={() => {
                  setEditId(group._id);
                  setEditData(group);
                  setOpen(true);
                }}
              >
                <Edit2 size={16} />
              </button>

              <button
                className="p-2 rounded-lg bg-red-500/10 cursor-pointer hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                title="Delete"
                onClick={() => {
                  setEditId(group._id);
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

export default AttendeeGroupHistory;
