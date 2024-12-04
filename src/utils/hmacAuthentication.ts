import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const hmacAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const SECRET_KEY = process.env.HMAC_SECRET_KEY || '';
    
    const URL_HOST =  process.env.URL_HOST || '';
    try {
        const receivedSignature = req.headers['x-signature'] as string;
        const timestamp = req.headers['x-timestamp'] as string;
        // console.log('timestamp: ' + timestamp)
        // Check if the required headers are present
        if (!receivedSignature || !timestamp) {
            throw new Error('Unauthorized: Missing signature or timestamp');
        }

        // Check for timestamp expiration (5 minutes limit)
        const timeDifference = Math.abs(Date.now() - parseInt(timestamp, 10));
        // console.log('Date.now(): ' + Date.now())
        if (timeDifference > 5 * 60 * 1000) {
            throw new Error('Unauthorized: Request expired');
        }   


        let params = [req.method, timestamp, URL_HOST, req.path];
        // console.log(params);
        
        if(req.query && Object.keys(req.query).length > 0) {
            params.push(req.query.toString() as string)
        }
        if(req.body && Object.keys(req.body).length > 0) {
            params.push(JSON.stringify(req.body))
        }

        const stringParams = params.join('\n');
        // console.log('stringParams', stringParams);
        
        const computedSignature = crypto
            .createHmac('sha256', SECRET_KEY)
            .update(stringParams)
            .digest('base64')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')

        // console.log('computedSignature', computedSignature);
        // console.log('receivedSignature', receivedSignature);
        
        // Validate the received signature against the computed signature
        if (receivedSignature !== computedSignature) {
            throw new Error('Unauthorized: Invalid signature' );
        }

        next();
    } catch (err) {
        next(err)
    }
};
