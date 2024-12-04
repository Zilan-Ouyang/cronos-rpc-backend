import express, { Application, Request,  Response} from 'express';
import cors from 'cors';

import bodyParser from 'body-parser';
import { CronosController } from './controllers/cronos.controller';
import { hmacAuthMiddleware } from './utils/hmacAuthentication';
import { isContract } from './utils/blockchainUtilities';

export class App {
  public app: Application;
  private cronosController: CronosController;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.cronosController = new CronosController();
    this.initializeRoutes();
  }
// Routes
  
  private initializeRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
        res.send('API is running');
    });
    this.app.get('/balance/:address', hmacAuthMiddleware, async(req:Request, res: Response) => {
        const { address } = req.params;
        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
            res.status(400).json({ error: 'Invalid address format' });
            return;
        }
        try {
            const result = await this.cronosController.getBalance(address);
            console.log(result);
            
            res.status(200).json({ balance: result})
        }
        catch (error: any){
            res.status(400).json({ error: 'Unable to fetch balance' });
        }
    });
    this.app.get('/token-balance/:address/:tokenAddress', hmacAuthMiddleware , async(req:Request, res: Response) => {
        const { address, tokenAddress } = req.params;
        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
            res.status(400).json({ error: 'Invalid address format' });
            return;
        }
        const isContractAddress = await isContract(tokenAddress);
        if(!tokenAddress || !isContractAddress) {
            res.status(400).json({ error: 'Invalid token address format' });
            return;
        }
        try {
            const result = await this.cronosController.getTokenBalance(address, tokenAddress);
            console.log(result);
            
            res.status(200).json({ balance: result})
        }
        catch (error: any){
            res.status(400).json({ error: 'Unable to fetch balance' });
        }
    })
  }
}
