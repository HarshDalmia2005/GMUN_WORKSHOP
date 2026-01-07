// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  // Polygon Amoy Testnet (Recommended for development - free gas)
  NETWORK: {
    name: "Polygon Amoy",
    chainId: 80002,
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorer: "https://amoy.polygonscan.com",
  },

  // Contract Address (Deploy your contract and update this)
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || "",

  // IPFS Configuration
  IPFS: {
    pinataApiKey: import.meta.env.VITE_PINATA_API_KEY || "",
    pinataSecretKey: import.meta.env.VITE_PINATA_SECRET_KEY || "",
    gatewayUrl: "https://gateway.pinata.cloud/ipfs",
  },

  // Features
  FEATURES: {
    storePrescriptions: true,
    storeAppointments: true,
    storeDiagnostics: true,
    storeLabReports: true,
    accessControl: true,
  },
};

// Deployment Instructions
export const DEPLOYMENT_GUIDE = `
STEP 1: Deploy Smart Contract
1. Go to Remix IDE: https://remix.ethereum.org/
2. Create new file and paste MedicalRecordsStorage.sol content
3. Compile the contract (Ctrl+S)
4. Add Polygon Amoy RPC to MetaMask:
   - Chain ID: 80002
   - RPC: https://rpc-amoy.polygon.technology
5. Get test MATIC: https://faucet.polygon.technology/ (Select Amoy)
6. Deploy using Injected Web3 provider
7. Copy deployed contract address

STEP 2: Configure Environment
1. Create .env.local file in project root
2. Add these variables:
   VITE_CONTRACT_ADDRESS=0x... (your deployed contract)
   VITE_PINATA_API_KEY=your_api_key
   VITE_PINATA_SECRET_KEY=your_secret_key

STEP 3: Get Pinata API Keys (Free)
1. Go to https://app.pinata.cloud
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Copy API Key and Secret Key to .env.local

STEP 4: Run Application
npm install
npm run dev

STEP 5: Connect MetaMask
1. Install MetaMask browser extension
2. Switch to Polygon Mumbai network
3. Click "Connect Wallet" button
4. Start storing medical records!
`;
