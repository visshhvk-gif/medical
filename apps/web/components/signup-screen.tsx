"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Card } from "@workspace/ui/components/card";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface SignupScreenProps {
  onSignupComplete: () => void;
}

const specializations = [
  "General Practitioner",
  "Pediatrician",
  "Cardiologist",
  "Dentist",
  "Orthopedist",
  "Dermatologist",
  "Psychiatrist",
  "ENT Specialist",
  "Ophthalmologist",
  "Other",
];

export default function SignupScreen({ onSignupComplete }: SignupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    specialization: "",
    medicalRegNumber: "",
    password: "",
    confirmPassword: "",
  });

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google sign-in error:", error);
        alert("Failed to sign in with Google");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step === 1) {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.mobileNumber ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        alert("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSignupComplete();
      }, 1000);
      return;
    }

  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Sidebar - White Background */}
      <div className="hidden lg:flex lg:w-2/5 bg-white text-gray-900 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="text-3xl font-bold text-teal-600">+</div>
            <h1 className="text-2xl font-bold text-teal-600">ClinicRx</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight text-gray-900">
            Digital prescriptions for modern clinics
          </h2>

          <p className="text-gray-600 text-lg mb-12 leading-relaxed">
            Replace handwritten prescriptions with clear, legible, professional
            digital ones. Built for clinics in every corner of India.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600 mt-1">✓</div>
              <p className="text-gray-700">Legible prescriptions every time</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600 mt-1">✓</div>
              <p className="text-gray-700">Drug inventory at your fingertips</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600 mt-1">✓</div>
              <p className="text-gray-700">Patient history in one place</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Single Card Form */}
      <div className="w-full lg:w-3/5 bg-white p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-lg mx-auto w-full">
          {/* Single Card Container */}
          <Card className="p-8 shadow-lg border-gray-200">
            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold mb-1 text-gray-900">
                {step === 1 ? "Create your account" : "Secure your account"}
              </h2>
              <p className="text-gray-600 text-base">
                {step === 1
                  ? "Register as a licensed medical practitioner"
                  : "Set a strong password"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <>
                {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-semibold text-gray-900">
                      Full name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Dr. Rajesh Sharma"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      disabled={loading}
                      className="h-11 bg-white border-gray-300"
                    />
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold text-gray-900">
                        Email address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="dr.rajesh@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={loading}
                        className="h-11 bg-white border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="font-semibold text-gray-900">
                        Mobile number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mobile"
                        placeholder="98765 43210"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobileNumber: e.target.value,
                          })
                        }
                        disabled={loading}
                        className="h-11 bg-white border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-semibold text-gray-900">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        disabled={loading}
                        className="h-11 bg-white border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="font-semibold text-gray-900">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        disabled={loading}
                        className="h-11 bg-white border-gray-300"
                      />
                    </div>
                  </div>

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base mt-6 cursor-pointer hover:cursor-pointer"
                size="md"
              >
                {loading ? "Processing..." : "Create Account"}
              </Button>

              {/* Continue with Google Button */}
              <Button
                type="button"
                disabled={loading || googleLoading}
                onClick={handleGoogleSignup}
                className="w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 h-12 text-base mt-0 flex items-center justify-center gap-2 cursor-pointer hover:cursor-pointer"
                size="md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
              </>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-600">Already registered? </span>
              <a href="#" className="text-teal-600 font-semibold hover:underline">
                Sign in
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
