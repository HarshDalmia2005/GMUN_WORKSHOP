import React, { useState } from "react";
import RoleSelection from "./components/RoleSelection";
import BlockchainConnect from "./components/BlockchainConnect";
import { useWallet } from "./components/WalletContext";

// Patient Components
import PatientNavbar from "./components/patient/Navbar";
import PatientAppointments from "./components/patient/Appointments";
import PatientPrescriptions from "./components/patient/Prescriptions";

// Doctor Components
import DoctorNavbar from "./components/doctor/Navbar";
import DoctorAppointments from "./components/doctor/Appointments";
import DoctorPrescriptions from "./components/doctor/Prescriptions";

function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const { connect } = useWallet();
  const [currentDoctorId, setCurrentDoctorId] = useState("1");

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setActiveTab("appointments");
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setActiveTab("appointments");
  };

  // 1. Early return for Role Selection to keep the main return clean
  if (!selectedRole) {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  // 2. Logic to determine which Navbar to show
  const NavbarComponent = selectedRole === "patient" ? PatientNavbar : DoctorNavbar;

  // 3. Logic to determine which Main Content to show
  const renderComponent = () => {
    const components = {
      patient: {
        appointments: <PatientAppointments />,
        prescriptions: <PatientPrescriptions />,
      },
      doctor: {
        appointments: <DoctorAppointments currentDoctorId={currentDoctorId} />,
        prescriptions: <DoctorPrescriptions currentDoctorId={currentDoctorId} />,
      }
    };

    return components[selectedRole][activeTab] || components[selectedRole]["appointments"];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-13">
            <div 
              className="text-2xl font-bold text-blue-600 tracking-tight cursor-pointer" 
              onClick={() => setActiveTab("appointments")}
            >
              MedChain
            </div>
            
            <div className="flex items-center gap-4">
              <BlockchainConnect onConnected={connect} />
              {/* Optional: Add a mobile menu toggle here */}
            </div>
          </div>
        </div>

        {/* Role-Specific Navigation (Integrated into the same sticky header) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavbarComponent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            handleLogout={handleLogout}
            currentDoctorId={currentDoctorId}
            setCurrentDoctorId={setCurrentDoctorId}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {renderComponent()}
      </main>
    </div>
  );
}

export default App;