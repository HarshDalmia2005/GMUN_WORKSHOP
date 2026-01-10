# MedChain - Blockchain-Based Medical Records System

MedChain is a simple and secure medical records management system that uses blockchain technology to store patient prescriptions. It allows patients to book appointments and view their medical records, while doctors can manage appointments and write prescriptions that are permanently stored on the blockchain.

## What Does This App Do?

Think of MedChain as a digital medical records system where:
- **Patients** can book appointments with doctors and view their medical prescriptions
- **Doctors** can see their appointments and write prescriptions for patients
- **Blockchain** ensures that all medical records are secure, permanent, and cannot be changed or deleted

## Architecture

This is a **frontend-only application** built with React that connects to the Ethereum blockchain. Here's how it works:

```
User Interface (React App)
        ↓
Wallet Connection (MetaMask)
        ↓
Blockchain Service (ethers.js)
        ↓
Smart Contract (Ethereum)
```

### Key Technologies:
- **React** - JavaScript library for building the user interface
- **Vite** - Fast development server and build tool
- **ethers.js** - Library to interact with the Ethereum blockchain
- **TailwindCSS** - Styling framework for beautiful designs
- **Lucide React** - Icons for the interface

## Folder Structure

Here's what each folder and file does:

```
GMUN_WORKSHOP/
│
├── public/                          # Public assets
│   └── logo.png                     # MedChain logo image
│
├── src/                             # Source code (main application)
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── doctor/                  # Doctor-specific components
│   │   │   ├── Appointments.jsx     # Shows doctor's appointments list
│   │   │   ├── Navbar.jsx          # Navigation bar for doctors
│   │   │   ├── Prescriptions.jsx   # Doctor can write new prescriptions
│   │   │   └── README.md           # Documentation for doctor components
│   │   │
│   │   ├── patient/                 # Patient-specific components
│   │   │   ├── Appointments.jsx     # Shows patient's appointments
│   │   │   ├── BookingForm.jsx      # Form to book new appointments
│   │   │   ├── DoctorInfo.jsx       # Displays doctor information
│   │   │   ├── Navbar.jsx          # Navigation bar for patients
│   │   │   ├── Prescriptions.jsx   # View patient's prescriptions
│   │   │   └── README.md           # Documentation for patient components
│   │   │
│   │   ├── BlockchainConnect.jsx    # Button to connect MetaMask wallet
│   │   ├── BlockchainPrescriptionStore.jsx  # Stores prescriptions on blockchain
│   │   ├── RoleSelection.jsx        # Choose between Patient or Doctor role
│   │   ├── ToastContext.jsx         # Shows notification messages
│   │   └── WalletContext.jsx        # Manages wallet connection state
│   │
│   ├── config/                      # Configuration files
│   │   └── blockchain.js            # Blockchain settings (contract address, etc.)
│   │
│   ├── contracts/                   # Smart contract files
│   │   └── MedicalRecordsStorage.sol  # Solidity contract for storing records
│   │
│   ├── services/                    # Business logic
│   │   └── blockchainService.js     # Functions to interact with blockchain
│   │
│   ├── App.css                      # Styles for main App component
│   ├── App.jsx                      # Main application component (router)
│   ├── index.css                    # Global styles
│   └── main.jsx                     # Application entry point
│
├── .env                             # Environment variables (private keys)
├── .gitignore                       # Files to ignore in git
├── eslint.config.js                 # Code quality rules
├── index.html                       # Main HTML file
├── package.json                     # Project dependencies and scripts
└── vite.config.js                   # Vite build configuration
```

## How Each Part Works

### 1. **Entry Point (`main.jsx`)**
This is where the app starts. It renders the App component and wraps it with Toast and Wallet providers.

### 2. **Main App (`App.jsx`)**
- Controls which screen to show (role selection, patient view, or doctor view)
- Acts like a traffic controller for the whole application

### 3. **Components Folder**
Think of components as building blocks:

- **RoleSelection.jsx** - The first screen where you choose to login as Patient or Doctor
- **BlockchainConnect.jsx** - The "Connect Wallet" button that links your MetaMask
- **WalletContext.jsx** - Keeps track of whether your wallet is connected
- **ToastContext.jsx** - Shows pop-up messages (like "Prescription saved!")

### 4. **Doctor Components**
These are only for doctors:
- View all their appointments
- See patient details
- Write and save prescriptions to the blockchain

### 5. **Patient Components**
These are only for patients:
- Book new appointments with doctors
- View their upcoming appointments
- See all their prescriptions from the blockchain

### 6. **Config Folder**
Contains settings like:
- Which blockchain network to use
- The smart contract address
- Other configuration details

### 7. **Contracts Folder**
Contains the Solidity smart contract (`MedicalRecordsStorage.sol`) that runs on the Ethereum blockchain. This contract has functions to:
- Store new prescriptions
- Retrieve prescriptions for a patient
- Ensure only doctors can write prescriptions

### 8. **Services Folder**
The `blockchainService.js` file contains all the functions that:
- Connect to the blockchain
- Save data to the smart contract
- Read data from the smart contract
- Handle errors and transactions

## Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **MetaMask** browser extension installed
- Basic knowledge of how to use blockchain wallets

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd GMUN_WORKSHOP
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file** (if not already present)
```env
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit `http://localhost:5173`

### How to Use

#### Step 1: Connect Your Wallet 🔗

1. Make sure you have MetaMask browser extension installed
2. Click the **"Connect Wallet"** button in the top right corner
3. MetaMask will pop up - click **"Connect"** to authorize the app
4. Your wallet address will appear once connected

#### Step 2: Choose Your Role 👤

After connecting your wallet, you'll see two options:
- **Patient** - For booking appointments and viewing prescriptions
- **Doctor** - For managing appointments and writing prescriptions

Select the role that applies to you.

---

## 🏥 Using MedChain as a **Patient**

### Booking an Appointment

1. Click on the **"Appointments"** tab in the navigation bar
2. Click the **"Book New Appointment"** button
3. Fill in the booking form:
   - **Select a Doctor** - Choose from the available doctors
   - **Appointment Date** - Pick a date
   - **Appointment Time** - Select a time slot
   - **Reason for Visit** - Describe why you need the appointment
4. Click **"Book Appointment"** to confirm
5. Your appointment will appear in the appointments list

### Viewing Your Appointments

1. Go to the **"Appointments"** tab
2. You'll see all your appointments with:
   - Doctor name and specialization
   - Date and time
   - Appointment status (Pending, Confirmed, Completed)
   - Reason for visit
3. You can filter or search for specific appointments

### Viewing Your Prescriptions 💊

1. Click on the **"Prescriptions"** tab
2. You'll see all prescriptions written by doctors for you
3. Each prescription shows:
   - Doctor's name and address (blockchain wallet)
   - Prescription date
   - Medications prescribed
   - Dosage instructions
   - Any special notes
4. **Important**: These prescriptions are stored on the blockchain and cannot be modified or deleted

---

## 👨‍⚕️ Using MedChain as a **Doctor**

### Managing Your Appointments

1. Click on the **"Appointments"** tab
2. You'll see all appointments scheduled with you
3. For each appointment, you can see:
   - Patient information
   - Appointment date and time
   - Reason for visit
   - Appointment status
4. Update appointment status as needed (Pending → Confirmed → Completed)

### Writing Prescriptions 📝

1. Go to the **"Prescriptions"** tab
2. Click **"Write New Prescription"** button
3. Fill in the prescription form:
   - **Patient Address** - Enter the patient's blockchain wallet address
   - **Medications** - List all medications (name, dosage, frequency)
   - **Diagnosis** - Write the medical diagnosis
   - **Special Instructions** - Add any special notes or warnings
4. Click **"Save to Blockchain"** to submit
5. MetaMask will pop up asking you to confirm the transaction
6. Pay the gas fee to complete the transaction
7. Wait for blockchain confirmation (usually takes a few seconds)
8. You'll see a success message once the prescription is saved

### Viewing Patient Prescriptions

1. In the **"Prescriptions"** tab
2. Enter a patient's wallet address in the search box
3. You'll see all prescriptions you've written for that patient
4. You can review previous prescriptions before writing new ones

---

## 🔐 Important Notes

- **Blockchain Transactions**: When you write a prescription, you need to pay a small gas fee in cryptocurrency (usually ETH)
- **Permanent Records**: Once a prescription is saved to the blockchain, it cannot be edited or deleted
- **Wallet Security**: Never share your private keys or seed phrase with anyone
- **Test Network**: Make sure you're connected to the correct blockchain network (test or mainnet)

## Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## Built With Love 💙

This project demonstrates how blockchain technology can be used for secure medical records management. It's built with modern web technologies and designed to be simple yet powerful.

---

**Note**: This is a workshop/learning project. For production use, additional security measures, error handling, and features would be needed.
