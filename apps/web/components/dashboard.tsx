"use client";

import { useState, useEffect } from "react";
import { ClinicProfile, Patient } from "@/lib/types";
import { getPatients, searchPatients } from "@/lib/db";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import PatientForm from "./patient-form";
import PatientDetails from "./patient-details";
import PrescriptionForm from "./prescription-form";

interface DashboardProps {
  clinic: ClinicProfile;
  onClinicUpdate: (clinic: ClinicProfile) => void;
}

type Screen = "patients" | "patient-details" | "new-prescription";

export default function Dashboard({ clinic, onClinicUpdate }: DashboardProps) {
  const [screen, setScreen] = useState<Screen>("patients");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const allPatients = await getPatients();
      setPatients(allPatients);
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchPatients(query);
      setPatients(results);
    } else {
      await loadPatients();
    }
  }

  function handlePatientSelect(patient: Patient) {
    setSelectedPatient(patient);
    setScreen("patient-details");
  }

  function handlePatientCreate(patient: Patient) {
    setPatients([...patients, patient]);
    setSelectedPatient(patient);
    setSearchQuery("");
    setScreen("patient-details");
  }

  function handleNewPrescription() {
    setScreen("new-prescription");
  }

  function handlePrescriptionComplete() {
    setScreen("patient-details");
  }

  if (screen === "new-prescription" && selectedPatient) {
    return (
      <PrescriptionForm
        clinic={clinic}
        patient={selectedPatient}
        onComplete={handlePrescriptionComplete}
        onBack={() => setScreen("patient-details")}
      />
    );
  }

  if (screen === "patient-details" && selectedPatient) {
    return (
      <PatientDetails
        patient={selectedPatient}
        onNewPrescription={handleNewPrescription}
        onBack={() => setScreen("patients")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{clinic.name}</h1>
              <p className="text-sm text-muted-foreground">Dr. {clinic.doctorName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Patients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="mb-4"
                />

                {loading ? (
                  <div className="text-center text-muted-foreground">
                    Loading patients...
                  </div>
                ) : patients.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No patients found. Create your first patient.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full text-left p-3 rounded border hover:bg-accent transition"
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age && `Age: ${patient.age}`}
                          {patient.phone && ` • ${patient.phone}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <PatientForm onPatientCreate={handlePatientCreate} />
          </div>
        </div>
      </main>
    </div>
  );
}
