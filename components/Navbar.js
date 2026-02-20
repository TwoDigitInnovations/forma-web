import { userContext } from "@/pages/_app";
import { Bell, User,Search, User2, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiCalendarSlash, PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

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
        confirmButton: 'px-12 rounded-xl',
        title: 'text-[20px] text-black',
        actions: 'swal2-actions-no-hover',
        popup: 'rounded-[15px] shadow-lg'
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: '350px'
    }).then(function (result) {
      if (result.isConfirmed) {
        logOut();
      }
    });
  };

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
    // event.currentTarget.className = "error";
  };

  return (
    <nav className="w-full bg-custom-black z-0  shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:ps-8 xl:ps-6 ">
        <div className="flex items-center justify-between md:h-20 h-18">
          <div className="flex items-center gap-4">
            {/* <img 
              className="h-10 w-auto object-contain" 
              src="/logo.png" 
              alt="Logo"
              onClick={()=> router.push("/")}
            /> */}
            {/* <div className="p-2 rounded-2xl bg-custom-yellow text-black cursor-pointer"    onClick={()=> router.push("/dashboard")}> <Briefcase size={30}/></div>
            <div className="flex items-start flex-col">  
            <p className="text-2xl text-white font-bold">Forma</p>
            <p className="text-md text-white font-medium ">Construction Management</p>
            </div> */}
          </div>

          {user?._id && (
          <div className="hidden md:flex items-center justify-end flex-1">
            <div className="relative">
              <div
                className="flex items-center space-x-3  py-2 rounded-lg transition-colors duration-200"
              >
                
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#e0f349] flex-shrink-0 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={"/office-man.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-custom-yellow text-md">{user?.role}</p>
                </div>

              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                   <button
                    onClick={()=> router.push("/MyProfile")}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <User2 size={16} className="text-black" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <PiSignOutFill size={16} className="text-black" />
                    <span>Sign Out</span>
                  </button>

                </div>
              )}
            </div>
          </div>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden flex">
            <button
              onClick={() => setOpenTab(!openTab)}
              className="p-2 rounded-md text-white hover:bg-gray-100 focus:outline-none"
            >
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
