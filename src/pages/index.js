import React, { useContext, useEffect } from "react";

import isAuth from "../../components/isAuth";
import TaskTrussLanding from "../../components/landingPage";
import { userContext } from "./_app";
import { useRouter } from "next/router";

function Home(props) {
  const [user] = useContext(userContext);
  const router = useRouter();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDetail"));

    if (!user || !user._id) {
      router.replace("/");
      return;
    }

    const hasActiveSubscription =
      user.subscription &&
      user.subscription.status === "active" &&
      user.subscription.planEndDate &&
      new Date(user.subscription.planEndDate) > new Date();

    if (hasActiveSubscription) {
      router.replace("/dashboard");
    }
  }, []);
  return (
    <div>
      <TaskTrussLanding />
    </div>
  );
}

export default isAuth(Home);
