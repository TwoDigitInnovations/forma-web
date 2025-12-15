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

  // pages without any navbar / footer / sidebar
  const withOutNavbar = router.pathname.includes("/Ragister");

  // before login pages (but NOT register)
  const isBeforeLoginPage =
    !withOutNavbar &&
    (router.pathname.includes("/login") ||
      router.pathname.includes("/PlanPage"));

  return (
    <div className="min-h-screen max-w-screen bg-white flex flex-col">
      {/* ONLY CONTENT (No navbar, no footer, no sidebar) */}
      {withOutNavbar && <main className="flex-1">{children}</main>}

      {/* BEFORE LOGIN PAGES */}
      {isBeforeLoginPage && (
        <>
          <BeforeLoginNavbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </>
      )}

      {/* AFTER LOGIN (Dashboard Layout) */}
      {!withOutNavbar && !isBeforeLoginPage && (
        <div className="flex w-full flex-1">
          <SidePannel setOpenTab={setOpenTab} openTab={openTab} />

          <div className="w-full xl:pl-[280px] md:pl-[250px] sm:pl-[200px]">
            <Navbar setOpenTab={setOpenTab} openTab={openTab} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
