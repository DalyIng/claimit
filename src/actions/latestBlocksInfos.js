// import web3 from "../constants/Web3";

// import statusMessage from "./status";

// export function getLatestBlocksInfos() {
//   return (dispatch) =>
//     new Promise(async (resolve) => {
//       await statusMessage(dispatch, "loading", true);
//       const data = [];

//       const lastBlockNumber = await web3.eth.getBlockNumber();

//       for (var i = 0; i < 10; i++) {
//         data[i] = await web3.eth.getBlock(lastBlockNumber - i);
//       }

//       resolve(
//         dispatch({
//           type: "latestBlocksInfos",
//           data,
//         })
//       );

//       statusMessage(dispatch, "success", "We have emailed you a reset link");
//     }).catch(async (err) => {
//       console.log("Error: ", err);
//       await statusMessage(dispatch, "error", err.message);
//       throw err.message;
//     });
// }
