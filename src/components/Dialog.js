import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Camera, { IMAGE_TYPES } from "react-html5-camera-photo";

import "react-html5-camera-photo/build/css/index.css";

export default function AlertDialog(props) {
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    // console.log("dataUri: ", dataUri);
    console.log("takePhoto");
    props.setImage(dataUri);
  }

  function resetPhoto() {
    // Do stuff with the photo...
    // console.log("dataUri: ", dataUri);

    props.setImage("");
  }
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Taking a photo"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
          {props.dataUri === "" ? (
            <Camera
              onTakePhoto={(dataUri) => {
                handleTakePhoto(dataUri);
              }}
              imageType={IMAGE_TYPES.PNG}
              idealResolution={{ width: 300 }}
            />
          ) : (
            <img width="300px" src={props.dataUri} alt="Plate Number" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetPhoto} color="primary">
            Retake
          </Button>
          <Button onClick={props.handleClose} color="primary" autoFocus>
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
