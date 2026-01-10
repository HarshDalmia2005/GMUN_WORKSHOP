# Doctor Components

This directory contains React components for the **Doctor** role in the MedChain appointment booking application.

## Components Overview

### 1. **Navbar.jsx**
**Purpose**: Navigation header for doctor interface

**Features**:
- Navigation tabs specific to doctor role:
  - **Appointments**: View and manage appointment schedule
  - **Prescriptions**: Issue and track prescriptions
- Doctor profile switcher (dropdown to select current doctor)
- User avatar icon
- Logout button

**Props**:
- `activeTab` (string): Currently active tab
- `setActiveTab` (function): Function to change active tab
- `currentDoctorId` (string): Current doctor ID
- `setCurrentDoctorId` (function): Function to change current doctor
- `handleLogout` (function): Function to handle logout

**State Management**: None (receives state from parent)

**Differences from Patient Navbar**:
- Includes "Prescriptions" tab for issuing rather than viewing

---

### 2. **Appointments.jsx**
**Purpose**: Doctor's schedule management and appointment handling

**Features**:

**Appointment List View**:
- Displays all appointments for the current doctor
- Fetches data from blockchain for known patients
- Each appointment shows:
  - Patient ID
  - Date and time
  - Status badge (Active, Completed, Past/Expired)
- Sync button to refresh data

**Functionality**:
- Fetches appointments on load and when blockchain/wallet changes
- Filters appointments to show only those assigned to current doctor
- Sorts appointments by date (upcoming first)
- Loading state with spinner
- Responsive layout

**Props**:
- `currentDoctorId` (string): ID of the current doctor

**State Variables**:
- `appointments`: Array of appointment objects
- `isLoading`: Boolean for loading state

**Data Source**:
- Blockchain service for real appointment data
- Known patients list: ["patient-001", "patient-002"]

**Status Color Coding**:
- Active: Blue
- Completed: Green
- Past/Expired: Gray

---

### 3. **Prescriptions.jsx**
**Purpose**: Issue and manage patient prescriptions

**Features**:

**Prescription List**:
- Shows issued prescriptions fetched from blockchain
- Each prescription displays:
  - Drug name
  - Duration
  - Patient name
  - Issue date
  - Status badge (Active)
- Selection highlighting
- Sync button to refresh data

**Create Prescription Form**:
- Form with fields:
  - Patient ID / Name (required)
  - Drug name (required)
  - Dosage (required)
  - Duration (days) (required)
  - Additional Instructions (textarea)
- Store on Blockchain button
- Cancel button

**Prescription Details View**:
- Dark header with prescription information
- Drug name and dosage
- Patient information
- Usage instructions
- Issue date

**Functionality**:
- Create new prescriptions and store on blockchain
- View prescription details
- Fetches prescriptions on load and sync
- Responsive 3-column layout (list and details)
- Loading states and error handling

**Props**:
- `currentDoctorId` (string): ID of the current doctor

**State Variables**:
- `prescriptions`: Array of prescription objects
- `isCreating`: Boolean for create form visibility
- `selectedPrescription`: Currently selected prescription
- `newPrescription`: Form data for new prescription
- `isLoading`: Boolean for loading state
- `isStoring`: Boolean for storing state

**Data Source**:
- Blockchain service for prescription data
- Real-time data from decentralized ledger

**Features**:
- Blockchain integration for secure storage
- Automatic ID generation
- Responsive design

---

## Component Hierarchy

```
App (selectedRole === "doctor")
├── DoctorNavbar
│   └── Tab Navigation
└── Active Tab Component
    ├── Appointments
    └── Prescriptions
```

## Data Flow

1. **Navigation**: Navbar updates `activeTab` state in App
2. **Appointment Management**: Appointments component fetches and displays appointments for current doctor
3. **Prescription Management**: Prescriptions component handles creation and viewing of prescriptions

## Styling

All components use:
- **Tailwind CSS** for styling
- **Lucide React** icons for visual elements
- Consistent color scheme (Blue #0066CC primary, Green for doctor-specific actions)
- Responsive grid layouts
- Smooth transitions and hover effects
- Status badges with color coding

## Data Sources

The doctor components fetch data from:

- **Blockchain**: Appointments and prescriptions stored on decentralized ledger
- **Wallet Integration**: Requires connected wallet for blockchain access

In production, additional data sources include:
- Backend API for additional patient/appointment details
- IPFS for decentralized file storage
- Smart contracts for verification

---

## Key Differences from Patient Components

| Feature | Patient | Doctor |
|---------|---------|--------|
| Appointments | Book new | View & manage schedule |
| Prescriptions | View only | Issue & manage |
| Primary Actions | Booking, viewing | Managing, issuing |

---
