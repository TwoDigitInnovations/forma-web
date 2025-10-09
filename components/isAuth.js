import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userDetail");

      if (!token || !userData) {

        redirectToLogin();
        return;
      }
      console.log(token, userData);
      try {
        const user = JSON.parse(userData);
        if (!user || !user._id) {
          redirectToLogin();
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        redirectToLogin();
      }
    }, []);

    const redirectToLogin = () => {
      localStorage.clear();
      setIsAuthorized(false);
      router.replace("/login");
    };

    if (isAuthorized === null) return null;

    return isAuthorized ? <Component {...props} /> : null;
  };
};

export default isAuth;
