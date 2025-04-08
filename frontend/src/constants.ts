// Contract deployed to local network
export const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

// ABI for the TopTokens contract
export const CONTRACT_ABI = [
    "function owner() external view returns (address)",
    "function saveTokens(address[] memory _addresses, string[] memory _symbols, uint256[] memory _prices) external",
    "function getTokens() external view returns (tuple(address address, string symbol, uint256 price)[] memory)",
    "function clearTokens() external",
    "function transferOwnership(address newOwner) external",
    "event TokensSaved(address[] addresses, string[] symbols, uint256[] prices)",
    "event TokensCleared()",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"
]; 