const hre = require("hardhat");

async function main() {
  console.log("Deploying TopTokens contract...");

  const TopTokens = await hre.ethers.getContractFactory("TopTokens");
  const topTokens = await TopTokens.deploy();

  await topTokens.waitForDeployment();

  console.log("TopTokens deployed to:", await topTokens.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
