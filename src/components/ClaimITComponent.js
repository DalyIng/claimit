import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import AccessibleIcon from "@material-ui/icons/Accessible";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import QrReader from "react-qr-reader";
import axios from "axios";
import CropFreeIcon from "@material-ui/icons/CropFree";

import web3 from "../constants/Web3";
import Upload from "./UploadPhoto";
import Dialog from "./Dialog";

import claimManagerContractABI from "../ABIs/claimManager";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        ClaimIT!
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function VerificationSuccess(props) {
  return (
    <Typography variant="h6" color="textPrimary" align="center">
      1. Checking claims...
      <br />
      <br />
      2. Parking authorization claim is valid
      <br />
      <br />
      3. CarID claim is valid
      <br />
      <br />
      4. Car Plate Number is matching the claim
      <br />
      <br />
      <Link color="inherit" href="https://material-ui.com/">
        YOU ARE VERIFIED!
      </Link>
    </Typography>
  );
}

function VerificationDenied() {
  return (
    <Typography variant="h6" color="textPrimary" align="center">
      1. Checking claims...
      <br />
      <br />
      2. Parking authorization claim is valid
      <br />
      <br />
      3. CarID claim is valid
      <br />
      <br />
      4. Car Plate Number is not matching the claim
      <br />
      <br />
      <Link color="inherit" href="https://material-ui.com/">
        YOU ARE NOT ALLOWED!
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#D3D3D3",
    padding: "60px",
    borderRadius: "10px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  container: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ClaimITComponent(props) {
  const [data, setData] = useState("");
  const [scan, setScan] = useState(false);
  const [files, setFiles] = useState([]);
  const [dataUri, setDataUri] = useState("");
  const [plate, setPlate] = useState("");
  const [verified, setVerified] = useState(null);
  const [firstScreen, setFirstScreen] = useState(true);
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (props.address) setData(props.address);
  }, [props]);

  async function handleScan(data) {
    if (data) {
      setData(data);
    }
  }

  function handleError(err) {
    console.error(err);
  }

  function handleOpenScanner() {
    if (!scan) {
      setScan(true);
    } else {
      setScan(false);
    }
  }

  async function verifyClaim() {
    const Mr_MAX_MUSTERMANContractAddress = data;

    console.log(
      "QRCode Scan: Mr_MAX_MUSTERMAN contract address",
      Mr_MAX_MUSTERMANContractAddress
    );

    const maxMContract = new web3.eth.Contract(
      claimManagerContractABI,
      Mr_MAX_MUSTERMANContractAddress
    );

    const pmrParkingAuth = await maxMContract.methods
      .getTopicClaim("PMR_PARKING_AUTH")
      .call();

    console.log("pmrParkingAuth: ", pmrParkingAuth);

    const Dr_AXXXXContractAddress = pmrParkingAuth[3];

    console.log(
      "Doctor Issuer Address: Dr_AXXXXContractAddress",
      Dr_AXXXXContractAddress
    );

    const doctorContract = new web3.eth.Contract(
      claimManagerContractABI,
      Dr_AXXXXContractAddress
    );

    const pmrParkingVehiculeNumber = await maxMContract.methods
      .getTopicClaim("PMR_PARKING_VEHICLE_REG_NB")
      .call();

    console.log("pmrParkingVehiculeNumber: ", pmrParkingVehiculeNumber);

    const vehiculeNumber = pmrParkingVehiculeNumber[0];

    console.log("vehiculeNumber: ", vehiculeNumber);

    let constructDataVehiculerNumber = `${pmrParkingVehiculeNumber[0]}${pmrParkingVehiculeNumber[1]}${pmrParkingVehiculeNumber[2]}${pmrParkingVehiculeNumber[3]}${pmrParkingVehiculeNumber[4]}${pmrParkingVehiculeNumber[5]}`;

    let constructDataParkingAuth = `${pmrParkingAuth[0]}${pmrParkingAuth[1]}${pmrParkingAuth[2]}${pmrParkingAuth[3]}${pmrParkingAuth[4]}${pmrParkingAuth[5]}`;

    const signerVehiculeNumber = web3.eth.accounts.recover(
      constructDataVehiculerNumber,
      pmrParkingVehiculeNumber[6]
    );

    const signerParkingAuth = web3.eth.accounts.recover(
      constructDataParkingAuth,
      pmrParkingAuth[6]
    );

    console.log("signerVehiculeNumber: ", signerVehiculeNumber);

    console.log("signerParkingAuth: ", signerParkingAuth);

    const doctorContractOwner = await doctorContract.methods.owner().call();
    console.log("doctorContractOwner: ", doctorContractOwner);

    const pmrContractOwner = await maxMContract.methods.owner().call();
    console.log("pmrContractOwner: ", pmrContractOwner);

    if (
      pmrContractOwner === signerVehiculeNumber &&
      doctorContractOwner === signerParkingAuth &&
      vehiculeNumber === plate
    ) {
      console.log("Verified: TRUE!");
      setVerified(true);
    } else {
      console.log("Verified: FALSE!");
      setVerified(false);
    }

    setFirstScreen(false);
  }

  async function getFiles(files) {
    setFiles(files);
    const res = await axios.post(
      "https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=us&secret_key=sk_978e794068ff24ccbcce9de5",
      // INFO 22 = length of "data:image/png;base64,"
      // TODO handle other images types (jpg, jpeg...)
      files[0].base64.substring(22)
    );
    console.log("Plate Number: ", res.data.results[0].plate);
    setPlate(res.data.results[0].plate);
  }

  async function setImage(dataUri) {
    console.log("dataUri: ", dataUri);
    setDataUri(dataUri);

    const res = await axios.post(
      "https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=us&secret_key=sk_978e794068ff24ccbcce9de5",
      // INFO 22 = length of "data:image/png;base64,"
      // TODO handle other images types (jpg, jpeg...)
      dataUri.substring(22)
    );
    console.log("Plate Number: ", res.data.results[0].plate);
    setPlate(res.data.results[0].plate);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function toRender() {
    if (!firstScreen) {
      return (
        <Box mt={12}>
          {verified ? <VerificationSuccess /> : <VerificationDenied />}
        </Box>
      );
    } else {
      return (
        <div className={classes.container}>
          {scan ? (
            data === "" ? (
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
            ) : null
          ) : null}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleOpenScanner}
          >
            {data === "" ? (
              <React.Fragment>
                <CropFreeIcon /> Scan QRCode
              </React.Fragment>
            ) : (
              "QRCode Scanned"
            )}
          </Button>

          {data === "" ? null : (
            <Typography variant="h6" color="textPrimary" align="center">
              Address found:
              <br />
              {data.substring(0, 5)}...{data.substring(37, 41)}
              <br />
              Owner:
              <br />
              Mr MAX MUSTERMAN
            </Typography>
          )}

          <br />
          <br />

          <Upload
            multiple={true}
            onDone={getFiles}
            text={files.length === 0 ? "Upload Plate Image" : "Upload finished"}
          />

          <br />
          <br />

          <Button
            onClick={handleClickOpen}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Take a picture
          </Button>

          <Dialog
            open={open}
            handleClose={handleClose}
            setImage={setImage}
            dataUri={dataUri}
          />

          {files.length === 0 ? null : (
            <img width="300px" src={files[0].base64} alt="Plate Number" />
          )}

          {open ? null : dataUri === "" ? null : (
            <img width="300px" src={dataUri} alt="Plate Number" />
          )}

          <br />
          <br />
          <br />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={verifyClaim}
            disabled={data === "" && files.length === 0 ? true : false}
          >
            Launch verification
          </Button>
        </div>
      );
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccessibleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ClaimIT!
        </Typography>
        {toRender()}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
