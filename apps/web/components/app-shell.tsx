"use client";

import { useEffect, useState } from "react";
import { ClinicProfile } from "@/lib/types";
import { getClinic } from "@/lib/db";
import SetupScreen from "./setup-screen";
import Dashboard from "./dashboard";

export default function AppShell() {
  const [clinic, setClinic] = useState<ClinicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkClinicSetup();
  }, []);

  async function checkClinicSetup() {
    try {
      const existingClinic = await getClinic();
      setClinic(existingClinic);
    } catch (error) {
      console.error("Failed to load clinic:", error);
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

  if (!clinic) {
    return <SetupScreen onSetupComplete={setClinic} />;
  }

  return <Dashboard clinic={clinic} onClinicUpdate={setClinic} />;
}
