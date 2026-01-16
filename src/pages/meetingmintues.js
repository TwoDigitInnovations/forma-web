import React, { useState, useEffect, useContext } from "react";
import {
  FileText,
  History,
  Users,
  UserPlus,
  List,
  Plus,
  MessageSquare,
  Briefcase,
  Trash2,
  Save,
} from "lucide-react";
import { Api } from "@/services/service";
import isAuth from "../../components/isAuth";
import MeetingHistory from "../../components/MeetingHistory";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import moment from "moment";
import { ConfirmModal } from "../../components/AllComponents";
import dynamic from "next/dynamic";
import project from "./project";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const MeetingDocumentation = (props) => {
  const [activeTab, setActiveTab] = useState("new");
  const [meetings, setMeetings] = useState([]);
  const [user] = useContext(userContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [AllProjectData, setAllProjectData] = useState([]);
  const [editId, setEditId] = useState("");
  const [editData, setEditData] = useState({});
  const router = useRouter();
  const [AllActionPoints, setAllActionPoints] = useState([]);
  const [projectId, setProjectID] = useState(null);

  const [meetingTitle, setMeetingTitle] = useState();
  const [meetingDate, setMeetingDate] = useState();
  const [membersPresent, setMembersPresent] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [discussions, setDiscussions] = useState({});

  // useEffect(() => {
  //   if (AllProjectData) {
  //     setProjectID(AllProjectData[0]?._id);
  //   }
  // }, []);

  console.log(AllProjectData[0]?._id);

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
      `Project Review Meeting - ${moment().format("DD MMM YYYY, hh:mm A")}`
    );
    setMeetingDate(new Date().toISOString().split("T")[0]);
    setMembersPresent([
      { name: user?.name, designation: "Admin", Organization: "" },
    ]);
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

  const getActionPoints = async (id) => {
    props?.loader(true);

    Api("get", `action-Point/getAllActionPoints?projectId=${id}`, "", router)
      .then((res) => {
        props.loader(false);

        if (res?.status === true) {
          const filteredData = (res.data?.data || []).filter(
            (item) => item.status !== "Completed"
          );

          setAllActionPoints(filteredData);

          const mappedActions = filteredData.map((item) => ({
            actionItemDescription: item.description || "",
            responsiblePerson: item.assignedTo || "",
            deadline: item.dueDate || "",
            status: item.status || "Open",
            priority: item.priority || "medium",
          }));

          setActionRegistry([
            {
              projectId: id,
              actions: mappedActions.length
                ? mappedActions
                : [
                    {
                      actionItemDescription: "",
                      responsiblePerson: "",
                      deadline: "",
                      status: "Open",
                      priority: "medium",
                    },
                  ],
            },
          ]);
        } else {
          toast.error(res?.message || "Failed to fetch action points");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  console.log(AllActionPoints);

  const editorConfig = {
    height: 300,
    toolbarAdaptive: false,
    toolbarSticky: true,
    toolbarButtonSize: "middle",
    readonly: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    enableDragAndDropFileToEditor: true,
    allowPasteImages: true,
    useNativeTooltip: false,
    spellcheck: true,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "fontsize",
      "font",
      "paragraph",
      "brush",
      "|",
      "left",
      "center",
      "right",
      "justify",
      "|",
      "ul",
      "ol",
      "indent",
      "outdent",
      "|",
      "link",
      "image",
      "video",
      "table",
      "hr",
      "emoji",
      "|",
      "undo",
      "redo",
      "|",
      "cut",
      "copy",
      "paste",
      "|",
      "brush",
      "background",
      "|",
      "source",
      "fullsize",
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    clipboard: {
      matchVisual: false,
    },
    removeButtons: ["about"],
  };

  const updateRegistry = (index, field, value) => {
    setActionRegistry((prev) =>
      prev.map((registry, i) =>
        i === index ? { ...registry, [field]: value } : registry
      )
    );
  };

  const removeActionRegistry = (index) => {
    setActionRegistry((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
  };

  const [actionRegistry, setActionRegistry] = useState([
    {
      projectId: "",
      actions: [
        {
          actionItemDescription: "",
          responsiblePerson: "",
          deadline: "",
          status: "pending",
        },
      ],
    },
  ]);

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
                  status: "pending",
                },
              ],
            }
          : registry
      )
    );
  };

  useEffect(() => {
    if (activeTab === "history") {
      getAllMeetings();
    }
  }, [activeTab]);

  useEffect(() => {
    getAllProject();
  }, []);

  const getAllProject = async (e) => {
    props.loader(true);
    Api("get", `project/getAllProjects?OrganizationId=${user._id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const data = res.data?.data;
          setAllProjectData(data);
          setProjectID(data[0]?._id);
          getActionPoints(data[0]?._id);
          setActionRegistry([
            {
              projectId: data[0]?._id,
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
    const id = editId;
    props.loader(true);
    Api("delete", `meeting-minutes/deleteMeetingMinutes/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(
            res?.data?.message || "Meeting minutes deleted successfully"
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
        router
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

  const addMember = () => {
    setMembersPresent([
      ...membersPresent,
      { name: "", designation: "", Organization: "" },
    ]);
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
          i === actionIndex ? { ...action, [field]: value } : action
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
                (_, aIndex) => aIndex !== actionIndex
              ),
            }
          : registry
      )
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
      (a) => !a.title || a.title.trim() === ""
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
      meetingDiscussions: meetingDiscussionsPayload, // ✅ FIXED
      projectActionRegistry: actionRegistry,
      status: "saved",
    };

    const url = editId
      ? `meeting-minutes/updateMeetingMinutes/${editId}`
      : "meeting-minutes/createMeetingMinutes";

    try {
      const res = await Api("post", url, meetingData, router);

      if (res?.status === true) {
        toast.success("Meeting saved successfully!");
        setActiveTab("history");
        setEditData({});
        setEditId("");
      }
    } catch (err) {
      console.error("Failed to save meeting", err);
      toast.error(err?.message || "Save failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 md:px-6 px-4 py-6">
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
      <div className="border-b border-gray-800 md:px-6 px-4">
        <div className="flex gap-8">
          <button
            onClick={() => {
              resetToDefaults();
              getAllProject();
              setActiveTab("new");
            }}
            className={`flex items-center gap-2 py-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === "new"
                ? "border-custom-yellow text-custom-yellow cursor-pointer"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileText size={18} />
            {editId ? "Update" : "New"} Meeting
          </button>
          <button
            onClick={() => {
              setEditData({});
              setEditId("");
              setActiveTab("history");
            }}
            className={`flex items-center gap-2 py-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === "history"
                ? "border-custom-yellow text-custom-yellow"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <History size={18} />
            Meeting History
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {activeTab === "new" ? (
          <div className="space-y-6">
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
              </div>
            </div>

            <div className="bg-custom-black rounded-lg p-3 md:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                  <Users size={18} />
                  MEMBERS PRESENT
                </div>
                <button
                  onClick={addMember}
                  className="flex items-center gap-2 px-4 py-2 text-custom-yellow hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <UserPlus size={16} />
                  Add Attendee
                </button>
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
                        value={member.Organization}
                        onChange={(e) =>
                          updateMember(index, "Organization", e.target.value)
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
                    <div className="text-black">
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
        e.target.value
      );
    }}
    className="
      w-full
      bg-transparent
      outline-none
      resize-none
      overflow-hidden
      text-white
      leading-relaxed
    "
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
                                    e.target.value
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
                                    e.target.value
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
                                    e.target.value
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
                                    e.target.value
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
                              {/* <button
                                onClick={() =>
                                  removeActionItem(registryIndex, itemIndex)
                                }
                                className="text-gray-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button> */}
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
        ) : (
          <MeetingHistory
            meetings={meetings}
            setActiveTab={setActiveTab}
            setEditId={setEditId}
            setIsConfirmOpen={setIsConfirmOpen}
            setEditData={setEditData}
          />
        )}
      </div>

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
