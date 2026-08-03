"use client";

import { useState } from "react";
import { ClinicProfile, Patient, Prescription, Medicine } from "@/lib/types";
import { savePrescription, getLatestPrescription } from "@/lib/db";
import { searchMedicines, getMedicineByName } from "@/lib/medicines";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import MedicineSelector from "./medicine-selector";
import PrescriptionPreview from "./prescription-preview";

interface PrescriptionFormProps {
  clinic: ClinicProfile;
  patient: Patient;
  onComplete: () => void;
  onBack: () => void;
}

export default function PrescriptionForm({
  clinic,
  patient,
  onComplete,
  onBack,
}: PrescriptionFormProps) {
  const [screen, setScreen] = useState<"form" | "preview">("form");
  const [loading, setLoading] = useState(false);
  const [useLastPrescription, setUseLastPrescription] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: "",
    medicines: [] as Medicine[],
    advice: "",
    followUpDate: "",
  });

  async function handleUseLastPrescription() {
    try {
      const lastPrescription = await getLatestPrescription(patient.id);
      if (lastPrescription) {
        setFormData({
          diagnosis: lastPrescription.diagnosis,
          medicines: lastPrescription.medicines,
          advice: lastPrescription.advice,
          followUpDate: "",
        });
        setUseLastPrescription(false);
      }
    } catch (error) {
      console.error("Failed to load last prescription:", error);
    }
  }

  async function handleSubmit() {
    if (!formData.diagnosis.trim() || formData.medicines.length === 0) {
      alert("Please add diagnosis and at least one medicine.");
      return;
    }

    setLoading(true);
    try {
      const prescription: Prescription = {
        id: `prescription-${Date.now()}`,
        patientId: patient.id,
        clinicId: clinic.id,
        diagnosis: formData.diagnosis,
        medicines: formData.medicines,
        advice: formData.advice,
        followUpDate: formData.followUpDate || undefined,
        createdAt: Date.now(),
      };

      await savePrescription(prescription);
      setScreen("preview");
    } catch (error) {
      console.error("Failed to save prescription:", error);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (screen === "preview") {
    return (
      <PrescriptionPreview
        clinic={clinic}
        patient={patient}
        formData={formData}
        onBack={() => setScreen("form")}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Create Prescription</h1>
          <p className="text-sm text-muted-foreground">
            {patient.name} • {patient.age && `Age: ${patient.age}`}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {useLastPrescription ? (
            <Card>
              <CardHeader>
                <CardTitle>Use Last Prescription?</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button onClick={handleUseLastPrescription}>
                  Yes, Use It
                </Button>
                <Button variant="outline" onClick={() => setUseLastPrescription(false)}>
                  Start Fresh
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Chief Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Diagnosis / Chief Complaint"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosis: e.target.value })
                }
                className="min-h-24"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medicines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MedicineSelector
                medicines={formData.medicines}
                onAdd={(medicine) =>
                  setFormData({
                    ...formData,
                    medicines: [...formData.medicines, medicine],
                  })
                }
                onRemove={(id) =>
                  setFormData({
                    ...formData,
                    medicines: formData.medicines.filter((m) => m.id !== id),
                  })
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advice & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any advice or special instructions for the patient"
                value={formData.advice}
                onChange={(e) =>
                  setFormData({ ...formData, advice: e.target.value })
                }
                className="min-h-20"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="followUp" className="text-sm">
                Follow-up Date (Optional)
              </Label>
              <Input
                id="followUp"
                type="date"
                value={formData.followUpDate}
                onChange={(e) =>
                  setFormData({ ...formData, followUpDate: e.target.value })
                }
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? "Saving..." : "Preview & Print"}
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              disabled={loading}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
