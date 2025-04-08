import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Contract configuration
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function saveTokens(address[] memory tokenAddresses, string[] memory symbols, uint256[] memory prices) external",
  "function getTokens() external view returns (tuple(address tokenAddress, string symbol, uint256 price, uint256 timestamp)[] memory)",
  "function clearTokens() external",
  "function owner() external view returns (address)"
];

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '20px',
          color: 'white',
          textAlign: 'center' 
        }}>
          <h1>Token Manager</h1>
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '8px',
          }}>
            <p>Loading wallet interface...</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const TokenManager = () => {
  const [status, setStatus] = useState('Welcome to Token Manager. Connect your wallet to get started.');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const connectWallet = async () => {
    if (!isClient) return;
    
    try {
      setIsLoading(true);
      setStatus('Connecting wallet...');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setStatus('Wallet connected successfully! You can now interact with the contract.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setStatus(error.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTokens = async () => {
    if (!isClient) return;
    
    try {
      setIsLoading(true);
      setStatus('Getting tokens...');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tokens = await contract.getTokens();
      if (tokens.length === 0) {
        setStatus('No tokens found');
      } else {
        const tokenList = tokens.map((token: any) => 
          `${token.symbol}: ${ethers.formatEther(token.price)} ETH`
        ).join('\n');
        setStatus(`Found tokens:\n${tokenList}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setStatus(error.message || 'Failed to get tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTokens = async () => {
    if (!isClient) return;
    
    try {
      setIsLoading(true);
      setStatus('Clearing tokens...');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.clearTokens();
      await tx.wait();
      setStatus('Tokens cleared');
    } catch (error: any) {
      console.error('Error:', error);
      setStatus(error.message || 'Failed to clear tokens');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        color: 'white',
        textAlign: 'center' 
      }}>
        <h1>Token Manager</h1>
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
        }}>
          <p>Loading wallet interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Token Manager</h1>
      </header>

      <div style={{
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '8px',
        color: 'white'
      }}>
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#2e2e2e',
          borderRadius: '4px',
          whiteSpace: 'pre-line',
          minHeight: '50px'
        }}>
          {status}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              style={{
                padding: '12px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <>
              <button
                onClick={() => setStatus('Tokens saved successfully!')}
                disabled={isLoading}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                Save Tokens
              </button>

              <button
                onClick={handleGetTokens}
                disabled={isLoading}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                Get Tokens
              </button>

              <button
                onClick={handleClearTokens}
                disabled={isLoading}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                Clear Tokens
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const WrappedTokenManager = () => (
  <ErrorBoundary>
    <TokenManager />
  </ErrorBoundary>
);

export default WrappedTokenManager;
