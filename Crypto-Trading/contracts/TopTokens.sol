// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TopTokens
 * @dev Contract for storing and retrieving top 10 tokens on Theta chain
 * @custom:security-contact security@thetascreener.com
 */
contract TopTokens is Ownable, ReentrancyGuard {
    /// @dev Structure to store token information
    struct Token {
        address tokenAddress;
        string symbol;
        uint256 price;
        uint256 timestamp;
    }

    /// @dev Maximum number of tokens to store
    uint8 private constant MAX_TOKENS = 10;

    /// @dev Array to store top tokens
    Token[] private topTokens;

    /// @dev Mapping to check if token already exists
    mapping(address => bool) private tokenExists;

    /// @dev Events for state changes
    event TokensUpdated(address indexed updater, uint256 timestamp);
    event TokenAdded(address indexed token, string symbol, uint256 price);
    event TokenRemoved(address indexed token);

    /// @dev Constructor
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Save new top tokens
     * @param _tokens Array of token addresses
     * @param _symbols Array of token symbols
     * @param _prices Array of token prices
     */
    function saveTokens(address[] calldata _tokens, string[] calldata _symbols, uint256[] calldata _prices)
        external
        onlyOwner
        nonReentrant
    {
        require(_tokens.length == _symbols.length && _tokens.length == _prices.length, "Arrays length mismatch");
        require(_tokens.length <= MAX_TOKENS, "Too many tokens");

        // Clear existing tokens
        _clearTokens();

        // Add new tokens
        for (uint8 i = 0; i < _tokens.length; i++) {
            require(_tokens[i] != address(0), "Invalid token address");
            require(bytes(_symbols[i]).length > 0, "Empty symbol");
            require(_prices[i] > 0, "Invalid price");

            topTokens.push(
                Token({tokenAddress: _tokens[i], symbol: _symbols[i], price: _prices[i], timestamp: block.timestamp})
            );

            tokenExists[_tokens[i]] = true;
            emit TokenAdded(_tokens[i], _symbols[i], _prices[i]);
        }

        emit TokensUpdated(msg.sender, block.timestamp);
    }

    /**
     * @dev Get all stored tokens
     * @return tokens Array of Token structs
     */
    function getTokens() external view returns (Token[] memory) {
        return topTokens;
    }

    /**
     * @dev Get the number of stored tokens
     * @return count Number of tokens
     */
    function getTokenCount() external view returns (uint256) {
        return topTokens.length;
    }

    /**
     * @dev Clear all stored tokens
     */
    function _clearTokens() private {
        for (uint8 i = 0; i < topTokens.length; i++) {
            tokenExists[topTokens[i].tokenAddress] = false;
            emit TokenRemoved(topTokens[i].tokenAddress);
        }
        delete topTokens;
    }
}
