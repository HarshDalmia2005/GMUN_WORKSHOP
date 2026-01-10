import React, { useState, useEffect } from "react";
import {
  Pill,
  FileText,
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
  Loader,
  RefreshCw,
} from "lucide-react";
import blockchainService from "../../services/blockchainService";
import { useWallet } from "../WalletContext";
import { useToast } from "../ToastContext";

export default function DoctorPrescriptions({ currentDoctorId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const { blockchainEnabled, walletAddress } = useWallet();
  const { showToast } = useToast();
  const [patientId, setPatientId] = useState("patient-001");
  const [isLoading, setIsLoading] = useState(true);
  const [isStoring, setIsStoring] = useState(false);

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

  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    drug: "",
    dosage: "",
    instructions: "",
    duration: "",
    type: "",
  });

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      if (blockchainEnabled && walletAddress) {
        const records = await blockchainService.getPrescriptions(patientId);
        if (records && Array.isArray(records)) {
          const transformed = records.map((rx, idx) => ({
            id: `RX-${idx}`,
            patientName: patientId,
            doctorId: rx[0],
            drug: rx[1] || "Unknown Drug",
            dosage: rx[2] || "Unknown Dosage",
            date: new Date(tsToMillis(rx[4])).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            status: "Active",
            instructions: `Duration: ${rx[3] ? rx[3].toString() : '7'} days`,
            duration: rx[3] || 7,
            type: "Blockchain Record",
          }));

          const myPrescriptions = transformed.filter(p => p.doctorId === currentDoctorId);
          setPrescriptions(myPrescriptions);
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

  useEffect(() => {
    fetchPrescriptions();
  }, [blockchainEnabled, walletAddress, patientId, currentDoctorId]);

  const handleCreatePrescription = async () => {
    if (newPrescription.patientName && newPrescription.drug && newPrescription.dosage) {
      if (!blockchainEnabled || !walletAddress) {
        showToast({ type: "error", message: "Connect wallet to store prescriptions" });
        return;
      }

      setIsStoring(true);
      try {
        const tx = await blockchainService.storePrescription(
          patientId,
          currentDoctorId,
          newPrescription.drug,
          newPrescription.dosage,
          // newPrescription.duration
          parseInt(newPrescription.duration) || 7
        );

        showToast({
          type: "success",
          message: `Prescription stored: ${tx.transactionHash ? tx.transactionHash.slice(0, 10) : 'success'}...`,
        });

        setNewPrescription({ patientName: "", drug: "", dosage: "", instructions: "",duration: "", type: "" });
        setIsCreating(false);
        fetchPrescriptions(); // Refresh list after creation
      } catch (err) {
        showToast({ type: "error", message:"Failed to store prescription"});
      } finally {
        setIsStoring(false);
      }
    }
  };

  const handleDeletePrescription = (id) => {
    setPrescriptions(prescriptions.filter((rx) => rx.id !== id));
    if (selectedPrescription?.id === id) setSelectedPrescription(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Prescription Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as Doctor ID: <span className="font-mono font-bold text-blue-600">{currentDoctorId}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchPrescriptions}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Sync
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Prescription
            </button>
          </div>
        </div>

        {!blockchainEnabled && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="text-amber-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-amber-900">Blockchain Wallet Disconnected</p>
              <p className="text-xs text-amber-700">Please connect your wallet to access or issue medical records.</p>
            </div>
          </div>
        )}

        {/* Main Grid: items-start is crucial for sticky column to work */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* List Section (Left) */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
              Recent Patient Records
            </h3>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-100">
                <Loader className="animate-spin text-blue-600 mb-2" />
                <span className="text-sm text-gray-400">Fetching records...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.length > 0 ? (
                  prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      onClick={() => {
                        setSelectedPrescription(rx);
                        setIsCreating(false);
                      }}
                      className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                        selectedPrescription?.id === rx.id && !isCreating
                          ? "border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Pill className="text-blue-600" size={18} />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">
                          {rx.status}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 truncate">{rx.drug}</p>
                      <p className="font-bold text-gray-900 truncate">{rx.duration}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="font-medium text-gray-700">{rx.patientName}</span>
                        <span>•</span>
                        <span>{rx.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400">No prescriptions issued yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail Section (Right - STICKY) */}
          <div className="lg:col-span-2 sticky top-24">
            {isCreating ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">New Prescription Entry</h2>
                  <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Patient ID / Name</label>
                    <input
                      type="text"
                      value={newPrescription.patientName}
                      onChange={(e) => setNewPrescription({...newPrescription, patientName: e.target.value})}
                      placeholder="e.g. PATIENT-001"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Drug Name</label>
                    <input
                      type="text"
                      value={newPrescription.drug}
                      onChange={(e) => setNewPrescription({...newPrescription, drug: e.target.value})}
                      placeholder="e.g. Paracetamol"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dosage</label>
                    <input
                      type="text"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                      placeholder="e.g. 500mg"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                      placeholder="e.g. 7"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Additional Instructions</label>
                    <textarea
                      rows={4}
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                      placeholder="Take after meals..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleCreatePrescription}
                    disabled={isStoring}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                  >
                    {isStoring ? <Loader className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    Store on Blockchain
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedPrescription ? (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold">{selectedPrescription.drug}</h2>
                      <p className="text-slate-400 mt-2 flex items-center gap-2">
                        <Pill size={16} /> {selectedPrescription.dosage}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <FileText className="text-blue-400" size={24} />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-2 gap-12">
                    <section>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Patient Details</h4>
                      <p className="text-lg font-bold text-gray-900">{selectedPrescription.patientName}</p>
                      <p className="text-sm text-gray-500 mt-1">Issued: {selectedPrescription.date}</p>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Clinical Notes</h4>
                      <p className="text-gray-700 italic leading-relaxed">"{selectedPrescription.instructions}"</p>
                    </section>
                  </div>

                  
                </div>
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50 text-gray-400">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <FileText className="text-gray-200" size={32} />
                </div>
                <p className="font-medium text-gray-500">No Record Selected</p>
                <p className="text-xs mt-1">Select a prescription from the list to view full details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}