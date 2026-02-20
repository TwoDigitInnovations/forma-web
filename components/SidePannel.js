"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "@/pages/_app";
import Swal from "sweetalert2";

import {
  Menu,
  X,
  MoveLeft,
  User2,
  LogOut,
  User2Icon,
  Briefcase,
} from "lucide-react";
import {
  LayoutDashboard,
  Building,
  Users,
  NotebookPen,
  LoaderCircle,
  BrickWall,
  Dock,
  Settings,
  NotepadTextDashed,
} from "lucide-react";
import { MdCreditCard } from "react-icons/md";

const SIDEBAR_WIDTH = 280;

const SidePannel = ({ openTab, setOpenTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    setOpenTab(false);
  }, [router.pathname]);

  const logOut = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#e0f349",
      reverseButtons: true,
      width: "320px",
    }).then((result) => {
      if (result.isConfirmed) {
        setUser({});
        localStorage.removeItem("userDetail");
        localStorage.removeItem("token");
        router.push("/login");
      }
    });
  };

  // ======================
  // Main Menu
  // ======================
  const menuItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      img: <LayoutDashboard size={22} />,
      access: ["Admin", "Organization", "User", "TeamsMember"],
    },
    {
      href: "/project",
      title: "Project",
      img: <Building size={22} />,
      access: ["Organization", "User", "TeamsMember"],
    },
    {
      href: "/program",
      title: "Program",
      img: <Building size={22} />,
      access: ["Organization", "User", "TeamsMember"],
    },
    {
      href: "/teams",
      title: "Teams",
      img: <Users size={22} />,
      access: ["Organization"],
    },
    {
      href: "/meetingmintues",
      title: "Meeting Mintues",
      img: <NotepadTextDashed size={22} />,
      access: ["Organization", "User"],
    },
    {
      href: "/billingPage",
      title: "Billing",
      img: <MdCreditCard size={22} />,
      access: ["Organization", "User"],
    },
  ];

  // ======================
  // Project Details Menu
  // ======================
  const menuItemsProject = [
    {
      href: "/ProjectDetails/overview",
      title: "Overview",
      img: <LayoutDashboard size={22} />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/work-plan",
      title: "Work Plan",
      img: <NotebookPen size={22} />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/ProgressUpdate",
      title: "Progress",
      img: <LoaderCircle size={22} />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/Pre-construction",
      title: "Documents Checklist",
      img: <BrickWall size={22} />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/teams",
      title: "Teams",
      img: <Users size={22} />,
      access: ["User", "Organization"],
    },
    {
      href: "/ProjectDetails/documents",
      title: "Documents",
      img: <Dock size={22} />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/siteLogs",
      title: "Site Logs",
      img: <Settings size={22} />,
      access: ["User", "Organization", "TeamsMember"],
    },
  ];

  // Detect ProjectDetails route
  const isProjectDetailsRoute = router.pathname.startsWith("/ProjectDetails");

  const currentMenuItems = isProjectDetailsRoute ? menuItemsProject : menuItems;

  // Active route checker
  const isActive = (path) => router.pathname.startsWith(path);

  return (
    <>
      {/* <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-custom-green p-2 rounded"
        onClick={() => setOpenTab(true)}
      >
        <Menu className="text-white" />
      </button> */}
      <div
        className="hidden lg:flex fixed top-0 left-0 h-screen bg-custom-black z-40 flex-col"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="flex items-center gap-4 mb-6 mt-4 ms-4">
          <div
            className="p-2 rounded-2xl bg-custom-yellow text-black cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            {" "}
            <Briefcase size={30} />
          </div>
          <div className="flex items-start flex-col">
            <p className="text-2xl text-white font-bold">Forma</p>
            {/* <p className="text-md text-white font-medium ">
              Construction Management
            </p> */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {currentMenuItems.map(
            (item, i) =>
              item.access.includes(user?.role) && (
                <div
                  key={i}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-3 mx-3 my-1 px-3 py-3 rounded cursor-pointer
                  ${
                    isActive(item.href)
                      ? "bg-custom-green text-white"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-custom-yellow">{item.img}</span>
                  <span className="whitespace-nowrap">{item.title}</span>
                </div>
              ),
          )}

          {/* Back Button */}
          {isProjectDetailsRoute && (
            <div
              className="m-3 bg-custom-green flex items-center gap-3 justify-center rounded-lg cursor-pointer py-3"
              onClick={() => router.push("/project")}
            >
              <MoveLeft className="text-white" />
              <span className="text-white font-medium">Back to Project</span>
            </div>
          )}
        </div>
      </div>

      {openTab && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpenTab(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-[260px] bg-custom-black z-40 transform transition-transform duration-300 lg:hidden
        ${openTab ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-white/20 relative">
          <X
            className="absolute right-4 top-4 text-white cursor-pointer"
            onClick={() => setOpenTab(false)}
          />

          <p className="text-2xl text-custom-yellow font-bold">Forma</p>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
              <User2Icon size={24} className="text-black" />
            </div>
            <p className="text-white">{user?.name}</p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              className="flex items-center gap-2 text-white"
              onClick={() => router.push("/MyProfile")}
            >
              <User2 size={18} />
              My Profile
            </button>

            <button
              className="flex items-center gap-2 text-white"
              onClick={logOut}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        <div className="mt-2">
          {currentMenuItems.map(
            (item, i) =>
              item.access.includes(user?.role) && (
                <div
                  key={i}
                  onClick={() => router.push(item.href)}
                  className={`px-5 py-3 cursor-pointer
                  ${
                    isActive(item.href)
                      ? "bg-custom-yellow text-black rounded-xl m-2"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-custom-yellow">{item.img}</span>
                    {item.title}
                  </div>
                </div>
              ),
          )}

          {isProjectDetailsRoute && (
            <div
              className="px-5 py-4 text-white border-t border-white/20 cursor-pointer"
              onClick={() => router.push("/project")}
            >
              <div className="flex items-center gap-3">
                <MoveLeft />
                Back to Project
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidePannel;
