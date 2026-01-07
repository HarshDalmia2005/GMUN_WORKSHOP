# Patient Components

This directory contains all React components for the **Patient** role in the MedChain appointment booking application.

## Components Overview

### 1. **Navbar.jsx**
**Purpose**: Navigation header for patient interface

**Features**:
- Displays the MedChain logo (clickable to go to appointments)
- Navigation tabs for different sections:
  - **Appointments**: Book and view appointments
  - **Prescriptions**: Access medical records and prescriptions
  - **Profile**: Manage personal and medical information
- User account information display
- Logout button

**Props**:
- `activeTab` (string): Currently active tab
- `setActiveTab` (function): Function to change active tab

**State Management**: None (receives state from parent)

---

### 2. **Appointments.jsx**
**Purpose**: Patient appointment booking and management interface

**Features**:
- Appointment booking form with:
  - Department selection
  - Doctor selection (dynamically filtered by department)
  - Date picker with minimum date validation
  - Time slot selection
  - Reason for visit (optional textarea)
- Doctor information panel showing:
  - Doctor name and specialization
  - Years of experience
  - Availability details
  - Appointment duration and cancellation policy
- Form validation (disables submit until all required fields are filled)

**Props**:
- None (uses local state)

**State Variables**:
- `selectedDoctorId`: ID of selected doctor

**Data**:
- Mock doctors data organized by department (Cardiology, Neurology, Pediatrics)
- Time slots: 9:00 AM - 3:00 PM

**Key Functions**:
- `onDoctorSelect(doctorId)`: Updates selected doctor in parent component

---

### 3. **Prescriptions.jsx**
**Purpose**: Display and manage patient medical records and prescriptions

**Features**:
- Prescription list view showing:
  - Drug name and dosage
  - Prescribing doctor
  - Issue date
  - Status (Active/Fulfilled)
- Detailed prescription view displaying:
  - Full prescription information
  - Token ID (blockchain hash reference)
  - QR code representation
  - Usage instructions
  - Issuing doctor with verification status
  - IPFS content hash for decentralized storage
- Download button for prescription verification

**Props**: None

**State Variables**:
- `selectedRxId`: Currently selected prescription ID

**Data**:
- Mock prescriptions from IPFS/blockchain:
  - Amoxicillin (Active)
  - Metformin (Fulfilled)

**Integration Points**:
- IPFS hashes for decentralized prescription storage
- Blockchain verification for doctor credentials

---

### 4. **Profile.jsx**
**Purpose**: Patient profile management and medical information storage

**Features**:

**Personal Information Section**:
- First and last name
- Email address
- Phone number
- Date of birth
- Gender (Male/Female/Other)
- Address

**Medical Information Section**:
- Blood type
- Height and weight
- Allergies
- Chronic conditions
- Current medications

**Emergency Contact Section**:
- Contact person's name
- Relationship to patient
- Emergency phone number

**Functionality**:
- Edit mode toggle for updating information
- Form validation
- Save/Cancel buttons
- View mode shows information in read-only format
- Edit mode shows input fields for modification

**Props**: None

**State Variables**:
- `isEditing`: Boolean for edit mode
- `formData`: Object containing all profile fields

**Key Features**:
- Dynamic InputField component that renders differently based on edit mode
- Support for text, email, tel, date, select, and textarea inputs
- Responsive grid layout (2 columns on large screens)
- Important note about data accuracy

---

## Component Hierarchy

```
App (selectedRole === "patient")
├── PatientNavbar
│   └── Tab Navigation
└── Active Tab Component
    ├── Appointments
    ├── Prescriptions
    └── Profile
```

## Data Flow

1. **Navigation**: Navbar updates `activeTab` state in App
2. **Doctor Selection**: Appointments component passes selected doctor to parent
3. **Doctor Info**: DoctorInfo component receives doctor ID and displays details
4. **Prescription Selection**: Prescriptions component manages selection state internally
5. **Profile Updates**: Profile component manages form state and saves locally

## Styling

All components use:
- **Tailwind CSS** for styling
- **Lucide React** icons for visual elements
- Consistent color scheme (Blue #0066CC primary)
- Responsive grid layouts
- Smooth transitions and hover effects

## Mock Data

The patient components use mock data for:
- Doctor information (names, specializations, availability)
- Available time slots
- Patient prescriptions
- Department listings

In production, these would be fetched from:
- Backend API for doctor and appointment data
- Blockchain/IPFS for prescription data
- Smart contracts for verification

---

## Future Enhancements

- [ ] Integration with backend API for real appointments
- [ ] Blockchain integration for prescription verification
- [ ] Real-time appointment status updates
- [ ] Email notifications for appointment reminders
- [ ] Payment integration for consultation fees
- [ ] Chat/video consultation with doctors
- [ ] Health analytics dashboard
- [ ] Integration with wearable devices for health metrics
