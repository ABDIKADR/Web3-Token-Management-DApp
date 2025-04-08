const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TopTokens", function () {
  let TopTokens;
  let topTokens;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    TopTokens = await ethers.getContractFactory("TopTokens");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new TopTokens contract before each test
    topTokens = await TopTokens.deploy();
    await topTokens.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await topTokens.owner()).to.equal(owner.address);
    });

    it("Should start with empty tokens array", async function () {
      expect(await topTokens.getTokenCount()).to.equal(0);
    });
  });

  describe("Token Management", function () {
    const mockTokens = [
      ethers.Wallet.createRandom().address,
      ethers.Wallet.createRandom().address,
    ];
    const mockSymbols = ["TKN1", "TKN2"];
    const mockPrices = [100, 200];

    it("Should allow owner to save tokens", async function () {
      await topTokens.saveTokens(mockTokens, mockSymbols, mockPrices);

      const savedTokens = await topTokens.getTokens();
      expect(savedTokens.length).to.equal(2);

      expect(savedTokens[0].tokenAddress).to.equal(mockTokens[0]);
      expect(savedTokens[0].symbol).to.equal(mockSymbols[0]);
      expect(savedTokens[0].price).to.equal(mockPrices[0]);
    });

    it("Should emit events when saving tokens", async function () {
      await expect(topTokens.saveTokens(mockTokens, mockSymbols, mockPrices))
        .to.emit(topTokens, "TokensUpdated")
        .and.to.emit(topTokens, "TokenAdded")
        .withArgs(mockTokens[0], mockSymbols[0], mockPrices[0]);
    });

    it("Should prevent non-owners from saving tokens", async function () {
      await expect(
        topTokens.connect(addr1).saveTokens(mockTokens, mockSymbols, mockPrices)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should validate input arrays length", async function () {
      const invalidTokens = [
        ...mockTokens,
        ethers.Wallet.createRandom().address,
      ];
      await expect(
        topTokens.saveTokens(invalidTokens, mockSymbols, mockPrices)
      ).to.be.revertedWith("Arrays length mismatch");
    });

    it("Should enforce maximum tokens limit", async function () {
      const tooManyTokens = Array(11)
        .fill()
        .map(() => ethers.Wallet.createRandom().address);
      const tooManySymbols = Array(11)
        .fill()
        .map((_, i) => `TKN${i}`);
      const tooManyPrices = Array(11)
        .fill()
        .map((_, i) => i + 100);

      await expect(
        topTokens.saveTokens(tooManyTokens, tooManySymbols, tooManyPrices)
      ).to.be.revertedWith("Too many tokens");
    });

    it("Should validate token addresses", async function () {
      const invalidTokens = [ethers.ZeroAddress, mockTokens[1]];
      await expect(
        topTokens.saveTokens(invalidTokens, mockSymbols, mockPrices)
      ).to.be.revertedWith("Invalid token address");
    });

    it("Should validate token symbols", async function () {
      const invalidSymbols = ["", "TKN2"];
      await expect(
        topTokens.saveTokens(mockTokens, invalidSymbols, mockPrices)
      ).to.be.revertedWith("Empty symbol");
    });

    it("Should validate token prices", async function () {
      const invalidPrices = [0, 200];
      await expect(
        topTokens.saveTokens(mockTokens, mockSymbols, invalidPrices)
      ).to.be.revertedWith("Invalid price");
    });
  });
});
