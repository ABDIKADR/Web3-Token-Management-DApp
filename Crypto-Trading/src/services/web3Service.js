import Web3 from "web3";
import TopTokensABI from "../contracts/TopTokens.json";

class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  async init() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        this.web3 = new Web3(window.ethereum);
        this.account = (await this.web3.eth.getAccounts())[0];

        // Initialize contract
        const networkId = await this.web3.eth.net.getId();
        const deployedNetwork = TopTokensABI.networks[networkId];

        if (!deployedNetwork) {
          throw new Error("Contract not deployed on the current network");
        }

        this.contract = new this.web3.eth.Contract(
          TopTokensABI.abi,
          deployedNetwork.address
        );

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          this.account = accounts[0];
        });

        return true;
      } catch (error) {
        console.error("Error initializing Web3:", error);
        return false;
      }
    } else {
      console.error("Please install MetaMask!");
      return false;
    }
  }

  async saveTokens(tokens, symbols, prices) {
    if (!this.contract || !this.account) {
      throw new Error("Web3 not initialized");
    }

    try {
      return await this.contract.methods
        .saveTokens(tokens, symbols, prices)
        .send({ from: this.account });
    } catch (error) {
      console.error("Error saving tokens:", error);
      throw error;
    }
  }

  async getTokens() {
    if (!this.contract) {
      throw new Error("Web3 not initialized");
    }

    try {
      return await this.contract.methods.getTokens().call();
    } catch (error) {
      console.error("Error getting tokens:", error);
      throw error;
    }
  }

  async getTokenCount() {
    if (!this.contract) {
      throw new Error("Web3 not initialized");
    }

    try {
      return await this.contract.methods.getTokenCount().call();
    } catch (error) {
      console.error("Error getting token count:", error);
      throw error;
    }
  }

  isConnected() {
    return this.web3 !== null && this.account !== null;
  }

  getAccount() {
    return this.account;
  }
}

export default new Web3Service();
