import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { Fab } from "@material-ui/core";

export default class FileBase64 extends React.Component {
  state = {
    files: null,
  };

  handleChange(e) {
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
          if (this.props.multiple) this.props.onDone(allFiles);
          else this.props.onDone(allFiles[0]);
        }
      }; // reader.onload
    } // for
  }

  render() {
    return (
      <div className="App">
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            type="file"
            onChange={this.handleChange.bind(this)}
            multiple={this.props.multiple}
            id="upload-photo"
            name="upload-photo"
          />
          <Fab
            color="primary"
            size="large"
            component="span"
            aria-label="add"
            variant="extended"
          >
            <AddIcon /> {this.props.text}
          </Fab>
        </label>
      </div>
    );
  }
}
