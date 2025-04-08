import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useToast,
  Text,
  Heading,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

// ABI of your deployed contract
const CONTRACT_ABI = [
  "function saveTokens(address[] calldata _tokens, string[] calldata _symbols, uint256[] calldata _prices) external",
  "function getTokens() external view returns (tuple(address tokenAddress, string symbol, uint256 price, uint256 timestamp)[])",
  "function getTokenCount() external view returns (uint256)",
];

// This will be updated after deployment
const CONTRACT_ADDRESS = "CONTRACT_ADDRESS_PLACEHOLDER";

const TopTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const toast = useToast();

  // Sample token data with valid addresses for testing
  const sampleTokens = [
    {
      address: "0x0000000000000000000000000000000000000001",
      symbol: "TOKEN1",
      price: ethers.utils.parseEther("1.5"),
    },
    {
      address: "0x0000000000000000000000000000000000000002",
      symbol: "TOKEN2",
      price: ethers.utils.parseEther("2.3"),
    },
  ];

  const checkNetwork = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 1337) {
        setNetworkError(true);
        return false;
      }
      setNetworkError(false);
      return true;
    }
    return false;
  };

  const setupLocalNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x539", // 1337 in hex
            chainName: "Localhost 8545",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545/"],
          },
        ],
      });
      toast({
        title: "Network Added",
        description: "Local network has been added to MetaMask",
        status: "success",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error setting up network:", error);
      toast({
        title: "Network Setup Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) {
          await setupLocalNetwork();
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        setConnected(true);
        toast({
          title: "Wallet Connected",
          status: "success",
          duration: 3000,
        });
        loadTokens();
      } else {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to use this dApp",
          status: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const loadTokens = async () => {
    if (
      !CONTRACT_ADDRESS ||
      CONTRACT_ADDRESS === "CONTRACT_ADDRESS_PLACEHOLDER"
    ) {
      toast({
        title: "Contract Not Deployed",
        description:
          "Please deploy the contract and update the CONTRACT_ADDRESS",
        status: "error",
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const tokenData = await contract.getTokens();
      setTokens(tokenData);
    } catch (error) {
      console.error("Error loading tokens:", error);
      toast({
        title: "Error Loading Tokens",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTokens = async () => {
    if (
      !CONTRACT_ADDRESS ||
      CONTRACT_ADDRESS === "CONTRACT_ADDRESS_PLACEHOLDER"
    ) {
      toast({
        title: "Contract Not Deployed",
        description:
          "Please deploy the contract and update the CONTRACT_ADDRESS",
        status: "error",
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const addresses = sampleTokens.map((t) => t.address);
      const symbols = sampleTokens.map((t) => t.symbol);
      const prices = sampleTokens.map((t) => t.price);

      const tx = await contract.saveTokens(addresses, symbols, prices);
      await tx.wait();

      toast({
        title: "Tokens Saved",
        description: "The tokens have been successfully saved",
        status: "success",
        duration: 3000,
      });

      loadTokens();
    } catch (error) {
      console.error("Error saving tokens:", error);
      toast({
        title: "Error Saving Tokens",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      checkNetwork();
      window.ethereum.on("chainChanged", () => {
        checkNetwork();
      });
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setConnected(true);
          loadTokens();
        } else {
          setConnected(false);
          setTokens([]);
        }
      });
    }
  }, []);

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Top Tokens Demo
        </Heading>

        {networkError && (
          <Alert status="warning">
            <AlertIcon />
            Please connect to the local network (Localhost 8545)
          </Alert>
        )}

        {!connected ? (
          <Button
            colorScheme="teal"
            onClick={connectWallet}
            isLoading={loading}
          >
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button
              colorScheme="blue"
              onClick={saveTokens}
              isLoading={loading}
              mb={4}
            >
              Save Sample Tokens
            </Button>

            {tokens.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Symbol</Th>
                    <Th>Address</Th>
                    <Th>Price</Th>
                    <Th>Timestamp</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tokens.map((token, index) => (
                    <Tr key={index}>
                      <Td>{token.symbol}</Td>
                      <Td>{token.tokenAddress}</Td>
                      <Td>{ethers.utils.formatEther(token.price)} ETH</Td>
                      <Td>
                        {new Date(
                          token.timestamp.toNumber() * 1000
                        ).toLocaleString()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text textAlign="center">No tokens saved yet</Text>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default TopTokens;
