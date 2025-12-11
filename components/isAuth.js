import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    const publicRoutes = ["/planpage", "/login"];

    let currentPath = router.pathname.toLowerCase().replace(/\/$/, "");
    const isPublic = publicRoutes.includes(currentPath);

    useEffect(() => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userDetail");

      if (!token || !userData) {
        if (!isPublic) router.replace("/PlanPage");
        else setIsAuthorized(true);
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (!user || !user._id) {
          router.replace("/PlanPage");
          return;
        }

        setIsAuthorized(true);
      } catch {
        router.replace("/PlanPage");
      }
    }, [router.pathname]);

    if (isAuthorized === null && !isPublic) return null;

    return <Component {...props} />;
  };
};

export default isAuth;

