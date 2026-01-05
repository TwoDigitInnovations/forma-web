import React, { useEffect, useState } from "react";
import {
  FolderPlus,
  Clock1,
  CircleAlert,
  TriangleAlert,
  Briefcase,
  ListCheck,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Api } from "@/services/service";
import { useContext } from "react";
import { ProjectDetailsContext } from "../_app";
import isAuth from "../../../components/isAuth";
import {
  ContractorDetails,
  Milestones,
  OpenIncient,
  ProjectActionPoints,
  ProjectGrievances,
  ProjectInformation,
} from "../../../components/AllComponents";

const ProjectDetailsPage = (props) => {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [projectData, setProjectData] = useState([]);
  const [milestones, setMilestones] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [openIncient, setOpenIncient] = useState(false);
  const [grievancesOpen, setGrievancesOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed._id === router.query.id) {
        setProjectdetails(parsed);
        setProjectData(parsed);
      }
    }
  }, [router.query.id]);

  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (id && !projectDetails?._id) {
      getProjectbyId(id);
    }
  }, [router.isReady, router.query.id, projectDetails]);

  const getProjectbyId = async (id) => {
    props.loader(true);
    Api("get", `project/getProjectById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setProjectData(res.data?.data);
          setProjectdetails(res.data?.data);
          localStorage.setItem(
            "projectDetails",
            JSON.stringify(res.data?.data)
          );
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  function formatTodayDate(d) {
    const date = new Date(d);
    if (isNaN(date)) return "Invalid Date";

    const day = date.getDate(),
      year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    const suffix = (n) =>
      n > 3 && n < 21 ? "th" : ["st", "nd", "rd"][(n % 10) - 1] || "th";

    return `${day}${suffix(day)} ${month}, ${year}`;
  }

  const formatSimpleDate = (d) => {
    const date = new Date(d);
    return isNaN(date)
      ? "Invalid Date"
      : `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  function getTotalDuration(start, end) {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return 0;

    const diffTime = endDate - startDate; // milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
    return diffDays;
  }

  const physical = 0;
  const time = 33;
  const financial = 0;

  const Card = ({ title, value, icon, Open }) => {
    return (
      <div className="flex flex-col w-full relative group cursor-pointer ">
        <div
          className="bg-custom-black space-y-2 rounded-2xl px-4 py-4 border hover:border-[#e0f349] border-gray-700 cursor-pointer transition-colors mb-3 z-10 min-h-[110px]"
          onClick={Open}
        >
          <div className="flex items-start justify-start gap-3 rounded-lg">
            <div className="bg-custom-green p-1.5 rounded-2xl">{icon}</div>
            <div>
              <p className="text-white text-md font-medium  tracking-wide">
                {title}
              </p>
              <p className="text-xl font-bold text-custom-yellow">{value}</p>

              <p
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                text-gray-200 text-[13px] font-medium tracking-wide"
              >
                Click for Details
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ActionCard = ({ icon, title, subtitle, text, open }) => {
    return (
      <div
        className="bg-custom-black rounded-2xl min-h-[250px] transition-colors p-4 border border-gray-500 hover:border-[#e0f349] cursor-pointer"
        onClick={open}
      >
        <div className="flex flex-col justify-start items-start">
          <div className="flex justify-start items-start gap-2 space-y-2">
            <span className="text-custom-yellow"> {icon}</span>
            <p className="text-white text-md">{title}</p>
          </div>
          <p className="text-white text-sm">{subtitle}</p>
        </div>

        <div className="min-h-[170px] flex justify-center items-center">
          <p className="text-white text-md"> {text}</p>
        </div>
      </div>
    );
  };

  const SecondCard = ({ title, value, subtitle }) => {
    return (
      <div className="bg-custom-black space-y-2 rounded-2xl px-4 py-4 border border-gray-700 hover:border-gray-600 transition-colors mb-3 z-10">
        <div className="flex flex-col items-start justify-start gap-1 rounded-lg">
          <p className="text-white text-md font-medium  tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-custom-yellow">${value}</p>
          <p className="text-gray-200 text-[13px] font-medium  tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-black text-white ">
      <div className="max-w-7xl mx-auto w-full h-full md:h-[95vh] overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 p-3 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="md:text-2xl text-[20px] font-bold text-[#e0f349]">
              {projectDetails.projectName}
            </h1>
            <button className="mt-1 py-1 px-4 flex text-sm cursor-pointer rounded-full bg-custom-yellow text-black">
              {projectDetails.status}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex bg-custom-gold text-black items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm md:text-md cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push(`/ProjectDetails/EditProject`)}
            >
              <FolderPlus size={28} />
              Edit Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-3 gap-2 mb-3">
          <Card
            title="Contractor"
            Open={() => setOpen(true)}
            value={
              projectDetails?.contractorInfo?.contractorName || "Not Assign"
            }
            icon={<Briefcase size={28} />}
          />

          {open && (
            <ProjectInformation
              projectInfo={projectDetails}
              onClose={() => setOpen(false)}
            />
          )}

          <Card
            title="Project Info/Status"
            value={projectDetails.status}
            Open={() => setIsOpen(true)}
            icon={<FileText size={28} />}
          />

          {isOpen && (
            <ContractorDetails
              projectInfo={projectDetails}
              onClose={() => setIsOpen(false)}
            />
          )}

          <div className="relative group bg-custom-black space-y-2 rounded-2xl px-4 py-4 border hover:border-[#e0f349] border-gray-700 cursor-pointer transition-colors mb-3 z-10 min-h-[110px]">
            <div
              className="flex items-start justify-start gap-3 rounded-lg"
              onClick={() => router.push("/ProjectDetails/Pre-construction")}
            >
              <div className="bg-custom-green p-1.5 rounded-2xl">
                <ListCheck size={28} />
              </div>
              <div>
                <p className="text-white text-md font-medium  tracking-wide">
                  Pre-Commencement
                </p>
                <p className="text-xl font-bold text-custom-yellow">
                  1 Pending
                </p>

                <p
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                text-gray-200 text-[13px] font-medium tracking-wide"
                >
                  Click for Details
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-3 gap-2 mb-3">
          <SecondCard
            title="Contract Amount"
            value={projectDetails?.contractAmount}
            subtitle="Total project value"
          />

          <SecondCard
            title="Amount Spent"
            value={projectDetails?.paidAmount}
            subtitle="From payment certificates"
          />
          <SecondCard
            title="Balance"
            value={projectDetails?.contractAmount - projectDetails?.paidAmount}
            subtitle="Remaining funds"
          />
          <SecondCard
            title="Advance Payment"
            value={projectDetails?.advancePayment}
            subtitle="All Advance Payment"
          />
        </div>

        <div className="bg-custom-black border border-white/10 rounded-2xl p-6 text-white min-h-[260px] ">
          <div className="mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              ↗ Progress Overview
            </h2>
            <p className="text-sm text-gray-400">
              Track project completion and timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="md:col-span-2 space-y-4 group relative:">
              <div
                className="group-hover:cursor-pointer"
                onClick={() => router.push("/ProjectDetails/ProgressUpdate")}
              >
                <div className="flex justify-between mb-2 text-sm">
                  <span className="group-hover:text-[#e0f349]">
                    Physical Progress
                  </span>
                  <span>{physical}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full transition-all"
                    style={{ width: `${physical}%` }}
                  />
                </div>
                <p
                  className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                text-gray-200 text-[13px] font-medium tracking-wide"
                >
                  Click for details
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Time Progress</span>
                  <span>{time}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-custom-yellow rounded-full transition-all"
                    style={{ width: `${time}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="group relative w-28 h-28 cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => router.push("/ProjectDetails/ProgressUpdate")}
              >
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="#2a2a2a"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="#ffffff"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={
                      2 * Math.PI * 50 - (financial / 100) * 2 * Math.PI * 50
                    }
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold group-hover:text-[#e0f349] transition-hover duration-200">
                    {financial}%
                  </span>
                  <span className="text-xs text-gray-400">Financial</span>
                </div>
                <p
                  className="text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                text-gray-200 text-[13px] font-medium tracking-wide"
                >
                  Click for IPCs
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <ActionCard
            title="Milestones"
            subtitle="Upcoming and overdue"
            icon={<Clock1 size={20} className="text-custom-yellow" />}
            text="No milestones due soon"
            open={() => setMilestones(true)}
          />
          <ActionCard
            title=" Overdue Action Points"
            subtitle="Missed deadlines"
            icon={<CircleAlert size={20} className="text-custom-yellow" />}
            text="No overdue action points"
            open={() => setActionOpen(true)}
          />
          <ActionCard
            title="Open incidents"
            subtitle="World Bank ESF compliance"
            icon={<TriangleAlert size={20} className="text-custom-yellow" />}
            text="No open incidents"
            open={() => setOpenIncient(true)}
          />
          <ActionCard
            title="No Open grievances"
            subtitle="Community complaints (GRM)"
            icon={<MessageSquare size={20} className="text-custom-yellow" />}
            text="No open grievances"
            open={() => setGrievancesOpen(true)}
          />

          {milestones && (
            <Milestones
              onclose={() => setMilestones(false)}
              loader={props.loader}
            />
          )}
          {openIncient && (
            <OpenIncient
              onclose={() => setOpenIncient(false)}
              loader={props.loader}
            />
          )}

          {grievancesOpen && (
            <ProjectGrievances
              onclose={() => setGrievancesOpen(false)}
              loader={props.loader}
            />
          )}

          {actionOpen && (
            <ProjectActionPoints
              onclose={() => setActionOpen(false)}
              loader={props.loader}
            />
          )}
        </div>

        <div className="bg-custom-black rounded-2xl p-6 mt-6">
          <h3 className="text-xl font-semibold text-white ">
            Client & Contractor Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            <div>
              <h4 className="text-white font-semibold mb-4">
                Contract Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Contract Amount</span>
                  <span className="text-white">
                    ${projectDetails?.contractAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Duration</span>
                  <span className="text-white">
                    {" "}
                    {getTotalDuration(
                      projectDetails?.startDate,
                      projectDetails?.endDate
                    )}{" "}
                    Days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Start Date</span>
                  <span className="text-white">
                    {formatTodayDate(projectDetails?.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">End Date</span>
                  <span className="text-white">
                    {formatTodayDate(projectDetails?.endDate)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">
                Contractor Details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white">Name</div>
                  <div className="text-white">
                    {" "}
                    {projectDetails?.contractorInfo?.contractorName}
                  </div>
                </div>
                <div>
                  <div className="text-white">Email</div>
                  <div className="text-white">
                    {projectDetails?.contractorInfo?.Email}
                  </div>
                </div>
                <div>
                  <div className="text-white">Phone</div>
                  <div className="text-white">
                    {projectDetails?.contractorInfo?.phone}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Clients Details</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white">Name</div>
                  <div className="text-white">
                    {projectDetails?.clientInfo?.ClientName}
                  </div>
                </div>
                <div>
                  <div className="text-white">Address</div>
                  <div className="text-white">
                    {projectDetails?.clientInfo?.Address}
                  </div>
                </div>
                <div>
                  <div className="text-white">Phone</div>
                  <div className="text-white">
                    {projectDetails?.clientInfo?.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default isAuth(ProjectDetailsPage);
