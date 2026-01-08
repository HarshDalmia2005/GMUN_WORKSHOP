import { LogOut, User } from "lucide-react";

function Navbar({ activeTab, setActiveTab, handleLogout }) {
  const navItems = [
    { name: "Appointments", id: "appointments" },
    { name: "Prescriptions", id: "prescriptions" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-14">
            {/* <div className="text-xl font-bold text-blue-600 tracking-tight cursor-pointer" onClick={() => setActiveTab("appointments")}>
              MedChain
            </div> */}
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
            
            <div className="hidden md:block text-right">
              <p className=" text-gray-400 font-mono">Patient Portal</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleLogout()}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;