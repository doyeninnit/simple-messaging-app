import { ethers } from 'ethers';
import { contractABI, contractAddress } from './contractConfig';
import getWeb3 from './getWeb3';
export const getContract = async () => {
    const { provider, error } = await getWeb3();

    if (error) {
        console.error("Web3 provider error:", error);
        return { contract: null, error };
    }

    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        return { contract, error: null };
    } catch (contractError) {
        console.error("Contract initialization error:", contractError);
        return { contract: null, error: contractError.message || "Failed to initialize contract" };
    }
};
 