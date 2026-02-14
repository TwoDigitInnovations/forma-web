import React, { useState, useEffect, useContext } from "react";
import {
  FileText,
  Users,
  UserPlus,
  List,
  Plus,
  MessageSquare,
  Briefcase,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import moment from "moment";
import { userContext } from "@/pages/_app";

function meetingmintues({
  setOpen,
  getAllMeetings,
  editData,
  allGroups,
  setEditData,
  close,
  editId,
  setEditId,
}) {
  const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

  const [user] = useContext(userContext);
  const [AllProjectData, setAllProjectData] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [actionRegistry, setActionRegistry] = useState([
    {
      projectId: "",
      actions: [
        {
          actionItemDescription: "",
          responsiblePerson: "",
          deadline: "",
          status: "Open",
        },
      ],
    },
  ]);
  const router = useRouter();
  const [AllActionPoints, setAllActionPoints] = useState([]);
  const [projectId, setProjectID] = useState(null);

  const [meetingTitle, setMeetingTitle] = useState();
  const [meetingDate, setMeetingDate] = useState();
  const [membersPresent, setMembersPresent] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [discussions, setDiscussions] = useState({});

  const defaultAdmin = {
    name: user?.name,
    designation: "Admin",
    organization: "",
  };

  useEffect(() => {
    if (!editData || Object.keys(editData).length === 0) {
      resetToDefaults();
      return;
    }
    if (editData) {
      setAgendas(editData.agendas ?? []);

      const mappedDiscussions = {};

      (editData.agendas ?? []).forEach((agenda, index) => {
        mappedDiscussions[index] =
          editData.meetingDiscussions?.[agenda.order] ?? "";
      });

      setDiscussions(mappedDiscussions);
    }

    setMembersPresent(editData.membersPresent ?? []);
    setMeetingDate(editData.meetingDate ?? "");
    setMeetingTitle(editData.meetingTitle ?? "");
    setActionRegistry(editData?.projectActionRegistry || []);
  }, [editData]);

  const resetToDefaults = () => {
    setMeetingTitle(
      `Project Review Meeting - ${moment().format("DD MMM YYYY, hh:mm A")}`,
    );
    setMeetingDate(new Date().toISOString().split("T")[0]);
    setMembersPresent([defaultAdmin]);
    setAgendas([{ title: "Review physical progress", order: 1 }]);

    setDiscussions({
      0: "", // index-based key
    });
  };

  useEffect(() => {
    if (projectId) {
      getActionPoints(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    getAllProject();
  }, []);

  const getActionPoints = async (id) => {
    // props?.loader(true);

    Api("get", `action-Point/getAllActionPoints?projectId=${id}`, "", router)
      .then((res) => {
        // props.loader(false);

        if (res?.status === true) {
          const filteredData = (res.data?.data || []).filter(
            (item) => item.status !== "Completed",
          );

          setAllActionPoints(filteredData);

          const mappedActions = filteredData.map((item) => ({
            actionItemDescription: item.description || "",
            responsiblePerson: item.assignedTo || "",
            deadline: item.dueDate || "",
            status: item.status || "",
            priority: item.priority || "",
          }));
          console.log(mappedActions);

          setActionRegistry([
            {
              projectId: id,
              actions: mappedActions,
            },
          ]);
        } else {
          toast.error(res?.message || "Failed to fetch action points");
        }
      })
      .catch((err) => {
        // props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const editorConfig = {
    height: 250,
    readonly: false,
    toolbarAdaptive: false,
    toolbarSticky: false,
    spellcheck: true,

    buttons: ["bold", "ul", "ol"],

    removeButtons: [
      "source",
      "image",
      "video",
      "table",
      "link",
      "brush",
      "font",
      "fontsize",
      "paragraph",
      "fullsize",
    ],

    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
  };

  const updateRegistry = (index, field, value) => {
    setActionRegistry((prev) =>
      prev.map((registry, i) =>
        i === index ? { ...registry, [field]: value } : registry,
      ),
    );
  };

  const removeActionRegistry = (index) => {
    setActionRegistry((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  };

  const addNewActionItem = (registryIndex) => {
    setActionRegistry((prev) =>
      prev.map((registry, index) =>
        index === registryIndex
          ? {
              ...registry,
              actions: [
                ...registry.actions,
                {
                  actionItemDescription: "",
                  responsiblePerson: "",
                  deadline: "",
                  status: "Open",
                },
              ],
            }
          : registry,
      ),
    );
  };

  const updateMember = (index, field, value) => {
    const updated = [...membersPresent];
    updated[index][field] = value;
    setMembersPresent(updated);
  };

  const removeMember = (index) => {
    setMembersPresent(membersPresent.filter((_, i) => i !== index));
  };

  const addAgenda = () => {
    setAgendas([...agendas, { title: "", order: agendas.length + 1 }]);
  };

  const updateAgenda = (index, value) => {
    const updated = [...agendas];
    updated[index].title = value;
    setAgendas(updated);
  };

  const removeAgenda = (index) => {
    setAgendas(agendas.filter((_, i) => i !== index));
  };

  const addActionItem = () => {
    setActionRegistry([
      ...actionRegistry,
      {
        projectId: "",
        actions: [
          {
            actionItemDescription: "",
            responsiblePerson: "",
            deadline: "",
            status: "Open",
          },
        ],
      },
    ]);
  };

  const updateActionItem = (projectIndex, actionIndex, field, value) => {
    setActionRegistry((prev) => {
      const updated = [...prev];

      updated[projectIndex] = {
        ...updated[projectIndex],
        actions: updated[projectIndex].actions.map((action, i) =>
          i === actionIndex ? { ...action, [field]: value } : action,
        ),
      };

      return updated;
    });
  };

  const removeActionItem = (registryIndex, actionIndex) => {
    setActionRegistry((prev) =>
      prev.map((registry, rIndex) =>
        rIndex === registryIndex
          ? {
              ...registry,
              actions: registry.actions.filter(
                (_, aIndex) => aIndex !== actionIndex,
              ),
            }
          : registry,
      ),
    );
  };

  const saveMeeting = async () => {
    if (!meetingTitle || meetingTitle.trim() === "") {
      toast.error("Meeting title is required");
      return;
    }

    if (!meetingDate) {
      toast.error("Meeting date is required");
      return;
    }

    if (!Array.isArray(membersPresent) || membersPresent.length === 0) {
      toast.error("Please add at least one member");
      return;
    }

    if (!Array.isArray(agendas) || agendas.length === 0) {
      toast.error("Please add at least one agenda");
      return;
    }

    const hasEmptyAgenda = agendas.some(
      (a) => !a.title || a.title.trim() === "",
    );

    if (hasEmptyAgenda) {
      toast.error("Agenda title cannot be empty");
      return;
    }
    const meetingDiscussionsPayload = {};

    agendas.forEach((agenda, index) => {
      meetingDiscussionsPayload[agenda.order] = discussions[index] || "";
    });

    const meetingData = {
      meetingTitle,
      meetingDate,
      membersPresent,
      agendas,
      attendeeGroupId: selectedGroupId,
      meetingDiscussions: meetingDiscussionsPayload,
      projectActionRegistry: actionRegistry,
      status: "saved",
    };

    const url = editId
      ? `meeting-minutes/updateMeetingMinutes/${editId}`
      : "meeting-minutes/createMeetingMinutes";

    try {
      const res = await Api("post", url, meetingData, router);

      if (res?.status === true) {
        toast.success(
          editId
            ? "Meeting Updated successfully"
            : "Meeting saved successfully!",
        );
        setEditData({});
        setEditId("");
        getAllMeetings();
        setOpen(false);
      }
    } catch (err) {
      console.error("Failed to save meeting", err);
      toast.error(err?.message || "Save failed");
    }
  };

  const getAllProject = async (e) => {
    Api("get", `project/getAllProjects?OrganizationId=${user._id}`, "", router)
      .then((res) => {
        if (res?.status === true) {
          const data = res.data?.data;
          setAllProjectData(data);
          setProjectID(data[0]?._id);
          getActionPoints(data[0]?._id);
        } else {
          toast.error(res?.message || "Failed to created status");
        }
      })
      .catch((err) => {
        toast.error(err?.message || "An error occurred");
      });
  };

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);

    const selectedGroup = allGroups.find(
      (group) => group._id.toString() === groupId,
    );

    if (selectedGroup && selectedGroup.attendees?.length > 0) {
      const groupMembers = selectedGroup.attendees.map((att) => ({
        name: att.name || "",
        designation: att.designation || "",
        organization: att.organization || "",
      }));

      setMembersPresent([defaultAdmin, ...groupMembers]);
    } else {
      setMembersPresent([
        {
          name: "",
          designation: "",
          organization: "",
        },
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full h-full overflow-y-auto scrollbar-hide flex items-center justify-center py-6 ">
        <div className="bg-custom-black text-white rounded-[18px] p-3md:p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto scrollbar-hide space-y-6 ">
          <div className="bg-custom-black rounded-lg p-3 md:p-6 border border-gray-800">
            <div className="flex md:flex-row flex-col gap-3 items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                  <FileText size={14} />
                  CREATE MEETING MINUTES
                </div>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-none outline-none w-full text-white"
                  placeholder="Enter meeting title"
                />
              </div>

              <button
                onClick={saveMeeting}
                className="flex items-center gap-2 px-6 md:py-3 py-2 bg-custom-yellow text-black rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <Save size={18} />
                {editId ? "Update & Sync" : "Save & Sync"}
              </button>
              <button
                onClick={close}
                className="flex items-center gap-2 px-6 md:py-3 py-2 bg-custom-yellow text-black rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>

          <div className="bg-custom-black rounded-lg p-3 md:p-6 border border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 rounded-xl p-4 shadow-sm">
            
              <div className="flex items-center gap-2">
                <div className="bg-black/5 rounded-lg">
                  <Users size={18} className="text-white" />
                </div>
                <p className="text-gray-100 text-md font-semibold tracking-wide">
                  MEMBERS PRESENT
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <select
                  className="w-full h-[42px] border border-gray-300 rounded-lg px-3 pr-8 outline-none bg-custom-green text-white text-sm font-medium focus:border-black transition"
                  value={selectedGroupId}
                  onChange={handleGroupChange}
                >
                  <option value="">Select Group</option>

                  {allGroups?.map((group) => (
                    <option key={group._id} value={group._id} className="text-black">
                      {group.title}
                    </option>
                  ))}
                </select>

                {/* Custom Arrow */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 uppercase font-semibold px-4">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-4">Designation / Role</div>
                <div className="col-span-3">Organization</div>
                <div className="col-span-1"></div>
              </div>

              {membersPresent.map((member, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center bg-custom-green rounded-lg md:p-4 p-2.5"
                >
                  <div className="col-span-1 text-gray-400">{index + 1}</div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, "name", e.target.value)
                      }
                      className="w-full bg-transparent border-none outline-none text-white"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={member.designation}
                      onChange={(e) =>
                        updateMember(index, "designation", e.target.value)
                      }
                      className="w-full bg-transparent border-none outline-none text-gray-400"
                      placeholder="Enter role"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={member.organization}
                      onChange={(e) =>
                        updateMember(index, "organization", e.target.value)
                      }
                      className="w-full bg-transparent border-none outline-none text-gray-400"
                      placeholder="Enter Organization"
                    />
                  </div>
                  <div className="col-span-1">
                    {membersPresent.length > 1 && (
                      <button
                        onClick={() => removeMember(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-custom-black rounded-lg p-3 md:p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                <List size={18} />
                AGENDAS
              </div>
              <button
                onClick={addAgenda}
                className="flex items-center gap-2 px-4 py-2 text-custom-yellow hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add Agenda Topic
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 uppercase font-semibold px-4">
                <div className="col-span-1">#</div>
                <div className="col-span-10">Agenda Description</div>
                <div className="col-span-1"></div>
              </div>

              {agendas.map((agenda, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center bg-custom-green rounded-lg md:p-4 p-2.5"
                >
                  <div className="col-span-1 text-gray-400">{index + 1}</div>
                  <div className="col-span-10">
                    <input
                      type="text"
                      value={agenda.title}
                      onChange={(e) => updateAgenda(index, e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-white"
                      placeholder="Enter agenda topic"
                    />
                  </div>
                  <div className="col-span-1">
                    {agendas.length > 1 && (
                      <button
                        onClick={() => removeAgenda(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-custom-black rounded-lg p-3 md:p-6 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-6">
              <MessageSquare size={18} />
              MEETING DISCUSSIONS
            </div>

            <div className="space-y-6">
              {agendas.map((agenda, index) => (
                <div key={index}>
                  <div className="text-sm font-semibold mb-3">
                    {index + 1}. {agenda.title.toUpperCase()}
                  </div>
                  <div className="text-black bg-cusom-black">
                    <JoditEditor
                      value={discussions[index] || ""}
                      config={{
                        ...editorConfig,
                        placeholder: `Summary of what was discussed regarding "${agenda.title}"...`,
                      }}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setDiscussions((prev) => ({
                          ...prev,
                          [index]: newContent,
                        }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-custom-black rounded-lg p-3 md:p-6 border border-gray-800">
            <div className="flex md:flex-row flex-col gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                <Briefcase size={18} />
                PROJECT ACTION REGISTRY
              </div>
              <button
                onClick={addActionItem}
                className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-lg font-semibold transition-colors"
              >
                <Plus size={16} />
                Assign Action Points to Project
              </button>
            </div>

            {actionRegistry?.map((registry, registryIndex) => (
              <div
                key={registryIndex}
                className="mb-6 pb-6 border-b border-gray-800 last:border-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <select
                      value={registry.projectId}
                      required
                      onChange={(e) => {
                        const projectId = e.target.value;

                        updateRegistry(registryIndex, "projectId", projectId);
                        setProjectID(projectId);
                      }}
                      className="bg-gray-800 text-custom-yellow px-4 py-2 rounded-lg border border-gray-700 outline-none"
                    >
                      <option value="">Select Project</option>

                      {AllProjectData?.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>

                    <span className="text-xs text-gray-500 uppercase">
                      Action Registry
                    </span>
                  </div>

                  <button
                    onClick={() => removeActionRegistry(registryIndex)}
                    className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase font-semibold">
                        <th className="px-4 py-2 text-left w-10">#</th>
                        <th className="px-4 py-2 text-left">
                          Action Item Description
                        </th>
                        <th className="px-4 py-2 text-left">
                          Responsible Person
                        </th>
                        <th className="px-4 py-2 text-left">Deadline</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Priority</th>
                        <th className="px-4 py-2 text-left w-10"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {registry?.actions?.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          className="bg-custom-green rounded-lg"
                        >
                          <td className="px-4 py-3 text-gray-400">
                            {itemIndex + 1}
                          </td>

                          <td className="px-4 py-3">
                            <textarea
                              rows={1}
                              value={item.actionItemDescription}
                              onChange={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;

                                updateActionItem(
                                  registryIndex,
                                  itemIndex,
                                  "actionItemDescription",
                                  e.target.value,
                                );
                              }}
                              className="w-full bg-transparent outline-none
      resize-none
      overflow-hidden
      text-white
      leading-relaxed"
                              placeholder="Describe action item"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.responsiblePerson}
                              onChange={(e) =>
                                updateActionItem(
                                  registryIndex,
                                  itemIndex,
                                  "responsiblePerson",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none text-gray-400"
                              placeholder="Assign person"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              type="date"
                              value={
                                item.deadline
                                  ? new Date(item.deadline)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                updateActionItem(
                                  registryIndex,
                                  itemIndex,
                                  "deadline",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none text-gray-400"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateActionItem(
                                  registryIndex,
                                  itemIndex,
                                  "status",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none text-gray-400"
                            >
                              <option value="Open">Open</option>
                              <option value="In-Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.priority}
                              onChange={(e) =>
                                updateActionItem(
                                  registryIndex,
                                  itemIndex,
                                  "priority",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none text-gray-400"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>

                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                removeActionItem(registryIndex, itemIndex)
                              }
                              className="text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => addNewActionItem(registryIndex)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors w-full justify-center border border-gray-800"
                >
                  <Plus size={16} />
                  CREATE NEW ACTION POINT
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default meetingmintues;
