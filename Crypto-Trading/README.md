# Thetachain Development ![License](https://img.shields.io/badge/License-MIT-blue.svg)

**Thetascreener** is an innovative DeFi platform built on the **Theta blockchain**, an Ethereum Virtual Machine (EVM) compatible network. Our project is designed to enhance the Theta ecosystem by offering real-time decentralized exchange (DEX) data and tools for traders and investors.

## Table of Contents

- [Overview](#overview)
- [Smart Contract Features](#smart-contract-features)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Testing](#testing)
- [Security Considerations](#security-considerations)

## Overview

Thetascreener's primary function mirrors that of **Dexscreener**, providing users with up-to-date token prices, trading volumes, and market data across DEXs operating on the Theta blockchain. Built on an EVM-based chain, Thetascreener integrates seamlessly with the Theta network, offering a familiar yet advanced toolset for traders.

## Smart Contract Features

- Store and retrieve top 10 tokens
- Owner-restricted updates
- Gas-optimized operations
- Event emissions for state changes
- Security features:
  - Reentrancy protection
  - Access control
  - Input validation
  - Gas optimization

## Environment Setup

1. Node.js requirements:

   - Node.js v20 or later
   - npm v9 or later

2. Supported operating systems:

   - macOS
   - Windows
   - Linux

3. Required environment variables (create a `.env` file):
   ```
   THETA_TESTNET_URL=https://eth-rpc-api-testnet.thetatoken.org/rpc
   THETA_MAINNET_URL=https://eth-rpc-api.thetatoken.org/rpc
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CryptoDevGroup/Crypto-Trading.git
   cd Crypto-Trading
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile smart contracts:
   ```bash
   npm run compile
   ```

## Smart Contract Deployment

1. Deploy to Theta Testnet:

   ```bash
   npm run deploy:testnet
   ```

2. Deploy to Theta Mainnet:

   ```bash
   npm run deploy:mainnet
   ```

3. Verify the deployment:
   - Check the deployment address in the console output
   - Verify the contract on Theta Explorer
   - Test basic functionality through the frontend

## Testing

1. Run smart contract tests:

   ```bash
   npm run test:contracts
   ```

2. Run frontend tests:

   ```bash
   npm test
   ```

3. Start the development environment:
   ```bash
   npm run dev
   ```

## Security Considerations

1. Smart Contract Security:

   - Uses OpenZeppelin's battle-tested contracts
   - Implements reentrancy protection
   - Restricts admin functions to owner
   - Validates all inputs
   - Emits events for important state changes

2. Frontend Security:

   - Implements Web3 wallet connection security
   - Validates transaction data
   - Handles errors gracefully
   - Uses secure dependencies

3. Best Practices:
   - Regular security audits
   - Gas optimization
   - Comprehensive testing
   - Event monitoring
   - Access control

## License

This project is licensed under the MIT License - see the LICENSE file for details.
