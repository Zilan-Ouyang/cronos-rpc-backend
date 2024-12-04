const crypto = require('crypto');
const readline = require('readline');



const generateSignature = (method, host, path, secret, query = null, body = null) => {
    const nowStr = Math.floor(Date.now()).toString();
    let params = [method, nowStr, host, path]
    
    if(query) {
        params.push(query)
    }
    if(body) {
        params.push(JSON.stringify(body))
    }

    const stringParams = params.join('\n');
    
    return {signature: crypto
        .createHmac('sha256', secret)
        .update(stringParams)
        .digest('base64')
        .replace(/\//g, '_')
        .replace(/\+/g, '-'),
        timestamp: nowStr}
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter endpoint (e.g., /balance/{address} or /token-balance/{address}/{tokenaddress}): ', (endpoint) => {
    rl.question('Enter Environment (prod/dev): ', (environment) => {
        rl.question('Enter HMAC secret key: ', (secretKey) => {
            const method = 'GET';
            const host = environment == 'dev' ? 'localhost:3000' : 'localhost:8080';
            const path = endpoint.trim();

            // Validate input
            if (!['dev', 'prod'].includes(environment)) {
                console.log('Invalid environment input. Please enter a valid value (prod or dev).');
                rl.close();
                return;
            }
            if (!path.startsWith('/balance/') && !path.startsWith('/token-balance/')) {
                console.log('Invalid endpoint. Please enter a valid endpoint.');
                rl.close();
                return;
            }

            // Generate and display the signature
            const result = generateSignature(method, host, path, secretKey);
            console.log('Generated Signature:', result.signature);
            console.log('timestamp:', result.timestamp);

            rl.close();
        });
    })
});