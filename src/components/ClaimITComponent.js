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
import TextField from "@material-ui/core/TextField";

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

function VerificationSuccess() {
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
  form: {
    "& > *": {
      margin: theme.spacing(1),
      // width: "25ch",
      width: "100%",
    },
  },
}));

export default function ClaimITComponent(props) {
  const [data, setData] = useState(""); // address of the PMR
  const [scan, setScan] = useState(false); // QrCode scanner
  const [files, setFiles] = useState([]); // file uploaded
  const [dataUri, setDataUri] = useState(""); // plateImage
  const [plate, setPlate] = useState(""); // plateText
  const [verified, setVerified] = useState(null); // result after onChain verification
  const [firstScreen, setFirstScreen] = useState(true); //
  const [open, setOpen] = useState(false); // cam dialog
  const [validAddress, setValidAddress] = useState(null); // validate Ethereum address

  //

  const classes = useStyles();

  //

  useEffect(() => {
    if (props.address && verifyValidAddress(props.address)) {
      setData(props.address);
    }
  }, [props.address]);

  //

  // = = = = = = = IDENTITY = = = = = = = =

  // verify valid Ethereum address
  const verifyValidAddress = (data) => {
    setValidAddress(web3.utils.isAddress(data));
    return web3.utils.isAddress(data);
  };
  //

  // handle QrCode
  async function handleScan(data) {
    if (data && verifyValidAddress(data)) {
      setData(data);
    }
  }

  function handleError(err) {
    console.error(err);
  }
  //

  // handle open QrCode scanner
  function handleOpenScanner() {
    if (!scan) {
      setScan(true);
    } else {
      setScan(false);
    }
  }
  //

  // = = = = = = = PLATE = = = = = = = =

  // handle openCam dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // handle Input
  const handlePlate = (event) => {
    setPlate(event.target.value);
  };

  // handle set plate image with Cam
  async function setImage(data) {
    if (typeof data === "object") {
      setFiles(data);
      setDataUri(data[0].base64);
      await getPlateNumber(data[0].base64);
    } else {
      setDataUri(data);
      await getPlateNumber(data);
    }
  }

  // Request OpenAlpr provider
  async function getPlateNumber(data) {
    try {
      const res = await axios.post(
        "https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=us&secret_key=sk_978e794068ff24ccbcce9de5",
        data.substring(22)
      );
      console.log("Plate Number: ", res.data.results[0].plate);
      setPlate(res.data.results[0].plate);
      return res.data.results[0].plate;
    } catch (e) {
      console.log("Error when fetching the plate number, ", e);
    }
  }

  // = = = = = = = Veirification = = = = = = = =

  // Main verification function
  async function verifyClaim() {
    console.log("Plate: ", plate);
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

    // setVerified (
    //   pmrContractOwner === signerVehiculeNumber &&
    //   doctorContractOwner === signerParkingAuth &&
    //   vehiculeNumber === plate
    // )

    setFirstScreen(false);
  }

  // = = = = = = = = = What to render = = = = = = = = =

  function toRender() {
    if (!firstScreen) {
      return (
        <Box mt={12}>
          {verified ? <VerificationSuccess /> : <VerificationDenied />}
          <Button
            onClick={() => {
              setFirstScreen(true);
            }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Back
          </Button>
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
            onDone={setImage}
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

          {open ? null : dataUri === "" ? null : (
            <img width="300px" src={dataUri} alt="Plate Number" />
          )}

          {validAddress === false ? <p>NOT VALID ADDRESS</p> : null}

          <br />
          <br />

          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              label="License plate"
              variant="outlined"
              onChange={handlePlate}
            />
          </form>

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

  // = = = = = = = = = Return ... = = = = = = = = =

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
