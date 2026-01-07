import React, { useState } from "react";
import RoleSelection from "./components/RoleSelection";
import BlockchainConnect from "./components/BlockchainConnect";
import blockchainService from "./services/blockchainService";
import { BLOCKCHAIN_CONFIG } from "./config/blockchain";

// Patient Components
import PatientNavbar from "./components/patient/Navbar";
import PatientAppointments from "./components/patient/Appointments";
import PatientPrescriptions from "./components/patient/Prescriptions";

// Doctor Components
import DoctorNavbar from "./components/doctor/Navbar";
import DoctorAppointments from "./components/doctor/Appointments";
import DoctorPrescriptions from "./components/doctor/Prescriptions";
import { useWallet } from "./components/WalletContext";

function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const {connect} = useWallet();
  
  // State for the currently selected doctor profile
  const [currentDoctorId, setCurrentDoctorId] = useState("1");

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setActiveTab(role === "doctor" ? "appointments" : "appointments");
  };

  if (!selectedRole) {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  const renderComponent = () => {
    if (selectedRole === "patient") {
      switch (activeTab) {
        case "appointments":
          return <PatientAppointments />;
        case "prescriptions":
          return <PatientPrescriptions />;
        default:
          return <PatientAppointments />;
      }
    } else if (selectedRole === "doctor") {
      switch (activeTab) {
        case "appointments":
          return <DoctorAppointments currentDoctorId={currentDoctorId} />;
        case "prescriptions":
          return <DoctorPrescriptions currentDoctorId={currentDoctorId} />;
        default:
          return <DoctorAppointments currentDoctorId={currentDoctorId} />;
      }
    }
  };

  const NavbarComponent =
    selectedRole === "patient" ? PatientNavbar : DoctorNavbar;

  const handleLogout = () => {
    setSelectedRole(null);
    setActiveTab("appointments");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Healthcare Portal</h1>
          <BlockchainConnect onConnected={connect} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {selectedRole && (
          <NavbarComponent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            handleLogout={handleLogout}
            currentDoctorId={currentDoctorId}
            setCurrentDoctorId={setCurrentDoctorId}
          />
        )}

        <main className="animate-in fade-in duration-500">
          {selectedRole ? (
            renderComponent()
          ) : (
            <RoleSelection onSelectRole={handleSelectRole} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;