import React, { useContext, useEffect, useState } from "react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userContext } from "@/pages/_app";

const AddAttendeeGroupForm = ({
  setIsOpen,
  loader,
  getAllGroups,
  editItem,
}) => {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    attendees: [
      {
        name: "",
        designation: "",
        organization: "",
      },
    ],
  });

  useEffect(() => {
    if (!editItem) return;

    setFormData({
      title: editItem.title || "",
      attendees:
        editItem.attendees?.length > 0
          ? editItem.attendees
          : [{ name: "", designation: "", organization: "" }],
    });

    setEditId(editItem._id);
  }, [editItem]);

  const handleTitleChange = (e) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };


  const handleAttendeeChange = (index, field, value) => {
    const updated = [...formData.attendees];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, attendees: updated }));
  };

  const addAttendee = () => {
    setFormData((prev) => ({
      ...prev,
      attendees: [
        ...prev.attendees,
        { name: "", designation: "", organization: "" },
      ],
    }));
  };

  const removeAttendee = (index) => {
    const updated = formData.attendees.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, attendees: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Group title is required");
    }

    loader(true);

    const data = {
      ...formData,
      createdBy: user._id,
    };

    const url = editId
      ? `attendee/update/${editId}`
      : `attendee/create`;

    Api(editId ? "put" : "post", url, data, router)
      .then((res) => {
        loader(false);

        if (res?.status) {
          toast.success(
            `Attendee group ${editId ? "updated" : "created"} successfully`
          );
          getAllGroups();
          setIsOpen(false);
        } else {
          toast.error(res?.message || "Operation failed");
        }
      })
      .catch((err) => {
        loader(false);
        toast.error(err?.message || "Something went wrong");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-1">
          {editId ? "Update" : "Add"} Attendee Group
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Create a reusable attendee group for meeting minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Title */}
          <label className="text-sm">Group Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg"
            placeholder="e.g. Weekly Client Meeting"
            required
          />

          {/* Attendees */}
          <div>
            <label className="text-sm mb-2 block">Attendees</label>

            {formData.attendees.map((attendee, index) => (
              <div
                key={index}
                className="grid md:grid-cols-3 gap-2 mb-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={attendee.name}
                  onChange={(e) =>
                    handleAttendeeChange(index, "name", e.target.value)
                  }
                  className="px-3 py-2 bg-[#5F5F5F] rounded"
                />

                <input
                  type="text"
                  placeholder="Designation"
                  value={attendee.designation}
                  onChange={(e) =>
                    handleAttendeeChange(
                      index,
                      "designation",
                      e.target.value
                    )
                  }
                  className="px-3 py-2 bg-[#5F5F5F] rounded"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Organization"
                    value={attendee.organization}
                    onChange={(e) =>
                      handleAttendeeChange(
                        index,
                        "organization",
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 bg-[#5F5F5F] rounded"
                  />

                  {formData.attendees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttendee(index)}
                      className="px-2 bg-red-500 rounded"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAttendee}
              className="mt-2 text-sm cursor-pointer bg-custom-yellow text-black px-3 py-2  rounded"
            >
              + Add Attendee
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 cursor-pointer  text-sm rounded-lg bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-3 text-sm rounded-lg cursor-pointer bg-custom-yellow text-black"
            >
              {editId ? "Update" : "Create"} Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendeeGroupForm;
