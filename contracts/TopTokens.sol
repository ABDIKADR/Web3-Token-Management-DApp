// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TopTokens is Ownable {
    struct Token {
        address tokenAddress;
        string symbol;
        uint256 price;
        uint256 timestamp;
    }

    Token[] public topTokens;
    uint256 public constant MAX_TOKENS = 10;

    event TokensUpdated(Token[] tokens);
    event TokenAdded(Token token);
    event TokenRemoved(address tokenAddress);

    constructor() Ownable(msg.sender) {}

    function saveTokens(address[] memory tokenAddresses, string[] memory symbols, uint256[] memory prices)
        external
        onlyOwner
    {
        require(
            tokenAddresses.length == symbols.length && symbols.length == prices.length, "Arrays must have same length"
        );
        require(tokenAddresses.length <= MAX_TOKENS, "Too many tokens");

        delete topTokens;

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            Token memory newToken = Token({
                tokenAddress: tokenAddresses[i],
                symbol: symbols[i],
                price: prices[i],
                timestamp: block.timestamp
            });
            topTokens.push(newToken);
            emit TokenAdded(newToken);
        }

        emit TokensUpdated(topTokens);
    }

    function getTokens() external view returns (Token[] memory) {
        return topTokens;
    }

    function clearTokens() external onlyOwner {
        delete topTokens;
        emit TokensUpdated(topTokens);
    }
}
