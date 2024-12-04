import axios from "axios";

// Function to check if an address is a contract
export const isContract = async(address: string): Promise<boolean> => {
    const RPC_URL = process.env.RPC_URL || 'https://evm-t3.cronos.org';
    try {
        console.log(RPC_URL);
        
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            method: "eth_getCode",
            params: [address, "latest"],
            id: 1,
        });

        const code = response.data.result;
        return code !== '0x'; // If the code is not empty, it's a contract
    } catch (error) {
        console.error("Error checking contract:", error);
        return false;
    }
}