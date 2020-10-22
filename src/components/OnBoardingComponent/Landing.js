import React, { useState } from "react";
import QrReader from "react-qr-reader";

import logo from "../../assets/claim_it/logo.svg";

export default function Landing(props) {
  const [scanning, setScanning] = useState(false); // QrCode scanner

  const handleOpenScanner = () => {
    setScanning(!scanning);
  };

  return (
    <div className="main">
      <div className="triangle" />
      <div className="container-xl">
        <div className="row">
          <div className="col-12 items_aligned">
            <img
              style={{ height: "50px", width: "50px" }}
              src={logo}
              alt="logo"
            />
            <h1 className="title">
              ClaimIT
              <br />
              <span className="subtitle">Digital disabled parking permit</span>
            </h1>
          </div>
          <div className="col-xl-8 offset-xl-2 col-12 mt-50">
            <div className="card_main">
              <div className="card_1">
                {scanning ? (
                  <QrReader
                    delay={1500}
                    onError={props.handleError}
                    onScan={props.handleScan}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <React.Fragment>
                    <h1 className="card_title">Easy, reliabe</h1>
                    <h1 className="card_subtitle">Here's how to check it</h1>
                    <ol className="list_1">
                      <li>
                        <span className="list_span">
                          Scan QR code present on the vehicule
                        </span>
                      </li>
                      <li>
                        <span className="list_span">
                          Scan license plate of vehicule
                        </span>
                      </li>
                      <li>
                        <span className="list_span">
                          Get parking permit status
                        </span>
                      </li>
                    </ol>
                  </React.Fragment>
                )}
              </div>
              <div className="card_2">
                <h1 className="card_title_2">Benefits</h1>
                <ul className="list_2">
                  <li>
                    <span className="list_span">
                      Reduction of the administrative burden for the disabled
                      persons
                    </span>
                  </li>
                  <li>
                    <span className="list_span">
                      Reduction of the administrative workload for the
                      administration
                    </span>
                  </li>
                  <li>
                    <span className="list_span">
                      Police force can verify the authenticity of the claim
                    </span>
                  </li>
                </ul>
              </div>
              <hr className="solid" />
              <div style={{ textAlign: "center", paddingTop: "20px" }}>
                <button className="link">Get a disabled parking permit</button>
              </div>
              <div className="button_div">
                <button className="scan_button" onClick={handleOpenScanner}>
                  {scanning ? <span>Scanning</span> : <span>Scan QR code</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
