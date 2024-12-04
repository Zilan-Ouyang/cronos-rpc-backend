import axios from 'axios';
import Web3 from 'web3';
export class CronosService {
  private readonly rpcUrl: string;
  private web3: any;
  constructor() {
    this.rpcUrl = process.env.RPC_URL || '';
    this.web3 = new Web3()
  }

  async getBalance(address: string){
    try {
        const response = await axios.post(this.rpcUrl, {
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1,
        });
        console.log('getBalance', response.data.result);
        // Convert balance from hexadecimal to decimal
        let balanceInEth = this.web3.utils.fromWei(response.data.result, 'ether');
        console.log('getBalance', balanceInEth);
        // Handle case where balance is 0
        balanceInEth = balanceInEth === "0." ? "0" : balanceInEth
        return balanceInEth;
    } catch (error) {
        console.error('Error interacting with Cronos:', error);
        throw new Error('Failed to fetch data from Cronos chain');
    }
  }

  async getTokenBalance(address: string, tokenAddress: string){
    try {
        // Get balance of the token in the specified address
        const balanceMethodSignature = this.web3.utils.keccak256("balanceOf(address)");
        const balanceOfData = balanceMethodSignature.slice(0, 10) + address.slice(2).padStart(64, "0");
        // Get decimals of the token
        const decimalsMethod = this.web3.utils.keccak256("decimals()").slice(0, 10);
        const decimalsData = await axios.post(this.rpcUrl, {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_call",
            params: [
                {
                    to: tokenAddress,
                    data: decimalsMethod, // Function signature for `decimals()`
                },
                "latest",
            ],
        });
        // Convert decimals from hexadecimal to decimal
        const decimals = parseInt(decimalsData.data.result, 16);
        
        const response = await axios.post(this.rpcUrl, {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{
                to: tokenAddress,
                data: balanceOfData
            }, 'latest'],
            id: 1,
        });
        // Convert balance from hexadecimal to decimal
        const balanceInToken = BigInt(response.data.result).toString();
        // Convert balance to decimal with specified decimals
        const formattedBalance = Number(balanceInToken) / 10 ** decimals;
        return formattedBalance.toString();
    }
    catch (error) {
      console.error('Error interacting with Cronos:', error);
      throw new Error('Failed to fetch data from Cronos chain');
    }
  }
}
