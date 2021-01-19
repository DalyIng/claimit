import Web3 from "web3";

const web3 = new Web3(
  // new Web3.providers.WebsocketProvider("wss://infrachain-bc.intech.lu/ws") // 403 Forbidden
  new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/478594576aff47efb0c126f142526737") // 403 Forbidden
);

// Check Chain coonectivity...
web3.eth.getBlock("latest", true).then((block) => {
  console.log(
    `INFO - Check connectivity - The latest block number was ${block.number}. It contained ${block.transactions.length} transactions.`
  );
});

web3.eth
  .getBalance("0x22db6e11f9ddfcc9fb176245eea87eba9164e8c2")
  .then((balance) => {
    console.log(
      `INFO - Check connectivity - The balance is: ${web3.utils.fromWei(
        balance,
        "ether"
      )}.`
    );
  });

export default web3;
