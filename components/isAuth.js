import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component, allowedRoles = []) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    const publicRoutes = ["/", "/login", "/register", "/acceptInvite"];
    const path = router.pathname.toLowerCase();

    const isPublic = publicRoutes.some(
      (route) => path === route || path.startsWith(route + "/")
    );

    console.log(isPublic);
    
    useEffect(() => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userDetail");

      if (!token || !userData) {
        if (!isPublic) router.replace("/");
        else setIsAuthorized(true);
        return;
      }

      try {
        const user = JSON.parse(userData);

        if (!user?._id) {
          router.replace("/");
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          router.replace("/");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        router.replace("/");
      }
    }, [router.pathname]);

    if (isAuthorized === null && !isPublic) return null;

    return <Component {...props} />;
  };
};

export default isAuth;
