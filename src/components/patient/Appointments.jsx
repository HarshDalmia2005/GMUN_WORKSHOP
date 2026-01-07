import { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import DoctorInfo from "./DoctorInfo";
import blockchainService from "../../services/blockchainService";
import { Upload, AlertCircle, Hash, Calendar, Clock, CheckCircle } from "lucide-react";
import { useWallet } from "../WalletContext";


const doctorNames = {
  "1": "Dr. Smith",
  "2": "Dr. Johnson",
  "3": "Dr. Williams"
};

function Appointments() {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
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
          // Original Contract Struct: { string doctorId; uint256 appointmentDate; bool isCompleted; }
          const transformed = records.map((appt, idx) => {
            // Conversions
            const rawTimestamp = appt[1]; // Index 1 is the uint256
            const timestampNum = Number(rawTimestamp); // Convert BigNumber to JS Number
            const dateObj = new Date(timestampNum * 1000); // Convert seconds to millis

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
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Book an Appointment
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Select a doctor and preferred time
              </p>
            </div>
          </div>

          {!blockchainEnabled && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={20} />
              <div>
                <p className="text-sm font-medium text-yellow-800">Blockchain not connected</p>
                <p className="text-xs text-yellow-700">Connect your wallet at the top to enable blockchain storage</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <BookingForm 
                onDoctorSelect={setSelectedDoctorId} 
                patientId={patientId} 
                onSuccess={fetchAppointments} 
              />
            </div>
            <div className="lg:col-span-1">
              <DoctorInfo doctorId={selectedDoctorId} />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Scheduled Appointments</h2>
            {isLoading ? (
              <p className="text-gray-500">Loading appointments from blockchain...</p>
            ) : appointments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No appointments found on blockchain.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Appointments;