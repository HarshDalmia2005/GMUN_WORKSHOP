import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, AlertCircle, RefreshCw, History } from "lucide-react";
import blockchainService from "../../services/blockchainService";
import { useWallet } from "../WalletContext";

const KNOWN_PATIENTS = ["patient-001", "patient-002"];
const DOCTORS = [
  { id: "1", name: "Dr. Smith (Cardiology)" },
  { id: "2", name: "Dr. Johnson (Cardiology)" },
  { id: "3", name: "Dr. Williams (Neurology)" }
];

export default function DoctorAppointments({ currentDoctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { blockchainEnabled, walletAddress } = useWallet();

  const currentDoctor = DOCTORS.find(d => d.id === currentDoctorId);

  const fetchAppointments = async () => {
    if (!blockchainEnabled || !walletAddress) return;

    setIsLoading(true);
    const relevantAppointments = [];
    const now = Date.now();

    try {
      for (const patientId of KNOWN_PATIENTS) {
        try {
          const records = await blockchainService.getAppointments(patientId);
          
          if (records && Array.isArray(records)) {
            const mapped = records.map((r, idx) => {
              const apptTimestamp = Number(r[1]) * 1000;
              const isPast = apptTimestamp < now;
              const isCompleted = r[2];

              // Determine Status
              let statusLabel = "Active";
              let statusColor = "bg-blue-100 text-blue-700 border-blue-200";

              if (isCompleted) {
                statusLabel = "Completed";
                statusColor = "bg-green-100 text-green-700 border-green-200";
              } else if (isPast) {
                statusLabel = "Past / Expired";
                statusColor = "bg-gray-100 text-gray-500 border-gray-200";
              }

              return {
                id: `${patientId}-${idx}`,
                patientId: patientId,
                doctorId: r[0],
                timestamp: r[1],
                isCompleted,
                isPast,
                statusLabel,
                statusColor,
                date: new Date(apptTimestamp).toLocaleDateString("en-US", {
                  year: 'numeric', month: 'short', day: 'numeric'
                }),
                time: new Date(apptTimestamp).toLocaleTimeString([], { 
                  hour: '2-digit', minute: '2-digit' 
                })
              };
            });

            const myAppointments = mapped.filter(appt => appt.doctorId === currentDoctorId);
            relevantAppointments.push(...myAppointments);
          }
        } catch (e) {
          console.warn(`Could not fetch for ${patientId}`, e);
        }
      }

      // Sorting: Upcoming first (Ascending)
      relevantAppointments.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
      setAppointments(relevantAppointments);

    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [blockchainEnabled, walletAddress, currentDoctorId]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              Doctor Schedule
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentDoctor?.name} • Doctor ID: {currentDoctorId}
            </p>
          </div>
          <button 
            onClick={fetchAppointments}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm transition-all"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Sync
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 text-sm">Accessing Ledger...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {appointments.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <div 
                    key={appt.id} 
                    className={`p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${appt.isPast && !appt.isCompleted ? 'opacity-60 grayscale-[0.5]' : 'hover:bg-blue-50/30'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${appt.isPast ? 'bg-gray-100' : 'bg-blue-100'}`}>
                        {appt.isPast ? <History className="w-6 h-6 text-gray-400" /> : <User className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {appt.patientId}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                            <Calendar size={14} className="text-gray-400" />
                            {appt.date}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                            <Clock size={14} className="text-gray-400" />
                            {appt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${appt.statusColor}`}>
                        {appt.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50/20">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No Appointments Found</h3>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}