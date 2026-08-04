"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  form: string;
}

interface MedicineManagementScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const medicineFormOptions = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Drops",
  "Inhaler",
];

export default function MedicineManagementScreen({
  onComplete,
  onSkip,
}: MedicineManagementScreenProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brandName: "",
    genericName: "",
    strength: "",
    form: "",
  });

  async function handleAddMedicine() {
    if (
      !formData.brandName ||
      !formData.genericName ||
      !formData.strength ||
      !formData.form
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newMedicine: Medicine = {
      id: editingId || Date.now().toString(),
      brandName: formData.brandName,
      genericName: formData.genericName,
      strength: formData.strength,
      form: formData.form,
    };

    if (editingId) {
      setMedicines(
        medicines.map((m) => (m.id === editingId ? newMedicine : m))
      );
      setEditingId(null);
    } else {
      setMedicines([...medicines, newMedicine]);
    }

    setFormData({
      brandName: "",
      genericName: "",
      strength: "",
      form: "",
    });
  }

  function handleEditMedicine(medicine: Medicine) {
    setEditingId(medicine.id);
    setFormData({
      brandName: medicine.brandName,
      genericName: medicine.genericName,
      strength: medicine.strength,
      form: medicine.form,
    });
  }

  function handleRemoveMedicine(id: string) {
    setMedicines(medicines.filter((m) => m.id !== id));
  }

  const filteredMedicines = medicines.filter(
    (m) =>
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8 md:p-16 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Back Button - Outside Card */}
        <button
          onClick={onSkip}
          disabled={loading}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
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

        <div className="grid grid-cols-2 gap-8">
          {/* Left Side - Medicine List */}
          <Card className="p-8 shadow-lg border-gray-200">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2 text-gray-900">
                Add medicines
              </h2>
              <p className="text-gray-600 text-base">
                Stock your formulary — you can add more anytime
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Search drugs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 bg-white border-gray-300"
              />

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMedicines.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {medicines.length === 0
                      ? "No medicines added yet"
                      : "No matches found"}
                  </p>
                ) : (
                  filteredMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white bg-teal-600 px-2 py-1 rounded">
                              {medicine.form.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900">
                            {medicine.brandName} {medicine.strength}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {medicine.genericName}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => handleEditMedicine(medicine)}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveMedicine(medicine.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Right Side - Add Medicine Form */}
          <Card className="p-8 shadow-lg border-gray-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Add medicine</h2>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <Label className="font-semibold text-gray-900">
                  Brand / Trade name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Crocin"
                  value={formData.brandName}
                  onChange={(e) =>
                    setFormData({ ...formData, brandName: e.target.value })
                  }
                  disabled={loading}
                  className="h-11 bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-900">
                  Generic name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Paracetamol"
                  value={formData.genericName}
                  onChange={(e) =>
                    setFormData({ ...formData, genericName: e.target.value })
                  }
                  disabled={loading}
                  className="h-11 bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-900">
                  Strength / Dose <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="500mg / 5ml"
                  value={formData.strength}
                  onChange={(e) =>
                    setFormData({ ...formData, strength: e.target.value })
                  }
                  disabled={loading}
                  className="h-11 bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-900">
                  Form <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {medicineFormOptions.map((form) => (
                    <button
                      key={form}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, form })
                      }
                      className={`px-4 py-2 rounded border transition ${
                        formData.form === form
                          ? "border-teal-600 bg-teal-50 text-teal-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {form}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddMedicine}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base cursor-pointer hover:cursor-pointer"
              >
                {editingId ? "Update medicine" : "+ Add to formulary"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end gap-4 max-w-6xl mx-auto">
          <Button
            onClick={onSkip}
            variant="outline"
            className="border-gray-300 cursor-pointer hover:cursor-pointer"
          >
            Skip
          </Button>
          <Button
            onClick={onComplete}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 cursor-pointer hover:cursor-pointer"
          >
            Continue to Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
}
