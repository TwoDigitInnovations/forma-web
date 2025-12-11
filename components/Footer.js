import { Flame } from "lucide-react";
import React from "react";

function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2"
          onClick={() => router.push("/PlanPage")}
        >
          <Flame className="w-5 h-5 text-custom-yellow" />
          <span className="font-medium text-lg text-white">Forma</span>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right">
          © 2025 Forma Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
