import { LogOut, User } from "lucide-react";

// Mock doctor list matching the patient's booking data
const DOCTORS = [
  { id: "1", name: "Dr. Smith (Cardiology)" },
  { id: "2", name: "Dr. Johnson (Cardiology)" },
  { id: "3", name: "Dr. Williams (Neurology)" }
];

function Navbar({ activeTab, setActiveTab, currentDoctorId, setCurrentDoctorId }) {
  const navItems = [
    { name: "Appointments", id: "appointments" },
    { name: "Prescriptions", id: "prescriptions" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-14">
            <div className="text-xl font-bold text-blue-600 tracking-tight cursor-pointer" onClick={() => setActiveTab("appointments")}>
              MedChain
            </div>
            <div className="flex gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-sm transition-all duration-200 pb-5 mt-5 border-b-2 ${
                    activeTab === item.id
                      ? "text-blue-600 font-semibold border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Doctor Profile Switcher */}
            {setCurrentDoctorId && (
              <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor:</span>
                <select 
                  value={currentDoctorId} 
                  onChange={(e) => setCurrentDoctorId(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer border-none focus:ring-0"
                >
                  {DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="hidden md:block text-right">
              <p className="text-[10px] text-gray-400 font-mono">0x71C...89</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;