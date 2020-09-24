import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider("wss://infrachain-bc.intech.lu/ws")
);

web3.eth.getBlock("latest", true).then((block) => {
  console.log(
    `The latest block number was ${block.number}. It contained ${block.transactions.length} transactions.`
  );
});

web3.eth
  .getBalance("0x22db6e11f9ddfcc9fb176245eea87eba9164e8c2")
  .then((balance) => {
    console.log(`The balance is: ${web3.utils.fromWei(balance, "ether")}.`);
  });

export default web3;
