import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Building,
  Handshake,
  CircleCheck,
  Pickaxe,
  FolderPlus,
  DollarSign,
  Dock,
  PiggyBank,
  Clock,
  MessageSquare,
  StickyNote,
  SquareCheckBig,
} from "lucide-react";
import { Api } from "@/services/service";
import isAuth from "../../components/isAuth";
import { userContext } from "./_app";
import Listproject from "../../components/Listproject";
import { toast } from "react-toastify";
import CreateProject from "../../components/CreateProject";
import {
  ActionPoints,
  AllGrievances,
  AllIncident,
  ProjectBehind,
} from "../../components/AllComponents";

function Dashboard(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const [allProjectData, setAllProjectData] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [projectBehind, setProjectBehind] = useState(false);
  const [grievancesOpen, setGrievancesOpen] = useState(false);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("userDetail");

    if (!userStr) {
      setChecking(false);
      router.replace("/");
      return;
    }

    const user = JSON.parse(userStr);

    let isSubscriptionInvalid = false;

    if (user.role === "TeamsMember" && user.OrganizationId) {
      const org = user.OrganizationId;
      isSubscriptionInvalid =
        !org.subscription ||
        org.subscription.status !== "active" ||
        new Date(org.subscription.planEndDate) <= new Date();
    } else {
      isSubscriptionInvalid =
        !user.subscription ||
        user.subscription.status !== "active" ||
        new Date(user.subscription.planEndDate) <= new Date();
    }

    if (isSubscriptionInvalid) {
      router.push("/PlanPage");
    }

    setChecking(false);
  }, []);

  // if (checking) {
  //   return <div className="text-white">Loading dashboard...</div>;
  // }

  useEffect(() => {
    getAllProject();
  }, []);

  const [AllActionPoints, setAllActionPoints] = useState([]);
  const [AllActionPointsLength, setAllActionPointsLength] = useState([]);
  const [AllBehiendProject, setAllBehiendProject] = useState([]);
  const [projectId, setProjectID] = useState("all");

  useEffect(() => {
    getActionPoints();
    getDashboardData();
    getAllBehindProjects();
  }, [projectId]);

  const getActionPoints = async (e) => {
    props?.loader(true);
    Api(
      "get",
      `action-Point/getAllActionPoints?projectId=${projectId}`,
      "",
      router,
    )
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const data = res.data?.data;
          setAllActionPoints(data);

          const filtered = data.filter(
            (item) => item.status === "Open" || item.status === "In-Progress",
          );

          setAllActionPointsLength(filtered.length);
        } else {
          toast.error(res?.message || "Failed to created status");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const getAllBehindProjects = async (e) => {
    props?.loader(true);
    Api("get", `project/getAllBehindProjects`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setAllBehiendProject(res.data?.data);
        } else {
          toast.error(res?.message || "Failed");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const getDashboardData = async (e) => {
    props?.loader(true);
    Api("get", `user/dashboardData`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setDashboardData(res.data?.data);
        } else {
          toast.error(res?.message || "Failed");
        }
      })
      .catch((err) => {
        props.loader(false);
        // toast.error(err?.message || "An error occurred");
      });
  };

  const getAllProject = async () => {
    props?.loader(true);
    Api("get", `project/getAllProjects?OrganizationId=${user?._id}`, "", router)
      .then((res) => {
        props?.loader(false);
        if (res?.status === true) {
          setAllProjectData(res?.data?.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch projects");
        }
      })
      .catch((err) => {
        props?.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  console.log(AllBehiendProject);

  return (
    <section className=" bg-[#000000] md:py-4 py-4 p-3 text-white h-screen z-0">
      <div className="h-full space-y-3 md:space-y-4 overflow-y-scroll scrollbar-hide overflow-scroll pb-28 ">
        <div className="bg-custom-black md:py-6 py-4 md:px-6 px-3 flex flex-col md:flex-row gap-4 md:items-center justify-between rounded-[16px] mb-4">
          <div>
            <h1 className="text-3xl font-bold text-custom-yellow">Dashboard</h1>
            <p className="md:text-[16px] text-[14px] text-white ">
              Key financial and project metrics overview.
            </p>
          </div>

          <button
            className="w-fit flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
            onClick={() => setIsOpen(true)}
          >
            <FolderPlus size={28} />
            New Project
          </button>

          {isOpen && (
            <CreateProject
              setIsOpen={setIsOpen}
              loader={props?.loader}
              getAllProject={getAllProject}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-2">
          <DarkStatsCard
            title="Total Contracts"
            value={dashboardData?.TotalContracts || "100.00"}
            subtitle="Sum of all contract amounts"
            icon={<DollarSign size={35} />}
          />
          <DarkStatsCard
            title="IPCs Paid"
            value={dashboardData?.TotalPaid || "100.00"}
            subtitle="Total payment certificates"
            icon={<Dock size={35} />}
          />
          <DarkStatsCard
            title="Balance"
            value={dashboardData?.TotalBalance || "100.00"}
            subtitle="Contracts - IPCs paid"
            icon={<PiggyBank size={35} />}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4">
          <div
            className="bg-custom-black  rounded-2xl md:px-4 px-3 md:py-6 py-3 border border-gray-700 transition-colors mb-3 z-10 cursor-pointer hover:border-[#e0f349]"
            onClick={() => setProjectBehind(true)}
          >
            <div className="flex flex-col md:flex-row items-start justify-start gap-3 rounded-lg">
              <div className="bg-custom-green p-2 rounded-2xl">
                <Clock />
              </div>
              <div>
                <p className="text-white text-md font-medium  tracking-wide">
                  Projects Behind
                </p>
                <p className="text-2xl font-bold text-custom-yellow">
                  {AllBehiendProject?.totalBehindProjects || 0}
                </p>
                <p className="text-gray-200 text-[13px] font-medium  tracking-wide">
                  Click to view Details
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-custom-black  rounded-2xl px-4 py-6 border border-gray-700  transition-colors mb-3 z-10 cursor-pointer hover:border-[#e0f349]"
            onClick={() => setIncidentOpen(true)}
          >
            <div className="flex flex-col md:flex-row items-start justify-start gap-3 rounded-lg">
              <div className="bg-custom-green p-2 rounded-2xl">
                <StickyNote />
              </div>
              <div>
                <p className="text-white text-md font-medium  tracking-wide">
                  Incidents
                </p>
                <p className="text-2xl font-bold text-custom-yellow">0</p>
                <p className="text-gray-200 text-[12px] font-medium ">
                  Severe: 0
                </p>
                <p className="text-gray-200 text-[12px] font-medium ">
                  Serious: 0
                </p>
                <p className="text-gray-200 text-[12px] font-medium ">
                  Indicative: 0
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-custom-black  rounded-2xl px-4 py-6 border border-gray-700  transition-colors mb-3 z-10 cursor-pointer hover:border-[#e0f349]"
            onClick={() => setGrievancesOpen(true)}
          >
            <div className="flex flex-col md:flex-row items-start justify-start gap-3 rounded-lg">
              <div className="bg-custom-green p-2 rounded-2xl">
                <MessageSquare />
              </div>
              <div>
                <p className="text-white text-md font-medium  tracking-wide">
                  Grievances
                </p>
                <p className="text-2xl font-bold text-custom-yellow">0</p>
                <p className="text-gray-200 text-[12px] font-medium ">
                  Registered: 0
                </p>
                <p className="text-gray-200 text-[12px] font-medium ">
                  Investigating: 0
                </p>
                <p className="text-gray-200 text-[12px] font-medium ">
                  Escalated: 0
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-custom-black  rounded-2xl px-4 py-6 border-2 border-gray-700  transition-colors mb-3 z-10 cursor-pointer hover:border-[#e0f349]"
            onClick={() => {
              getActionPoints();
              setActionOpen(true);
            }}
          >
            <div className="flex flex-col md:flex-row items-start justify-start gap-3 rounded-lg">
              <div className="bg-custom-green p-2 rounded-2xl">
                <SquareCheckBig />
              </div>
              <div>
                <p className="text-white text-md font-medium  tracking-wide">
                  Action points
                </p>
                <p className="text-2xl font-bold text-custom-yellow">
                  {AllActionPointsLength}
                </p>
                <p className="text-gray-200 text-[13px] font-medium  tracking-wide">
                  Open Task to complete
                </p>
              </div>
            </div>
          </div>

          {incidentOpen && (
            <AllIncident
              onclose={() => setIncidentOpen(false)}
              loader={props.loader}
            />
          )}
          {projectBehind && (
            <ProjectBehind
              onclose={() => setProjectBehind(false)}
              loader={props.loader}
              AllBehiendProject={AllBehiendProject}
            />
          )}

          {grievancesOpen && (
            <AllGrievances
              onclose={() => setGrievancesOpen(false)}
              loader={props.loader}
            />
          )}

          {actionOpen && (
            <ActionPoints
              onclose={() => {
                setProjectID("all");
                getActionPoints();
                setActionOpen(false);
              }}
              projects={allProjectData}
              projectId={projectId}
              setProjectID={setProjectID}
              AllActionPoints={AllActionPoints}
            />
          )}
        </div>

        <Listproject
          allProjectData={allProjectData}
          loader={props.loader}
          getAllProject={getAllProject}
        />
      </div>
    </section>
  );
}

export default isAuth(Dashboard, [
  "Organization",
  "User",
  "TeamsMember",
  "Admin",
]);

const DarkStatsCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="flex flex-col w-full relative ">
      <div className="bg-custom-black space-y-2 rounded-2xl px-4 py-6 border border-gray-700 hover:border-gray-600 transition-colors mb-3 z-10">
        <div className="flex items-start justify-start gap-3 rounded-lg">
          <div className="bg-custom-green p-2 rounded-2xl">{icon}</div>
          <div>
            <p className="text-white text-md font-medium  tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold text-custom-yellow">${value}</p>
            <p className="text-gray-200 text-[13px] font-medium  tracking-wide">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
