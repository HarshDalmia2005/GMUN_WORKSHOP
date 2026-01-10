/*
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MedicalRecordsStorage {

  struct Prescription {
    string doctorId;
    string medication;
    string dosage;
    uint256 duration; 
    uint256 timestamp;
  }

  struct Appointment {
    string doctorId;
    uint256 appointmentDate;
    bool isCompleted;
  }

  mapping(string => Prescription[]) public patientPrescriptions;
  mapping(string => Appointment[]) public patientAppointments;

  event PrescriptionStored(string indexed patientId, string doctorId, string medication, uint256 timestamp);
  event AppointmentStored(string indexed patientId, string doctorId, uint256 appointmentDate);
 
  function storePrescription(
    string memory patientId,
    string memory doctorId,
    string memory medication,
    string memory dosage,
    uint256 duration
  ) public {
    Prescription memory prescription = Prescription({
      doctorId: doctorId,
      medication: medication,
      dosage: dosage,
      duration: duration,
      timestamp: block.timestamp
    });

    patientPrescriptions[patientId].push(prescription);
    emit PrescriptionStored(patientId, doctorId, medication, block.timestamp);
  }

  function getPrescriptions(string memory patientId)
    public
    view
    returns (Prescription[] memory)
  {
    return patientPrescriptions[patientId];
  }

  function storeAppointment(
    string memory patientId,
    string memory doctorId,
    uint256 appointmentDate
  ) public {
    Appointment memory appointment = Appointment({
      doctorId: doctorId,
      appointmentDate: appointmentDate,
      isCompleted: false
    });

    patientAppointments[patientId].push(appointment);
    emit AppointmentStored(patientId, doctorId, appointmentDate);
  }

  function getAppointments(string memory patientId)
    public
    view
    returns (Appointment[] memory)
  {
    return patientAppointments[patientId];
  }

}
*/
