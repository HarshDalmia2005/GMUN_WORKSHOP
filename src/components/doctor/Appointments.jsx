import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText, AlertCircle, RefreshCw } from "lucide-react";
import blockchainService from "../../services/blockchainService";
import { useWallet } from "../WalletContext";

const KNOWN_PATIENTS = ["patient-001", "patient-002"];

export default function DoctorAppointments({ currentDoctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { blockchainEnabled, walletAddress } = useWallet();

  const fetchAppointments = async () => {
    if (blockchainEnabled && walletAddress) {
      setIsLoading(true);
      const relevantAppointments = [];

      try {
        for (const patientId of KNOWN_PATIENTS) {
          try {
            const records = await blockchainService.getAppointments(patientId);
            
            if (records && Array.isArray(records)) {
              const mapped = records.map((r, idx) => ({
                id: `${patientId}-${idx}`,
                patientId: patientId,
                doctorId: r[0],
                timestamp: r[1],
                isCompleted: r[2],
                date: new Date(Number(r[1]) * 1000).toLocaleDateString(),
                time: new Date(Number(r[1]) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }));

              // FILTER: Keep only appointments for the current doctor
              const myAppointments = mapped.filter(appt => appt.doctorId === currentDoctorId);
              relevantAppointments.push(...myAppointments);
            }
          } catch (e) {
            console.warn(`Could not fetch for ${patientId}`, e);
          }
        }

        relevantAppointments.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
        setAppointments(relevantAppointments);

      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [blockchainEnabled, walletAddress, currentDoctorId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              My Schedule
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Viewing appointments for Doctor ID: <span className="font-mono font-bold">{currentDoctorId}</span>
            </p>
          </div>
          <button 
            onClick={fetchAppointments}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {!blockchainEnabled && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <div>
              <p className="text-sm font-medium text-yellow-800">Blockchain disconnected</p>
              <p className="text-xs text-yellow-700">Connect wallet to view patient schedule</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {appointments.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Patient ID: {appt.patientId}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {appt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {appt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appt.isCompleted 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {appt.isCompleted ? "Completed" : "Scheduled"}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-blue-600 border border-gray-200 rounded-lg hover:bg-white transition-all">
                        <FileText size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No Appointments Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  No appointments found for Doctor ID {currentDoctorId} on the blockchain. 
                  (Checked patients: {KNOWN_PATIENTS.join(", ")})
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}