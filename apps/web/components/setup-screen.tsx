"use client";

import { useState } from "react";
import { ClinicProfile } from "@/lib/types";
import { saveClinic } from "@/lib/db";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";

interface SetupScreenProps {
  onSetupComplete: (clinic: ClinicProfile) => void;
}

export default function SetupScreen({ onSetupComplete }: SetupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "",
    registrationNumber: "",
    address: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const clinic: ClinicProfile = {
        id: "clinic-1",
        name: formData.clinicName,
        doctorName: formData.doctorName,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        phone: formData.phone,
      };

      await saveClinic(clinic);
      onSetupComplete(clinic);
    } catch (error) {
      console.error("Failed to save clinic:", error);
      alert("Failed to save clinic details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Digital Prescription</CardTitle>
          <CardDescription>
            Set up your clinic profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                placeholder="Your clinic name"
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData({ ...formData, clinicName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                placeholder="Your full name"
                value={formData.doctorName}
                onChange={(e) =>
                  setFormData({ ...formData, doctorName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                placeholder="Medical council registration"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registrationNumber: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="address">Clinic Address</Label>
              <Input
                id="address"
                placeholder="Full clinic address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.clinicName || !formData.doctorName}
              className="w-full"
              size="md"
            >
              {loading ? "Setting up..." : "Get Started"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Your clinic details are stored locally on this device and never sent to any server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
