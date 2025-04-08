# Web3-Token-Management-DApp

A decentralized application for managing ERC20 tokens on the Ethereum blockchain. This DApp allows users to save, retrieve, and manage token information through a smart contract interface.

## Features

- 🔐 Secure wallet connection via MetaMask
- 💾 Save token information to the blockchain
- 📋 Retrieve token listings with prices
- 🗑️ Clear token data functionality
- ⚡ Real-time blockchain interaction
- 🎨 Clean and intuitive user interface

## Tech Stack

- **Frontend**: React.js
- **Blockchain**: Ethereum (Hardhat Network)
- **Smart Contracts**: Solidity
- **Web3 Integration**: ethers.js
- **Wallet**: MetaMask

## Prerequisites

- Node.js v20+
- MetaMask browser extension
- Git

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/ABDIKADR/Web3-Token-Management-DApp.git
cd Web3-Token-Management-DApp
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
```

3. Start the Hardhat node:
```bash
npx hardhat node
```

4. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Start the frontend:
```bash
cd frontend
npm start
```

6. Open http://localhost:3000 in your browser

## Usage

1. Connect your MetaMask wallet
2. Use the terminal script to add tokens:
```bash
npx hardhat run scripts/add-tokens.js --network localhost
```
3. Click "Get Tokens" to view saved tokens
4. Use "Clear Tokens" to reset the token list

## Smart Contract

The `TopTokens.sol` contract provides the following functions:

- `saveTokens()`: Save multiple tokens with their addresses, symbols, and prices
- `getTokens()`: Retrieve the list of saved tokens
- `clearTokens()`: Remove all saved tokens

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

ABDIKADR - [@ABDIKADR](https://github.com/ABDIKADR)

Project Link: [https://github.com/ABDIKADR/Web3-Token-Management-DApp](https://github.com/ABDIKADR/Web3-Token-Management-DApp) 