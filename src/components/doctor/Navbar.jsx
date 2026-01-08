import { LogOut, User } from "lucide-react";

// Mock doctor list
const DOCTORS = [
  { id: "1", name: "Dr. Smith (Cardiology)" },
  { id: "2", name: "Dr. Johnson (Cardiology)" },
  { id: "3", name: "Dr. Williams (Neurology)" }
];

function Navbar({ activeTab, setActiveTab, currentDoctorId, setCurrentDoctorId, handleLogout }) {
  const navItems = [
    { name: "Appointments", id: "appointments" },
    { name: "Prescriptions", id: "prescriptions" },
  ];

  return (
    <div className="flex items-center justify-between">
      {/* Left Side: Navigation Tabs */}
      <div className="flex items-center gap-10">
        <div className="flex gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-sm font-medium transition-all duration-200 py-4 border-b-2 -mb-px ${
                activeTab === item.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Profile & Switcher */}
      <div className="flex items-center gap-4">
        {/* Doctor Profile Switcher */}
        {setCurrentDoctorId && (
          <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Profile:
            </span>
            <select
              value={currentDoctorId}
              onChange={(e) => setCurrentDoctorId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer border-none focus:ring-0 p-0"
            >
              {DOCTORS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;