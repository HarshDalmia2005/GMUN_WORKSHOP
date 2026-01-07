# Doctor Components

This directory contains all React components for the **Doctor** role in the MedChain appointment booking application.

## Components Overview

### 1. **Navbar.jsx**
**Purpose**: Navigation header for doctor interface

**Features**:
- Displays the MedChain logo (clickable to go to appointments)
- Navigation tabs specific to doctor role:
  - **Appointments**: View and manage appointment schedule
  - **Patients**: Access and manage patient records
  - **Prescriptions**: Issue and track prescriptions
  - **Profile**: Manage professional information
- Wallet/User address display
- User avatar icon
- Logout button

**Props**:
- `activeTab` (string): Currently active tab
- `setActiveTab` (function): Function to change active tab

**State Management**: None (receives state from parent)

**Differences from Patient Navbar**:
- Includes "Patients" tab instead of "Prescriptions" as primary tab
- "Prescriptions" tab for issuing rather than viewing

---

### 2. **Appointments.jsx**
**Purpose**: Doctor's schedule management and appointment handling

**Features**:

**Appointment List View**:
- Displays all upcoming appointments
- Filter by status: All, Confirmed, Pending, Completed, Cancelled
- Each appointment shows:
  - Patient name
  - Reason for visit
  - Status badge (color-coded)
  - Date and time
- Click to select appointment for details

**Appointment Details Panel**:
- Patient information with avatar
- Email address (clickable)
- Phone number
- Date and time of appointment
- Department information
- Reason for visit
- Action buttons:
  - **Complete**: Mark appointment as completed
  - **Cancel**: Cancel the appointment
- Status indicator

**Functionality**:
- Real-time filtering by appointment status
- Click-to-select interface for appointment details
- Responsive 3-column layout (2 col for list, 1 col for details)

**Props**: None

**State Variables**:
- `selectedAppointment`: Currently selected appointment object
- `filterStatus`: Current status filter

**Mock Data**:
- 3 sample appointments with various statuses
- Patient contact information included

**Status Color Coding**:
- Confirmed: Green
- Pending: Yellow
- Completed: Blue
- Cancelled: Red

---

### 3. **Patients.jsx**
**Purpose**: Patient management and medical record access

**Features**:

**Patient Search**:
- Real-time search by:
  - Patient name
  - Email address
  - Phone number
- Search bar with icon

**Patient List**:
- Displays all patients with visit count
- Shows total patient count
- Scrollable list with hover effects
- Selection highlighting

**Patient Profile Card**:
- Patient name and ID
- Contact information:
  - Email
  - Phone number
- Medical Information:
  - Blood type
  - Known conditions
- Visit History:
  - Total number of visits
  - Last visit date
- Action buttons:
  - **View Records**: Access complete medical records
  - **Schedule Appointment**: Create new appointment

**Functionality**:
- Dynamic filtering based on search input
- Click-to-select patient interface
- Color-coded sections for different information types
- Empty state message when no patient is selected

**Props**: None

**State Variables**:
- `selectedPatient`: Currently selected patient object
- `searchTerm`: Current search input

**Mock Data**:
- 4 sample patients with complete information
- Visit history and medical conditions

---

### 4. **Prescriptions.jsx**
**Purpose**: Issue and manage patient prescriptions

**Features**:

**Prescription List**:
- Shows recently issued prescriptions
- Each prescription displays:
  - Drug name
  - Patient name
  - Dosage
  - Issue date
  - Status badge (Active/Fulfilled)
- Selection highlighting

**Create Prescription Form**:
- Modal-style form with fields:
  - Patient name (required)
  - Drug name (required)
  - Dosage (required)
  - Type/Category (e.g., Antibiotic, Diabetes)
  - Instructions (textarea for detailed usage)
- Form validation
- Save and Cancel buttons

**Prescription Details View**:
- Dark header with prescription information
- Token ID (blockchain reference)
- Drug name and type
- Dosage information
- Patient information
- Usage instructions
- Issuing details
- IPFS hash for decentralized storage
- Action buttons:
  - **Edit**: Modify prescription
  - **Delete**: Remove prescription

**Functionality**:
- Create new prescriptions for patients
- View detailed prescription information
- Edit existing prescriptions
- Delete prescriptions
- Display decentralized storage references (IPFS)
- Status management (Active/Fulfilled)

**Props**: None

**State Variables**:
- `prescriptions`: Array of all issued prescriptions
- `isCreating`: Boolean for create form visibility
- `selectedPrescription`: Currently selected prescription
- `newPrescription`: Form data for new prescription

**Mock Data**:
- 2 sample prescriptions with full details
- Includes IPFS hash references
- Status information

**Features**:
- Real-time prescription creation
- Automatic ID generation based on timestamp
- Automatic date assignment
- Responsive 3-column layout

---

### 5. **Profile.jsx**
**Purpose**: Doctor profile and professional credential management

**Features**:

**Personal Information Section**:
- First and last name
- Email address
- Phone number

**Professional Information Section**:
- Specialization (e.g., Cardiology)
- Department name
- Hospital/Clinic name

**Credentials Section**:
- Medical license number
- Registration number
- Qualifications (MBBS, MD, etc.)

**Availability & Rates Section**:
- Years of experience
- Available days (e.g., Monday to Friday)
- Availability time (e.g., 9:00 AM - 5:00 PM)
- Appointment slot duration (in minutes)
- Consultation fee

**Professional Bio Section**:
- Large textarea for professional biography
- Describes expertise and experience

**Functionality**:
- Edit mode toggle for updating information
- Form validation
- Save/Cancel buttons
- View mode shows information in read-only format
- Edit mode shows input fields for modification
- Dynamic InputField component rendering

**Props**: None

**State Variables**:
- `isEditing`: Boolean for edit mode
- `formData`: Object containing all profile fields

**Key Features**:
- Credential verification emphasis
- Professional information organization
- Important note about accuracy and verification
- Responsive grid layout (2 columns on large screens)
- Support for various input types

---

## Component Hierarchy

```
App (selectedRole === "doctor")
├── DoctorNavbar
│   └── Tab Navigation
└── Active Tab Component
    ├── Appointments
    ├── Patients
    ├── Prescriptions
    └── Profile
```

## Data Flow

1. **Navigation**: Navbar updates `activeTab` state in App
2. **Appointment Selection**: Appointments component manages selection internally
3. **Patient Selection**: Patients component manages search and selection internally
4. **Prescription Management**: Prescriptions component handles CRUD operations locally
5. **Profile Updates**: Profile component manages form state and saves locally

## Styling

All components use:
- **Tailwind CSS** for styling
- **Lucide React** icons for visual elements
- Consistent color scheme (Blue #0066CC primary, Green for doctor-specific actions)
- Responsive grid layouts
- Smooth transitions and hover effects
- Status badges with color coding

## Mock Data

The doctor components use mock data for:
- Doctor appointments with patient information
- Patient list with medical history
- Issued prescriptions
- Doctor credentials and availability

In production, these would be fetched from:
- Backend API for appointments and patient data
- Database for prescription records
- Blockchain/IPFS for prescription verification and storage
- Smart contracts for credential verification

---

## Key Differences from Patient Components

| Feature | Patient | Doctor |
|---------|---------|--------|
| Appointments | Book new | View & manage schedule |
| Prescriptions | View only | Issue & manage |
| Profile | Personal & medical | Professional & credentials |
| Patients | Not applicable | Full patient management |
| Primary Actions | Booking, viewing | Managing, issuing |

---

## Future Enhancements

- [ ] Integration with backend API for real appointment data
- [ ] Blockchain integration for prescription verification and issuance
- [ ] Real-time patient booking notifications
- [ ] Video/audio consultation features
- [ ] Electronic signature for prescriptions
- [ ] Patient communication/messaging system
- [ ] Appointment analytics and statistics
- [ ] Prescription analytics and compliance tracking
- [ ] Calendar view for appointments
- [ ] Bulk prescription generation
- [ ] Integration with pharmacy systems for prescription fulfillment
- [ ] Smart contract for payment and commission management
