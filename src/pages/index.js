import React from "react";

import isAuth from "../../components/isAuth";
import TaskTrussLanding from "../../components/landingPage";

function Home(props) {
  return (
    <div>
      <TaskTrussLanding />
    </div>
  );
}

export default isAuth(Home);
