const hre = require("hardhat");

async function main() {
  const newOwnerAddress = "0x0F238bF1C862Ba16F984407561c5b04e0a4A01d8"; // Your Trust Wallet address
  
  console.log("Transferring ownership to:", newOwnerAddress);
  
  // Get the contract instance
  const contract = await hre.ethers.getContractAt(
    "TopTokens",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );
  
  // Transfer ownership
  const tx = await contract.transferOwnership(newOwnerAddress);
  await tx.wait();
  
  console.log("Ownership transferred successfully!");
  
  // Verify the new owner
  const newOwner = await contract.owner();
  console.log("New owner is:", newOwner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
