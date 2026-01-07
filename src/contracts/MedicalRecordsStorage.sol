// Smart Contract for Medical Records Storage on Blockchain
// Deploy on Polygon Mumbai (Testnet) for low gas fees
// This contract stores medical data references on-chain

/*
SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecordsStorage {
  // Patient structure
  struct MedicalRecord {
    string recordType; // "prescription", "appointment", "labReport", etc.
    string ipfsHash; // Hash of data stored on IPFS
    uint256 timestamp;
  }

  struct Prescription {
    string doctorId;
    string medication;
    string dosage;
    uint256 duration; // in days
    uint256 timestamp;
  }

  struct Appointment {
    string doctorId;
    uint256 appointmentDate;
    bool isCompleted;
  }

  // Patient => Medical Records mapping
  mapping(string => MedicalRecord[]) public patientRecords;
  mapping(string => Prescription[]) public patientPrescriptions;
  mapping(string => Appointment[]) public patientAppointments;

  // Access control
  mapping(string => mapping(string => bool)) public hasAccess; // patientId => doctorId => hasAccess
  mapping(string => address) public patientWallets;

  // Events
  event MedicalRecordStored(string indexed patientId, string recordType, string ipfsHash, uint256 timestamp);
  event PrescriptionStored(string indexed patientId, string doctorId, string medication, uint256 timestamp);
  event AppointmentStored(string indexed patientId, string doctorId, uint256 appointmentDate);
  event AccessGranted(string indexed patientId, string indexed doctorId);
  event AccessRevoked(string indexed patientId, string indexed doctorId);

  // Store medical record (IPFS hash references)
  function storeMedicalRecord(
    string memory patientId,
    string memory recordType,
    string memory ipfsHash
  ) public {
    MedicalRecord memory record = MedicalRecord({
      recordType: recordType,
      ipfsHash: ipfsHash,
      timestamp: block.timestamp
    });

    patientRecords[patientId].push(record);
    emit MedicalRecordStored(patientId, recordType, ipfsHash, block.timestamp);
  }

  // Get medical records for patient
  function getMedicalRecords(string memory patientId)
    public
    view
    returns (MedicalRecord[] memory)
  {
    return patientRecords[patientId];
  }

  // Store prescription
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

  // Get prescriptions for patient
  function getPrescriptions(string memory patientId)
    public
    view
    returns (Prescription[] memory)
  {
    return patientPrescriptions[patientId];
  }

  // Store appointment
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

  // Get appointments for patient
  function getAppointments(string memory patientId)
    public
    view
    returns (Appointment[] memory)
  {
    return patientAppointments[patientId];
  }

  // Grant doctor access to patient records
  function grantAccess(string memory patientId, string memory doctorId) public {
    hasAccess[patientId][doctorId] = true;
    emit AccessGranted(patientId, doctorId);
  }

  // Revoke doctor access
  function revokeAccess(string memory patientId, string memory doctorId) public {
    hasAccess[patientId][doctorId] = false;
    emit AccessRevoked(patientId, doctorId);
  }

  // Check if doctor has access
  function checkAccess(string memory patientId, string memory doctorId)
    public
    view
    returns (bool)
  {
    return hasAccess[patientId][doctorId];
  }
}
*/

// Deployment Instructions:
// 1. Deploy on Polygon Mumbai Testnet: https://mumbai.polygonscan.com/
// 2. Get test MATIC from faucet: https://faucet.polygon.technology/
// 3. Replace CONTRACT_ADDRESS in blockchainService.js with deployed address
// 4. Update contract ABI if needed
