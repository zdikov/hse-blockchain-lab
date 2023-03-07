const Web3 = require("web3");

// Loading the contract ABI
// (the results of a previous compilation step)
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("Token.json"));

async function main() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );

  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating a Contract instance
  const contract = new web3.eth.Contract(
    abi,
    process.env.CONTRACT_ADDRESS
  );

  if (process.argv[2] == "list") {
    console.log(await contract.getPastEvents(process.argv[3], { fromBlock: 0 }));
    process.exit(0);
  }

  var tx;
  if (process.argv[2] == "add") {
    tx = contract.methods.addMessage(process.argv[3])
  } else if (process.argv[2] == "delete") {
    tx = contract.methods.deleteMessage(process.argv[3])
  }

  const receipt = await tx
    .send({
      from: signer.address,
      gas: 3 * await tx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });

  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
main();
