import React, { useState, useEffect, useContext } from "react";
import { MapPin, Plus, Save, Trash2 } from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { ProjectDetailsContext } from "../_app";
import isAuth from "../../../components/isAuth";

const documents = (props) => {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
    }
  }, []);

  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 md:px-8 mx-auto">
        <div className="bg-[#DFF34940] py-4 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center md:gap-4 gap-1">
            <p className="text-white text-2xl"> Documents</p>
            <h1 className="md:text-[14px] text-[13px] font-bold text-white flex items-center gap-2">
              {projectDetails.projectName}
              <span className="ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1">
                <MapPin size={15} /> {projectDetails.location}
              </span>
            </h1>
          </div>
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="w-full justify-center bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
            >
              <Plus size={18} />
              Create New Documents
            </button>
          </div>
        </div>

        <div className="mt-6 bg-custom-black rounded-[18px] md:px-6 px-3 pt-4 pb-6 min-h-[700px] md:min-h-[600px]"></div>
      </div>
    </div>
  );
};

export default isAuth(documents);
