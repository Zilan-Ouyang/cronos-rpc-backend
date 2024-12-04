# Application Setup and Usage Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node** (v23.3.0)
- **npm** or **yarn**
- **cURL** or **Postman** (for testing API endpoints)


## Setup Instructions

1. **Install the required dependencies**  
   ```bash
   npm install
   ```

2. **Environment Configuration**  
   ```bash
   cp .env.example .env
   ```
   then update the .env file with the required values.

3. **Build the TypeScript Project**  
   ```bash
   npm run build
   ```

4. **Start the Application**
   
   ```bash
   // Start the server in production mode (the application should be running at port 8080):
   npm start
   ```
    
   ```bash
   // Start the server in development mode (the application should be running at port 3000):
   npm run dev
   ```

## Running Unit Tests
1. **Set Up Testing Environment**  
   Ensure your .env.test file is properly configured for testing.

2. **Run Tests**  
   Execute the test suite using the following command:
   ```bash
   npm run test
   ```

## Testing the API Endpoints
When testing an API endpoint protected by HMAC middleware, the signature and timestamp must be calculated and included in the request headers. Below are the steps for testing such an endpoint using cURL and Postman:

1. **Pre-requisites**
- HMAC Middleware: Requires x-signature and x-timestamp headers.
- Secret Key: Used to generate the HMAC signature.
- HMAC Algorithm: Ensure the algorithm (e.g., sha256) is known

2. **Calculate the HMAC Signature:**
    1. Run the ***generateHMACSig.js*** file in the root directory of the project:
    ```bash
        node generateHMACSig.js
    ```
    2. Provide the values following the command prompts:
        * endpoints: either entering the path starting with ***/balance/{walletAddress}*** or entering ***/token-balance/{walletAddress}/{tokenAddress}***
        * Environment: ***prod*** or ***dev***
        * HMAC Secret Key (you could use the key provided in the env files .env or .env.test)
    3. Result would look like this:
    ```bash
    Generated Signature: hLGY7js3jwHLfmojb5nGbdWEK_w0bgD7LOxbxVyLTE0=
    timestamp: 1733286663276 (the signature is only valid within +/-5 mins range)
    ```

3. **Use cURL**

    Include the x-signature and x-timestamp in your request headers:
    ```bash
    curl -X GET "http://localhost:3000/balance/{walletAddress}" \
        -H "x-signature: <calculated-signature>" \
        -H "x-timestamp: <current-timestamp>" \
    ```

4. **User Postman**
    1. Prepare headers:
        * x-signature: Calculated HMAC signature
        * x-timestamp: Current Unix timestamp
    2. Configure Postman
        * Select the HTTP method (e.g., GET) and enter the URL (e.g., http://localhost:3000/balance/{walletAddress}).
    3. Go to the Headers tab and add
        * Key: x-signature, Value: <calculated-signature>
        * Key: x-timestamp, Value: <current-timestamp>
        * Click Send to test.
