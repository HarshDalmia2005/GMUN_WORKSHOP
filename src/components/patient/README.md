# Patient Components

This directory contains all React components for the **Patient** role in the MedChain appointment booking application.

## Components Overview

### 1. **Navbar.jsx**
**Purpose**: Navigation header for patient interface

**Features**:
- Navigation tabs for different sections:
  - **Appointments**: Book and view appointments
  - **Prescriptions**: Access medical records and prescriptions
- User account information display ("Patient Portal")
- Logout button

**Props**:
- `activeTab` (string): Currently active tab
- `setActiveTab` (function): Function to change active tab
- `handleLogout` (function): Logout handler

**State Management**: None (receives state from parent)

---

### 2. **Appointments.jsx**
**Purpose**: Patient appointment viewing and booking interface with blockchain integration

**Features**:
- View scheduled appointments fetched from blockchain in card format
- Switch between dashboard view and booking view
- Integration with BookingForm and DoctorInfo components for booking
- Displays appointment details: doctor, date, time, status
- Loading states and blockchain connection alerts
- Success handling after booking

**Props**: None

**State Variables**:
- `selectedDoctorId`: ID of selected doctor
- `isBooking`: Boolean for booking mode
- `appointments`: Array of appointment data from blockchain
- `isLoading`: Loading state

**Data**:
- Appointments fetched from blockchain service
- Doctor names mapping

**Key Functions**:
- `fetchAppointments()`: Fetches and transforms appointments from blockchain

---

### 3. **Prescriptions.jsx**
**Purpose**: Display and manage patient medical records and prescriptions from blockchain

**Features**:
- Prescription list view fetched from blockchain
- Detailed prescription view with QR code, instructions, doctor info
- Loading states and blockchain connection alerts
- Selection of prescriptions to view details

**Props**: None

**State Variables**:
- `prescriptions`: Array of prescription data from blockchain
- `selectedRxId`: Currently selected prescription ID
- `isLoading`: Loading state

**Data**:
- Prescriptions fetched from blockchain service
- Doctor mapping

**Integration Points**:
- Blockchain service for fetching prescriptions
- QR code representation for verification

---

### 4. **BookingForm.jsx**
**Purpose**: Form component for booking new appointments with blockchain storage

**Features**:
- Department selection dropdown
- Doctor selection filtered by selected department
- Date picker with minimum date validation
- Time slot selection grid
- Reason for visit textarea (optional)
- Form validation and submission to blockchain
- Status messages for pending, success, error

**Props**:
- `onDoctorSelect` (function): Callback to update selected doctor
- `patientId` (string): Patient identifier
- `onSuccess` (function): Callback after successful booking

**State Variables**:
- `selectedDepartment`: Selected department
- `selectedDoctor`: Selected doctor ID
- `selectedDate`: Selected date
- `selectedTime`: Selected time slot
- `reason`: Reason text
- `status`: Submission status object

**Data**:
- Departments: Cardiology, Neurology, Pediatrics
- Doctors organized by department
- Time slots: 9:00 AM to 3:00 PM

**Integration Points**:
- Blockchain service for storing appointments

---

### 5. **DoctorInfo.jsx**
**Purpose**: Display information about the selected doctor

**Features**:
- Doctor name, specialization, experience, availability
- Appointment duration and cancellation policy
- Placeholder when no doctor selected

**Props**:
- `doctorId` (string): ID of the doctor to display

**Data**:
- Mock doctor details for IDs 1, 2, 3

---

## Component Hierarchy

```
App (selectedRole === "patient")
├── PatientNavbar
│   └── Tab Navigation
└── Active Tab Component
    ├── Appointments
    │   ├── BookingForm
    │   └── DoctorInfo
    └── Prescriptions
```

## Data Flow

1. **Navigation**: Navbar updates `activeTab` state in App
2. **Appointment Viewing**: Appointments fetches and displays appointments from blockchain
3. **Booking Mode**: Appointments switches to booking view with BookingForm and DoctorInfo
4. **Doctor Selection**: BookingForm updates selected doctor and notifies DoctorInfo
5. **Blockchain Submission**: BookingForm submits appointment data to blockchain
6. **Prescription Viewing**: Prescriptions fetches and displays prescriptions from blockchain

## Styling

All components use:
- **Tailwind CSS** for styling
- **Lucide React** icons for visual elements
- Consistent color scheme (Blue #0066CC primary)
- Responsive grid layouts
- Smooth transitions and hover effects

## Mock Data

The patient components use mock data for:
- Doctor details in DoctorInfo component
- Department and doctor lists in BookingForm
- Time slots for appointments

Data fetched from blockchain:
- Appointments in Appointments component
- Prescriptions in Prescriptions component

All data storage and retrieval is handled via blockchain services for security and decentralization.

---
