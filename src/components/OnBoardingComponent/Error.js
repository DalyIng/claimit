import React from "react";
import Lottie from "react-lottie";

import error from "../../assets/claim_it/anims/error.json";

export default function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: error,
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
      <Lottie options={defaultOptions} height={150} width={150} />
    </div>
  );
}
