/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";
import BeforeLoginNavbar from "./beforLoginNavbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false);

  const isBeforeLoginPage =
    router.pathname.includes("/login") ||
    router.pathname.includes("/PlanPage"); // <- These two pages show BeforeLoginNavbar + Footer

  return (
    <div className="min-h-screen max-w-screen bg-white flex flex-col">

      {isBeforeLoginPage && <BeforeLoginNavbar />}

      {!isBeforeLoginPage && (
        <div className="flex w-full">
          <SidePannel setOpenTab={setOpenTab} openTab={openTab} />

          <div className="w-full xl:pl-[280px] md:pl-[250px] sm:pl-[200px]">
            <Navbar setOpenTab={setOpenTab} openTab={openTab} />
            {children}
          </div>
        </div>
      )}

      {isBeforeLoginPage && <main className="flex-1">{children}</main>}

      {isBeforeLoginPage && <Footer />}
    </div>
  );
};

export default Layout;
