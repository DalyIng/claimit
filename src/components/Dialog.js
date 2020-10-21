import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Camera, { IMAGE_TYPES, FACING_MODES } from "react-html5-camera-photo";

import "react-html5-camera-photo/build/css/index.css";

export default function AlertDialog(props) {
  function handleTakePhoto(dataUri) {
    console.log("takePhoto");
    props.setImage(dataUri);
    props.handleClose();
  }

  //   function resetPhoto() {
  //     // Do stuff with the photo...
  //     // console.log("dataUri: ", dataUri);

  //     props.setImage("");
  //   }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
      >
        <DialogTitle id="alert-dialog-title">{"Taking a photo"}</DialogTitle>
        <DialogContent>
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            // imageType={IMAGE_TYPES.PNG}
            // // idealResolution={{ width: 100}}
            // idealFacingMode={FACING_MODES.ENVIRONMENT}
            // // isFullscreen
            // imageCompression={0.97}
            // isImageMirror={false}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution={{ width: 640, height: 480 }}
            imageType={IMAGE_TYPES.JPG}
            imageCompression={0.97}
            isMaxResolution={false}
            isImageMirror={false}
            isSilentMode={true}
            isDisplayStartCameraError={true}
            isFullscreen={false}
            sizeFactor={1}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={resetPhoto} color="primary">
            Retake
          </Button> */}
          <Button onClick={props.handleClose} color="primary" autoFocus>
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
