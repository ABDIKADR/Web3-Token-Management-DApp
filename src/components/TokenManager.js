import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function saveTokens(address[] memory tokenAddresses, string[] memory symbols, uint256[] memory prices) external",
  "function getTokens() external view returns (tuple(address tokenAddress, string symbol, uint256 price, uint256 timestamp)[] memory)",
  "function clearTokens() external",
];

const TokenManager = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setProvider(provider);
        setContract(contract);
      } catch (err) {
        setError("Failed to connect to MetaMask");
        console.error(err);
      }
    };

    if (window.ethereum) {
      init();
    } else {
      setError("Please install MetaMask");
    }
  }, []);

  const handleGetTokens = async () => {
    try {
      setLoading(true);
      const result = await contract.getTokens();
      setTokens(result);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tokens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTokens = async () => {
    try {
      setLoading(true);
      // Example data - in a real app, this would come from user input
      const tokenAddresses = ["0x123...", "0x456..."];
      const symbols = ["TOKEN1", "TOKEN2"];
      const prices = [ethers.parseEther("1.0"), ethers.parseEther("2.0")];

      await contract.saveTokens(tokenAddresses, symbols, prices);
      setError(null);
    } catch (err) {
      setError("Failed to save tokens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearTokens = async () => {
    try {
      setLoading(true);
      await contract.clearTokens();
      setTokens([]);
      setError(null);
    } catch (err) {
      setError("Failed to clear tokens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Token Manager
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleGetTokens}
            disabled={loading || !contract}
          >
            Get Tokens
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTokens}
            disabled={loading || !contract}
          >
            Save Tokens
          </Button>
          <Button
            variant="contained"
            onClick={handleClearTokens}
            disabled={loading || !contract}
          >
            Clear Tokens
          </Button>
        </Box>

        {loading && <Typography>Loading...</Typography>}

        <List>
          {tokens.map((token, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${token.symbol} (${token.tokenAddress})`}
                secondary={`Price: ${ethers.formatEther(
                  token.price
                )} ETH | Updated: ${new Date(
                  token.timestamp * 1000
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TokenManager;
