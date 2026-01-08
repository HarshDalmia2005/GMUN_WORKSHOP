import { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import DoctorInfo from "./DoctorInfo";
import blockchainService from "../../services/blockchainService";
import { AlertCircle, Calendar, Clock, Plus, ArrowLeft } from "lucide-react";
import { useWallet } from "../WalletContext";

const doctorNames = {
  "1": "Dr. Smith",
  "2": "Dr. Johnson",
  "3": "Dr. Williams"
};

function Appointments() {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isBooking, setIsBooking] = useState(false); 
  const { blockchainEnabled, setBlockchainEnabled, walletAddress } = useWallet();
  const [patientId] = useState("patient-001");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBlockchainEnabled(blockchainService.isConnected);
  }, [setBlockchainEnabled]);

  const fetchAppointments = async () => {
    if (blockchainEnabled && walletAddress) {
      setIsLoading(true);
      try {
        const records = await blockchainService.getAppointments(patientId);
        if (records && Array.isArray(records)) {
          const transformed = records.map((appt, idx) => {
            const rawTimestamp = appt[1];
            const timestampNum = Number(rawTimestamp);
            const dateObj = new Date(timestampNum * 1000);

            return {
              id: idx,
              doctorId: appt[0],
              doctorName: doctorNames[appt[0]] || `Doctor #${appt[0]}`,
              timestamp: rawTimestamp,
              date: dateObj.toLocaleDateString(),
              time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isCompleted: appt[2]
            };
          });
          setAppointments(transformed);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [blockchainEnabled, walletAddress, patientId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isBooking ? "Book an Appointment" : "Your Scheduled Appointments"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isBooking ? "Select a doctor and preferred time" : "Review your upcoming and past medical visits"}
            </p>
          </div>
          
          {/* Action Button */}
          {!isBooking ? (
            <button 
              onClick={() => setIsBooking(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <Plus size={18} /> Book Appointment
            </button>
          ) : (
            <button 
              onClick={() => setIsBooking(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
          )}
        </div>

        {/* Status Alerts */}
        {!blockchainEnabled && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <div>
              <p className="text-sm font-medium text-yellow-800">Blockchain not connected</p>
              <p className="text-xs text-yellow-700">Connect your wallet to enable storage.</p>
            </div>
          </div>
        )}

        {/* Main Content Switcher */}
        {!isBooking ? (
          <div className="pb-10">
            {isLoading ? (
              <p className="text-gray-500">Loading appointments from blockchain...</p>
            ) : appointments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appt) => (
                  <div key={appt.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {appt.doctorName.charAt(4)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{appt.doctorName}</p>
                          <p className="text-xs text-gray-500">ID: {appt.doctorId}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${appt.isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {appt.isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{appt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span>{appt.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No appointments found on blockchain.</p>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: BOOKING LAYOUT */
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <BookingForm 
                onDoctorSelect={setSelectedDoctorId} 
                patientId={patientId} 
                onSuccess={() => {
                  fetchAppointments();
                  setIsBooking(false); // Go back to list on success
                }} 
              />
            </div>
            <div className="lg:col-span-1">
              <DoctorInfo doctorId={selectedDoctorId} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Appointments;