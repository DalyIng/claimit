import React, { useEffect, useState } from "react";
import axios from "axios";

import Landing from "./Landing";
import InvalidIdentity from "./InvalidIdentity";
import ScanVehicule from "./ScanVehicule";
import ResultError from "./ResultError";
import ResultSuccess from "./ResultSuccess";
import PermitExpired from "./PermitExpired";
import Loading from "./Loading";

import web3 from "../../constants/Web3";
import conf from "../../constants/conf";
// import claimManagerContractABI from "../../ABIs/claimManager";

export default function Index(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [validAddress, setValidAddress] = useState(false); // validate Ethereum address
  const [identityAddress, setIdentityAddress] = useState(""); // address of the PMR
  const [loading, setLoading] = useState(false); // address of the PMR
  const [plateImage, setPlateImage] = useState(null); // plateImage
  const [plateNumber, setPlateNumber] = useState(null); // plateNumber
  const [validClaim, setValidClaim] = useState(null); // result after onChain verification

  // If PMR identityAddress is passed as queryParam, it will be set in the state.
  useEffect(() => {
    if (props.address && verifyValidAddress(props.address)) {
      setIdentityAddress(props.address);
      handleNext();
    }
  }, [props.address]);

  // Log result after check
  useEffect(() => {
    if (validClaim) {
      console.log("INFO - PMR claim is valid: ", validClaim);
    }
  }, [validClaim]);

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
    // Loading ON
    setLoading(true);
    // Reset state
    setValidAddress(false);
    setIdentityAddress("");
    setPlateImage(null);
    setPlateNumber(null);
    setValidClaim(null);
    setActiveStep(0);
    // Loading OFF
    setLoading(false);
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

  // = = = = handle plateImage = = = =

  // handle Input
  const handlePlate = (event) => {
    setPlateNumber(event.target.value);
  };

  // Request OpenAlpr provider
  const getPlateNumber = async (data) => {
    try {
      const res = await axios.post(
        `${conf.openALPR_BaseURL}${conf.openALPR_SecretKey}`,
        // substring(22): remove first 22 chars, actually ONLY PNG format is supported.
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
      console.log("INFO - Error when fetching the plate number, ", e);
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

    /** 
    The Bllockchain in no longer accessible, so for demo purposes, we'll skip this part
    until we deploy the smart contracts on Kovan blockchain for the next demo.
    */

    // const Mr_MAX_MUSTERMANContractAddress = identityAddress;

    // console.log(
    //   "INFO - QRCode Scan: Mr_MAX_MUSTERMAN contract address",
    //   Mr_MAX_MUSTERMANContractAddress
    // );

    // const maxMContract = new web3.eth.Contract(
    //   claimManagerContractABI,
    //   Mr_MAX_MUSTERMANContractAddress
    // );

    // const pmrParkingAuth = await maxMContract.methods
    //   .getTopicClaim("PMR_PARKING_AUTH")
    //   .call();

    // console.log("INFO - pmrParkingAuth: ", pmrParkingAuth);

    // const Dr_AXXXXContractAddress = pmrParkingAuth[3];

    // console.log(
    //   "INFO - Doctor Issuer Address: Dr_AXXXXContractAddress",
    //   Dr_AXXXXContractAddress
    // );

    // const doctorContract = new web3.eth.Contract(
    //   claimManagerContractABI,
    //   Dr_AXXXXContractAddress
    // );

    // const pmrParkingVehiculeNumber = await maxMContract.methods
    //   .getTopicClaim("PMR_PARKING_VEHICLE_REG_NB")
    //   .call();

    // console.log("INFO - pmrParkingVehiculeNumber: ", pmrParkingVehiculeNumber);

    // const vehiculeNumber = pmrParkingVehiculeNumber[0];

    // console.log("INFO - vehiculeNumber: ", vehiculeNumber);

    // let constructDataVehiculerNumber = `${pmrParkingVehiculeNumber[0]}${pmrParkingVehiculeNumber[1]}${pmrParkingVehiculeNumber[2]}${pmrParkingVehiculeNumber[3]}${pmrParkingVehiculeNumber[4]}${pmrParkingVehiculeNumber[5]}`;

    // let constructDataParkingAuth = `${pmrParkingAuth[0]}${pmrParkingAuth[1]}${pmrParkingAuth[2]}${pmrParkingAuth[3]}${pmrParkingAuth[4]}${pmrParkingAuth[5]}`;

    // const signerVehiculeNumber = web3.eth.accounts.recover(
    //   constructDataVehiculerNumber,
    //   pmrParkingVehiculeNumber[6]
    // );

    // const signerParkingAuth = web3.eth.accounts.recover(
    //   constructDataParkingAuth,
    //   pmrParkingAuth[6]
    // );

    // console.log("INFO - signerVehiculeNumber: ", signerVehiculeNumber);

    // console.log("INFO - signerParkingAuth: ", signerParkingAuth);

    // const doctorContractOwner = await doctorContract.methods.owner().call();
    // console.log("INFO - doctorContractOwner: ", doctorContractOwner);

    // const pmrContractOwner = await maxMContract.methods.owner().call();
    // console.log("INFO - pmrContractOwner: ", pmrContractOwner);

    // setValidClaim(
    //   pmrContractOwner === signerVehiculeNumber &&
    //     doctorContractOwner === signerParkingAuth &&
    //     vehiculeNumber === plateNumber
    // );

    setValidClaim(true);

    handleNext();

    setTimeout(() => setLoading(false), 5000);
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
            <InvalidIdentity
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
