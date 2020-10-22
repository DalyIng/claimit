import React from "react";
import Lottie from "react-lottie";

import logo from "../../assets/claim_it/logo.svg";
import success from "../../assets/claim_it/anims/success.json";

export default function ResultSuccess(props) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="main">
      <div className="triangle" />
      <div className="container-xl">
        <div className="row">
          <div className="col-10 offset-1 items_aligned_identity">
            <img
              style={{ height: "40px", width: "40px" }}
              src={logo}
              alt="logo"
            />
            <h1 className="title_identity">ClaimIT</h1>
          </div>
          <div className="col-xl-8 offset-xl-2 col-12 mt-50">
            <div className="card_main">
              <div>
                <Lottie options={defaultOptions} height={150} width={150} />
              </div>
              <div className="card_identity_2">
                <h1 className="card_title_identity_2">Vehicule is allowed</h1>
                <p className="card_p_identity_2">
                  the scanned permit is valid and this vehicule s currently
                  allowed to be used with this card.
                </p>
              </div>
              <div className="cardResult">
                <h1 className="card_titleResult">Identity</h1>
                <h1 className="identity_textResult">
                  {props.identityAddress}
                </h1>
                <hr className="divider" />
                <h1 className="card_titleResult">License plate</h1>
                <h1 className="identity_textResult">{props.plateNumber}</h1>
              </div>
              <div className="button_div">
                <button className="retry_button" onClick={props.reset}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
