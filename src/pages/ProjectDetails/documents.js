import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FileWarning,
  MapPin,
  NotepadText,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { ProjectDetailsContext } from "../_app";
import isAuth from "../../../components/isAuth";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../components/AllComponents";

const documents = (props) => {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useState({});
  const [projectId, setProjectId] = useState("");
  const [SelectedType, setSelectedType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);

      setProjectId(project._id);
      getAllDocuments(project._id);
      getProjectbyId(project._id);
    }
  }, []);

  const getProjectbyId = async (id) => {
    props.loader(true);
    Api("get", `project/getProjectById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const project = res.data?.data;
          setProjectdetails(project);
          localStorage.setItem("projectDetails", JSON.stringify(project));
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const options = [
    {
      label: "Monthly Progress Report",
      icon: "📄",
      links: "meetingMinutes",
      type: "monthly-progress-report",
    },
    {
      label: "Taking Over Certificate",
      icon: "📄",
      links: "/",
      type: "taking-over-certificate",
    },
    {
      label: "Commencement Order",
      icon: "📝",
      links: "/",
      type: "commencement-order",
    },
    {
      label: "Instruction Letter",
      icon: "✉️",
      links: "InstructionLetter",
      type: "instruction-letter",
    },
    {
      label: "Meeting Minutes",
      icon: "👥",
      links: "meetingMinutes",
      type: "meeting-minutes",
    },
  ];

  const routeMap = {
    "meeting-minutes": "/ProjectDetails/documents/meetingMinutes",
    "instruction-letter": "/ProjectDetails/documents/InstructionLetter",
    "monthly-progress-report":
      "/ProjectDetails/documents/MonthlyProgressReport",
    "taking-over-certificate":
      "/ProjectDetails/documents/TakingOverCertificate",
    "commencement-order": "/ProjectDetails/documents/CommencementOrder",
  };

  const handleRoute = (doc) => {
    const baseRoute = routeMap[doc.type];

    if (!baseRoute) {
      console.error("Invalid document type:", doc.type);
      return;
    }
    console.log(`${baseRoute}?type=${doc.type}&editId=${doc._id}`);
    router.push(`${baseRoute}?type=${doc.type}&editId=${doc._id}`);
  };

  const getAllDocuments = async (id) => {
    const projectId = id;
    props.loader(true);
    Api("get", `documents/getAllproject/${projectId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const data = res.data?.data;
          setDocuments(data);
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const handleDelete = () => {
    props.loader(true);
    Api("delete", `documents/delete/${deleteId}`)
      .then((res) => {
        if (res?.status === true) {
          toast.success("Documents deleted");
          getAllDocuments(projectId);
        } else {
          toast.error("Failed to delete item");
        }
        props.loader(false);
      })
      .catch(() => {
        props.loader(false);
        toast.error("Error deleting item");
      });
  };

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-0 md:py-6 p-4  mx-auto">
        <div className="bg-[#DFF34940] py-4 px-6  rounded-[16px] ">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap items-center md:gap-4 gap-1">
              <p className="text-white text-2xl"> Project Documents</p>
              <h1 className="md:text-[14px] text-[13px] font-bold text-white flex items-center gap-2">
                {projectDetails.projectName}
                <span className="ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1">
                  <MapPin size={15} /> {projectDetails.location}
                </span>
              </h1>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full justify-center bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
              >
                <Plus size={18} />
                Create New Document
              </button>

              {isOpen && (
                <div className="absolute mt-2 right-0 w-60 bg-black rounded-xl shadow-lg p-2 z-50">
                  {options.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm"
                      onClick={() => {
                        const baseRoute = routeMap[item.type];
                        router.push(`${baseRoute}?type=${item.type}`);
                        console.log(`${baseRoute}?type=${item.type}`);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-lg text-white">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {documents.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {documents.length} documents created
            </p>
          )}
        </div>
        <div className="mt-6 bg-custom-black rounded-[18px] md:px-6 px-3 pt-4 pb-6 min-h-[600px] flex flex-col">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center min-h-[500px]">
              <div className="bg-neutral-800 p-4 rounded-full mb-4">
                <FileWarning size={40} className="text-gray-300" />
              </div>

              <h3 className="text-lg font-semibold text-white">
                No Documents Found
              </h3>

              <p className="text-gray-400 text-sm mt-1 max-w-sm">
                You haven’t created any documents yet. Create your first
                document using the "Create New Document" button.
              </p>
            </div>
          ) : (
            <>
              <div className="w-full text-white min-h-[500px]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <NotepadText className="text-custom-yellow" />
                      <p className="font-semibold text-lg">
                        Monthly Progress Report
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {documents.length} documents
                    </p>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-12 py-3 border-b border-gray-700 text-gray-300 text-sm font-medium">
                  <div className="col-span-6 font-bold text-xl">
                    Document Name
                  </div>
                  <div className="col-span-3 font-bold text-xl">Created</div>
                  <div className="col-span-3 font-bold text-xl">Actions</div>
                </div>

                <div className="mt-2">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="
                        grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0
                        py-4  rounded-lg border-b border-gray-800
                        
                        transition-all
                        text-gray-300 text-sm"
                    >
                      <div className="md:col-span-6 font-medium truncate">
                        {doc.name}
                      </div>

                      <div className="md:col-span-3 text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      <div className="md:col-span-3 flex gap-2 md:justify-start justify-end">
                       
                        <button
                          className="px-3 py-2 rounded-lg border cursor-pointer border-gray-600 hover:bg-gray-800 text-xs md:text-sm"
                          onClick={() => handleRoute(doc)}
                        >
                          View
                        </button>

                        <button
                          className="px-3 py-2 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-900/30 text-xs cursor-pointer md:text-sm"
                          onClick={() => handleRoute(doc)}
                        >
                          Edit
                        </button>

                        <button
                          className="px-3 py-2 rounded-lg border border-red-500 text-red-400 cursor-pointer hover:bg-red-900/30 text-xs md:text-sm"
                          onClick={() => {
                            setDeleteId(doc._id);
                            setIsConfirmOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={isConfirmOpen}
          setIsOpen={setIsConfirmOpen}
          title="Delete Documents"
          message={`Are you sure you want to delete this"?`}
          onConfirm={handleDelete}
          yesText="Delete"
          noText="Cancel"
        />
      </div>
    </div>
  );
};

export default isAuth(documents);
