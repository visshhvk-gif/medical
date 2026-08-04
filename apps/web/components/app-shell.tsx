"use client";

import { useEffect, useState } from "react";
import { ClinicProfile } from "@/lib/types";
import { getClinic } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import SignupScreen from "./signup-screen";
import SetupScreen from "./setup-screen";
import MedicineManagementScreen from "./medicine-management-screen";
import Dashboard from "./dashboard";

type Screen = "signup" | "clinic-setup" | "medicine-management" | "dashboard";

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [clinic, setClinic] = useState<ClinicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndClinic();
  }, []);

  async function checkAuthAndClinic() {
    try {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Not authenticated - show signup
        console.log("No session found");
        setIsAuthenticated(false);
        setScreen("signup");
        setLoading(false);
        return;
      }

      // User is authenticated
      const currentUserId = session.user.id;
      console.log("User authenticated with ID:", currentUserId);
      setUserId(currentUserId);
      setIsAuthenticated(true);

      // Check if clinic is already set up for this user
      console.log("Checking for clinic data with userId:", currentUserId);
      const existingClinic = await getClinic(currentUserId);

      if (existingClinic) {
        console.log("Found existing clinic:", existingClinic);
        setClinic(existingClinic);
        setScreen("dashboard");
      } else {
        console.log("No clinic found, showing setup screen");
        setScreen("clinic-setup");
      }
    } catch (error) {
      console.error("Failed to check auth/clinic:", error);
      setScreen("signup");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (screen === "signup") {
    return <SignupScreen onSignupComplete={() => checkAuthAndClinic()} />;
  }

  if (screen === "clinic-setup") {
    return (
      <SetupScreen
        userId={userId}
        onSetupComplete={(clinicData) => {
          console.log("Clinic setup complete, going to medicine management");
          setClinic(clinicData);
          setScreen("medicine-management");
        }}
        onSignOut={() => {
          setIsAuthenticated(false);
          setScreen("signup");
          setClinic(null);
        }}
      />
    );
  }

  if (screen === "medicine-management") {
    console.log("Showing medicine management screen");
    return (
      <MedicineManagementScreen
        onComplete={() => {
          console.log("Medicine management complete, going to dashboard");
          setScreen("dashboard");
        }}
        onSkip={() => {
          console.log("Medicine management skipped, going to dashboard");
          setScreen("dashboard");
        }}
      />
    );
  }

  if (screen === "dashboard" && clinic) {
    return (
      <Dashboard
        clinic={clinic}
        onClinicUpdate={(updatedClinic) => {
          if (updatedClinic === null) {
            // Sign out
            supabase.auth.signOut();
            setIsAuthenticated(false);
            setScreen("signup");
            setClinic(null);
          } else {
            setClinic(updatedClinic);
          }
        }}
      />
    );
  }

  return null;
}
