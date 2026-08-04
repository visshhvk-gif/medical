"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoogleLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: GoogleLoginModalProps) {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setStep("password");
    }
  };

  const handlePasswordSubmit = () => {
    if (password.trim()) {
      setTimeout(() => {
        onSuccess();
        setStep("email");
        setEmail("");
        setPassword("");
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        {/* Google Logo */}
        <div className="text-center mb-8">
          <svg className="w-8 h-8 mx-auto mb-4" viewBox="0 0 24 24">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="font-bold text-lg fill-gray-900">
              G
            </text>
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">Google</h2>
        </div>

        {step === "email" ? (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in with your Google Account
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Enter your email or phone number
            </p>

            <Input
              type="email"
              placeholder="Email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 mb-6"
              onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
            />

            <Button
              onClick={handleEmailSubmit}
              disabled={!email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 mb-3"
            >
              Next
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-11"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Enter your password
            </h3>
            <p className="text-gray-600 text-sm mb-2">{email}</p>
            <p className="text-gray-600 text-xs mb-6">
              <button className="text-blue-600 hover:underline">
                Not your computer? Use a private browsing window
              </button>
            </p>

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 mb-6"
              onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStep("email");
                  setEmail("");
                  setPassword("");
                }}
                variant="outline"
                className="flex-1 h-11"
              >
                Back
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={!password.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
