import { Flame } from "lucide-react";
import React from "react";

function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-800">
    
        <div
          className="flex items-center gap-2"
          onClick={() => router.push("/PlanPage")}
        >
          <Flame className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-lg text-black">Forma</span>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right text-black">
          © 2025 Forma Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
