const hre = require("hardhat");

async function main() {
  console.log("Deploying TopTokens contract...");

  const TopTokens = await hre.ethers.getContractFactory("TopTokens");
  const topTokens = await TopTokens.deploy();

  await topTokens.deployed();

  console.log("TopTokens deployed to:", topTokens.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
