import request from 'supertest';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({path: '.env.test'});

import {App} from './app'; // Import the express app

const appInstance = new App();

function generateSignature (method: string, nowStr: string, host: string, path: string, secret: string, query = null, body = null){

  let params = [method, nowStr, host, path]
  console.log(params);
  
  if(query) {
      params.push(query)
  }
  if(body) {
      params.push(JSON.stringify(body))
  }

  const stringParams = params.join('\n');
  
  return crypto
      .createHmac('sha256', secret)
      .update(stringParams)
      .digest('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
}
const URL_HOST = process.env.URL_HOST || 'localhost:3000';
  const SECRET_KEY = process.env.HMAC_SECRET_KEY || 'MEMbONArUnBL';
describe('GET /balance/:address', () => {
  it('should return the balance for the given address', async () => {
    const validTimestamp = Math.floor(Date.now()).toString();
    const validSignature = generateSignature('GET', validTimestamp, URL_HOST, '/balance/0xf994f79590e9b9418F0dE031055d9E42B585ec5d', SECRET_KEY);
    const response = await request(appInstance.app)
                              .get('/balance/0xf994f79590e9b9418F0dE031055d9E42B585ec5d')
                              .set('x-signature', validSignature)
                              .set('x-timestamp', validTimestamp);
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe("50");
  });

  it('should return a balance of 0 for an unknown address', async () => {
    const validTimestamp = Math.floor(Date.now()).toString();
    const validSignature = generateSignature('GET', validTimestamp, URL_HOST, '/balance/0x3D498F7b6164428cA3838c52ea0e5d3860fA9a31', SECRET_KEY);
    const response = await request(appInstance.app)
                              .get('/balance/0x3D498F7b6164428cA3838c52ea0e5d3860fA9a31')
                              .set('x-signature', validSignature)
                              .set('x-timestamp', validTimestamp);
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe('0');
  });

  
});

describe('GET /token-balance/:address/:tokenAddress', () => {
  it('should return the given token balance for the given address', async () => {
    const validTimestamp = Math.floor(Date.now()).toString();
    const validSignature = generateSignature('GET', validTimestamp, URL_HOST, '/token-balance/0x1277B52638600913392B214c3d5ADE863763C856/0xCea2b0c503ae691c8AAeC0431E9C0431Ce096Da6', SECRET_KEY);
    const response = await request(appInstance.app)
                              .get('/token-balance/0x1277B52638600913392B214c3d5ADE863763C856/0xCea2b0c503ae691c8AAeC0431E9C0431Ce096Da6')
                              .set('x-signature', validSignature)
                              .set('x-timestamp', validTimestamp);
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe("0.123");
  });

  it('should return a balance of 0 for an unknown address', async () => {
    const validTimestamp = Math.floor(Date.now()).toString();
    const validSignature = generateSignature('GET', validTimestamp, URL_HOST, '/token-balance/0x3D498F7b6164428cA3838c52ea0e5d3860fA9a31/0xCea2b0c503ae691c8AAeC0431E9C0431Ce096Da6', SECRET_KEY);
    const response = await request(appInstance.app)
                              .get('/token-balance/0x3D498F7b6164428cA3838c52ea0e5d3860fA9a31/0xCea2b0c503ae691c8AAeC0431E9C0431Ce096Da6')
                              .set('x-signature', validSignature)
                              .set('x-timestamp', validTimestamp);
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe('0');
  });

  
});
