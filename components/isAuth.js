import { useEffect } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    let auth = false;

    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userDetail");
      const token = localStorage.getItem("token");

      if (user) {
        const u = JSON.parse(user);
        const token = localStorage.getItem("token");
        if (
          router?.pathname === "/" 
        ) {
          auth =
            token && (u?.role === "Admin" || u?.role === "Provider")
              ? true
              : false;
        } else {
          auth = token && u?.role === "Admin" ? true : false;
        }
      }
    }

    useEffect(() => {
      if (!auth) {
        localStorage.clear();
        router.replace("/login");
      }
    }, []);

    return <Component {...props} />;
  };
};

export default isAuth;
