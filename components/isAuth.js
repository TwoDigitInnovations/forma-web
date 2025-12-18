import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component, allowedRoles = []) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    // 🌍 Public routes
    const publicRoutes = ["/", "/login", "/ragister"];

    const path = router.pathname.toLowerCase();
    const isPublic = publicRoutes.includes(path);

    useEffect(() => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userDetail");

      // ❌ Not logged in
      if (!token || !userData) {
        if (!isPublic) router.replace("/");
        else setIsAuthorized(true);
        return;
      }

      try {
        const user = JSON.parse(userData);

        // ❌ Invalid user
        if (!user?._id) {
          router.replace("/");
          return;
        }

        // 🔐 ROLE CHECK (if roles provided)
        if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role)
        ) {
          // unauthorized role
          router.replace("/"); // or /unauthorized
          return;
        }

        // ✅ All good
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
