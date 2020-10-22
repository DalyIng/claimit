import React from "react";

import logo from "../../assets/claim_it/logo.svg";
import placeholder from "../../assets/claim_it/arts/placeholder.png";

export default function PermitExpired(props) {
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
              <div className="card_identity">
                <h1 className="card_title">Identity</h1>
                <h1 className="identity_text">
                  0x6e955b0EC6cCdC283bB46A8f908cE042898ce0Fc
                </h1>
              </div>
              <div className="card_identity_2">
                <h1 className="card_title_identity_2">Permit is expired</h1>
                <p className="card_p_identity_2">
                  it seems that this permit is not valid anymore.
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <img
                  src={placeholder}
                  alt="scan"
                  className="img-fluid placeholder"
                />
              </div>
              <div className="button_div">
                <button className="retry_button" onClick={props.handleNext}>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
