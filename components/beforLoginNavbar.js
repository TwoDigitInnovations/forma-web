import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { ChevronUp, Flame, LogOut, Menu, User2, X } from "lucide-react";
import { userContext } from "@/pages/_app";
import Swal from "sweetalert2";

function BeforeLoginNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#e0f349",
      customClass: {
        confirmButton: "px-12 rounded-xl",
        confirmButtonText: "text-black font-medium",
        title: "text-[20px] text-black",
        actions: "swal2-actions-no-hover",
        popup: "rounded-[15px] shadow-lg",
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: "350px",
    }).then(function (result) {
      if (result.isConfirmed) {
        logOut();
      }
    });
  };
  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Flame className="w-6 h-6 text-custom-yellow" />
          <span className="text-xl font-bold text-white">Forma</span>
        </div>
        {user?._id ? (
          <div className="relative hidden md:flex">
            
            <div
              className="flex items-center gap-2 cursor-pointer text-white"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                <User2 size={18} />
              </div>
              <span className="hidden sm:block">{user?.name}</span>
              <ChevronUp
                className={`ml-1 h-4 w-4 transition-transform ${
                  profileOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute left-0 top-8 mt-3 w-48 bg-[#0f1629] border border-gray-800 rounded-xl shadow-lg z-50">
                <button
                  onClick={() => router.push("/MyProfile")}
                  className="flex items-center space-x-3 w-full text-left px-4 py-2.5 text-sm text-gray-200 cursor-pointer"
                >
                  <User2 size={20} className="text-white" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center text-sm gap-3 px-4 py-2.5 text-white hover:bg-[#111827] rounded-xl cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <button
              style={{ backgroundColor: "#e0f349" }}
              className="px-5 py-2 rounded-lg text-black font-medium hover:opacity-90 transition-all cursor-pointer"
              onClick={() => router.push("/Ragister")}
            >
              Get Started
            </button>

            <button
              className="px-5 py-2 text-white hover:text-gray-300 border border-custom-yellow  rounded-lg transition-all cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
          </div>
        )}
        <div
          className="sm:hidden text-white cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 animate-fadeIn">
          {user?._id ? (
            <>
              <button
                onClick={() => router.push("/MyProfile")}
                className="flex items-center space-x-3 w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-100 cursor-pointer"
              >
                <User2 size={20} className="text-white" />
                <span>My Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center text-sm gap-3 px-4 py-2.5 text-white hover:bg-[#111827] rounded-xl cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div>
              <button
                style={{ backgroundColor: "#e0f349" }}
                className="px-5 py-2 rounded-lg text-black font-medium hover:opacity-90 w-full"
                onClick={() => {
                  router.push("/Ragister");
                  setMenuOpen(false);
                }}
              >
                Get Started
              </button>
              <button
                className="px-5 py-2 text-white cursor-pointer hover:text-gray-300 w-full border border-gray-700 rounded-lg"
                onClick={() => {
                  router.push("/login");
                  setMenuOpen(false);
                }}
              >
                Log In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default BeforeLoginNavbar;
