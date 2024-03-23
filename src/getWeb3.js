// import { ethers } from 'ethers';

// async function getWeb3() {
//     await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     return provider;
// }

// export default getWeb3;


// import { ethers } from 'ethers';

// const ARBITRUM_SEPOLIA_CHAIN_ID = '0x66eee'; // Chain ID for Arbitrum Sepolia in hexadecimal

// async function getWeb3() {
//     await window.ethereum.request({ method: 'eth_requestAccounts' });

//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const { chainId } = await provider.getNetwork();
    
//     if (chainId !== parseInt(ARBITRUM_SEPOLIA_CHAIN_ID, 16)) {
//         alert("Please connect to the Arbitrum Sepolia testnet.");
//         throw new Error("Incorrect network");
//     }

//     return provider;
// }

// export default getWeb3;


import { ethers } from 'ethers';
import { contractABI, contractAddress } from './contractConfig';

const ARBITRUM_SEPOLIA_CHAIN_ID = '0x66eee'; // Chain ID for Arbitrum Sepolia in hexadecimal

async function getWeb3() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();

        if (chainId !== parseInt(ARBITRUM_SEPOLIA_CHAIN_ID, 16)) {
            // Return both provider (which could be null here) and an error message
            return {
                provider: null,
                error: "Please connect to the Arbitrum Sepolia testnet."
            };
        }

        // If the network is correct, return the provider and no error
        return { provider, error: null };
    } catch (error) {
        console.error("Failed to initialize web3:", error);
        // Return null provider and the error message
        return {
            provider: null,
            error: error.message || "An unknown error occurred"
        };
    }
}

export default getWeb3;
