const { ethers } = require("hardhat");

async function main() {
  const tokens = [
    { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH", price: "3500" },
    { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "WBTC", price: "65000" },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", price: "1" },
    { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", symbol: "LINK", price: "15" },
    { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", symbol: "UNI", price: "8" },
    { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", symbol: "AAVE", price: "90" },
    { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", symbol: "MATIC", price: "1.2" },
    { address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", symbol: "SHIB", price: "0.00001" },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", price: "1" },
    { address: "0xc00e94Cb662C3520282E6f5717214004A7f26888", symbol: "COMP", price: "45" }
  ];

  // Get the contract
  const TopTokens = await ethers.getContractFactory("TopTokens");
  const contract = await TopTokens.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  console.log("Adding tokens...");

  // Prepare arrays for batch transaction
  const addresses = tokens.map(t => t.address);
  const symbols = tokens.map(t => t.symbol);
  const prices = tokens.map(t => ethers.parseEther(t.price));

  // Save tokens
  const tx = await contract.saveTokens(addresses, symbols, prices);
  await tx.wait();

  console.log("Tokens added successfully!");

  // Verify tokens were added
  const savedTokens = await contract.getTokens();
  console.log("\nSaved tokens:");
  savedTokens.forEach((token, index) => {
    console.log(`${index + 1}. ${token.symbol}: ${ethers.formatEther(token.price)} ETH`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 