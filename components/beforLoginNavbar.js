import React, { useState } from "react";
import { useRouter } from "next/router";
import { Flame, Menu, X } from "lucide-react";

function BeforeLoginNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/PlanPage")}
        >
          <Flame className="w-6 h-6 text-custom-yellow" />
          <span className="text-xl font-bold text-white">Forma</span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-3">
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

        {/* Mobile Menu Icon */}
        <div className="sm:hidden text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 animate-fadeIn">
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
    </header>
  );
}

export default BeforeLoginNavbar;
