import { CronosService } from '../services/cronos.service';

export class CronosController {
  private readonly cronosService: CronosService;

  constructor() {
    this.cronosService = new CronosService();
  }

  async getBalance(address: string) {
    try {
      const data = await this.cronosService.getBalance(address);
      // console.log('getBalance contorller', data);
      
      return data
    } catch (error: any) {
      return error
    }
  }

  async getTokenBalance(address: string, tokenAddress: string) {
    try {
      const data = await this.cronosService.getTokenBalance(address, tokenAddress);
      console.log('getTokenBalance controller', data);
      
      return data
    } catch (error: any) {
      return error
    }
  }
}
