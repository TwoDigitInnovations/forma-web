import React from "react";
import { useRouter } from "next/router";
import { Flame } from "lucide-react";

function BeforeLoginNavbar() {
  const router = useRouter();

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

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button
            style={{ backgroundColor: "#e0f349" }}
            className="px-5 py-2 rounded-lg text-black font-medium hover:opacity-90 transition-all 
                       hidden sm:block"
            onClick={() => router.push("/Ragister")}
          >
            Get Started
          </button>

          <button
            className="px-5 py-2 text-white hover:text-gray-300 transition-all"
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="sm:hidden px-4 pb-4 flex flex-col gap-2">
        <button
          style={{ backgroundColor: "#e0f349" }}
          className="px-5 py-2 rounded-lg text-blackcursor-pointer font-medium hover:opacity-90 w-full"
          onClick={() => router.push("/Ragister")}
        >
          Get Started
        </button>

        <button
          className="px-5 py-2 cursor-pointer text-white hover:text-gray-300 w-full border border-gray-700 rounded-lg"
          onClick={() => router.push("/login")}
        >
          Log In
        </button>
      </div>
    </header>
  );
}

export default BeforeLoginNavbar;
