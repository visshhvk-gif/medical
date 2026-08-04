"use client";

import { useState } from "react";
import { ClinicProfile } from "@/lib/types";
import { saveClinic } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

interface SetupScreenProps {
  userId: string | null;
  onSetupComplete: (clinic: ClinicProfile) => void;
  onSignOut: () => void;
}

export default function SetupScreen({ userId, onSetupComplete, onSignOut }: SetupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    logo: null as File | null,
  });

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      alert("Error: User not authenticated. Please sign in again.");
      return;
    }

    if (!formData.clinicName || !formData.doctorName) {
      alert("Please fill in clinic name and doctor name");
      return;
    }

    setLoading(true);

    try {
      console.log("Saving clinic for userId:", userId);

      const clinic: ClinicProfile = {
        id: userId,
        name: formData.clinicName,
        doctorName: formData.doctorName,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        phone: formData.phone,
      };

      await saveClinic(clinic, userId);
      console.log("Clinic saved successfully");

      onSetupComplete(clinic);
    } catch (error) {
      console.error("Failed to save clinic:", error);
      alert("Failed to save clinic details. Please try again. Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      onSignOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-8 md:p-16 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Back Button - Outside Card */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
          title="Go back"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <Card className="p-8 shadow-lg border-gray-200">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">
              Complete Your Profile
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Clinic Logo Upload */}
            <div className="space-y-2">
              <Label className="font-semibold text-gray-900">
                Clinic Logo
              </Label>
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Clinic logo preview"
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl text-gray-400">+</div>
                      <p className="text-xs text-gray-500">Logo</p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={loading}
                    className="h-10 bg-white border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Clinic Name */}
            <div className="space-y-2">
              <Label htmlFor="clinicName" className="font-semibold text-gray-900">
                Clinic / Hospital name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clinicName"
                placeholder="Sharma Medical Centre"
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData({ ...formData, clinicName: e.target.value })
                }
                disabled={loading}
                className="h-10 bg-white border-gray-300"
              />
            </div>

            {/* Doctor Name */}
            <div className="space-y-2">
              <Label htmlFor="doctorName" className="font-semibold text-gray-900">
                Doctor / Owner name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="doctorName"
                placeholder="Dr. Rajesh Sharma"
                value={formData.doctorName}
                onChange={(e) =>
                  setFormData({ ...formData, doctorName: e.target.value })
                }
                disabled={loading}
                className="h-10 bg-white border-gray-300"
              />
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="font-semibold text-gray-900">
                Street address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="Near Bus Stand, MG Road"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={loading}
                className="h-10 bg-white border-gray-300"
              />
            </div>

            {/* City, State & Pincode */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="font-semibold text-gray-900">
                  City / Town <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Bilaspur"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  disabled={loading}
                  className="h-10 bg-white border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-900">
                  State
                </Label>
                <Select value={formData.state} onValueChange={(value) =>
                  setFormData({ ...formData, state: value })
                }>
                  <SelectTrigger style={{ height: "40px" }} className="bg-white border-gray-300">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="center" className="max-h-[320px]">
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="font-semibold text-gray-900">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  placeholder="495001"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  disabled={loading}
                  className="h-10 bg-white border-gray-300"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold text-gray-900">
                Clinic phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={loading}
                className="h-10 bg-white border-gray-300"
              />
            </div>

            {/* Registration Number (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="registrationNumber" className="font-semibold text-gray-900">
                Medical Registration Number
              </Label>
              <Input
                id="registrationNumber"
                placeholder="MH-2019-12345"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registrationNumber: e.target.value })
                }
                disabled={loading}
                className="h-10 bg-white border-gray-300"
              />
              <p className="text-xs text-gray-500">
                As per State Medical Council
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base mt-8"
              size="md"
            >
              {loading ? "Setting up..." : "Continue to Dashboard →"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
