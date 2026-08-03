export interface ClinicProfile {
  id: string;
  name: string;
  doctorName: string;
  registrationNumber: string;
  address: string;
  phone?: string;
  logoUrl?: string;
}

export interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: "M" | "F" | "Other";
  phone?: string;
  address?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  clinicId: string;
  diagnosis: string;
  medicines: Medicine[];
  advice: string;
  followUpDate?: string;
  createdAt: number;
  printedAt?: number;
}

export interface CommonMedicine {
  id: string;
  name: string;
  dosages: string[];
  frequencies: string[];
}
