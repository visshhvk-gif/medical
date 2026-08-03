"use client";

import { useState, useEffect } from "react";
import { Patient, Prescription } from "@/lib/types";
import { getPatientPrescriptions } from "@/lib/db";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { format } from "date-fns";

interface PatientDetailsProps {
  patient: Patient;
  onNewPrescription: () => void;
  onBack: () => void;
}

export default function PatientDetails({
  patient,
  onNewPrescription,
  onBack,
}: PatientDetailsProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, [patient.id]);

  async function loadPrescriptions() {
    try {
      const data = await getPatientPrescriptions(patient.id);
      setPrescriptions(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <div className="text-sm text-muted-foreground mt-1">
              {patient.age && `Age: ${patient.age}`}
              {patient.gender && ` • ${patient.gender}`}
              {patient.phone && ` • ${patient.phone}`}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prescriptions</CardTitle>
              <Button onClick={onNewPrescription}>+ New Prescription</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">
                  Loading...
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No prescriptions yet. Create one to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4 border rounded hover:bg-accent transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">
                            {prescription.diagnosis}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {prescription.medicines.length} medicine
                            {prescription.medicines.length !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(
                              new Date(prescription.createdAt),
                              "PPP p"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
