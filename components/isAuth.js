import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    // ❗ PlanPage NOT public
    const publicRoutes = ["/", "/login", "/ragister",""];

    const path = router.pathname.toLowerCase();
    const isPublic = publicRoutes.includes(path);

    useEffect(() => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userDetail");

      if (!token || !userData) {
        if (!isPublic) {
          router.replace("/");
        } else {
          setIsAuthorized(true);
        }
        return;
      }
      try {
        const user = JSON.parse(userData);
        if (!user?._id) {
          router.replace("/");
          return;
        }

        setIsAuthorized(true);
      } catch {
        router.replace("/");
      }
    }, [router.pathname]);

    if (isAuthorized === null && !isPublic) return null;

    return <Component {...props} />;
  };
};

export default isAuth;
