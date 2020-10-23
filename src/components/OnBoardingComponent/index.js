import React, { useEffect, useState } from "react";
import axios from "axios";

import Landing from "./Landing";
import Identity from "./Identity";
import ScanVehicule from "./ScanVehicule";
import ResultError from "./ResultError";
import ResultSuccess from "./ResultSuccess";
import PermitExpired from "./PermitExpired";
import Loading from "./Loading";

import web3 from "../../constants/Web3";
import claimManagerContractABI from "../../ABIs/claimManager";

export default function Index(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [validAddress, setValidAddress] = useState(false); // validate Ethereum address
  const [identityAddress, setIdentityAddress] = useState(""); // address of the PMR
  const [loading, setLoading] = useState(false); // address of the PMR
  const [plateImage, setPlateImage] = useState(null); // plateImage
  const [plateNumber, setPlateNumber] = useState(null); // plateNumber
  const [validClaim, setValidClaim] = useState(null); // result after onChain verification

  useEffect(() => {
    if (props.address && verifyValidAddress(props.address)) {
      setIdentityAddress(props.address);
      handleNext();
    }
  }, [props.address]);

  // = = = =  verify valid Ethereum address = = = =
  const verifyValidAddress = (data) => {
    setValidAddress(web3.utils.isAddress(data));
    return web3.utils.isAddress(data);
  };

  // = = = = handle steps = = = =
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const reset = () => {
    setActiveStep(0);
  };

  // = = = =  handle QrCode = = = =
  const handleScan = (data) => {
    if (data) {
      setLoading(true);
      if (verifyValidAddress(data)) {
        setIdentityAddress(data);
        handleNext();
      } else {
        setIdentityAddress(data);
        handleNext();
      }
    }
    setTimeout(() => setLoading(false), 3000);
  };

  const handleError = (err) => {
    console.error(err);
  };

  // = = = = handle plate image = = = =

  // handle Input
  const handlePlate = (event) => {
    setPlateNumber(event.target.value);
  };

  // Request OpenAlpr provider
  const getPlateNumber = async (data) => {
    try {
      const res = await axios.post(
        "https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=us&secret_key=sk_978e794068ff24ccbcce9de5",
        data.substring(22)
      );
      console.log(
        "INFO - API called, plate Number retrieved: ",
        res.data.results[0].plate
      );
      setPlateNumber(res.data.results[0].plate);
      return res.data.results[0].plate;
    } catch (e) {
      // BackUP for demo purpose...
      setPlateNumber("XB4940");
      console.log("Error when fetching the plate number, ", e);
    }
  };

  // = = = = handle verification  = = = =
  const launchVerification = async () => {
    console.log("INFO - plateImage: ", plateImage);
    console.log("INFO - plateNumber: ", plateNumber);
    console.log("INFO - identityAddress: ", identityAddress);
    await verifyClaim();
  };

  // = = = = = = = Veirification = = = = = = = =
  async function verifyClaim() {
    setLoading(true);

    //
    const Mr_MAX_MUSTERMANContractAddress = identityAddress;

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

    setValidClaim(
      pmrContractOwner === signerVehiculeNumber &&
        doctorContractOwner === signerParkingAuth &&
        vehiculeNumber === plateNumber
    );

    handleNext();

    setTimeout(() => setLoading(false), 3000);
  }

  // = = = = handle UI/Steps = = = =
  const getContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Landing
            handleNext={handleNext}
            handleScan={handleScan}
            handleError={handleError}
          />
        );
      case 1:
        // TODO we need to add a check on identity found or not by calling a DNS contract
        if (validAddress) {
          return (
            <ScanVehicule
              handleNext={handleNext}
              identityAddress={identityAddress}
              setPlateImage={setPlateImage}
              plateImage={plateImage}
              launchVerification={launchVerification}
              getPlateNumber={getPlateNumber}
              plateNumber={plateNumber}
              setLoading={setLoading}
              handlePlate={handlePlate}
            />
          );
        } else {
          return (
            <Identity
              handleNext={handleNext}
              identityAddress={identityAddress}
              reset={reset}
            />
          );
        }
      case 2:
        if (validClaim) {
          return (
            <ResultSuccess
              handleNext={handleNext}
              reset={reset}
              identityAddress={identityAddress}
              plateNumber={plateNumber}
            />
          );
        } else {
          return (
            <ResultError
              handleNext={handleNext}
              reset={reset}
              identityAddress={identityAddress}
              plateNumber={plateNumber}
            />
          );
        }
      // TODO handle permitExpired, we need a modification on smartContracts for this
      case 3:
        return <PermitExpired handleNext={handleNext} />;
      default:
        return "Unknown step";
    }
  };

  return <div>{loading ? <Loading /> : getContent(activeStep)}</div>;
}
