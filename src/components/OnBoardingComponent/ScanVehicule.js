import React, { useState } from "react";
import Camera, { IMAGE_TYPES, FACING_MODES } from "react-html5-camera-photo";

import "react-html5-camera-photo/build/css/index.css";

import logo from "../../assets/claim_it/logo.svg";
import scan from "../../assets/claim_it/arts/scan.png";

export default function ScanVehicule(props) {
  const [scanning, setScanning] = useState(false); // QrCode scanner

  const handleTakePhoto = async (dataUri) => {
    props.setLoading(true);
    setScanning(false);
    console.log("INFO - Photo taken");
    props.setPlateImage(dataUri);
    await props.getPlateNumber(dataUri);
    props.setLoading(false);
  };

  const handleOpenCamera = () => {
    setScanning(!scanning);
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
              {scanning ? (
                <div style={{ margin: "100px 0 100px 0", textAlign: "center" }}>
                  <Camera
                    onTakePhoto={(dataUri) => {
                      handleTakePhoto(dataUri);
                    }}
                    idealFacingMode={FACING_MODES.ENVIRONMENT}
                    idealResolution={{ width: "100%", height: "100%" }}
                    imageType={IMAGE_TYPES.PNG}
                    imageCompression={0.97}
                    isMaxResolution={false}
                    isImageMirror={false}
                    isSilentMode={true}
                    isDisplayStartCameraError={true}
                    isFullscreen={false}
                    sizeFactor={1}
                  />
                </div>
              ) : !props.plateImage ? (
                <React.Fragment>
                  <div className="card_identity">
                    <h1 className="card_title">Identity</h1>
                    <h1 className="identity_text">{props.identityAddress}</h1>
                  </div>
                  <div className="card_identity_2">
                    <h1 className="card_title_identity_2">Vehicule to check</h1>
                    <p className="card_p_identity_2">
                      to complete the verification of parking card, please scan
                      license plate. You can alos upload a picture or fill in
                      the field manually.
                    </p>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="card_identity">
                    <h1 className="card_title">Identity</h1>
                    <h1 className="identity_text">{props.identityAddress}</h1>
                  </div>
                  <div
                    className="card_identity"
                    style={{ margin: "20px 0 20px 0" }}
                  >
                    <h1 className="card_title">Licesne plate</h1>
                    {/* <img
                      className="img-fluid scan_vehicule_img"
                      src={props.plateImage}
                      alt="plateImage"
                    /> */}
                    {props.plateNumber && (
                      <h1
                        className="identity_text"
                        style={{ marginTop: "20px" }}
                      >
                        Plate Number : {props.plateNumber}
                      </h1>
                    )}
                  </div>
                </React.Fragment>
              )}
              {/* {!props.plateNumber ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={scan}
                    alt="scan"
                    className="img-fluid placeholder"
                  />
                </div>
              ) : null} */}
              <div style={{ textAlign: "center" }}>
                <img src={scan} alt="scan" className="img-fluid placeholder" />
              </div>
              <div className="button_div">
                {scanning ? (
                  <button className="retry_button" onClick={handleOpenCamera}>
                    Cancel camera
                  </button>
                ) : !props.plateImage ? (
                  <button className="retry_button" onClick={handleOpenCamera}>
                    Scan licesne plate
                  </button>
                ) : props.plateNumber ? (
                  <button
                    className="retry_button"
                    onClick={props.launchVerification}
                  >
                    <span className="launch">Launch verification</span>
                  </button>
                ) : (
                  <button className="retry_button" onClick={handleOpenCamera}>
                    Bad Image - Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
