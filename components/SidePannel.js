import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { userContext } from "@/pages/_app";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { Menu, MoreVertical } from "lucide-react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {
  BrickWall,
  Building,
  Dock,
  LayoutDashboard,
  LoaderCircle,
  MoveLeft,
  NotebookPen,
  NotepadTextDashed,
  Settings,
  User2,
  Users,
  X,
} from "lucide-react";
import { MdCreditCard } from "react-icons/md";

const SidePannel = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null); // desktop submenu state
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null); // mobile submenu state

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      img: <LayoutDashboard size={25} />,
      access: ["Admin", "Organization", "User", "TeamsMember"],
    },
    {
      href: "/project",
      title: "Project",
      img: <Building size={25} />,
      access: ["Organization", "User", "TeamsMember"],
    },

    {
      href: "/teams",
      title: "Teams",
      img: <Users size={25} />,
      access: ["Organization"],
    },
    {
      href: "/meetingmintues",
      title: "Meeting Mintues",
      img: <NotepadTextDashed size={25} />,
      access: ["Organization", "User"],
    },
    {
      href: "/billingPage",
      title: "Billing",
      img: <MdCreditCard size={25} />,
      access: ["Organization", "User"],
    },
  ];

  const menuItemsProject = [
    {
      href: "/ProjectDetails/overview",
      title: "Overview",
      img: <LayoutDashboard className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/work-plan",
      title: "Work Plan",
      img: <NotebookPen className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/ProgressUpdate",
      title: "Progress",
      img: <LoaderCircle className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/Pre-construction",
      title: "Documents Checklist",
      img: <BrickWall className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/teams",
      title: "Teams",
      img: <Users className="text-3xl" />,
      access: ["User", "Organization"],
    },
    {
      href: "/ProjectDetails/documents",
      title: "Documents",
      img: <Dock className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/siteLogs",
      title: "Site Logs",
      img: <Settings className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
  ];

  const imageOnError = (event) => {
    // event.currentTarget.src = "/userprofile.png";
  };

  const isProjectDetailsRoute = router.pathname.includes("ProjectDetails");

  const currentMenuItems = isProjectDetailsRoute ? menuItemsProject : menuItems;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div
        className={`
    fixed top-0 left-0 z-20
    bg-custom-black
    transition-all duration-300 ease-in-out
    hidden sm:flex flex-col overflow-y-scroll scrollbar-hide overflow-scroll 
    ${isSidebarOpen ? "w-[260px] h-screen" : "h-10"}
  `}
      >
        <div className="flex items-center justify-start ps-6 py-5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-custom-yellow text-2xl cursor-pointer"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <ul className="flex flex-col gap-1 mt-2">
            {currentMenuItems.map((item, i) =>
              item?.access?.includes(user?.role) ? (
                <li key={i}>
                  <div
                    className={`flex items-center gap-4 mx-3 px-3 py-3 cursor-pointer rounded-md
                hover:bg-[#dff34940]
                ${
                  router.pathname === item.href
                    ? "bg-custom-green text-white"
                    : "text-white"
                }
              `}
                    onClick={() => {
                      if (item.children) {
                        setOpenMenu(openMenu === i ? null : i);
                      } else {
                        router.push(item.href);
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    {isSidebarOpen && (
                      <span className="text-custom-yellow text-xl min-w-[24px] flex justify-center">
                        {item.img}
                      </span>
                    )}

                    {isSidebarOpen && (
                      <span className="whitespace-nowrap font-medium">
                        {item.title}
                      </span>
                    )}

                    {/* ARROW */}
                    {item.children && isSidebarOpen && (
                      <span className="ml-auto">
                        {openMenu === i ? (
                          <IoIosArrowDown />
                        ) : (
                          <IoIosArrowForward />
                        )}
                      </span>
                    )}
                  </div>

                  {/* CHILD */}
                  {item.children && openMenu === i && isSidebarOpen && (
                    <ul className="ml-12">
                      {item.children.map((child, j) => (
                        <li key={j}>
                          <Link
                            href={child.href}
                            className={`block py-2 px-4 my-1 rounded text-sm
                        hover:bg-custom-orange
                        ${
                          router.pathname === child.href
                            ? "bg-custom-orange text-black font-semibold"
                            : "text-gray-300"
                        }
                      `}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : null,
            )}

            {isProjectDetailsRoute && isSidebarOpen && (
              <div
                className="m-3  bg-custom-green flex items-center gap-3 justify-center rounded-lg cursor-pointer py-3 "
                onClick={() => {
                  router.push("/project");
                  setIsSidebarOpen(false);
                }}
              >
                <MoveLeft className="text-white" />
                <span className="text-white font-medium">Back to Project</span>
              </div>
            )}
          </ul>
        </div>
      </div>

      <div
        className={`
    fixed top-0 left-0 z-40 sm:hidden
    h-screen w-full
    bg-custom-black
    transform transition-transform duration-300 ease-in-out
    ${openTab ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <div className="relative border-b border-white/20">
          <X
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
            onClick={() => setOpenTab(false)}
          />

          <div className="p-4 space-y-4">
            <p className="text-3xl font-bold text-custom-yellow">Forma</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white">
                  <img
                    src="/office-man.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <p className="text-white font-semibold">{user?.name}</p>
              </div>

              {user?._id ? (
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => {
                      setOpenTab(false);
                      router.push("/MyProfile");
                    }}
                    className="flex items-center gap-2 text-white font-semibold"
                  >
                    <User2 size={20} />
                    My Profile
                  </button>

                  <button
                    className="flex items-center gap-2 text-white font-semibold"
                    onClick={() => {
                      Swal.fire({
                        text: "Are you sure you want to logout?",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        confirmButtonColor: "#e0f349",
                        customClass: {
                          confirmButton: "px-10 rounded-xl text-black",
                          popup: "rounded-xl shadow-custom-green",
                        },
                        reverseButtons: true,
                        width: "320px",
                      }).then((result) => {
                        if (result.isConfirmed) logOut();
                      });
                    }}
                  >
                    <PiSignOutFill size={22} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setOpenTab(false)}>
                  <p className="text-white font-bold">Login</p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-white/10">
            {currentMenuItems.map((item, i) =>
              item?.access?.includes(user?.role) ? (
                <li key={i}>
                  <div
                    className="flex items-center justify-between px-5 py-4 text-white cursor-pointer active:bg-white/10"
                    onClick={() =>
                      item.children
                        ? setMobileOpenMenu(mobileOpenMenu === i ? null : i)
                        : (setOpenTab(false), router.push(item.href))
                    }
                  >
                    <div className="flex items-center gap-4 font-semibold">
                      <span className="text-custom-yellow text-lg">
                        {item.img}
                      </span>
                      {item.title}
                    </div>

                    {item.children &&
                      (mobileOpenMenu === i ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      ))}
                  </div>

                  {item.children && mobileOpenMenu === i && (
                    <ul className="bg-white/95">
                      {item.children.map((child, j) => (
                        <li key={j}>
                          <Link
                            href={child.href}
                            onClick={() => setOpenTab(false)}
                            className={`
                        block py-3 pl-14 text-sm font-medium
                        ${
                          router.pathname === child.href
                            ? "bg-custom-orange text-black"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : null,
            )}
          </ul>
        </div>

        {isProjectDetailsRoute && (
          <div
            className="border-t border-white/20 p-4 bg-custom-black"
            onClick={() => {
              setOpenTab(false);
              router.push("/project");
            }}
          >
            <div className="flex items-center gap-3 text-white font-semibold cursor-pointer">
              <MoveLeft />
              Back to Project
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidePannel;
