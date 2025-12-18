import React, { useContext } from "react";

import isAuth from "../../components/isAuth";
import TaskTrussLanding from "../../components/landingPage";
import { userContext } from "./_app";
import { useRouter } from "next/router";

function Home(props) {
  const [user] = useContext(userContext);
  const router = useRouter();


  if (user && user._id) {
    return router.push("/PlanPage");
  }

  return (
    <div>
      <TaskTrussLanding />
    </div>
  );
}

export default isAuth(Home);
