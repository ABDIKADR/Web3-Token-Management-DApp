const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Funding your wallet with ETH...");

  // The first Hardhat account with 10,000 ETH
  const [sender] = await ethers.getSigners();

  // Your wallet address
  const receiver = "0x0F238bF1C862Ba16F984407561c5b04e0a4A01d8";

  // Send 100 ETH
  const amountToSend = ethers.parseEther("100.0");

  console.log(
    `Sending ${ethers.formatEther(amountToSend)} ETH from ${
      sender.address
    } to ${receiver}`
  );

  const tx = await sender.sendTransaction({
    to: receiver,
    value: amountToSend,
  });

  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");

  await tx.wait();

  console.log("Transaction confirmed!");
  console.log(
    `Successfully sent ${ethers.formatEther(amountToSend)} ETH to ${receiver}`
  );

  // Check balance
  const balance = await ethers.provider.getBalance(receiver);
  console.log(`New balance: ${ethers.formatEther(balance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
