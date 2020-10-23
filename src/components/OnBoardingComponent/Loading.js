import React from "react";
import Lottie from "react-lottie";

import loader from "../../assets/claim_it/anims/loader.json";

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <Lottie options={defaultOptions} height={150} width={150} />
      </div>
    </div>
  );
}
