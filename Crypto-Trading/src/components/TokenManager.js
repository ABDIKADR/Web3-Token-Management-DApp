import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import web3Service from "../services/web3Service";

const TokenManager = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      const initialized = await web3Service.init();
      if (initialized) {
        loadTokens();
      }
    } catch (err) {
      setError("Failed to initialize Web3: " + err.message);
    }
  };

  const loadTokens = async () => {
    try {
      setLoading(true);
      const tokenData = await web3Service.getTokens();
      setTokens(tokenData);
    } catch (err) {
      setError("Failed to load tokens: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTokens = async () => {
    try {
      setLoading(true);
      // Get current top 10 tokens from your API or state
      const currentTokens = tokens.slice(0, 10);

      const addresses = currentTokens.map((token) => token.tokenAddress);
      const symbols = currentTokens.map((token) => token.symbol);
      const prices = currentTokens.map((token) => token.price);

      await web3Service.saveTokens(addresses, symbols, prices);
      setSuccess("Tokens saved successfully!");
      await loadTokens(); // Reload the tokens
    } catch (err) {
      setError("Failed to save tokens: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTokens = async () => {
    await loadTokens();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Token Manager
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveTokens}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Tokens"}
        </Button>
        <Button variant="outlined" onClick={handleGetTokens} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Get Tokens"}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Address</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token, index) => (
              <TableRow key={index}>
                <TableCell>{token.tokenAddress}</TableCell>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>{token.price.toString()}</TableCell>
                <TableCell>
                  {new Date(token.timestamp * 1000).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TokenManager;
