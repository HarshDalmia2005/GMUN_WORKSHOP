import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import blockchainService from "../../services/blockchainService";
import { BLOCKCHAIN_CONFIG } from "../../config/blockchain";


const doctors = {
 Cardiology: [
   { id: 1, name: "Dr. Smith" },
   { id: 2, name: "Dr. Johnson" }
 ],
 Neurology: [
   { id: 3, name: "Dr. Williams" }
 ]
};

const departments = ["Cardiology", "Neurology", "Pediatrics"];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

function BookingForm({ onDoctorSelect, patientId = "patient-001", onSuccess }) {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);

  const availableDoctors =
    selectedDepartment && doctors[selectedDepartment]
      ? doctors[selectedDepartment]
      : [];

  const isFormValid =
    selectedDepartment && selectedDoctor && selectedDate && selectedTime;

  // Helper: Parses 'YYYY-MM-DD' and 'HH:MM AM/PM' into a JS Date object
  function parseDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return new Date();
    
    const [time, meridian] = timeStr.split(" ");
    const [hourStr, minStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    const [y, m, d] = dateStr.split("-");
    // month is 0-indexed in JS Date
    return new Date(Number(y), Number(m) - 1, Number(d), hour, minute, 0);
  }

  const handleBlockchainBooking = async () => {
    if (!isFormValid) return;

    setStatus({ type: "pending", text: "Submitting appointment to blockchain..." });

    try {
      if (!blockchainService.isConnected) {
        await blockchainService.connectWallet();
      }

      // 1. Prepare Doctor ID
      const doctorIdStr = String(selectedDoctor);
      
      // 2. Prepare Date Object
      // The service expects a Date object to call .getTime() internally
      const dt = parseDateTime(selectedDate, selectedTime);

      // 3. Send to Contract
      // Pass 'dt' directly (Date object), NOT the timestamp number
      const res = await blockchainService.storeAppointment(patientId, doctorIdStr, dt);

      setStatus({ type: "success", text: `Appointment stored (tx: ${res.transactionHash?.slice(0, 10) || 'ok'})` });

      // Reset form
      setSelectedDepartment("");
      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedTime("");
      setReason("");

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "Failed to store appointment" });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Select Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedDoctor("");
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Select Doctor
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => {
              setSelectedDoctor(e.target.value);
              onDoctorSelect(e.target.value);
            }}
            disabled={!selectedDepartment}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50"
          >
            <option value="">Choose a doctor</option>
            {availableDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Select Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                disabled={!selectedDate}
                onClick={() => setSelectedTime(slot)}
                className={`px-4 py-2 text-sm rounded-full border ${
                  selectedTime === slot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                } disabled:opacity-40`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Reason for Visit <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
          />
        </div>
        <div>
          <button
            disabled={!isFormValid}
            onClick={handleBlockchainBooking}
            className={`w-full py-3 rounded-lg ${
              isFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Book Appointment (On-Chain)
          </button>

          {status && (
            <p className={`mt-3 text-sm ${status.type === 'error' ? 'text-red-600' : status.type === 'success' ? 'text-green-600' : 'text-gray-700'}`}>
              {status.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;