import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import licensePlate from "../../assets/claim_it/icons/license-plate.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      borderRadius: "30px",
      height: "53px",
      marginTop: "15px",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
      color: "#631d22",
    },
    iconButton_2: {
      margin: "15px 0 0 0",
      color: "#631d22",
      outline: "0 !important",
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

export default function InputPlate(props) {
  const classes = useStyles();

  const handleChange = (e) => {
    // get the files
    let files = e.target.files;

    // Process each file
    var allFiles = [];
    for (var i = 0; i < files.length; i++) {
      let file = files[i];

      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + " kB",
          base64: reader.result,
          file: file,
        };

        // Push it to the state
        allFiles.push(fileInfo);

        // If all files have been proceed
        if (allFiles.length === files.length) {
          // Apply Callback function
          if (props.multiple) props.handleTakePhoto(allFiles);
          else props.handleTakePhoto(allFiles[0].base64);
        }
      }; // reader.onload
    } // for
  };

  return (
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <img
          src={licensePlate}
          alt="licensePlate"
          style={{ height: "20px", width: "20px" }}
        />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Fill in license plate"
        inputProps={{ "aria-label": "search google maps" }}
        onChange={props.handlePlate}
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
        onClick={props.launchVerification}
        disabled={!props.plateNumber}
      >
        <CheckCircleIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        color="primary"
        className={classes.iconButton_2}
        aria-label="directions"
      >
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            type="file"
            onChange={handleChange}
            multiple={props.multiple}
            id="upload-photo"
            name="upload-photo"
          />
          <PublishIcon />
        </label>
      </IconButton>
    </Paper>
  );
}
