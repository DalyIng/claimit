import React from "react";

// import Lottie from "react-lottie";

import Landing from "./Landing";

// import loader from "../../assets/claim_it/anims/loader.json";

export default function OnBoardingComponent() {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: loader,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  return (
    <div>
      <Landing />
      {/* <div>
        <Lottie options={defaultOptions} height={400} width={400} />
      </div> */}
    </div>
  );
}
