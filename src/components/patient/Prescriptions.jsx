import React, { useState, useEffect } from "react";
import {
  Pill,
  FileText,
  CheckCircle,
  Clock,
  Download,
  QrCode,
  AlertCircle,
  Loader,
  RefreshCw,
} from "lucide-react";
import blockchainService from "../../services/blockchainService";
import { useWallet } from "../WalletContext";

const DOCTORS = [
  { id: "1", name: "Dr. Smith (Cardiology)" },
  { id: "2", name: "Dr. Johnson (Cardiology)" },
  { id: "3", name: "Dr. Williams (Neurology)" }
];

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedRxId, setSelectedRxId] = useState(null);
  const { blockchainEnabled, walletAddress } = useWallet();
  const [patientId] = useState("patient-001");
  const [isLoading, setIsLoading] = useState(true);

  const tsToMillis = (v) => {
    if (!v) return Date.now();
    try {
      if (typeof v === 'bigint') return Number(v) * 1000;
      if (typeof v === 'object' && v !== null && typeof v.toNumber === 'function') return v.toNumber() * 1000;
      return Number(v) * 1000;
    } catch (e) {
      return Date.now();
    }
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
      try {
        if (blockchainEnabled && walletAddress) {
          const records = await blockchainService.getPrescriptions(patientId);
          if (records && Array.isArray(records)) {
            const transformed = records.map((rx, idx) => ({
              id: `RX-${idx}`,
              doctor: rx[0] || "Unknown Doctor",
              drug: rx[1] || "Unknown Drug",
              dosage: rx[2] || "Unknown Dosage",
              duration: rx[3],
              date: new Date(tsToMillis(rx[4])).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              }),
              status: "Active",
              instructions: `Duration: ${rx[3] ? rx[3].toString() : '7'} days`,
              type: "Prescription",
            }));
            setPrescriptions(transformed);
            if (transformed.length > 0) setSelectedRxId(transformed[0].id);
          }
        } else {
          setPrescriptions([]);
        }
      } catch (err) {
        console.warn("Failed to fetch prescriptions:", err);
        setPrescriptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrescriptions();
  }, [blockchainEnabled, walletAddress, patientId]);

  const selectedRx = prescriptions.find((rx) => rx.id === selectedRxId);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Medical Records Vault
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Access your decentralized prescriptions stored on blockchain.
          </p>
        </div>

        {!blockchainEnabled && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <p className="text-sm font-medium text-yellow-800">Blockchain not connected. Connect wallet at the top.</p>
          </div>
        )}

        {/* MAIN GRID - items-start is required for sticky to work */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Scrollable Prescription List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
              Recent Records
            </h3>
            
            {/* Scrollable Container */}
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-8"><Loader className="animate-spin text-blue-600" /></div>
              ) : prescriptions.length > 0 ? (
                prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRxId(rx.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                      selectedRxId === rx.id
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-white rounded-lg border border-gray-100"><Pill className={selectedRxId === rx.id ? "text-blue-600" : "text-gray-400"} size={18} /></div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${rx.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{rx.status}</span>
                    </div>
                    <p className="font-bold text-gray-900 truncate">{rx.drug}</p>
                    <p className="text-xs text-gray-500 mt-1">{DOCTORS.find(d => d.id === rx.doctor)?.name || rx.doctor} • {rx.date}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">No prescriptions found.</div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Prescription Details */}
          <div className="lg:col-span-2 sticky top-24">
            {selectedRx ? (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
                <div className="bg-slate-900 p-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold">{selectedRx.drug}</h2>
                      <p className="text-slate-400 mt-1">{selectedRx.type} • {selectedRx.dosage}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-lg"><QrCode size={64} className="text-slate-900" /></div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Clock size={14} /> Usage Instructions</h4>
                      <p className="text-gray-800 leading-relaxed italic">"{selectedRx.instructions}"</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><CheckCircle size={14} /> Issuing Doctor</h4>
                      <p className="text-gray-800 font-medium">{DOCTORS.find(d => d.id === selectedRx.doctor)?.name || selectedRx.doctor}</p>
                      <p className="text-xs text-gray-500 mt-1">Verified via Blockchain License</p>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="h-125 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 bg-gray-50">
                <FileText size={48} className="mb-4 text-gray-200" />
                <p className="font-medium">Select a record to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}