import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";
import BeforeLoginNavbar from "./beforLoginNavbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (!mounted) return null; // ⬅️ hydration safe guard

  const path = router.pathname.toLowerCase();

  const publicLayoutRoutes = [
    "/",
    "/planpage",
    "/login",
    "/checkout",
    "/forgotpassword",
    "/myprofile",
  ];
  const withoutLayoutRoutes = ["/ragister", "/acceptinvite"];

  const isWithoutLayout = withoutLayoutRoutes.includes(path);
  const isPublicLayout = publicLayoutRoutes.includes(path);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {isPublicLayout && (
        <>
          <BeforeLoginNavbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </>
      )}

      {isWithoutLayout && (
        <main className="flex-1 min-h-screen">{children}</main>
      )}

      {!isPublicLayout && token && (
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
